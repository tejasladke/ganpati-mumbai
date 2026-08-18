import { Award, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { ChallengeCard } from '../components/ChallengeCard';
import { useAuth } from '../context/AuthContext';
import { Challenge, Submission } from '../types';

interface ChallengesPageProps {
  challenges: Challenge[];
  mySubmissions?: Submission[];
  onStartChallenge: (challenge: Challenge) => void;
  onNavigate?: (tab: any) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  challenges = [],
  mySubmissions = [],
  onStartChallenge,
}) => {
  const { user } = useAuth();
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const completedChallengeIds = (mySubmissions || [])
    .filter((s) => s.status === 'Approved')
    .map((s) => s.challengeId);

  const filteredChallenges = challenges.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold px-3.5 py-1 rounded-full border border-white/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>GANPATI FESTIVAL GAME & QUESTS</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Rozha_One',serif]">
            Mumbai Pandal Challenges
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm">
            Complete fun real-world Ganpati photo challenges, submit proof, earn points, and climb the Devotee Leaderboard!
          </p>

          {user && (
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-amber-100">
              <span className="bg-stone-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                🪙 Total Points: {user.points}
              </span>
              <span className="bg-stone-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                🏆 Quests Completed: {completedChallengeIds.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-200">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterDifficulty === diff
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            {diff} Difficulty
          </button>
        ))}
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => {
          const isDone = completedChallengeIds.includes(challenge.id);
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isCompleted={isDone}
              onStart={onStartChallenge}
            />
          );
        })}
      </div>
    </div>
  );
};
