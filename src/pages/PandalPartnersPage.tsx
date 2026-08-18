import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  CalendarDays, Check, CheckCheck, CircleUserRound, Clock3, MapPin, MessageCircle,
  MoreVertical, Search, Send, ShieldAlert, UserPlus, Users, X, Flag, Ban, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ChatConversation, ChatMessage, CommunityNotification, Connection, SharedVisitPlan, VisitPlan, TravelPreference, GroupPreference, Pandal } from '../types';

interface Match {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  preferredDate: string;
  preferredTime: string;
  area: string;
  pandalIds: string[];
  pandalNames: string[];
  travelPreference: TravelPreference;
  groupPreference: GroupPreference;
  introduction: string;
  matchPercentage: number;
  commonPandals: string[];
  user: any;
}

export const PandalPartnersPage: React.FC<{ pandals: Pandal[] }> = ({ pandals }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [plan, setPlan] = useState<VisitPlan | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [sharedPlans, setSharedPlans] = useState<SharedVisitPlan[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [form, setForm] = useState({
    preferredDate: '', preferredTime: '', area: '', pandalIds: [] as string[],
    numberOfPandals: 1, travelPreference: 'Walking' as TravelPreference,
    groupPreference: 'Solo partner' as GroupPreference, introduction: '',
  });

  const [sharedForm, setSharedForm] = useState({
    pandalId: '', date: '', time: '', meetingPoint: '', travelMethod: 'Walking' as TravelPreference, notes: ''
  });

  useEffect(() => {
    if (!user) return;
    Promise.all([api.getMyVisitPlan(), api.getPartnerMatches(), api.getConnections(), api.getConversations(), api.getNotifications()])
      .then(([p, m, c, conv, n]) => {
        setPlan(p);
        if (p) setForm({
          preferredDate: p.preferredDate, preferredTime: p.preferredTime, area: p.area, pandalIds: p.pandalIds,
          numberOfPandals: p.numberOfPandals, travelPreference: p.travelPreference, groupPreference: p.groupPreference, introduction: p.introduction
        });
        setMatches(m); setConnections(c); setConversations(conv); setNotifications(n);
      }).catch(e => showToast(e.message || 'Could not load community data', 'error'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('mumbai_ganpati_token');
    if (!token) return;
    const s = io(window.location.origin, { auth: { token } });
    s.on('new_message', (msg: ChatMessage) => {
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      setConversations(prev => prev.map(c => c.id === msg.conversationId ? { ...c, lastMessage: msg, updatedAt: msg.createdAt } : c));
    });
    s.on('typing', (p: { userId: string; isTyping: boolean }) => setTyping(p.userId !== user.id && p.isTyping));
    s.on('messages_read', () => setMessages(prev => prev.map(m => ({ ...m, status: m.senderId === user.id ? 'read' : m.status }))));
    s.on('message_notification', async () => setNotifications(await api.getNotifications().catch(() => [])));
    setSocket(s);
    return () => { s.disconnect(); setSocket(null); };
  }, [user?.id]);

  useEffect(() => {
    if (!selectedConversation) return;
    api.getMessages(selectedConversation.id).then(setMessages).catch(e => showToast(e.message, 'error'));
    api.getSharedVisitPlans(selectedConversation.id).then(setSharedPlans).catch(() => []);
    socket?.emit('join_conversation', selectedConversation.id);
    api.markConversationRead(selectedConversation.id).catch(() => {});
  }, [selectedConversation?.id, socket]);

  const filteredMatches = useMemo(() => matches.filter(m =>
    !search || `${m.displayName} ${m.area} ${m.pandalNames.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  ), [matches, search]);

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.preferredDate || !form.preferredTime || !form.area || form.pandalIds.length === 0) {
      showToast('Select date, time, area and at least one pandal.', 'error'); return;
    }
    setSaving(true);
    try {
      const saved = await api.saveVisitPlan({ ...form, displayName: user?.name, avatar: user?.avatar });
      setPlan(saved);
      setMatches(await api.getPartnerMatches());
      showToast('Your pandal visit plan is live! 🎉', 'success');
    } catch (e: any) { showToast(e.message, 'error'); } finally { setSaving(false); }
  };

  const connect = async (userId: string) => {
    try {
      await api.sendConnection(userId);
      setConnections(await api.getConnections());
      showToast('Connection request sent.', 'success');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const updateConnection = async (c: any, action: 'accept' | 'decline' | 'cancel') => {
    try {
      await api.updateConnection(c.id, action);
      setConnections(await api.getConnections());
      setConversations(await api.getConversations());
      showToast(action === 'accept' ? 'Connected! You can now chat.' : 'Request updated.', 'info');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const sendMessage = () => {
    if (!selectedConversation || !message.trim()) return;
    if (socket) {
      socket.emit('send_message', { conversationId: selectedConversation.id, text: message.trim() });
      setMessage('');
      socket.emit('typing', { conversationId: selectedConversation.id, isTyping: false });
    }
  };

  const createPlan = async () => {
    if (!selectedConversation) return;
    try {
      const p = await api.createSharedVisitPlan({ conversationId: selectedConversation.id, ...sharedForm });
      setSharedPlans(prev => [p, ...prev]);
      setShowPlanner(false);
      showToast('Visit plan sent to your partner.', 'success');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const respondToPlan = async (p: SharedVisitPlan, action: 'accept' | 'decline') => {
    try {
      const updated = await api.updateSharedVisitPlan(p.id, { action });
      setSharedPlans(prev => prev.map(x => x.id === p.id ? updated : x));
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  if (!user) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><Users className="w-14 h-14 mx-auto text-orange-500 mb-4" /><h1 className="text-3xl font-black">Find a Pandal Partner</h1><p className="text-stone-500 mt-2">Log in to find people who want to visit Bappa together.</p></div>;
  }

  if (loading) return <div className="max-w-7xl mx-auto p-8 animate-pulse"><div className="h-12 bg-amber-100 rounded-2xl mb-4"/><div className="h-64 bg-amber-50 rounded-3xl"/></div>;

  const connectionFor = (uid: string) => connections.find(c => c.otherUser?.id === uid);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#FFFDF5] px-4 sm:px-6 py-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 via-amber-500 to-pink-500 p-6 sm:p-9 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-orange-100 text-sm font-bold uppercase tracking-widest"><Users className="w-4 h-4"/> Community Darshan</div>
            <h1 className="text-3xl sm:text-5xl font-black mt-2">Find a Pandal Partner</h1>
            <p className="mt-3 text-white/90 max-w-2xl">Match with devotees who want to visit the same pandals around the same time. Connect first, then chat privately and plan your darshan together.</p>
          </div>
          <div className="absolute -right-10 -bottom-16 text-[10rem] opacity-20">🪔</div>
          <button onClick={async()=>{setNotifications(await api.getNotifications());setShowNotifications(v=>!v)}} className="absolute right-5 top-5 bg-white/20 hover:bg-white/30 p-3 rounded-2xl">
            <MessageCircle className="w-5 h-5"/>{unread>0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center">{unread}</span>}
          </button>
          {showNotifications && <div className="absolute right-5 top-16 z-30 w-80 bg-white text-stone-800 rounded-2xl shadow-2xl border border-amber-200 p-3">
            <div className="flex justify-between items-center px-2 py-1"><b>Notifications</b><button onClick={()=>api.markNotificationsRead().then(()=>setNotifications(prev=>prev.map(n=>({...n,read:true}))))} className="text-xs text-orange-600">Mark all read</button></div>
            <div className="max-h-64 overflow-auto mt-2">{notifications.length ? notifications.map(n=><div key={n.id} className={`p-3 rounded-xl mb-1 ${n.read?'':'bg-amber-50'}`}><b className="text-sm">{n.title}</b><p className="text-xs text-stone-500">{n.message}</p></div>) : <p className="p-3 text-sm text-stone-500">No notifications.</p>}</div>
          </div>}
        </div>

        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-5 mt-6">
          <section className="bg-white rounded-3xl border border-amber-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5"><div><h2 className="text-xl font-black">Your Darshan Plan</h2><p className="text-sm text-stone-500">Tell the community when and where you want to go.</p></div><CalendarDays className="text-orange-500"/></div>
            <form onSubmit={savePlan} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-sm font-semibold">Date<input type="date" value={form.preferredDate} onChange={e=>setForm({...form,preferredDate:e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-amber-200"/></label>
                <label className="text-sm font-semibold">Time<input type="time" value={form.preferredTime} onChange={e=>setForm({...form,preferredTime:e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-amber-200"/></label>
              </div>
              <label className="text-sm font-semibold">Area / location<input value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="e.g. Seawoods, Vashi, Lalbaug" className="mt-1 w-full p-3 rounded-xl border border-amber-200"/></label>
              <div><div className="text-sm font-semibold mb-2">Preferred pandals</div><div className="grid sm:grid-cols-2 gap-2 max-h-44 overflow-auto pr-1">{pandals.map(p=><button type="button" key={p.id} onClick={()=>setForm(f=>({...f,pandalIds:f.pandalIds.includes(p.id)?f.pandalIds.filter(x=>x!==p.id):[...f.pandalIds,p.id]}))} className={`text-left p-3 rounded-xl border text-sm ${form.pandalIds.includes(p.id)?'bg-orange-50 border-orange-400':'border-amber-200 hover:bg-amber-50'}`}><span className="font-bold">{p.name}</span><span className="block text-xs text-stone-500">{p.area}</span></button>)}</div></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-sm font-semibold">Travel<select value={form.travelPreference} onChange={e=>setForm({...form,travelPreference:e.target.value as TravelPreference})} className="mt-1 w-full p-3 rounded-xl border border-amber-200"><option>Walking</option><option>Bike</option><option>Car</option><option>Public Transport</option></select></label>
                <label className="text-sm font-semibold">Group<select value={form.groupPreference} onChange={e=>setForm({...form,groupPreference:e.target.value as GroupPreference})} className="mt-1 w-full p-3 rounded-xl border border-amber-200"><option>Solo partner</option><option>Small group</option></select></label>
              </div>
              <label className="text-sm font-semibold">Introduction<textarea value={form.introduction} onChange={e=>setForm({...form,introduction:e.target.value})} placeholder="Tell potential partners a little about your plan..." rows={3} className="mt-1 w-full p-3 rounded-xl border border-amber-200 resize-none"/></label>
              <button disabled={saving} className="w-full p-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow-lg disabled:opacity-50">{saving?'Saving...':plan?'Update & Find Partners':'Publish My Plan'}</button>
            </form>
          </section>

          <section className="bg-white rounded-3xl border border-amber-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-black">Recommended Partners</h2><p className="text-sm text-stone-500">{matches.length} potential matches</p></div><Search className="text-stone-400"/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, area or pandal..." className="w-full p-3 rounded-xl border border-amber-200 mb-4"/>
            <div className="space-y-3 max-h-[620px] overflow-auto pr-1">
              {!plan ? (
                <div className="text-center py-14 text-stone-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-amber-400" />
                  <p>Publish your darshan plan to see matches.</p>
                </div>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map((m) => {
                  const c = connectionFor(m.userId);
                  return (
                    <div key={m.userId} className="rounded-2xl border border-amber-200 p-4 hover:shadow-md transition">
                      <div className="flex gap-3">
                        <img
                          src={m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.displayName}`}
                          className="w-12 h-12 rounded-2xl object-cover bg-amber-50"
                          alt={m.displayName}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h3 className="font-black">{m.displayName}</h3>
                              <p className="text-xs text-stone-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {m.area}
                              </p>
                            </div>
                            <span className="h-fit px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                              {m.matchPercentage}% match
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-semibold text-stone-600">
                            <span>📅 {m.preferredDate}</span>
                            <span>🕐 {m.preferredTime}</span>
                            <span>🚶 {m.travelPreference}</span>
                          </div>

                          <p className="text-xs text-stone-600 mt-2">
                            {m.introduction || 'Ready for a peaceful darshan together.'}
                          </p>
                          <p className="text-xs text-orange-700 font-bold mt-2">
                            🛕 Common: {m.commonPandals.join(', ') || 'Nearby timing/location'}
                          </p>

                          <div className="mt-3">
                            {!c && (
                              <button
                                onClick={() => connect(m.userId)}
                                className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-black inline-flex gap-1"
                              >
                                <UserPlus className="w-4 h-4" /> Connect
                              </button>
                            )}

                            {c?.status === 'pending' && c.requesterId === user.id && (
                              <span className="text-xs font-bold text-stone-500">Request sent</span>
                            )}

                            {c?.status === 'pending' && c.recipientId === user.id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateConnection(c, 'accept')}
                                  className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateConnection(c, 'decline')}
                                  className="px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
                                >
                                  Decline
                                </button>
                              </div>
                            )}

                            {c?.status === 'accepted' && (
                              <button
                                onClick={async () => {
                                  const conv = await api.getConversations();
                                  setConversations(conv);
                                  const found = conv.find((x) => x.participant.id === m.userId);
                                  if (found) setSelectedConversation(found);
                                }}
                                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-black inline-flex gap-1"
                              >
                                <MessageCircle className="w-4 h-4" /> Message
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-14 text-stone-500">
                  No matching partners yet. Try a broader area/time.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 bg-white rounded-3xl border border-amber-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-black">Private Messages</h2><p className="text-sm text-stone-500">Only accepted connections can chat.</p></div><MessageCircle className="text-orange-500"/></div>
          <div className="grid lg:grid-cols-[280px_1fr] min-h-[520px] border border-amber-100 rounded-2xl overflow-hidden">
            <div className="bg-amber-50/50 border-r border-amber-100">
              <div className="p-3 border-b border-amber-100 font-black">Chats</div>
              {conversations.map(c=><button key={c.id} onClick={()=>setSelectedConversation(c)} className={`w-full text-left p-3 flex gap-3 border-b border-amber-100 ${selectedConversation?.id===c.id?'bg-white':'hover:bg-white/70'}`}><img src={c.participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.participant.name}`} className="w-10 h-10 rounded-full"/><div className="min-w-0 flex-1"><div className="font-bold text-sm truncate">{c.participant.name}</div><div className="text-xs text-stone-500 truncate">{c.lastMessage?.text || 'Start your darshan conversation'}</div></div>{c.unreadCount>0&&<span className="bg-orange-500 text-white rounded-full text-[10px] px-2 py-1 h-fit">{c.unreadCount}</span>}</button>)}
              {!conversations.length && <div className="p-6 text-xs text-stone-500">Accept a partner request to start chatting.</div>}
            </div>
            <div className="flex flex-col min-h-[520px]">
              {!selectedConversation ? <div className="flex-1 flex flex-col items-center justify-center text-stone-400"><MessageCircle className="w-14 h-14 mb-3"/><p className="font-bold">Select a conversation</p></div> :
              <>
                <div className="p-3 border-b border-amber-100 flex items-center gap-3"><img src={selectedConversation.participant.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.participant.name}`} className="w-10 h-10 rounded-full"/><div><div className="font-black">{selectedConversation.participant.name}</div><div className="text-xs text-emerald-600">{typing?'typing...':'Pandal Partner'}</div></div><div className="ml-auto flex gap-1"><button onClick={()=>setShowPlanner(true)} className="p-2 rounded-xl bg-orange-50 text-orange-600" title="Plan visit"><CalendarDays className="w-5 h-5"/></button><button onClick={()=>{if(confirm('Delete this chat?')) api.deleteConversation(selectedConversation.id).then(()=>{setConversations(prev=>prev.filter(x=>x.id!==selectedConversation.id));setSelectedConversation(null)})}} className="p-2 rounded-xl hover:bg-rose-50 text-rose-500"><Trash2 className="w-5 h-5"/></button></div></div>
                <div className="flex-1 p-4 overflow-auto space-y-2 bg-[#fffaf0]">{messages.map(m=><div key={m.id} className={`flex ${m.senderId===user.id?'justify-end':'justify-start'}`}><div className={`max-w-[75%] px-3 py-2 rounded-2xl ${m.senderId===user.id?'bg-orange-500 text-white rounded-br-md':'bg-white border border-amber-100 text-stone-800 rounded-bl-md'}`}><div className="text-sm whitespace-pre-wrap break-words">{m.text}</div><div className={`text-[9px] mt-1 flex items-center gap-1 ${m.senderId===user.id?'text-white/80':'text-stone-400'}`}>{new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}{m.senderId===user.id&&(m.status==='read'?<CheckCheck className="w-3 h-3"/>:<Check className="w-3 h-3"/>)}</div></div></div>)}</div>
                <div className="p-3 border-t border-amber-100 flex gap-2"><input value={message} onChange={e=>{setMessage(e.target.value);socket?.emit('typing',{conversationId:selectedConversation.id,isTyping:true})}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();sendMessage()}}} placeholder="Type a message..." className="flex-1 p-3 rounded-xl border border-amber-200"/><button onClick={sendMessage} className="p-3 rounded-xl bg-orange-500 text-white"><Send className="w-5 h-5"/></button></div>
              </>}
            </div>
          </div>
        </section>

        {showPlanner && selectedConversation && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-5 w-full max-w-lg shadow-2xl"><div className="flex justify-between"><h2 className="text-xl font-black">Plan Visit Together</h2><button onClick={()=>setShowPlanner(false)}><X/></button></div><div className="space-y-3 mt-4"><select value={sharedForm.pandalId} onChange={e=>setSharedForm({...sharedForm,pandalId:e.target.value})} className="w-full p-3 rounded-xl border border-amber-200"><option value="">Select pandal</option>{pandals.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select><div className="grid grid-cols-2 gap-2"><input type="date" value={sharedForm.date} onChange={e=>setSharedForm({...sharedForm,date:e.target.value})} className="p-3 rounded-xl border border-amber-200"/><input type="time" value={sharedForm.time} onChange={e=>setSharedForm({...sharedForm,time:e.target.value})} className="p-3 rounded-xl border border-amber-200"/></div><input placeholder="Meeting point e.g. Seawoods Station" value={sharedForm.meetingPoint} onChange={e=>setSharedForm({...sharedForm,meetingPoint:e.target.value})} className="w-full p-3 rounded-xl border border-amber-200"/><select value={sharedForm.travelMethod} onChange={e=>setSharedForm({...sharedForm,travelMethod:e.target.value as TravelPreference})} className="w-full p-3 rounded-xl border border-amber-200"><option>Walking</option><option>Bike</option><option>Car</option><option>Public Transport</option></select><textarea placeholder="Notes" value={sharedForm.notes} onChange={e=>setSharedForm({...sharedForm,notes:e.target.value})} className="w-full p-3 rounded-xl border border-amber-200" rows={3}/><button onClick={createPlan} className="w-full p-3 rounded-xl bg-orange-500 text-white font-black">Send Visit Plan</button></div></div></div>}

        {selectedConversation && sharedPlans.length > 0 && <div className="mt-4 bg-white rounded-3xl border border-amber-200 p-5"><h3 className="font-black mb-3">Shared Visit Plans</h3>{sharedPlans.map(p=><div key={p.id} className="border border-amber-200 rounded-2xl p-4 mb-2"><div className="font-black">🛕 {p.pandalName}</div><div className="text-sm text-stone-600 mt-1">📅 {p.date} • 🕐 {p.time} • 📍 {p.meetingPoint}</div><div className="text-sm mt-1">🚶 {p.travelMethod}</div><p className="text-xs text-stone-500 mt-2">{p.notes}</p><div className="mt-3 flex items-center gap-2">{p.status==='confirmed'?<span className="text-emerald-600 font-black text-sm">✓ Confirmed</span>:p.status==='pending'&&p.creatorId!==user.id?<><button onClick={()=>respondToPlan(p,'accept')} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold">Accept</button><button onClick={()=>respondToPlan(p,'decline')} className="px-3 py-2 rounded-xl bg-stone-100 text-xs font-bold">Decline</button></>:<span className="text-xs font-bold text-amber-700">Waiting for partner</span>}</div></div>)}</div>}
      </div>
    </div>
  );
};
