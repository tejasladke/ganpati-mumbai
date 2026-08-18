import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../auth.js';
import { store } from '../db.js';
import { ChatMessage, Connection, CommunityNotification, SharedVisitPlan, UserReport, VisitPlan } from '../../types.js';

const router = Router();

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function publicUser(user: any) {
  if (!user) return null;
  return { id: user.id, name: user.name, avatar: user.avatar, role: user.role, points: user.points, completedChallenges: user.completedChallenges, badges: user.badges, createdAt: user.createdAt };
}

function notify(userId: string, type: CommunityNotification['type'], title: string, message: string, relatedId?: string) {
  store.notifications.unshift({
    id: id('notification'), userId, type, title, message, relatedId, read: false, createdAt: new Date().toISOString()
  });
}

function findPlanForUser(userId: string) {
  return store.visitPlans.find(p => p.userId === userId);
}

function connectionBetween(a: string, b: string) {
  return store.connections.find(c =>
    (c.requesterId === a && c.recipientId === b) ||
    (c.requesterId === b && c.recipientId === a)
  );
}

function isConnected(a: string, b: string) {
  return connectionBetween(a, b)?.status === 'accepted';
}

function getConversation(a: string, b: string) {
  return store.conversations.find(c => c.participantIds.includes(a) && c.participantIds.includes(b) && c.participantIds.length === 2);
}

function conversationFor(idValue: string) {
  return store.conversations.find(c => c.id === idValue);
}

function decorateConversation(c: any, userId: string) {
  const otherId = c.participantIds.find((id: string) => id !== userId);
  const other = store.users.find(u => u.id === otherId);
  const last = store.messages.filter(m => m.conversationId === c.id).sort((a,b) => a.createdAt.localeCompare(b.createdAt)).at(-1);
  return {
    id: c.id,
    participantIds: c.participantIds,
    participant: publicUser(other),
    lastMessage: last,
    unreadCount: store.messages.filter(m => m.conversationId === c.id && m.senderId !== userId && !m.readBy.includes(userId)).length,
    updatedAt: last?.createdAt || c.updatedAt,
  };
}

router.use(authMiddleware);

router.get('/plans/me', (req: AuthRequest, res: Response) => {
  res.json(findPlanForUser(req.user!.id) || null);
});

router.post('/plans', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const body = req.body || {};
  if (!body.preferredDate || !body.preferredTime || !body.area || !Array.isArray(body.pandalIds) || body.pandalIds.length === 0) {
    return res.status(400).json({ message: 'Date, time, area and at least one pandal are required.' });
  }

  const pandalNames = body.pandalIds.map((pid: string) => store.pandals.find(p => p.id === pid)?.name).filter(Boolean);
  const existing = findPlanForUser(user.id);
  const plan: VisitPlan = {
    id: existing?.id || id('visit'),
    userId: user.id,
    displayName: String(body.displayName || user.name).slice(0, 60),
    avatar: user.avatar,
    preferredDate: String(body.preferredDate),
    preferredTime: String(body.preferredTime),
    area: String(body.area).slice(0, 120),
    pandalIds: body.pandalIds.slice(0, 20),
    pandalNames,
    numberOfPandals: Number(body.numberOfPandals || body.pandalIds.length),
    travelPreference: body.travelPreference || 'Walking',
    groupPreference: body.groupPreference || 'Solo partner',
    introduction: String(body.introduction || '').slice(0, 500),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  if (existing) Object.assign(existing, plan);
  else store.visitPlans.push(plan);
  res.json(plan);
});

router.delete('/plans/me', (req: AuthRequest, res: Response) => {
  store.visitPlans = store.visitPlans.filter(p => p.userId !== req.user!.id);
  res.json({ message: 'Visit plan removed' });
});

router.get('/matches', (req: AuthRequest, res: Response) => {
  const me = findPlanForUser(req.user!.id);
  if (!me) return res.json([]);
  const area = String(req.query.area || '').toLowerCase();
  const pandalId = String(req.query.pandalId || '');
  const date = String(req.query.date || '');
  const time = String(req.query.time || '');

  const results = store.visitPlans.filter(p => p.userId !== req.user!.id && !store.blockedUsers.some(b => b.userId === req.user!.id && b.blockedUserId === p.userId) && !store.blockedUsers.some(b => b.userId === p.userId && b.blockedUserId === req.user!.id)).map(p => {
    let score = 0;
    const commonPandals = p.pandalIds.filter(x => me.pandalIds.includes(x));
    if (p.preferredDate === me.preferredDate) score += 30;
    if (p.preferredTime === me.preferredTime) score += 20;
    if (p.area.toLowerCase() === me.area.toLowerCase()) score += 20;
    else if (p.area.toLowerCase().includes(me.area.toLowerCase()) || me.area.toLowerCase().includes(p.area.toLowerCase())) score += 10;
    score += Math.min(20, commonPandals.length * 10);
    if (p.travelPreference === me.travelPreference) score += 5;
    if (p.groupPreference === me.groupPreference) score += 5;
    return {
      ...p,
      user: publicUser(store.users.find(u => u.id === p.userId)),
      matchPercentage: Math.min(99, score),
      commonPandals: p.pandalNames.filter((_, i) => commonPandals.includes(p.pandalIds[i])),
    };
  }).filter(r => (!area || r.area.toLowerCase().includes(area)) && (!pandalId || r.pandalIds.includes(pandalId)) && (!date || r.preferredDate === date) && (!time || r.preferredTime === time)).sort((a,b) => b.matchPercentage - a.matchPercentage);
  res.json(results);
});

router.get('/connections', (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const items = store.connections.filter(c => c.requesterId === userId || c.recipientId === userId).map(c => ({
    ...c,
    otherUser: publicUser(store.users.find(u => u.id === (c.requesterId === userId ? c.recipientId : c.requesterId)))
  }));
  res.json(items);
});

router.post('/connections/:userId', (req: AuthRequest, res: Response) => {
  const requesterId = req.user!.id, recipientId = req.params.userId;
  if (requesterId === recipientId) return res.status(400).json({ message: 'You cannot connect with yourself.' });
  if (!store.users.some(u => u.id === recipientId)) return res.status(404).json({ message: 'User not found.' });
  if (store.blockedUsers.some(b => (b.userId === requesterId && b.blockedUserId === recipientId) || (b.userId === recipientId && b.blockedUserId === requesterId))) return res.status(403).json({ message: 'Connection unavailable.' });
  const existing = connectionBetween(requesterId, recipientId);
  if (existing) return res.status(400).json({ message: `Connection already ${existing.status}.` });
  const c: Connection = { id: id('connection'), requesterId, recipientId, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.connections.push(c);
  notify(recipientId, 'connection_request', 'New Pandal Partner request', `${req.user!.name} wants to visit pandals with you.`, c.id);
  res.status(201).json(c);
});

router.put('/connections/:id', (req: AuthRequest, res: Response) => {
  const c = store.connections.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ message: 'Connection not found.' });
  if (![c.requesterId, c.recipientId].includes(req.user!.id)) return res.status(403).json({ message: 'Not allowed.' });
  const action = req.body?.action;
  if (action === 'cancel' && c.requesterId === req.user!.id) c.status = 'declined';
  else if ((action === 'accept' || action === 'decline') && c.recipientId === req.user!.id) c.status = action === 'accept' ? 'accepted' : 'declined';
  else return res.status(400).json({ message: 'Invalid connection action.' });
  c.updatedAt = new Date().toISOString();
  if (c.status === 'accepted') {
    if (!getConversation(c.requesterId, c.recipientId)) {
      store.conversations.push({
        id: id('conversation'),
        participantIds: [c.requesterId, c.recipientId],
        participant: publicUser(store.users.find(u => u.id === (c.requesterId === req.user!.id ? c.recipientId : c.requesterId))),
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      } as any);
    }
    notify(c.requesterId, 'connection_accepted', 'Connection accepted', `${req.user!.name} accepted your pandal partner request.`, c.id);
    notify(c.recipientId, 'connection_accepted', 'Connection accepted', `You are now connected with ${store.users.find(u => u.id === c.requesterId)?.name || 'your partner'}.`, c.id);
  }
  res.json(c);
});

router.delete('/connections/:id', (req: AuthRequest, res: Response) => {
  const c = store.connections.find(x => x.id === req.params.id);
  if (!c || ![c.requesterId, c.recipientId].includes(req.user!.id)) return res.status(404).json({ message: 'Connection not found.' });
  store.connections = store.connections.filter(x => x.id !== c.id);
  if (c.status === 'accepted') {
    const conv = getConversation(c.requesterId, c.recipientId);
    if (conv) store.conversations = store.conversations.filter(x => x.id !== conv.id);
  }
  res.json({ message: 'Connection removed.' });
});

router.get('/conversations', (req: AuthRequest, res: Response) => {
  res.json(store.conversations.filter(c => c.participantIds.includes(req.user!.id)).map(c => decorateConversation(c, req.user!.id)).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)));
});

router.get('/conversations/:id/messages', (req: AuthRequest, res: Response) => {
  const c = conversationFor(req.params.id);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Conversation access denied.' });
  res.json(store.messages.filter(m => m.conversationId === c.id).sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
});

router.post('/conversations/:id/messages', (req: AuthRequest, res: Response) => {
  const c = conversationFor(req.params.id);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Conversation access denied.' });
  if (!String(req.body?.text || '').trim()) return res.status(400).json({ message: 'Message cannot be empty.' });
  const message: ChatMessage = { id: id('message'), conversationId: c.id, senderId: req.user!.id, senderName: req.user!.name, text: String(req.body.text).trim().slice(0, 2000), status: 'delivered', readBy: [req.user!.id], createdAt: new Date().toISOString() };
  store.messages.push(message);
  c.updatedAt = message.createdAt;
  const recipient = c.participantIds.find(x => x !== req.user!.id);
  if (recipient) notify(recipient, 'message', `New message from ${req.user!.name}`, message.text.slice(0, 100), c.id);
  res.status(201).json(message);
});

router.put('/conversations/:id/read', (req: AuthRequest, res: Response) => {
  const c = conversationFor(req.params.id);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Conversation access denied.' });
  store.messages.filter(m => m.conversationId === c.id && m.senderId !== req.user!.id).forEach(m => { if (!m.readBy.includes(req.user!.id)) m.readBy.push(req.user!.id); m.status = 'read'; });
  res.json({ message: 'Messages marked as read.' });
});

router.delete('/conversations/:id', (req: AuthRequest, res: Response) => {
  const c = conversationFor(req.params.id);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Conversation access denied.' });
  store.messages = store.messages.filter(m => m.conversationId !== c.id);
  store.conversations = store.conversations.filter(x => x.id !== c.id);
  res.json({ message: 'Conversation deleted.' });
});

router.get('/notifications', (req: AuthRequest, res: Response) => {
  res.json(store.notifications.filter(n => n.userId === req.user!.id).slice(0, 100));
});

router.put('/notifications/read-all', (req: AuthRequest, res: Response) => {
  store.notifications.filter(n => n.userId === req.user!.id).forEach(n => n.read = true);
  res.json({ message: 'Notifications marked as read.' });
});

router.post('/shared-plans', (req: AuthRequest, res: Response) => {
  const { conversationId, pandalId, date, time, meetingPoint, travelMethod, notes } = req.body || {};
  const c = conversationFor(conversationId);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Conversation access denied.' });
  if (!isConnected(c.participantIds[0], c.participantIds[1])) return res.status(403).json({ message: 'Users are not connected.' });
  const pandal = store.pandals.find(p => p.id === pandalId);
  if (!pandal || !date || !time || !meetingPoint) return res.status(400).json({ message: 'Pandal, date, time and meeting point are required.' });
  const plan: SharedVisitPlan = { id: id('shared-plan'), conversationId, creatorId: req.user!.id, pandalId, pandalName: pandal.name, date, time, meetingPoint, travelMethod: travelMethod || 'Walking', notes: String(notes || '').slice(0, 500), status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.sharedVisitPlans.push(plan);
  c.participantIds.filter(x => x !== req.user!.id).forEach(uid => notify(uid, 'visit_plan', 'New shared visit plan', `${req.user!.name} proposed a visit to ${pandal.name}.`, plan.id));
  res.status(201).json(plan);
});

router.put('/shared-plans/:id', (req: AuthRequest, res: Response) => {
  const plan = store.sharedVisitPlans.find(p => p.id === req.params.id);
  if (!plan) return res.status(404).json({ message: 'Visit plan not found.' });
  const c = conversationFor(plan.conversationId);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Access denied.' });
  const action = req.body?.action;
  if (action === 'accept') plan.status = 'confirmed';
  else if (action === 'decline') plan.status = 'declined';
  else {
    Object.assign(plan, {
      pandalId: req.body.pandalId || plan.pandalId,
      date: req.body.date || plan.date,
      time: req.body.time || plan.time,
      meetingPoint: req.body.meetingPoint || plan.meetingPoint,
      travelMethod: req.body.travelMethod || plan.travelMethod,
      notes: req.body.notes ?? plan.notes,
    });
  }
  plan.updatedAt = new Date().toISOString();
  c.participantIds.filter(x => x !== req.user!.id).forEach(uid => notify(uid, 'visit_plan', 'Visit plan updated', `${req.user!.name} updated the shared visit plan.`, plan.id));
  res.json(plan);
});

router.post('/block/:userId', (req: AuthRequest, res: Response) => {
  const userId = req.user!.id, blockedUserId = req.params.userId;
  if (userId === blockedUserId) return res.status(400).json({ message: 'Invalid user.' });
  if (!store.blockedUsers.some(b => b.userId === userId && b.blockedUserId === blockedUserId)) {
    store.blockedUsers.push({ userId, blockedUserId, createdAt: new Date().toISOString() });
  }
  store.connections = store.connections.filter(c => !(c.requesterId === userId && c.recipientId === blockedUserId) && !(c.requesterId === blockedUserId && c.recipientId === userId));
  const c = getConversation(userId, blockedUserId);
  if (c) store.conversations = store.conversations.filter(x => x.id !== c.id);
  res.json({ message: 'User blocked.' });
});

router.post('/report/:userId', (req: AuthRequest, res: Response) => {
  const reportedUserId = req.params.userId;
  if (!store.users.some(u => u.id === reportedUserId)) return res.status(404).json({ message: 'User not found.' });
  const report: UserReport = { id: id('report'), reporterId: req.user!.id, reportedUserId, reason: String(req.body?.reason || 'Inappropriate behavior').slice(0, 500), createdAt: new Date().toISOString() };
  store.reports.push(report);
  res.status(201).json({ message: 'Report submitted. Thank you.' });
});

router.get('/shared-plans/:conversationId', (req: AuthRequest, res: Response) => {
  const c = conversationFor(req.params.conversationId);
  if (!c || !c.participantIds.includes(req.user!.id)) return res.status(403).json({ message: 'Access denied.' });
  res.json(store.sharedVisitPlans.filter(p => p.conversationId === c.id).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)));
});

export default router;
