import { Camera, Compass, Filter, MapPin, Navigation, SlidersHorizontal, Sparkles, Target, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { CrowdBadge } from '../components/CrowdBadge';
import { DirectionsPanel } from '../components/DirectionsPanel';
import { LeafletMap } from '../components/LeafletMap';
import { LocationPhotosGallery } from '../components/LocationPhotosGallery';
import { LocationSearchInput } from '../components/LocationSearchInput';
import { useToast } from '../context/ToastContext';
import { RouteData } from '../services/directions';
import { Pandal } from '../types';

interface PandalMapPageProps {
  pandals: Pandal[];
  favorites: string[];
  initialSearchQuery?: string;
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

export const PandalMapPage: React.FC<PandalMapPageProps> = ({
  pandals,
  favorites,
  initialSearchQuery = '',
  onToggleFavorite,
  onSelectPandal,
}) => {
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCrowd, setSelectedCrowd] = useState('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(pandals[0] || null);
  const [sidebarTab, setSidebarTab] = useState<'details' | 'list'>('details');
  const [showDirections, setShowDirections] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteData | null>(null);

  const { showToast } = useToast();
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [searchedLocationPin, setSearchedLocationPin] = useState<{
    lat: number;
    lng: number;
    displayName: string;
  } | null>(null);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    displayName?: string;
    accuracyRadius?: number;
  } | null>(null);

  const [isLocating, setIsLocating] = useState(false);

  const areas = [
    'All',
    'Lalbaug',
    'Chinchpokli',
    'Sion',
    'Khetwadi',
    'Andheri',
    'Girgaon',
    'Dadar',
    'Kurla / Tilak Nagar',
    'Fort / CST',
    'Marine Lines / Girgaon',
    'Kala Chowkie',
    'Thane West',
    'Bandra West',
    'Ghatkopar East',
    'Turbhe / Navi Mumbai',
    'Juinagar / Navi Mumbai',
    'Vashi / Navi Mumbai',
    'Airoli / Navi Mumbai',
    'Kopar Khairane / Navi Mumbai',
    'Ghansoli / Navi Mumbai',
    'Kharghar / Navi Mumbai',
    'Sanpada / Navi Mumbai',
    'Panvel / Navi Mumbai',
    'Borivali',
  ];
  const crowdLevels = ['All', 'Low', 'Moderate', 'High', 'Heavy'];

  // Fetch real-time GPS location via browser API
  const handleGetBrowserLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsLocating(true);
    showToast('Fetching your real-time GPS position... 📡', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        const userLoc = {
          lat,
          lng,
          displayName: 'My Present Device Location',
          accuracyRadius: accuracy,
        };

        setUserLocation(userLoc);
        setSearchedLocationPin({
          lat,
          lng,
          displayName: 'My Present Device Location (GPS)',
        });

        showToast('Map centered on your current GPS location! 🎯', 'success');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        let errorMsg = 'Could not retrieve device location.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. You can select an area manually.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }

        showToast(errorMsg, 'warning');

        if (!userLocation && !searchedLocationPin) {
          setSearchedLocationPin({
            lat: 18.9912,
            lng: 72.8385,
            displayName: 'Lalbaug, Mumbai (Default)',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const panToPandalMarker = (pandal: Pandal, notify = true) => {
    setSelectedPandal(pandal);
    if (notify) {
      showToast(`Panned map to ${pandal.name} 📍`, 'info');
    }
    // Scroll smoothly to map on mobile if user clicked from below
    if (window.innerWidth < 1024 && mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle Location Search selection
  const handleLocationSelect = (res: {
    lat: number;
    lng: number;
    displayName: string;
    pandal?: Pandal;
  }) => {
    setSearchedLocationPin({
      lat: res.lat,
      lng: res.lng,
      displayName: res.displayName,
    });

    if (res.pandal) {
      panToPandalMarker(res.pandal, true);
    } else {
      // Find closest pandal to this searched location
      let closestPandal: Pandal | null = null;
      let minDistance = Infinity;

      pandals.forEach((p) => {
        const dist = calculateDistanceKm(res.lat, res.lng, p.latitude, p.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closestPandal = p;
        }
      });

      if (closestPandal) {
        panToPandalMarker(closestPandal, true);
      }
    }
  };

  const handleClearLocationPin = () => {
    setSearchedLocationPin(null);
    setUserLocation(null);
  };

  // Filter Pandals
  let filteredPandals = pandals.filter((p) => {
    const matchesArea = selectedArea === 'All' || p.area.toLowerCase() === selectedArea.toLowerCase();
    const matchesCrowd = selectedCrowd === 'All' || p.crowdLevel === selectedCrowd;
    return matchesArea && matchesCrowd;
  });

  // If a location is searched, sort pandals by proximity to that location
  if (searchedLocationPin) {
    filteredPandals = [...filteredPandals].sort((a, b) => {
      const distA = calculateDistanceKm(searchedLocationPin.lat, searchedLocationPin.lng, a.latitude, a.longitude);
      const distB = calculateDistanceKm(searchedLocationPin.lat, searchedLocationPin.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
            📍 LIVE MUMBAI GANPATI MAP
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Interactive Pandal & Location Explorer
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Search any address or select any pandal to instantly pan the map to its exact marker location.
          </p>
        </div>
      </div>

      {/* Main Location Search + Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/90 shadow-md space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Search Any Location, Street Address, Landmark or Pandal Name</span>
          </label>

          <LocationSearchInput
            pandals={pandals}
            initialValue={initialSearchQuery}
            placeholder="Type 'Bandra West', 'Juhu Beach', 'Thane', 'Siddhivinayak', 'Lalbaugcha Raja'..."
            onSelectLocation={handleLocationSelect}
            onClear={handleClearLocationPin}
          />
        </div>

        {/* Quick Area & Crowd Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Area Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-xs font-semibold text-stone-700">Area:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-amber-50/70 border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Crowd Filter */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-xs font-semibold text-stone-700">Crowd:</span>
              <select
                value={selectedCrowd}
                onChange={(e) => setSelectedCrowd(e.target.value)}
                className="bg-amber-50/70 border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
              >
                {crowdLevels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-medium text-stone-500">
            Showing <strong className="text-stone-900 font-bold">{filteredPandals.length}</strong> pandals
          </div>
        </div>

        {/* Searched Location Active Banner */}
        {searchedLocationPin && (
          <div className="bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <div>
                <span>Map centered on searched location: </span>
                <strong className="text-sky-950 font-bold">{searchedLocationPin.displayName}</strong>
              </div>
            </div>
            <button
              onClick={handleClearLocationPin}
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Map</span>
            </button>
          </div>
        )}
      </div>

      {/* Nearby pandals around searched station/location */}
      {searchedLocationPin && (
        <div className="bg-white rounded-3xl p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-stone-900">🛕 Nearby pandals</h2>
              <p className="text-[11px] text-stone-500">
                Closest 5 pandals to {searchedLocationPin.displayName}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {filteredPandals.slice(0, 5).map((p) => (
              <button
                key={p.id}
                onClick={() => panToPandalMarker(p, true)}
                className="text-left rounded-2xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100 p-3 transition-colors"
              >
                <div className="text-xs font-bold text-stone-900 truncate">{p.name}</div>
                <div className="text-[10px] text-stone-500 mt-1">
                  {calculateDistanceKm(
                    searchedLocationPin.lat,
                    searchedLocationPin.lng,
                    p.latitude,
                    p.longitude
                  ).toFixed(1)} km away
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Map + Sidebar Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container + Navigation Panel */}
        <div ref={mapSectionRef} className="lg:col-span-2 space-y-4">
          <div className="relative min-h-[450px] sm:min-h-[550px]">
            <LeafletMap
              pandals={filteredPandals}
              selectedPandalId={selectedPandal?.id}
              searchedLocationPin={searchedLocationPin}
              userLocation={userLocation}
              route={activeRoute}
              onSelectPandal={(pandal) => panToPandalMarker(pandal, false)}
              onLocateMe={handleGetBrowserLocation}
              isLocating={isLocating}
              className="h-[450px] sm:h-[600px] w-full rounded-3xl border border-amber-200 shadow-md overflow-hidden z-10"
            />
          </div>

          {/* Turn-by-Turn Directions Navigation Panel */}
          {showDirections && selectedPandal && (
            <div className="animate-fadeIn">
              <DirectionsPanel
                initialStartLocation={{
                  lat: userLocation?.lat || searchedLocationPin?.lat || 18.9543,
                  lng: userLocation?.lng || searchedLocationPin?.lng || 72.8143,
                  name: userLocation?.displayName || searchedLocationPin?.displayName || 'My Present Location / South Mumbai',
                }}
                initialDestinationPandal={selectedPandal}
                pandals={pandals}
                onRouteGenerated={(routeData) => setActiveRoute(routeData)}
                onLocationsChanged={(start, end) => {
                  setSearchedLocationPin({
                    lat: start.lat,
                    lng: start.lng,
                    displayName: start.name,
                  });
                }}
                onClose={() => {
                  setShowDirections(false);
                  setActiveRoute(null);
                }}
              />
            </div>
          )}

          {/* Searched Location Photos Gallery */}
          <LocationPhotosGallery
            locationName={
              searchedLocationPin?.displayName ||
              selectedPandal?.area ||
              selectedPandal?.name ||
              'Lalbaug, Mumbai'
            }
            pandalImageFallback={selectedPandal?.images}
          />
        </div>

        {/* Interactive Sidebar Panel */}
        <div className="lg:col-span-1 space-y-3">
          {/* Sidebar Mode Tabs */}
          <div className="bg-amber-100/80 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setSidebarTab('details')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                sidebarTab === 'details'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🎯 Active Focus Pandal
            </button>
            <button
              onClick={() => setSidebarTab('list')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                sidebarTab === 'list'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📋 All Pandals ({filteredPandals.length})
            </button>
          </div>

          {sidebarTab === 'details' ? (
            selectedPandal ? (
              <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-md space-y-4 sticky top-24">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest block">
                      {selectedPandal.area}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 leading-tight">{selectedPandal.name}</h3>
                  </div>
                  <CrowdBadge level={selectedPandal.crowdLevel} />
                </div>

                {searchedLocationPin && (
                  <div className="bg-amber-50 text-amber-900 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-amber-200/60 flex items-center justify-between">
                    <span>Distance from searched place:</span>
                    <strong className="text-orange-700 font-bold">
                      {calculateDistanceKm(
                        searchedLocationPin.lat,
                        searchedLocationPin.lng,
                        selectedPandal.latitude,
                        selectedPandal.longitude
                      ).toFixed(1)}{' '}
                      km
                    </strong>
                  </div>
                )}

                <div className="relative h-44 rounded-2xl overflow-hidden bg-amber-100">
                  <img
                    src={selectedPandal.images?.[0] || 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'}
                    alt={selectedPandal.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Pan to Marker Trigger Badge */}
                  <button
                    onClick={() => panToPandalMarker(selectedPandal, true)}
                    className="absolute bottom-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-amber-300 backdrop-blur-md text-[10px] font-bold px-2.5 py-1.5 rounded-xl border border-amber-400/30 flex items-center gap-1 shadow-lg transition-transform active:scale-95"
                    title="Pan map to marker"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Pan Map to Marker</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3">{selectedPandal.description}</p>

                <div className="space-y-1.5 text-xs text-stone-600 bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
                  <div>
                    <strong className="text-stone-900">📍 Address:</strong> {selectedPandal.address}
                  </div>
                  <div>
                    <strong className="text-stone-900">⏰ Darshan Hours:</strong> {selectedPandal.darshanStart} -{' '}
                    {selectedPandal.darshanEnd}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setShowDirections(!showDirections)}
                    className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
                  >
                    <Navigation className="w-4 h-4 text-amber-200" />
                    <span>{showDirections ? 'Hide Route Navigation' : 'Get Turn-by-Turn Directions 🗺️'}</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectPandal(selectedPandal)}
                      className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors text-center"
                    >
                      Full Details Page
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.latitude},${selectedPandal.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-stone-900 hover:bg-black text-amber-300 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
                      title="Open in Google Maps App"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-amber-200 text-stone-500">
                <p className="text-sm font-semibold">Select a marker on the map to view pandal details.</p>
              </div>
            )
          ) : (
            /* Sidebar All Pandals List with Direct Pan Buttons */
            <div className="bg-white rounded-3xl p-4 border border-amber-200/90 shadow-md space-y-2 max-h-[550px] overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block px-1">
                Click any pandal below to pan map automatically 📍
              </span>

              {filteredPandals.map((pandal) => {
                const isSelected = pandal.id === selectedPandal?.id;
                return (
                  <div
                    key={pandal.id}
                    onClick={() => panToPandalMarker(pandal, true)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-100/80 border-orange-400 shadow-sm'
                        : 'bg-stone-50/60 border-stone-200/80 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 truncate">{pandal.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">📍 {pandal.area} • {pandal.address}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        panToPandalMarker(pandal, true);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 shrink-0 transition-transform active:scale-95 ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-amber-200/70 text-amber-900 hover:bg-orange-500 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{isSelected ? 'Focused 🎯' : 'Pan Map'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Pandals Directory Cards Bar (Pan Map on Click) */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              <span>Pan Map to Pandals ({filteredPandals.length})</span>
            </h3>
            <p className="text-xs text-stone-500">Tap any card to fly map directly to its coordinates</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {filteredPandals.map((pandal) => (
            <button
              key={pandal.id}
              onClick={() => panToPandalMarker(pandal, true)}
              className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-28 group ${
                selectedPandal?.id === pandal.id
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-400 shadow-md ring-2 ring-orange-500/30'
                  : 'bg-stone-50/80 border-stone-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-orange-600 block uppercase tracking-wider truncate">
                  {pandal.area}
                </span>
                <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-orange-700">
                  {pandal.name}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60">
                <span className="font-semibold text-stone-700">{pandal.crowdLevel}</span>
                <span className="text-orange-600 font-bold flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> Pan 🎯
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
