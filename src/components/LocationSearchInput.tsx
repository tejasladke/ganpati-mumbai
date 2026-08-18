import { Compass, MapPin, Search, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { LocationSearchResult, searchLocations } from '../services/geocoding';
import { Pandal } from '../types';

interface LocationSearchInputProps {
  pandals: Pandal[];
  placeholder?: string;
  onSelectLocation: (result: {
    lat: number;
    lng: number;
    displayName: string;
    pandal?: Pandal;
  }) => void;
  onClear?: () => void;
  className?: string;
  initialValue?: string;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  pandals,
  placeholder = 'Search location, address, area or pandal name...',
  onSelectLocation,
  onClear,
  className = '',
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [matchingPandals, setMatchingPandals] = useState<Pandal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query if initialValue changes
  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Debounced Search Handler
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      setResults([]);
      setMatchingPandals([]);
      setIsOpen(false);
      return;
    }

    // Filter matching pandals locally first
    const pandalMatches = pandals.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.area.toLowerCase().includes(trimmed) ||
        p.address.toLowerCase().includes(trimmed)
    );
    setMatchingPandals(pandalMatches.slice(0, 5));

    // Fetch geocoding locations
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const geoResults = await searchLocations(trimmed);
        setResults(geoResults.slice(0, 6));
        setIsOpen(true);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, pandals]);

  const handleSelectPandal = (pandal: Pandal) => {
    setQuery(pandal.name);
    setIsOpen(false);
    onSelectLocation({
      lat: pandal.latitude,
      lng: pandal.longitude,
      displayName: `${pandal.name} (${pandal.area})`,
      pandal,
    });
  };

  const handleSelectGeoLocation = (item: LocationSearchResult) => {
    setQuery(item.displayName);
    setIsOpen(false);
    onSelectLocation({
      lat: item.lat,
      lng: item.lng,
      displayName: item.displayName,
    });
  };

  const handleLocateCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setQuery('My GPS Location');
        onSelectLocation({
          lat,
          lng,
          displayName: 'My Present GPS Location',
        });
      },
      (err) => {
        setLoading(false);
        console.warn('GPS location error:', err);
        // Default to Lalbaug, Mumbai
        setQuery('Lalbaug, Mumbai');
        onSelectLocation({
          lat: 18.9912,
          lng: 72.8385,
          displayName: 'Lalbaug, Mumbai (Default Center)',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setMatchingPandals([]);
    setIsOpen(false);
    if (onClear) onClear();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center bg-white border border-amber-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-orange-500 transition-all">
        <Search className="w-4 h-4 text-orange-500 ml-3 shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 outline-none"
        />

        {loading && (
          <div className="mr-2 shrink-0">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {query && (
          <button
            onClick={handleClear}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 mr-1"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleLocateCurrentGps}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-3 py-2 rounded-xl mr-1.5 transition-colors flex items-center gap-1 shrink-0"
          title="Use my GPS position"
        >
          <Compass className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>

      {/* Auto-suggest Dropdown */}
      {isOpen && (matchingPandals.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-amber-200 shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto divide-y divide-amber-100">
          {/* Matching Pandals Section */}
          {matchingPandals.length > 0 && (
            <div className="p-2 bg-amber-50/50">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 px-2 py-1 block">
                🌺 Matching Pandals ({matchingPandals.length})
              </span>
              <div className="space-y-1 mt-1">
                {matchingPandals.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPandal(p)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-100/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-900 group-hover:text-orange-700 block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500 shrink-0" /> {p.area} • {p.address}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full shrink-0">
                      Pandal
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Searched Geocoded Locations Section */}
          {results.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 px-2 py-1 block">
                📍 Searched Mumbai Locations & Places ({results.length})
              </span>
              <div className="space-y-1 mt-1">
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectGeoLocation(res)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-stone-800 group-hover:text-stone-900 block">
                          {res.displayName}
                        </span>
                        {res.areaName && (
                          <span className="text-[10px] text-stone-500">Area: {res.areaName}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full shrink-0">
                      {res.type === 'landmark' ? 'Landmark' : 'Address'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
