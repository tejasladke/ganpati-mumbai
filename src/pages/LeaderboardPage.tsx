import { Award, Crown, Medal, Sparkles, Trophy } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

interface LeaderboardPageProps {
  leaderboard: User[];
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ leaderboard }) => {
  const { user } = useAuth();

  const userRankIndex = user ? leaderboard.findIndex((u) => u.id === user.id) : -1;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>FESTIVAL DEVOTEE RANKS 2026</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
          Mumbai Bappa Leaderboard
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
          Devotees earn points by exploring pandals, completing photo quests, and sharing festive experiences
        </p>
      </div>

      {/* Current User Personal Rank Highlight Banner */}
      {user && (
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-xl text-stone-900 shadow-md">
              #{userRankIndex !== -1 ? userRankIndex + 1 : 'N/A'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Your Rank</span>
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-xs text-stone-400">{user.completedChallenges} Quests Completed</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-amber-400 block">🪙 {user.points} pts</span>
            <span className="text-[10px] font-semibold text-amber-200 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {user.badges?.[0] || 'Devotee'}
            </span>
          </div>
        </div>
      )}

      {/* Festive Top 3 Podium */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md text-center space-y-3 order-2 sm:order-1 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-slate-200 text-stone-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                🥈 2nd
              </div>
              <img
                src={top3[1].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${top3[1].name}`}
                alt=""
                className="w-16 h-16 rounded-full border-2 border-slate-300 mx-auto object-cover shadow"
              />
              <div>
                <h3 className="text-base font-bold text-stone-900">{top3[1].name}</h3>
                <span className="text-sm font-extrabold text-orange-600 block">🪙 {top3[1].points} pts</span>
                <span className="text-[10px] font-semibold text-stone-500">{top3[1].completedChallenges} Quests</span>
              </div>
            </div>
          )}

          {/* 1st Place Crown */}
          {top3[0] && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-6 border-2 border-amber-300 shadow-xl text-center space-y-3 order-1 sm:order-2 relative scale-105">
              <Crown className="w-8 h-8 text-amber-200 mx-auto fill-amber-200 animate-bounce" />
              <div className="absolute top-2 right-2 bg-amber-300 text-amber-950 text-xs font-black px-3 py-0.5 rounded-full shadow">
                👑 1st Rank
              </div>
              <img
                src={top3[0].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${top3[0].name}`}
                alt=""
                className="w-20 h-20 rounded-full border-4 border-white mx-auto object-cover shadow-lg"
              />
              <div>
                <h3 className="text-lg font-black text-white">{top3[0].name}</h3>
                <span className="text-xl font-black text-amber-100 block">🪙 {top3[0].points} pts</span>
                <span className="text-xs font-bold text-amber-100/90">{top3[0].completedChallenges} Quests Done</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-md text-center space-y-3 order-3 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                🥉 3rd
              </div>
              <img
                src={top3[2].avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${top3[2].name}`}
                alt=""
                className="w-16 h-16 rounded-full border-2 border-amber-300 mx-auto object-cover shadow"
              />
              <div>
                <h3 className="text-base font-bold text-stone-900">{top3[2].name}</h3>
                <span className="text-sm font-extrabold text-orange-600 block">🪙 {top3[2].points} pts</span>
                <span className="text-[10px] font-semibold text-stone-500">{top3[2].completedChallenges} Quests</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of Devotees Table */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-3">
        <h3 className="text-lg font-bold text-stone-900 mb-4">All Devotee Rankings</h3>
        <div className="divide-y divide-amber-100">
          {leaderboard.map((u, idx) => {
            const isMe = user?.id === u.id;
            return (
              <div
                key={u.id}
                className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isMe ? 'bg-amber-100/70 border border-amber-300' : 'hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-extrabold text-xs text-stone-500">#{idx + 1}</span>
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                    alt=""
                    className="w-10 h-10 rounded-full border border-amber-300 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {isMe && <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">You</span>}
                    </h4>
                    <span className="text-xs text-stone-500">{u.completedChallenges} Quests Completed</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-orange-600 block">🪙 {u.points} pts</span>
                  <div className="flex gap-1 justify-end mt-0.5">
                    {u.badges?.slice(0, 2).map((b, i) => (
                      <span key={i} className="text-[9px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
