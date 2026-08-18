import { Award, Calendar, Edit2, Heart, LogOut, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pandal, Submission } from '../types';

interface MyProfilePageProps {
  mySubmissions: Submission[];
  favoritePandals: Pandal[];
  onSelectPandal: (pandal: Pandal) => void;
  onNavigateLogin: () => void;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  mySubmissions,
  favoritePandals,
  onSelectPandal,
  onNavigateLogin,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl">
          🪔
        </div>
        <h2 className="text-2xl font-bold text-stone-900 font-['Rozha_One',serif]">Devotee Profile</h2>
        <p className="text-stone-600 text-xs sm:text-sm">Please log in to view your points, badges, and challenge submissions.</p>
        <button
          onClick={onNavigateLogin}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-2xl shadow-md transition-all text-sm"
        >
          Log In or Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(name, avatar);
    setEditing(false);
  };

  const allBadgesList = [
    { title: 'Bappa Devotee', desc: 'Registered on Ganpati Mumbai Explorer', icon: '🌺', unlocked: true },
    { title: 'Pandal Explorer', desc: 'Completed 3+ Pandal Quests', icon: '📍', unlocked: user.completedChallenges >= 3 },
    { title: 'Mumbai Raja Master', desc: 'Completed 5+ Pandal Quests', icon: '👑', unlocked: user.completedChallenges >= 5 },
    { title: 'Speed Darshan', desc: 'Earned 500+ Devotee Points', icon: '⚡', unlocked: user.points >= 500 },
    { title: 'Festive Photographer', desc: 'Earned 1000+ Devotee Points', icon: '📸', unlocked: user.points >= 1000 },
    { title: 'Festival Admin', desc: 'Platform Administrator', icon: '🛡️', unlocked: user.role === 'admin' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-lg shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Rozha_One',serif]">{user.name}</h1>
                <p className="text-amber-100 text-xs">{user.email}</p>
              </div>
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/30 flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
                <button
                  onClick={logout}
                  className="bg-rose-600/80 hover:bg-rose-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-rose-400 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold">
              <div className="bg-stone-900/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                🪙 <span className="text-amber-200 text-base font-black">{user.points}</span> Total Points
              </div>
              <div className="bg-stone-900/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                🏆 <span className="text-amber-200 text-base font-black">{user.completedChallenges}</span> Completed Quests
              </div>
              <div className="bg-stone-900/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                ❤️ <span className="text-amber-200 text-base font-black">{favoritePandals.length}</span> Saved Pandals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-900">Update Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-xs text-stone-900 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-xs text-stone-900 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Badges Showcase Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Devotee Badges & Medals</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {allBadgesList.map((badge, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-sm'
                  : 'bg-stone-50 border-stone-200 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl">{badge.icon}</div>
              <h4 className="text-xs font-bold text-stone-900 leading-tight">{badge.title}</h4>
              <p className="text-[10px] text-stone-500 leading-tight">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submission History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">
          Your Quest Submissions ({mySubmissions.length})
        </h2>
        {mySubmissions.length === 0 ? (
          <p className="text-xs text-stone-500 italic">No challenge submissions yet. Start a quest from the Challenges page!</p>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={sub.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{sub.challengeTitle}</h4>
                    <span className="text-[10px] text-stone-500">
                      Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    sub.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : sub.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
