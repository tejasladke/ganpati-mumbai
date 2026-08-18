import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Info,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  Star,
} from 'lucide-react';
import React, { useState } from 'react';
import { CrowdBadge } from '../components/CrowdBadge';
import { DirectionsPanel } from '../components/DirectionsPanel';
import { LeafletMap } from '../components/LeafletMap';
import { LocationPhotosGallery } from '../components/LocationPhotosGallery';
import { PandalPhotoGallery } from '../components/PandalPhotoGallery';
import { useToast } from '../context/ToastContext';
import { RouteData } from '../services/directions';
import { Challenge, Pandal } from '../types';

interface PandalDetailsPageProps {
  pandal: Pandal;
  challenges: Challenge[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToPlanner: (pandalId: string) => void;
  onStartChallenge: (challenge: Challenge) => void;
  onBack: () => void;
}

export const PandalDetailsPage: React.FC<PandalDetailsPageProps> = ({
  pandal,
  challenges,
  isFavorite,
  onToggleFavorite,
  onAddToPlanner,
  onStartChallenge,
  onBack,
}) => {
  const [selectedImage, setSelectedImage] = useState(pandal.images?.[0] || '');
  const [showDirections, setShowDirections] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteData | null>(null);
  const { showToast } = useToast();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Pandal details link copied to clipboard! 🌺', 'success');
    }
  };

  const pandalChallenges = challenges.filter(
    (c) => c.pandalId === pandal.id || c.pandalName?.toLowerCase() === pandal.name.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-stone-600 hover:text-stone-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
      >
        ← Back to Explorer
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                📍 {pandal.area}
              </span>
              <CrowdBadge level={pandal.crowdLevel} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
              {pandal.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(pandal.id)}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs sm:text-sm font-bold ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-300'
                  : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white text-stone-700 border border-amber-200 hover:bg-amber-50 transition-colors"
              title="Share Pandal"
            >
              <Share2 className="w-5 h-5 text-stone-600" />
            </button>

            <button
              onClick={() => onAddToPlanner(pandal.id)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Tour Plan</span>
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-amber-100 shadow-inner">
            <img
              src={selectedImage || pandal.images?.[0]}
              alt={pandal.name}
              className="w-full h-full object-cover"
            />
          </div>

          {pandal.images && pandal.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pandal.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-orange-500 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Darshan Hours</span>
              <span className="text-xs font-bold text-stone-800">
                {pandal.darshanStart} - {pandal.darshanEnd}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Star className="w-5 h-5 text-amber-500 shrink-0 fill-amber-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Popularity Score</span>
              <span className="text-xs font-bold text-stone-800">{pandal.popularity}% Devotee Choice</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Pandal Area</span>
              <span className="text-xs font-bold text-stone-800">{pandal.area}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{showDirections ? 'Hide Directions' : 'Get Directions 🗺️'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description & History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" />
            <span>About & Description</span>
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{pandal.description}</p>

          <h3 className="text-sm font-bold text-stone-900 pt-2">Famous Features</h3>
          <div className="flex flex-wrap gap-2">
            {pandal.famousFeatures?.map((feat, i) => (
              <span
                key={i}
                className="bg-amber-100/70 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>Heritage & History</span>
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{pandal.history}</p>

          <h3 className="text-sm font-bold text-stone-900 pt-2">Available Facilities</h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-700">
            {pandal.facilities?.map((fac, i) => (
              <div key={i} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200/60">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Map & Turn-by-Turn Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Location Map & Navigation</span>
            </h2>
            <p className="text-stone-600 text-xs mt-0.5">{pandal.address}</p>
          </div>

          <button
            onClick={() => setShowDirections(!showDirections)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
          >
            {showDirections ? 'Hide Route' : 'Show Route 🗺️'}
          </button>
        </div>

        <LeafletMap
          pandals={[pandal]}
          selectedPandalId={pandal.id}
          route={activeRoute}
          onSelectPandal={() => {}}
          className="h-64 sm:h-80 w-full rounded-2xl border border-amber-200"
        />

        {showDirections && (
          <DirectionsPanel
            initialStartLocation={{
              lat: 18.9543, // Default Girgaon/South Mumbai
              lng: 72.8143,
              name: 'Girgaon / South Mumbai (Current Position)',
            }}
            initialDestinationPandal={pandal}
            onRouteGenerated={(r) => setActiveRoute(r)}
            onClose={() => {
              setShowDirections(false);
              setActiveRoute(null);
            }}
          />
        )}
      </div>

      {/* Dedicated Pandal Photo Gallery (Idol, Decoration, Atmosphere across 2025, 2024, etc) */}
      <PandalPhotoGallery
        pandalId={pandal.id}
        pandalName={pandal.name}
      />

      {/* Location Photos Gallery */}
      <LocationPhotosGallery
        locationName={`${pandal.name}, ${pandal.area}`}
        pandalImageFallback={pandal.images}
      />

      {/* Linked Quests / Challenges */}
      {pandalChallenges.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/80 space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span>Associated Ganpati Challenges ({pandalChallenges.length})</span>
          </h2>
          <p className="text-xs text-stone-600">Complete these challenges during your visit to earn bonus points!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pandalChallenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{ch.title}</h4>
                  <span className="text-xs text-orange-600 font-semibold">+{ch.points} Points</span>
                </div>
                <button
                  onClick={() => onStartChallenge(ch)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Start Quest
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
