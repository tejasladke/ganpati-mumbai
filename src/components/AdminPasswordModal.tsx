import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, login, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!user) {
        // If not logged in, attempt admin login with admin@mumbai.org and password
        const success = await login('admin@mumbai.org', password);
        if (success) {
          showToast('Admin session unlocked! Welcome Administrator. 🛡️', 'success');
          onSuccess();
          onClose();
        } else {
          setErrorMsg('Incorrect admin password or email. (Default Admin Password: admin123)');
        }
      } else {
        // Verify admin password
        const res = await api.verifyAdminPassword(password);
        if (res.success) {
          await refreshProfile();
          showToast('Admin access granted! 🛡️', 'success');
          onSuccess();
          onClose();
        } else {
          setErrorMsg(res.message || 'Incorrect admin password. Try: admin123');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify admin password. Try: admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-300 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">
            Administrator Access
          </h3>
          <p className="text-stone-600 text-xs">
            Enter the Admin Password to unlock festival management tools, user permissions, and quest verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Admin Security Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (e.g. admin123)"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider"
              />
            </div>
            <p className="text-[11px] text-amber-800 font-medium mt-1">
              🔑 System Admin Password: <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono">admin123</code>
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
