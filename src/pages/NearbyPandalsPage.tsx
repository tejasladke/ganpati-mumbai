import { Compass, List, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { LeafletMap } from '../components/LeafletMap';
import { LocationSearchInput } from '../components/LocationSearchInput';
import { PandalCard } from '../components/PandalCard';
import { useToast } from '../context/ToastContext';
import { Pandal } from '../types';

interface NearbyPandalsPageProps {
  pandals: Pandal[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectPandal: (pandal: Pandal) => void;
}

// Calculate Haversine distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const NearbyPandalsPage: React.FC<NearbyPandalsPageProps> = ({
  pandals,
  favorites,
  onToggleFavorite,
  onSelectPandal,
}) => {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('My GPS Location');
  const [locating, setLocating] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [maxDistance, setMaxDistance] = useState<number>(25); // 25km
  const { showToast } = useToast();

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationName('My Current GPS Location');
        setLocating(false);
        showToast('Located your position in Mumbai! 📍', 'success');
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err);
        // Fallback to central Lalbaug coordinates if permission denied
        setUserCoords({ lat: 18.9912, lng: 72.8385 });
        setLocationName('Lalbaug, Mumbai (GPS Default)');
        showToast('Defaulting location to Lalbaug, Mumbai', 'info');
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleLocationSelect = (res: { lat: number; lng: number; displayName: string }) => {
    setUserCoords({ lat: res.lat, lng: res.lng });
    setLocationName(res.displayName);
    showToast(`Updated reference location to: ${res.displayName} 📍`, 'success');
  };

  // Compute distances
  const pandalsWithDistance = pandals.map((p) => {
    const dist = userCoords
      ? calculateDistanceKm(userCoords.lat, userCoords.lng, p.latitude, p.longitude)
      : calculateDistanceKm(18.9912, 72.8385, p.latitude, p.longitude);
    return { pandal: p, distanceKm: dist };
  });

  // Sort by nearest distance
  pandalsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

  const filteredPandals = pandalsWithDistance.filter((item) => item.distanceKm <= maxDistance);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
            📍 GPS & CUSTOM LOCATION PROXIMITY SEARCH
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Nearby Pandals & Proximity Search
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Discover Ganpati pandals closest to your present GPS location or any custom address in Mumbai
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Use My GPS'}</span>
          </button>

          {/* Toggle Map vs List */}
          <div className="bg-amber-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
              title="Map view"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Location Search Bar & Range Slider */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Search Distance From Any Location or Landmark</span>
          </label>
          <LocationSearchInput
            pandals={pandals}
            placeholder="Type any custom address: 'Bandra Station', 'Juhu Beach', 'Borivali', 'Thane'..."
            onSelectLocation={handleLocationSelect}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-amber-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-stone-800">
              Showing pandals within: <span className="text-orange-600 font-extrabold">{maxDistance} km</span> of{' '}
              <span className="text-stone-900 font-bold">{locationName}</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full sm:w-64 accent-orange-500 cursor-pointer"
          />
        </div>
      </div>

      {/* List or Map View */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPandals.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-amber-200 text-stone-500 space-y-2">
              <p className="text-base font-bold text-stone-800">No pandals found within {maxDistance} km of {locationName}.</p>
              <p className="text-xs text-stone-500">Try increasing the distance slider above or search a different area.</p>
            </div>
          ) : (
            filteredPandals.map(({ pandal, distanceKm }) => (
              <PandalCard
                key={pandal.id}
                pandal={pandal}
                distanceKm={distanceKm}
                isFavorite={favorites.includes(pandal.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectPandal}
              />
            ))
          )}
        </div>
      ) : (
        <LeafletMap
          pandals={filteredPandals.map((f) => f.pandal)}
          onSelectPandal={onSelectPandal}
          center={userCoords ? [userCoords.lat, userCoords.lng] : [18.9912, 72.8385]}
          searchedLocationPin={userCoords ? { lat: userCoords.lat, lng: userCoords.lng, displayName: locationName } : null}
          zoom={13}
          className="h-[550px] w-full rounded-3xl border border-amber-200 shadow-md"
        />
      )}
    </div>
  );
};
