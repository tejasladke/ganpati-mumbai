import { Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) onSuccess();
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    const ok = await login(demoEmail, demoPass);
    setLoading(false);
    if (ok) onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            🪔
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-['Rozha_One',serif]">
            Log In to Explorer
          </h1>
          <p className="text-stone-600 text-xs">Enter your account to track challenges and save pandals</p>
        </div>

        {/* Demo Fast Buttons */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-2">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Logins
          </span>
<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-2">
=======
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@mumbai.org', 'admin123')}
              className="py-2 px-2 rounded-xl bg-stone-900 text-amber-300 text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              Log in as Admin
            </button>
>>>>>>> 0f699526977362ba5f7d5f20df712ebe5992d6b5
            <button
              type="button"
              onClick={() => handleDemoLogin('devotee@mumbai.org', 'user123')}
              className="py-2 px-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
            >
              Log in as Devotee
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devotee@mumbai.org"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-2xl shadow-md transition-all text-sm"
          >
            {loading ? 'Logging in...' : 'Log In 🌺'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-600 pt-2">
          Don't have an account yet?{' '}
          <button onClick={onNavigateRegister} className="text-orange-600 font-bold hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};
