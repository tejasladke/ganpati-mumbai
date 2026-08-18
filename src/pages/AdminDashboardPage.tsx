import { Award, CheckCircle, Clock, MapPin, ShieldCheck, Trophy, Users, Trash2, UserCheck, ShieldAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ViewTab } from '../components/Navbar';
import { AdminStats, Challenge, Pandal, User } from '../types';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface AdminDashboardPageProps {
  pandals?: Pandal[];
  challenges?: Challenge[];
  onNavigate: (tab: ViewTab) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [s, u] = await Promise.all([api.getAdminStats(), api.getAdminUsers()]);
      setStats(s);
      setUsers(u);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (u: User) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await api.updateUserRole(u.id, newRole);
      showToast(`Updated ${u.name}'s role to ${newRole}! ✨`, 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await api.deleteUser(deleteUserId);
      showToast('Active user deleted from system.', 'info');
      setDeleteUserId(null);
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>ADMINISTRATOR CONTROL PANEL</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Festival Management Dashboard
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Monitor real-time system stats, manage active users, verify photo submissions, and edit pandals
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-1">
          <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Total Pandals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center justify-between">
            <span>{stats?.totalPandals || 0}</span>
            <MapPin className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-1">
          <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Active Quests</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center justify-between">
            <span>{stats?.totalChallenges || 0}</span>
            <Award className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-amber-500 text-white rounded-3xl p-5 shadow-md space-y-1">
          <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
          <div className="text-2xl sm:text-3xl font-extrabold flex items-center justify-between">
            <span>{stats?.pendingSubmissions || 0}</span>
            <Clock className="w-6 h-6 text-amber-200" />
          </div>
        </div>

        <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md space-y-1">
          <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">Active Users</span>
          <div className="text-2xl sm:text-3xl font-extrabold flex items-center justify-between text-amber-400">
            <span>{stats?.totalUsers || 0}</span>
            <Users className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Admin Action Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div
          onClick={() => onNavigate('admin-submissions')}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
            📸
          </div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Verify User Submissions
          </h3>
          <p className="text-stone-600 text-xs mt-1">
            Review uploaded photo proof, approve to award points & unlock devotee badges, or reject invalid entries.
          </p>
          <span className="text-xs font-bold text-orange-600 mt-4 inline-block">Go to Approvals →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-pandals')}
          className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
            🏛️
          </div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Manage Pandals Data
          </h3>
          <p className="text-stone-600 text-xs mt-1">
            Add new pandals, update darshan timings, modify crowd status levels, coordinates, and facility lists.
          </p>
          <span className="text-xs font-bold text-orange-600 mt-4 inline-block">Manage Pandals →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-challenges')}
          className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
            🏆
          </div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            Manage Festival Quests
          </h3>
          <p className="text-stone-600 text-xs mt-1">
            Create new photo quests, configure difficulty ratings, set deadline dates, and point values.
          </p>
          <span className="text-xs font-bold text-orange-600 mt-4 inline-block">Manage Quests →</span>
        </div>
      </div>

      {/* Active Registered Users Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Rozha_One',serif]">
              Active Registered Users ({users.length})
            </h2>
            <p className="text-stone-600 text-xs">
              Live devotees who registered and logged in to use features. Dummy default users have been deleted.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-800">
              <thead className="bg-amber-100/60 text-stone-900 uppercase font-bold tracking-wider text-[11px] border-b border-amber-200">
                <tr>
                  <th className="p-4">Devotee User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Points</th>
                  <th className="p-4">Completed Quests</th>
                  <th className="p-4">Badges</th>
                  <th className="p-4 text-right">User Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      No active users found. New registered users will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-amber-300"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{u.name}</span>
                            <span className="text-xs text-stone-500 block">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.role === 'admin'
                              ? 'bg-stone-900 text-amber-300 border border-stone-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {u.role === 'admin' ? '🛡️ Administrator' : '🌺 Devotee'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-orange-600">🪙 {u.points}</td>
                      <td className="p-4 font-semibold text-stone-700">{u.completedChallenges} quests</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.badges?.map((b) => (
                            <span
                              key={b}
                              className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors inline-flex items-center gap-1"
                          title="Toggle User/Admin Role"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{u.role === 'admin' ? 'Demote to User' : 'Make Admin'}</span>
                        </button>
                        <button
                          onClick={() => setDeleteUserId(u.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 bg-rose-50 rounded-xl transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteUserId}
        title="Delete User Account"
        message="Are you sure you want to delete this active user? Their account and submissions will be removed."
        isDangerous={true}
        confirmLabel="Delete User"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserId(null)}
      />
    </div>
  );
};

