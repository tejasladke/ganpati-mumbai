import { Award, Calendar, ChevronRight, Compass, MapPin, Search, Sparkles, Star, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';
import { PandalCard } from '../components/PandalCard';
import { LocationSearchInput } from '../components/LocationSearchInput';
import { FestiveCountdown } from '../components/FestiveCountdown';
import { ViewTab } from '../components/Navbar';
import { Challenge, Pandal, User } from '../types';

interface HomePageProps {
  pandals: Pandal[];
  challenges: Challenge[];
  leaderboard: User[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectPandal: (pandal: Pandal) => void;
  onStartChallenge: (challenge: Challenge) => void;
  onNavigate: (tab: ViewTab, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  pandals,
  challenges,
  leaderboard,
  favorites,
  onToggleFavorite,
  onSelectPandal,
  onStartChallenge,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');

  const popularAreas = ['Lalbaug', 'Chinchpokli', 'Sion', 'Khetwadi', 'Andheri', 'Girgaon', 'Dadar'];

  const filteredPandals = pandals.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All' || p.area.toLowerCase() === selectedArea.toLowerCase();
    return matchesSearch && matchesArea;
  });

  const featuredPandals = filteredPandals.slice(0, 6);

  return (
    <div className="min-h-screen bg-amber-50/30 pb-20 sm:pb-12 space-y-12">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-pink-600 text-white pt-12 pb-20 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl sm:rounded-b-[40px] shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]"></div>
        <div className="absolute -right-10 -bottom-10 opacity-10 text-[200px] pointer-events-none select-none">
          🐘
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-white/30 text-amber-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Welcome to Mumbai's Official Festival Guide 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-['Rozha_One',serif] drop-shadow-md leading-tight">
            Discover Iconic <br className="hidden sm:inline" />
            Mumbai Ganpati Pandals
          </h1>

          <p className="text-amber-100 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
            Explore live crowd status, interactive maps, darshan timings, complete fun challenges, and create your personalized pandal tour itinerary.
          </p>

          {/* Location Search Bar */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-amber-200/80 text-stone-800">
            <LocationSearchInput
              pandals={pandals}
              placeholder="Search Bandra, Juhu, Thane, Lalbaugcha Raja, address or landmark..."
              onSelectLocation={(res) => {
                if (res.pandal) {
                  onSelectPandal(res.pandal);
                } else {
                  onNavigate('map', { initialSearchQuery: res.displayName });
                }
              }}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('map')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Explore Interactive Map</span>
            </button>
            <button
              onClick={() => onNavigate('nearby')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Find Nearby Pandals</span>
            </button>
            <button
              onClick={() => onNavigate('planner')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Plan Tour Itinerary</span>
            </button>
          </div>
        </div>
      </section>

      {/* Festive Countdown Timer Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <FestiveCountdown />
      </section>

      {/* Popular Areas Quick Chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span>🌺 Popular Pandal Hubs</span>
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedArea('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              selectedArea === 'All'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            All Areas ({pandals.length})
          </button>
          {popularAreas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                selectedArea === area
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              📍 {area}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Pandals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
              Featured Mumbai Pandals
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Top visited Ganpati pandals with real-time crowd updates and darshan info
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-orange-600 hover:text-orange-700 font-bold text-xs sm:text-sm flex items-center gap-1 group"
          >
            <span>View All Map</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featuredPandals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-amber-200 text-stone-500">
            <p className="text-base font-semibold">No pandals matched your search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedArea('All');
              }}
              className="mt-3 text-sm font-bold text-orange-600 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPandals.map((pandal) => (
              <PandalCard
                key={pandal.id}
                pandal={pandal}
                isFavorite={favorites.includes(pandal.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectPandal}
              />
            ))}
          </div>
        )}
      </section>

      {/* Today's Challenges Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
                🥁 FESTIVAL GAME & CHALLENGES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
                Complete Mumbai Ganpati Quests
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Earn points, climb the leaderboard, and unlock exclusive Bappa Devotee badges!
              </p>
            </div>
            <button
              onClick={() => onNavigate('challenges')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm self-start sm:self-auto"
            >
              View All Quests
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.slice(0, 3).map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm flex flex-col justify-between group hover:border-orange-400 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      🪙 +{ch.points} Points
                    </span>
                    <span className="text-xs font-semibold text-stone-500">{ch.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors mb-2">
                    {ch.title}
                  </h3>
                  <p className="text-stone-600 text-xs line-clamp-2 mb-4">{ch.description}</p>
                </div>
                <button
                  onClick={() => onStartChallenge(ch)}
                  className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-orange-600" />
                  <span>Start Quest</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview & Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Devotees Preview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>Devotee Leaderboard</span>
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm">Top Ganpati explorers across Mumbai this festival</p>
            </div>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-orange-600 hover:text-orange-700 text-xs font-bold"
            >
              Full Ranks →
            </button>
          </div>

          <div className="space-y-3">
            {leaderboard.slice(0, 4).map((user, idx) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : idx === 1
                        ? 'bg-slate-300 text-stone-800'
                        : idx === 2
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-amber-300 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{user.name}</h4>
                    <span className="text-[11px] text-stone-500">{user.completedChallenges} Quests Completed</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-orange-600 block">🪙 {user.points}</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {user.badges?.[0] || 'Devotee'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Festival Stats */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl pointer-events-none select-none">
            🌺
          </div>

          <div>
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider block mb-2">
              FESTIVAL INSIGHTS 2026
            </span>
            <h3 className="text-2xl font-bold font-['Rozha_One',serif] text-amber-100 mb-6">
              Mumbai Festival Numbers
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">{pandals.length}+ Pandals</span>
                  <span className="text-xs text-stone-400">Mapped with Live Crowd Levels</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">{challenges.length} Active Quests</span>
                  <span className="text-xs text-stone-400">For Devotees & Photographers</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">100,000+ Visits</span>
                  <span className="text-xs text-stone-400">Planned through Festival Itinerary</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-700/80 mt-6">
            <button
              onClick={() => onNavigate('map')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All Pandals Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 px-4 sm:px-6 lg:px-8 mt-12 rounded-t-3xl border-t border-amber-500/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-amber-400 font-['Rozha_One',serif]">
              🪔 Ganpati Mumbai Explorer
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dedicated to helping devotees navigate Mumbai's grand Ganeshotsav festival with real-time pandal data, interactive maps, crowd alerts, and festive tours.
            </p>
            <p className="text-xs text-amber-300 font-semibold">Ganpati Bappa Morya! 🌺</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-amber-400 transition-colors">
                  Pandal Map & Live Crowd
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nearby')} className="hover:text-amber-400 transition-colors">
                  Nearby Pandals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-amber-400 transition-colors">
                  Festive Challenges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('planner')} className="hover:text-amber-400 transition-colors">
                  Pandal Tour Planner
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Famous Hubs</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>📍 Lalbaugcha Raja (Lalbaug)</li>
              <li>📍 Chinchpokli Cha Chintamani</li>
              <li>📍 GSB Seva Mandal (Kings Circle)</li>
              <li>📍 Khetwadi Cha Raja (Grant Road)</li>
              <li>📍 Andheri Cha Raja (Azad Nagar)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Emergency Helplines</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>🚨 Mumbai Police: <span className="text-amber-400 font-bold">100</span></li>
              <li>🚑 Ambulance / Medical: <span className="text-amber-400 font-bold">108</span></li>
              <li>🚦 Traffic Control Room: <span className="text-amber-400 font-bold">8454999999</span></li>
              <li>ℹ️ Festival Helpdesk: <span className="text-amber-400 font-bold">022-22621855</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          © 2026 Ganpati Mumbai Explorer • Built with Devotion for Mumbai Ganeshotsav
        </div>
      </footer>
    </div>
  );
};
