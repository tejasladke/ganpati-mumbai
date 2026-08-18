import React from 'react';
import { CrowdLevel } from '../types';

interface CrowdBadgeProps {
  level: CrowdLevel;
  className?: string;
}

export const CrowdBadge: React.FC<CrowdBadgeProps> = ({ level, className = '' }) => {
  const getColors = () => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Heavy':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getDotColor = () => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500';
      case 'Moderate':
        return 'bg-amber-500';
      case 'High':
        return 'bg-orange-500';
      case 'Heavy':
        return 'bg-rose-600';
      default:
        return 'bg-stone-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getColors()} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${getDotColor()}`}></span>
      <span>{level} Crowd</span>
    </span>
  );
};
