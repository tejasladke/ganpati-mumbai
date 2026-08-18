import React, { useState } from 'react';
import {
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Footprints,
  ListOrdered,
  Loader2,
  MapPin,
  Navigation,
  Navigation2,
  Sparkles,
  Train,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AiItinerary, Pandal } from '../types';
import { AiItineraryMap } from './AiItineraryMap';
import { MUMBAI_TRANSIT_STATIONS } from '../data/mumbaiStationsData';

interface AiItineraryPlannerProps {
  pandals: Pandal[];
  onRefreshPlanner: () => void;
  onSelectPandal: (pandal: Pandal) => void;
}

const MUMBAI_START_LOCATIONS = MUMBAI_TRANSIT_STATIONS.map((s) => ({
  name: `${s.name} (${s.line})`,
  latitude: s.latitude,
  longitude: s.longitude,
}));

export const AiItineraryPlanner: React.FC<AiItineraryPlannerProps> = ({
  pandals,
  onRefreshPlanner,
  onSelectPandal,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedStartIdx, setSelectedStartIdx] = useState<number>(0);
  const [customStartName, setCustomStartName] = useState<string>('');
  const [useGps, setUseGps] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [tourDate, setTourDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('08:00 AM');
  const [travelMode, setTravelMode] = useState<'walking' | 'transit' | 'driving'>('walking');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'fast'>('balanced');
  const [selectedPandalIds, setSelectedPandalIds] = useState<string[]>(
    pandals.map((p) => p.id)
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [applying, setApplying] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<AiItinerary | null>(null);
  const [itinerarySource, setItinerarySource] = useState<string>('');

  // Handle Geolocation
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setUseGps(true);
        setLoading(false);
        showToast('Acquired your GPS location for route planning! 📍', 'success');
      },
      (err) => {
        setLoading(false);
        showToast(`Could not get GPS location: ${err.message}`, 'error');
      }
    );
  };

  const getEffectiveStartLocation = () => {
    if (useGps && gpsCoords) {
      return {
        name: customStartName || 'My Current GPS Location',
        latitude: gpsCoords.latitude,
        longitude: gpsCoords.longitude,
      };
    }
    const preset = MUMBAI_START_LOCATIONS[selectedStartIdx] || MUMBAI_START_LOCATIONS[0];
    return {
      name: customStartName || preset.name,
      latitude: preset.latitude,
      longitude: preset.longitude,
    };
  };

  const togglePandalSelection = (id: string) => {
    if (selectedPandalIds.includes(id)) {
      if (selectedPandalIds.length <= 2) {
        showToast('Select at least 2 pandals to generate a route', 'info');
        return;
      }
      setSelectedPandalIds(selectedPandalIds.filter((p) => p !== id));
    } else {
      setSelectedPandalIds([...selectedPandalIds, id]);
    }
  };

  const selectAllPandals = () => {
    setSelectedPandalIds(pandals.map((p) => p.id));
  };

  const handleGenerateAiRoute = async () => {
    try {
      setLoading(true);
      const startLoc = getEffectiveStartLocation();

      const res = await api.planAiItinerary({
        startLocation: startLoc,
        pandalIds: selectedPandalIds,
        startTime,
        tourDate,
        travelMode,
        pace,
      });

      if (res.success && res.itinerary) {
        setItinerary(res.itinerary);
        setItinerarySource(res.source);
        showToast('AI Line-By-Line Route Plan generated successfully! 🤖✨', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate AI itinerary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToSchedule = async () => {
    if (!user) {
      showToast('Please log in to save this AI route to your personal schedule', 'info');
      return;
    }
    if (!itinerary || itinerary.stops.length === 0) return;

    try {
      setApplying(true);
      for (let i = 0; i < itinerary.stops.length; i++) {
        const stop = itinerary.stops[i];
        await api.addPlannerItem(stop.pandalId, tourDate, stop.estimatedArrival);
      }
      showToast('AI Tour Route saved to your personal schedule! 🗓️', 'success');
      onRefreshPlanner();
    } catch (err: any) {
      showToast(err.message || 'Failed to apply route to schedule', 'error');
    } finally {
      setApplying(false);
    }
  };

  const activeStartLoc = getEffectiveStartLocation();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AI MAP ROUTE PLANNER</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
            <span>AI Line-By-Line Tour Optimizer</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Generates an optimal line-by-line route starting from your location, analyzing crowd queues, travel distances, and best visit windows.
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/40 p-5 rounded-2xl border border-amber-200/70">
        {/* Left Column: Origin & GPS */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase flex items-center justify-between mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" /> Your Tour Starting Hub / Location:
              </span>
              <button
                type="button"
                onClick={handleGetLiveLocation}
                className="text-[11px] text-orange-600 font-bold hover:underline flex items-center gap-1"
              >
                <Compass className="w-3 h-3" /> Use GPS
              </button>
            </label>

            {!useGps ? (
              <select
                value={selectedStartIdx}
                onChange={(e) => {
                  setSelectedStartIdx(Number(e.target.value));
                  setUseGps(false);
                }}
                className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 font-medium outline-none focus:ring-2 focus:ring-orange-500"
              >
                {MUMBAI_START_LOCATIONS.map((loc, idx) => (
                  <option key={loc.name} value={idx}>
                    📍 {loc.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs font-bold text-emerald-900">
                <span>📍 Using GPS Coordinates ({gpsCoords?.latitude.toFixed(4)}, {gpsCoords?.longitude.toFixed(4)})</span>
                <button
                  onClick={() => setUseGps(false)}
                  className="text-emerald-700 hover:text-emerald-900 underline text-[10px]"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase mb-1 block">
              Custom Location Name (Optional)
            </label>
            <input
              type="text"
              value={customStartName}
              onChange={(e) => setCustomStartName(e.target.value)}
              placeholder="e.g. My Hotel at Marine Drive"
              className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase mb-1 block">
                Tour Date
              </label>
              <input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs text-stone-900 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase mb-1 block">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 08:00 AM"
                className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs text-stone-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Travel Mode & Pace */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase block mb-1">
              Preferred Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTravelMode('walking')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  travelMode === 'walking'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Walking</span>
              </button>

              <button
                type="button"
                onClick={() => setTravelMode('transit')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  travelMode === 'transit'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>Local Transit</span>
              </button>

              <button
                type="button"
                onClick={() => setTravelMode('driving')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  travelMode === 'driving'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <Navigation2 className="w-4 h-4" />
                <span>Cab / Taxi</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 uppercase block mb-1">
              Tour Pace
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPace('relaxed')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  pace === 'relaxed'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                ☕ Relaxed
              </button>
              <button
                type="button"
                onClick={() => setPace('balanced')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  pace === 'balanced'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                ⚖️ Balanced
              </button>
              <button
                type="button"
                onClick={() => setPace('fast')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  pace === 'fast'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                ⚡ Fast
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-800 uppercase">
                Selected Pandals ({selectedPandalIds.length})
              </label>
              <button
                type="button"
                onClick={selectAllPandals}
                className="text-[11px] text-orange-600 font-bold hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="max-h-24 overflow-y-auto bg-white border border-amber-200 rounded-xl p-2 space-y-1 text-xs">
              {pandals.map((p) => {
                const isSelected = selectedPandalIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePandalSelection(p.id)}
                    className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between ${
                      isSelected ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateAiRoute}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Map & Queue Vectors...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
              <span>Generate AI Line-By-Line Route</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Itinerary Output */}
      {itinerary && (
        <div className="pt-6 border-t border-amber-200 space-y-6 animate-fadeIn">
          {/* Title & Stats */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-300 font-['Rozha_One',serif]">
                {itinerary.itineraryTitle}
              </h3>
              <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 self-start sm:self-auto">
                Source: {itinerarySource === 'gemini-ai' ? 'Gemini 3.6 AI Engine' : 'Spatial Route Solver'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {itinerary.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Start Hub</span>
                <span className="text-xs font-bold text-amber-200 truncate block">{activeStartLoc.name}</span>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Distance</span>
                <span className="text-xs font-bold text-amber-200">{itinerary.totalDistanceKm} km</span>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Est. Duration</span>
                <span className="text-xs font-bold text-amber-200">{itinerary.estimatedTotalHours}</span>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Pandal Stops</span>
                <span className="text-xs font-bold text-amber-200">{itinerary.stops.length} Pandals</span>
              </div>
            </div>

            <button
              onClick={handleApplyToSchedule}
              disabled={applying}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>{applying ? 'Applying Schedule...' : 'Save AI Route To My Personal Schedule'}</span>
            </button>
          </div>

          {/* Map Vector Visualization */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span>Interactive Route Vector Map</span>
            </h4>
            <AiItineraryMap
              itinerary={itinerary}
              startLocation={activeStartLoc}
              onSelectStopPandal={(id) => {
                const match = pandals.find((p) => p.id === id);
                if (match) onSelectPandal(match);
              }}
            />
          </div>

          {/* Line-By-Line Step Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-orange-500" />
              <span>Line-By-Line Stop Schedule</span>
            </h4>

            <div className="space-y-3">
              {itinerary.stops.map((stop) => {
                return (
                  <div
                    key={stop.stepNumber}
                    className="p-4 sm:p-5 rounded-2xl border border-amber-200/90 bg-amber-50/30 hover:bg-amber-50/70 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/50 pb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          #{stop.stepNumber}
                        </span>
                        <div>
                          <h5 className="text-base font-bold text-stone-900">{stop.pandalName}</h5>
                          <span className="text-xs text-stone-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-500" /> {stop.area}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="bg-amber-200/80 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-600" /> Arrival: {stop.estimatedArrival}
                        </span>
                        <span className="bg-orange-100 text-orange-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          {stop.estimatedDurationMin} mins visit
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                        <span className="text-stone-500 font-semibold block">Transit & Travel:</span>
                        <span className="text-stone-800 font-medium">{stop.transitInstruction} ({stop.travelFromPrev})</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                        <span className="text-stone-500 font-semibold block">Crowd Forecast:</span>
                        <span className="text-amber-800 font-bold">{stop.crowdForecast}</span>
                      </div>
                    </div>

                    <div className="bg-amber-100/70 border border-amber-200/80 p-2.5 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span><strong>AI Tip:</strong> {stop.tip}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Box */}
          {itinerary.aiInsights && itinerary.aiInsights.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
              <h5 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-orange-600" />
                <span>AI Route Optimization Insights</span>
              </h5>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-900/90">
                {itinerary.aiInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
