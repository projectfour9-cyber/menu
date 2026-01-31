
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'The kitchen is closed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(13,148,136,0.2)] overflow-hidden border-8 border-white animate-fade-in">
        {/* Branding Header */}
        <div className="bg-gradient-to-br from-teal-600 to-violet-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-sprinkles opacity-20 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-xl mb-6 transform -rotate-6">
              🥗
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">Wedding Kitchen</h1>
            <p className="text-white/80 font-medium text-sm">We know it's cheeky, but what people remember the most about a wedding is the <b>FOOD</b>.</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
              <span className="text-xl">🌵</span>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Chef's Email</label>
              <input
                type="email"
                required
                placeholder="chef@yourwedding.com"
                className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secret Recipe (Password)</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl outline-none focus:border-teal-400 focus:bg-white transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-violet-600 hover:from-teal-700 hover:to-violet-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-200 btn-bounce text-lg flex items-center justify-center space-x-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="animate-pulse">Setting the table...</span>
              ) : (
                <>
                  <span>✨</span>
                  <span>{isSignUp ? 'Create Account' : 'Enter Kitchen'}</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-stone-400 text-xs font-bold hover:text-teal-700 transition-colors"
            >
              {isSignUp ? 'Already have an apron? Log in' : "Don't have a kitchen yet? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
