import React, { useEffect, useState } from 'react';
import { Navbar, ViewTab } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { api } from './services/api';
import { Challenge, Pandal, PlannerItem, Submission, User } from './types';
import { ShieldAlert, KeyRound } from 'lucide-react';

// Pages
import { HomePage } from './pages/HomePage';
import { PandalMapPage } from './pages/PandalMapPage';
import { PandalDetailsPage } from './pages/PandalDetailsPage';
import { NearbyPandalsPage } from './pages/NearbyPandalsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeSubmissionPage } from './pages/ChallengeSubmissionPage';
import { CommunityUploadPage } from './pages/CommunityUploadPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PlannerPage } from './pages/PlannerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminPandalPage } from './pages/AdminPandalPage';
import { AdminChallengePage } from './pages/AdminChallengePage';
import { AdminSubmissionPage } from './pages/AdminSubmissionPage';
import { PandalPartnersPage } from './pages/PandalPartnersPage';

function AppContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([]);
  const [plannerPandalIds, setPlannerPandalIds] = useState<string[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, cData, lData] = await Promise.all([
        api.getPandals(),
        api.getChallenges(),
        api.getLeaderboard(),
      ]);
      setPandals(pData);
      setChallenges(cData);
      setLeaderboard(lData);

      const token = localStorage.getItem('mumbai_ganpati_token');
      if (token) {
        const [favList, pItems, subData] = await Promise.all([
          api.getFavorites().catch(() => []),
          api.getPlanner().catch(() => []),
          api.getMySubmissions().catch(() => []),
        ]);
        setFavorites(favList.map((p) => p.id));
        setPlannerItems(pItems);
        setPlannerPandalIds(pItems.map((i) => i.pandalId));
        setMySubmissions(subData);
      } else {
        setFavorites([]);
        setPlannerItems([]);
        setPlannerPandalIds([]);
        setMySubmissions([]);
      }
    } catch (err: any) {
      console.error('Data load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  // Handlers
  const handleToggleFavorite = async (pandalId: string) => {
    if (!user) {
      showToast('Please log in to save your favorite pandals', 'info');
      setActiveTab('login');
      return;
    }
    try {
      const updated = await api.toggleFavorite(pandalId);
      setFavorites(updated);
      const isFav = updated.includes(pandalId);
      showToast(isFav ? 'Added to your favorites! 💖' : 'Removed from favorites', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update favorites', 'error');
    }
  };

  const handleTogglePlanner = async (pandalId: string) => {
    if (!user) {
      showToast('Please log in to plan your tour itinerary', 'info');
      setActiveTab('login');
      return;
    }
    try {
      const isCurrentlyIn = plannerPandalIds.includes(pandalId);
      let updated: string[];
      if (isCurrentlyIn) {
        updated = await api.removeFromPlanner(pandalId);
        showToast('Removed from itinerary planner 🗓️', 'info');
      } else {
        updated = await api.addToPlanner(pandalId);
        showToast('Added to tour itinerary planner! 📍', 'success');
      }
      setPlannerPandalIds(updated);
      const freshPlanner = await api.getPlanner();
      setPlannerItems(freshPlanner);
    } catch (err: any) {
      showToast(err.message || 'Failed to update planner', 'error');
    }
  };

  const handleNavigate = (tab: ViewTab, params?: any) => {
    if (tab.startsWith('admin') && user?.role !== 'admin') {
      setIsAdminModalOpen(true);
      return;
    }
    if (params?.pandal) {
      setSelectedPandal(params.pandal);
    }
    if (params?.challenge) {
      setSelectedChallenge(params.challenge);
    }
    if (params?.initialSearchQuery) {
      setMapSearchQuery(params.initialSearchQuery);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPandal = (pandal: Pandal) => {
    setSelectedPandal(pandal);
    setActiveTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('submit-challenge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoritePandals = pandals.filter((p) => favorites.includes(p.id));

  // Render Admin Guard Screen if activeTab is admin and user is not admin
  const renderAdminGuardScreen = () => (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-amber-600 border border-amber-300">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-stone-900 font-['Rozha_One',serif]">
          Admin Password Required
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          You must enter the administrator security password to access festival control features.
        </p>
      </div>
      <button
        onClick={() => setIsAdminModalOpen(true)}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all inline-flex items-center gap-2"
      >
        <KeyRound className="w-4 h-4" />
        <span>Enter Admin Password</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-stone-800 font-['Poppins',sans-serif] flex flex-col justify-between selection:bg-orange-200 selection:text-orange-900">
      <div>
        <Navbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        <main className="transition-all">
          {activeTab === 'home' && (
            <HomePage
              pandals={pandals}
              challenges={challenges}
              leaderboard={leaderboard}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectPandal={handleSelectPandal}
              onStartChallenge={handleStartChallenge}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'map' && (
            <PandalMapPage
              pandals={pandals}
              favorites={favorites}
              initialSearchQuery={mapSearchQuery}
              onToggleFavorite={handleToggleFavorite}
              onSelectPandal={handleSelectPandal}
            />
          )}

          {activeTab === 'details' && selectedPandal && (
            <PandalDetailsPage
              pandal={selectedPandal}
              challenges={challenges}
              isFavorite={favorites.includes(selectedPandal.id)}
              onToggleFavorite={handleToggleFavorite}
              onAddToPlanner={handleTogglePlanner}
              onStartChallenge={handleStartChallenge}
              onBack={() => handleNavigate('home')}
            />
          )}

          {activeTab === 'nearby' && (
            <NearbyPandalsPage
              pandals={pandals}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectPandal={handleSelectPandal}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesPage
              challenges={challenges}
              mySubmissions={mySubmissions}
              onStartChallenge={handleStartChallenge}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'upload' && (
            <CommunityUploadPage
              pandals={pandals}
              onNavigateLogin={() => handleNavigate('login')}
              onSuccess={() => {
                loadData();
                handleNavigate('profile');
              }}
            />
          )}

          {activeTab === 'submit-challenge' && selectedChallenge && (
            <ChallengeSubmissionPage
              challenge={selectedChallenge}
              mySubmissions={mySubmissions}
              onBack={() => handleNavigate('challenges')}
              onSubmitSuccess={() => {
                loadData();
                handleNavigate('challenges');
              }}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardPage
              leaderboard={leaderboard}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfilePage
              mySubmissions={mySubmissions}
              favoritePandals={favoritePandals}
              onSelectPandal={handleSelectPandal}
              onNavigateLogin={() => handleNavigate('login')}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesPage
              favoritePandals={favoritePandals}
              onRemoveFavorite={handleToggleFavorite}
              onSelectPandal={handleSelectPandal}
              onExploreMore={() => handleNavigate('home')}
            />
          )}

          {activeTab === 'partners' && (
            <PandalPartnersPage pandals={pandals} />
          )}

          {activeTab === 'planner' && (
            <PlannerPage
              pandals={pandals}
              plannerItems={plannerItems}
              onRefreshPlanner={loadData}
              onSelectPandal={handleSelectPandal}
            />
          )}

          {activeTab === 'login' && (
            <LoginPage
              onSuccess={() => handleNavigate('home')}
              onNavigateRegister={() => handleNavigate('register')}
            />
          )}

          {activeTab === 'register' && (
            <RegisterPage
              onSuccess={() => handleNavigate('home')}
              onNavigateLogin={() => handleNavigate('login')}
            />
          )}

          {/* Admin Tabs Guarded */}
          {activeTab === 'admin-dashboard' &&
            (user?.role === 'admin' ? (
              <AdminDashboardPage
                pandals={pandals}
                challenges={challenges}
                onNavigate={handleNavigate}
              />
            ) : (
              renderAdminGuardScreen()
            ))}

          {activeTab === 'admin-pandals' &&
            (user?.role === 'admin' ? (
              <AdminPandalPage
                pandals={pandals}
                onRefresh={loadData}
                onBack={() => handleNavigate('admin-dashboard')}
              />
            ) : (
              renderAdminGuardScreen()
            ))}

          {activeTab === 'admin-challenges' &&
            (user?.role === 'admin' ? (
              <AdminChallengePage
                challenges={challenges}
                onRefresh={loadData}
                onBack={() => handleNavigate('admin-dashboard')}
              />
            ) : (
              renderAdminGuardScreen()
            ))}

          {activeTab === 'admin-submissions' &&
            (user?.role === 'admin' ? (
              <AdminSubmissionPage
                onRefresh={loadData}
                onBack={() => handleNavigate('admin-dashboard')}
              />
            ) : (
              renderAdminGuardScreen()
            ))}
        </main>
      </div>

      <AdminPasswordModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          loadData();
          setActiveTab('admin-dashboard');
        }}
      />

      <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
