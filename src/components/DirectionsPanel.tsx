import {
  ArrowUpDown,
  Bike,
  Car,
  Compass,
  CornerUpLeft,
  CornerUpRight,
  ExternalLink,
  Footprints,
  Locate,
  MapPin,
  Navigation,
  Search,
  Train,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { getDirections, RouteData } from '../services/directions';
import { LocationSearchResult, searchLocations } from '../services/geocoding';
import { Pandal } from '../types';

interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
}

interface DirectionsPanelProps {
  initialStartLocation?: LocationPoint;
  initialDestinationPandal?: Pandal;
  pandals?: Pandal[];
  onRouteGenerated?: (route: RouteData | null) => void;
  onLocationsChanged?: (start: LocationPoint, end: LocationPoint) => void;
  onClose?: () => void;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  initialStartLocation,
  initialDestinationPandal,
  pandals = [],
  onRouteGenerated,
  onLocationsChanged,
  onClose,
}) => {
  const { showToast } = useToast();

  // State for Start Location (Origin A)
  const [startPoint, setStartPoint] = useState<LocationPoint>({
    lat: initialStartLocation?.lat || 18.9543,
    lng: initialStartLocation?.lng || 72.8143,
    name: initialStartLocation?.name || 'Girgaon / South Mumbai (Current Position)',
  });

  // State for Destination Location (Destination B)
  const [endPoint, setEndPoint] = useState<LocationPoint>({
    lat: initialDestinationPandal?.latitude || 18.9912,
    lng: initialDestinationPandal?.longitude || 72.8385,
    name: initialDestinationPandal?.name || 'Lalbaugcha Raja, Lalbaug',
  });

  const [mode, setMode] = useState<'driving' | 'walking' | 'bicycling' | 'transit'>('driving');
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLocatingStart, setIsLocatingStart] = useState(false);

  // Search input dropdown states
  const [activeSearchField, setActiveSearchField] = useState<'start' | 'end' | null>(null);
  const [startQuery, setStartQuery] = useState(startPoint.name);
  const [endQuery, setEndQuery] = useState(endPoint.name);
  const [startSearchResults, setStartSearchResults] = useState<LocationSearchResult[]>([]);
  const [endSearchResults, setEndSearchResults] = useState<LocationSearchResult[]>([]);

  // Sync state when props change
  useEffect(() => {
    if (initialStartLocation) {
      setStartPoint(initialStartLocation);
      setStartQuery(initialStartLocation.name);
    }
  }, [initialStartLocation?.lat, initialStartLocation?.lng, initialStartLocation?.name]);

  useEffect(() => {
    if (initialDestinationPandal) {
      const pLoc = {
        lat: initialDestinationPandal.latitude,
        lng: initialDestinationPandal.longitude,
        name: `${initialDestinationPandal.name}, ${initialDestinationPandal.area}`,
      };
      setEndPoint(pLoc);
      setEndQuery(pLoc.name);
    }
  }, [initialDestinationPandal?.id, initialDestinationPandal?.latitude, initialDestinationPandal?.longitude]);

  // Fetch Route on changes
  useEffect(() => {
    let isMounted = true;

    async function fetchRoute() {
      if (!startPoint.lat || !endPoint.lat) return;
      setLoading(true);
      try {
        const res = await getDirections(
          startPoint.lat,
          startPoint.lng,
          endPoint.lat,
          endPoint.lng,
          mode,
          startPoint.name,
          endPoint.name
        );
        if (isMounted) {
          setRoute(res);
          if (onRouteGenerated) onRouteGenerated(res);
          if (onLocationsChanged) onLocationsChanged(startPoint, endPoint);
        }
      } catch (err) {
        console.warn('Route fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng, mode]);

  // Search autocomplete handler for Start Point
  const handleStartQueryChange = async (q: string) => {
    setStartQuery(q);
    if (!q.trim()) {
      setStartSearchResults([]);
      return;
    }
    const results = await searchLocations(q);
    setStartSearchResults(results);
  };

  // Search autocomplete handler for End Point
  const handleEndQueryChange = async (q: string) => {
    setEndQuery(q);
    if (!q.trim()) {
      setEndSearchResults([]);
      return;
    }
    const results = await searchLocations(q);
    setEndSearchResults(results);
  };

  // Get GPS current location for Start Point
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocatingStart(true);
    showToast('Locating your GPS coordinates... 📡', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingStart(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newStart = {
          lat,
          lng,
          name: 'My Present Location (GPS)',
        };
        setStartPoint(newStart);
        setStartQuery(newStart.name);
        setActiveSearchField(null);
        showToast('Origin set to your GPS location! 🎯', 'success');
      },
      (err) => {
        setIsLocatingStart(false);
        console.warn('Geolocation error:', err);
        showToast('Could not fetch GPS location. Please select an area manually.', 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Swap Start (A) & End (B)
  const handleSwapLocations = () => {
    const temp = startPoint;
    setStartPoint(endPoint);
    setEndPoint(temp);
    setStartQuery(endPoint.name);
    setEndQuery(temp.name);
    showToast('Swapped Origin and Destination 🔁', 'info');
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startPoint.lat},${startPoint.lng}&destination=${endPoint.lat},${endPoint.lng}&travelmode=${
    mode === 'walking' ? 'walking' : mode === 'bicycling' ? 'bicycling' : mode === 'transit' ? 'transit' : 'driving'
  }`;

  return (
    <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-xl space-y-4 font-['Poppins',sans-serif]">
      {/* Google Maps Style Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 leading-none flex items-center gap-1.5">
              <span>Google Maps Directions</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Live GPS
              </span>
            </h3>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Turn-by-turn routing & transit times
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              if (onRouteGenerated) onRouteGenerated(null);
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Origin & Destination Inputs Box (Google Maps Form) */}
      <div className="relative bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
        {/* Swap Button Floating */}
        <button
          type="button"
          onClick={handleSwapLocations}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white text-stone-700 hover:bg-orange-50 hover:text-orange-600 border border-stone-300 shadow-md flex items-center justify-center transition-all active:scale-90"
          title="Swap Start and Destination"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* Start Point (Origin A) */}
        <div className="relative space-y-1 pr-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>START LOCATION (A)</span>
            </span>

            <button
              type="button"
              onClick={handleFetchCurrentLocation}
              disabled={isLocatingStart}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
            >
              <Locate className="w-3 h-3 text-blue-600" />
              <span>{isLocatingStart ? 'Locating...' : 'Use My GPS'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={startQuery}
              onChange={(e) => handleStartQueryChange(e.target.value)}
              onFocus={() => setActiveSearchField('start')}
              placeholder="Search start landmark, station or address..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-8"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
          </div>

          {/* Autocomplete Dropdown for Start */}
          {activeSearchField === 'start' && (startSearchResults.length > 0 || pandals.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-2xl shadow-2xl z-30 max-h-48 overflow-y-auto p-1 text-xs">
              <div
                onClick={handleFetchCurrentLocation}
                className="p-2 hover:bg-blue-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-blue-700 border-b border-stone-100"
              >
                <Locate className="w-4 h-4 text-blue-600" />
                <span>🎯 Use My Current GPS Location</span>
              </div>

              {startSearchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    setStartPoint({ lat: res.lat, lng: res.lng, name: res.displayName });
                    setStartQuery(res.displayName);
                    setActiveSearchField(null);
                  }}
                  className="p-2 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center gap-2 text-stone-800 border-b border-stone-50 last:border-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-medium">{res.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Point (Destination B) */}
        <div className="relative space-y-1 pr-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
            <span className="flex items-center gap-1 text-orange-700">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
              <span>DESTINATION (B)</span>
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={endQuery}
              onChange={(e) => handleEndQueryChange(e.target.value)}
              onFocus={() => setActiveSearchField('end')}
              placeholder="Search destination pandal, temple or landmark..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-8"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
          </div>

          {/* Autocomplete Dropdown for End */}
          {activeSearchField === 'end' && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-2xl shadow-2xl z-30 max-h-56 overflow-y-auto p-1 text-xs space-y-0.5">
              {/* Featured Pandals List */}
              <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 rounded-lg">
                Popular Ganesh Pandals
              </div>
              {pandals.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    const pPoint = { lat: p.latitude, lng: p.longitude, name: `${p.name}, ${p.area}` };
                    setEndPoint(pPoint);
                    setEndQuery(pPoint.name);
                    setActiveSearchField(null);
                  }}
                  className="p-2 hover:bg-orange-50 rounded-xl cursor-pointer flex items-center gap-2 text-stone-800"
                >
                  <span className="text-sm">🪔</span>
                  <div className="truncate min-w-0">
                    <p className="font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-stone-500">{p.area}</p>
                  </div>
                </div>
              ))}

              {endSearchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    setEndPoint({ lat: res.lat, lng: res.lng, name: res.displayName });
                    setEndQuery(res.displayName);
                    setActiveSearchField(null);
                  }}
                  className="p-2 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center gap-2 text-stone-800"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate font-medium">{res.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport Modes Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-amber-50/80 p-1 rounded-2xl border border-amber-200/80">
        <button
          type="button"
          onClick={() => setMode('driving')}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            mode === 'driving' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 hover:bg-amber-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Car / Cab</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('bicycling')}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            mode === 'bicycling' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 hover:bg-amber-100'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bike / 2W</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('transit')}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            mode === 'transit' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 hover:bg-amber-100'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Train / Metro</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('walking')}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            mode === 'walking' ? 'bg-orange-500 text-white shadow-md' : 'text-stone-600 hover:bg-amber-100'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>Walk</span>
        </button>
      </div>

      {/* Route Calculation Results */}
      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-600 font-bold">Calculating best Mumbai navigation route...</p>
        </div>
      ) : route ? (
        <div className="space-y-3">
          {/* Main Time & Distance Card */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-100 font-bold uppercase tracking-wider">
                <span>⚡ Fastest Route</span>
              </div>
              <div className="text-3xl font-black tracking-tight">{route.durationMins} min</div>
              <span className="text-[11px] text-amber-100 font-medium block">
                via main arterial connector
              </span>
            </div>

            <div className="text-right space-y-1">
              <div className="text-2xl font-bold">{route.distanceKm} km</div>
              <span
                className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[10px] ${
                  route.trafficLevel === 'Heavy'
                    ? 'bg-rose-900/80 text-rose-100'
                    : route.trafficLevel === 'Moderate'
                    ? 'bg-amber-900/60 text-amber-100'
                    : 'bg-emerald-900/60 text-emerald-100'
                }`}
              >
                {route.trafficLevel} Traffic
              </span>
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                Step-by-Step Maneuvers ({route.steps.length} steps)
              </span>
            </div>

            {route.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3 text-xs hover:border-amber-300 transition-colors"
              >
                <div className="w-6 h-6 rounded-xl bg-orange-100 text-orange-800 font-extrabold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  {step.type === 'start' ? (
                    'A'
                  ) : step.type === 'finish' ? (
                    'B'
                  ) : step.direction === 'left' ? (
                    <CornerUpLeft className="w-3.5 h-3.5 text-orange-600" />
                  ) : step.direction === 'right' ? (
                    <CornerUpRight className="w-3.5 h-3.5 text-orange-600" />
                  ) : (
                    idx
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-bold text-stone-900 leading-snug">{step.instruction}</p>
                  {step.distanceKm > 0 && (
                    <p className="text-[10px] text-stone-500">
                      In {step.distanceKm} km • Approx {step.durationMins} min
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Open Google Maps App Action Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-stone-900 hover:bg-black text-amber-300 font-extrabold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Compass className="w-4.5 h-4.5 text-amber-400" />
            <span>Start Live Navigation in Google Maps App</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      ) : null}
    </div>
  );
};
