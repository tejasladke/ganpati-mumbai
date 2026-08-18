import React from 'react';

export const FestiveGarland: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 py-1 flex justify-center items-center gap-3 overflow-hidden text-amber-100 text-xs font-semibold tracking-wide select-none">
      <span>🌺 🪔 GANPATI BAPPA MORYA 🪔 🌺</span>
      <span className="hidden sm:inline">•</span>
      <span className="hidden sm:inline">MUMBAI GANPATI FESTIVAL 2026</span>
      <span className="hidden md:inline">•</span>
      <span className="hidden md:inline">🥁 LIVE PANDAL EXPLORER & DARSHAN GUIDE 🥁</span>
    </div>
  );
};
