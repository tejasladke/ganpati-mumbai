import { Heart } from 'lucide-react';
import React from 'react';
import { PandalCard } from '../components/PandalCard';
import { Pandal } from '../types';

interface FavoritesPageProps {
  favoritePandals: Pandal[];
  onRemoveFavorite: (id: string) => void;
  onSelectPandal: (pandal: Pandal) => void;
  onExploreMore: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoritePandals,
  onRemoveFavorite,
  onSelectPandal,
  onExploreMore,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
          ❤️ SAVED DEVOTIONAL PLACES
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
          Your Favorite Pandals ({favoritePandals.length})
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
          Quickly access your bookmarked Ganpati pandals, darshan timings, and routes
        </p>
      </div>

      {favoritePandals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-200/80 space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-8 h-8 fill-rose-300" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">No Favorites Saved Yet</h3>
          <p className="text-stone-600 text-xs sm:text-sm">
            Click the heart icon on any pandal card to bookmark your favorite places for quick access.
          </p>
          <button
            onClick={onExploreMore}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md"
          >
            Explore Mumbai Pandals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePandals.map((pandal) => (
            <PandalCard
              key={pandal.id}
              pandal={pandal}
              isFavorite={true}
              onToggleFavorite={() => onRemoveFavorite(pandal.id)}
              onSelect={onSelectPandal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
