import {
  Award,
  Calendar,
  Compass,
  Heart,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Upload,
  Trophy,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FestiveGarland } from './FestiveHeader';

export type ViewTab =
  | 'home'
  | 'map'
  | 'details'
  | 'nearby'
  | 'challenges'
  | 'upload'
  | 'submit-challenge'
  | 'leaderboard'
  | 'profile'
  | 'favorites'
  | 'planner'
  | 'partners'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'admin-pandals'
  | 'admin-challenges'
  | 'admin-submissions';

interface NavbarProps {
  activeTab: ViewTab;
  onNavigate: (tab: ViewTab) => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, onOpenAdminModal }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ViewTab, label: 'Home', icon: Compass },
    { id: 'map' as ViewTab, label: 'Pandal Map', icon: MapPin },
    { id: 'nearby' as ViewTab, label: 'Nearby', icon: Compass },
    { id: 'challenges' as ViewTab, label: 'Challenges', icon: Award },
    { id: 'upload' as ViewTab, label: 'Upload Photo', icon: Upload },
    { id: 'leaderboard' as ViewTab, label: 'Leaderboard', icon: Trophy },
    { id: 'planner' as ViewTab, label: 'Planner', icon: Calendar },
    { id: 'partners' as ViewTab, label: 'Find Partner', icon: Users },
    { id: 'favorites' as ViewTab, label: 'Favorites', icon: Heart },
  ];

  const adminItems = [
    { id: 'admin-dashboard' as ViewTab, label: 'Admin Overview' },
    { id: 'admin-pandals' as ViewTab, label: 'Manage Pandals' },
    { id: 'admin-challenges' as ViewTab, label: 'Manage Challenges' },
    { id: 'admin-submissions' as ViewTab, label: 'Verify Submissions' },
  ];

  const handleAdminClick = () => {
    if (user?.role === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onOpenAdminModal?.();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm">
      <FestiveGarland />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
                🪔
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text text-transparent tracking-tight block font-['Rozha_One',serif]">
                GANPATI MUMBAI
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-stone-500 tracking-wider uppercase block -mt-1">
                Festival & Pandal Explorer
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-stone-700 hover:bg-amber-100/60 hover:text-orange-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleAdminClick}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                activeTab.startsWith('admin')
                  ? 'bg-stone-900 text-amber-300 border-stone-900'
                  : 'border-amber-300 text-amber-900 hover:bg-amber-100 bg-amber-50/80'
              }`}
              title="Requires Admin Password (admin123)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{user?.role === 'admin' ? 'Admin Panel' : 'Admin Login'}</span>
            </button>
          </nav>

          {/* Auth Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onNavigate('upload')}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
              title="Upload your Ganpati photo"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 p-1.5 pr-3 rounded-2xl">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-orange-400 object-cover"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-900 block line-clamp-1">{user.name}</span>
                    <span className="text-[10px] font-semibold text-amber-700 block -mt-0.5">
                      🪙 {user.points} pts
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-amber-100/60 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 transition-all active:scale-95"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-amber-100 text-stone-800 hover:bg-amber-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-amber-200 p-4 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-amber-50/50 text-stone-700 border-amber-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                Admin Controls
              </span>
              {user?.role !== 'admin' && (
                <button
                  onClick={() => {
                    onOpenAdminModal?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-amber-800 hover:text-orange-600 underline"
                >
                  Enter Admin Password 🔑
                </button>
              )}
            </div>
            {user?.role === 'admin' ? (
              <div className="grid grid-cols-2 gap-2">
                {adminItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold text-left border ${
                      activeTab === item.id
                        ? 'bg-stone-900 text-amber-300 border-stone-900'
                        : 'bg-stone-50 text-stone-800 border-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminModal?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Unlock Admin Mode (Password Required)</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-amber-200 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border border-orange-400 object-cover"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-900 block">{user.name}</span>
                    <span className="text-[10px] font-semibold text-amber-700">🪙 {user.points} points</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
