/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabase, syncUser } from '../api';
import { ArrowLeft, Loader2, Mail, Lock, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthPagesProps {
  type: 'login' | 'signup';
  onNavigate: (page: string) => void;
  onAuthComplete: (user: { id: string; email: string; full_name?: string }) => void;
}

export default function AuthPages({ type, onNavigate, onAuthComplete }: AuthPagesProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorText('Please supply both email and password.');
      return;
    }
    setLoading(true);
    setErrorText(null);

    try {
      if (type === 'signup') {
        // Real Supabase sign up - treat as instant, no email confirmation needed
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        
        // Immediately get session and proceed (don't wait for email confirmation)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const apiUrl = import.meta.env.VITE_API_URL;
          await fetch(`${apiUrl}/api/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          const stateRes = await fetch(`${apiUrl}/api/auth/workflow-state`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          const stateData = await stateRes.json();
          if (stateData.state?.has_paid) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/pricing';
          }
        } else {
          // If no session yet, redirect to pricing anyway (new user = unpaid)
          window.location.href = '/pricing';
        }
      } else {
        // Real Supabase sign in
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        // Sync session and redirect using window.location.href
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const apiUrl = import.meta.env.VITE_API_URL;
          await fetch(`${apiUrl}/api/auth/sync-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          const stateRes = await fetch(`${apiUrl}/api/auth/workflow-state`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          const stateData = await stateRes.json();
          if (stateData.state?.has_paid) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/pricing';
          }
        } else {
          window.location.href = '/pricing';
        }
      }
    } catch (err: any) {
      setErrorText(err?.message || 'Authentication handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      // Real Supabase Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      // OAuth will redirect, so we don't call onAuthComplete here
    } catch (err: any) {
      setErrorText(err?.message || 'Google Auth failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-ink text-vanilla-cream font-aeonikpro flex flex-col justify-center items-center px-6 relative selection:bg-goldenrod-orange selection:text-midnight-ink">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-goldenrod-orange/10 blur-[100px] pointer-events-none" />

      {/* Main card box */}
      <div className="bg-[#0b1718] border border-white/[0.08] p-8 max-w-sm w-full rounded-2xl flex flex-col items-stretch relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-goldenrod-orange via-accent-blue to-goldenrod-orange/20" />

        {/* Back Link */}
        <button 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mb-6 cursor-pointer self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Landing Section
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-goldenrod-orange rounded-full animate-pulse" />
          <span className="font-dotconnect text-lg font-medium tracking-tight text-white">
            Reddetect<span className="text-goldenrod-orange">.</span>
          </span>
        </div>

        <h2 className="text-xl font-medium tracking-tight text-white mb-1">
          {type === 'signup' ? 'Claim your validation vault' : 'Resume product tracking'}
        </h2>
        <p className="text-xs text-white/55 mb-6">
          {type === 'signup' 
            ? 'Generate real market intelligence in under 3 minutes free.'
            : 'Access your persistent workspaces, Vault, and reports.'}
        </p>

        {errorText && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-4 text-[11px] text-red-100 font-medium">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/50 uppercase font-semibold tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-goldenrod-orange transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/50 uppercase font-semibold tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-goldenrod-orange transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/50 uppercase font-semibold tracking-wider">Secure Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-goldenrod-orange transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-goldenrod-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-goldenrod-orange/10 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : type === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                Sign Up with Email
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Platform
              </>
            )}
          </button>
        </form>

        <div className="relative py-4 flex items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">or continue with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google Authentication OAuth Button */}
        <button
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium py-3 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-101"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.46 10.55-10.74 0-.72-.08-1.275-.175-1.685H12.24z" />
          </svg>
          {type === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        {/* Navigation Switch Link */}
        <p className="text-center text-[11px] text-white/50 mt-6 pt-2 border-t border-white/5">
          {type === 'signup' ? (
            <>
              Already registered in workspace?{' '}
              <button 
                onClick={() => onNavigate('login')} 
                className="text-goldenrod-orange font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have a research vault yet?{' '}
              <button 
                onClick={() => onNavigate('signup')} 
                className="text-goldenrod-orange font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Sign Up Free
              </button>
            </>
          )}
        </p>
      </div>

      <div className="absolute bottom-6 text-center text-[9px] text-white/25 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-goldenrod-orange" />
        <span>Enterprise JWT Token secure integration</span>
      </div>
    </div>
  );
}
