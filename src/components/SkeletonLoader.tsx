import React from 'react';

export const PandalSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 p-4 animate-pulse flex flex-col gap-3">
      <div className="h-48 bg-amber-100 rounded-xl w-full"></div>
      <div className="h-5 bg-amber-100 rounded w-3/4"></div>
      <div className="h-4 bg-amber-100/60 rounded w-full"></div>
      <div className="h-4 bg-amber-100/60 rounded w-2/3"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-amber-100 rounded-xl flex-1"></div>
        <div className="h-9 bg-amber-200 rounded-xl flex-1"></div>
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PandalSkeleton key={i} />
      ))}
    </div>
  );
};
