import { Heart, MapPin, Navigation, Star } from 'lucide-react';
import React from 'react';
import { Pandal } from '../types';
import { CrowdBadge } from './CrowdBadge';

interface PandalCardProps {
  pandal: Pandal;
  distanceKm?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelect: (pandal: Pandal) => void;
}

export const PandalCard: React.FC<PandalCardProps> = ({
  pandal,
  distanceKm,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) => {
  const primaryImage = pandal.images && pandal.images.length > 0
    ? pandal.images[0]
    : 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg';

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-amber-100">
        <img
          src={primaryImage}
          alt={pandal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="bg-orange-500/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-400">
            {pandal.area}
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(pandal.id);
              }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-md hover:scale-110 active:scale-95 transition-all"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600'}`} />
            </button>
          )}
        </div>

        {/* Bottom Banner inside Image */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
          <div className="flex items-center gap-1.5 text-xs bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-200 border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{pandal.popularity}% Popular</span>
          </div>
          {distanceKm !== undefined && (
            <span className="text-xs font-medium bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm">
              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm.toFixed(1)} km away`}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {pandal.name}
            </h3>
            <CrowdBadge level={pandal.crowdLevel} />
          </div>

          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mb-3">
            {pandal.description}
          </p>

          <div className="flex items-start gap-1.5 text-stone-500 text-xs mb-4">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{pandal.address}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-amber-100 flex gap-2">
          <button
            onClick={() => onSelect(pandal)}
            className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors text-center"
          >
            View Details
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
