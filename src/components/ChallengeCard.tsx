import { Award, Calendar, CheckCircle2, MapPin, Trophy } from 'lucide-react';
import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted?: boolean;
  onStart: (challenge: Challenge) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isCompleted = false, onStart }) => {
  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Hard':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Banner Image */}
        <div className="relative h-44 w-full overflow-hidden bg-amber-100">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>

          {/* Points Pill */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
            <Trophy className="w-3.5 h-3.5 fill-amber-200" />
            <span>+{challenge.points} Points</span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getDifficultyColor()}`}>
              {challenge.difficulty}
            </span>
          </div>

          {/* Completed overlay badge */}
          {isCompleted && (
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Challenge Completed!</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 line-clamp-1">
            {challenge.title}
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mb-4">
            {challenge.description}
          </p>

          <div className="space-y-1.5 text-xs text-stone-500 mb-4">
            {challenge.pandalName && (
              <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{challenge.pandalName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Ends: {challenge.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <button
          onClick={() => onStart(challenge)}
          disabled={isCompleted}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 cursor-default'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 active:scale-95'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isCompleted ? 'Completed' : 'Start Challenge'}</span>
        </button>
      </div>
    </div>
  );
};
