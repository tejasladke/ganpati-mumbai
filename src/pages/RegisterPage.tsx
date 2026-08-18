import { Lock, Mail, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin, onSuccess }) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
    const ok = await register(name, email, password, avatar);
    setLoading(false);
    if (ok) onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            🌺
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-['Rozha_One',serif]">
            Create Devotee Account
          </h1>
          <p className="text-stone-600 text-xs">Join Ganpati Mumbai Explorer and start earning points!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Srikant Patil"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="srikant@gmail.com"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-2xl shadow-md transition-all text-sm"
          >
            {loading ? 'Creating Account...' : 'Register Account 🪔'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-600 pt-2">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="text-orange-600 font-bold hover:underline">
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
};
