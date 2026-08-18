import { Award, Calendar, Compass, MapPin, Trophy, User, Users } from 'lucide-react';
import React from 'react';
import { ViewTab } from './Navbar';

interface BottomNavProps {
  activeTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const items = [
    { id: 'home' as ViewTab, label: 'Home', icon: Compass },
    { id: 'map' as ViewTab, label: 'Map', icon: MapPin },
    { id: 'nearby' as ViewTab, label: 'Nearby', icon: Compass },
    { id: 'challenges' as ViewTab, label: 'Challenges', icon: Award },
    { id: 'planner' as ViewTab, label: 'Planner', icon: Calendar },
    { id: 'leaderboard' as ViewTab, label: 'Ranks', icon: Trophy },
    { id: 'profile' as ViewTab, label: 'Profile', icon: User },
    { id: 'partners' as ViewTab, label: 'Partners', icon: Users },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-amber-200/80 px-2 py-1.5 sm:hidden shadow-lg flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-orange-600 font-bold scale-105' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
