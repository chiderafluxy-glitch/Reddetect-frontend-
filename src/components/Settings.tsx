/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getStripeStatus, getApiMode, setApiMode } from '../api';
import { CreditCard, ShieldCheck, HelpCircle, Loader2, Sparkles, Sliders, ToggleLeft, ToggleRight, Radio } from 'lucide-react';

interface SettingsProps {
  currentEmail?: string;
  fullName?: string;
  onPlanChanged: () => void;
}

export default function Settings({ currentEmail, fullName, onPlanChanged }: SettingsProps) {
  const [loading, setLoading] = useState(true);
  const [apiMode, setApiState] = useState<'live' | 'sandbox'>('sandbox');
  const [billingInfo, setBillingInfo] = useState({
    planName: 'Pro Pack - Subscription Mode',
    status: 'active',
    used: 5,
    limit: 30,
    unlimited: false
  });

  useEffect(() => {
    async function fetchBilling() {
      setLoading(true);
      try {
        const status = await getStripeStatus();
        setBillingInfo({
          planName: status.subscription.plan === 'free' ? 'Sandbox Free pack' : status.subscription.plan === 'builder' ? 'Builder pack' : 'Pro pack',
          status: status.subscription.status,
          used: status.usage.used,
          limit: status.usage.limit,
          unlimited: status.usage.unlimited
        });
        setApiState(getApiMode());
      } catch (err) {
        console.warn('Failed to retrieve billing settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBilling();
  }, []);

  const handleToggleMode = (mode: 'live' | 'sandbox') => {
    setApiMode(mode);
    setApiState(mode);
    // Reload components in main frames
    onPlanChanged();
  };

  const handleManageBilling = () => {
    // Open mock Stripe customer portal in new tab securely
    window.open('https://billing.stripe.com/p/session/test_mock_portal', '_blank', 'referrer');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">LOADING CENTRAL SYSTEM CONTROLS...</span>
      </div>
    );
  }

  return (
    <div className="text-vanilla-cream font-aeonikpro max-w-2xl mx-auto selection:bg-goldenrod-orange selection:text-midnight-ink animate-fade-in animate-duration-300">
      
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <h1 className="text-2xl font-semibold uppercase text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-white/40 mt-1">
          Review digital profile specifics, billing caps, database synchronization, and credentials.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* PROFILE SEGMENT */}
        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6">
          <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-widest block mb-4">
            01 &bull; Active profile coordinates
          </span>

          <div className="grid sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="text-white/40 block mb-1 uppercase font-semibold text-[9px]">Verified Account Username</label>
              <div className="bg-black/35 border border-white/5 px-4 py-3 rounded-xl select-all font-mono text-white/95">
                {fullName || 'Alex Validator'}
              </div>
            </div>

            <div>
              <label className="text-white/40 block mb-1 uppercase font-semibold text-[9px]">Authorized Email Address</label>
              <div className="bg-black/35 border border-white/5 px-4 py-3 rounded-xl select-all font-mono text-white/95 truncate">
                {currentEmail || 'builder.test@google.com'}
              </div>
            </div>
          </div>
        </section>

        {/* API INTERFACE SELECTOR (Zero setup vs live setup Toggle!) */}
        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-goldenrod-orange animate-pulse" />
            <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-widest">
              02 &bull; API Integration Gateway
            </span>
          </div>
          <p className="text-[11px] text-white/40 mb-6 leading-relaxed">
            Toggle between local Sandbox Simulation (zero installation required, perfect for viewing mockup report flows) and Live API Engine (connects directly to your Express cluster variables).
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleToggleMode('sandbox')}
              className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition-all text-left cursor-pointer ${
                apiMode === 'sandbox'
                  ? 'bg-goldenrod-orange/10 border-goldenrod-orange'
                  : 'bg-black/10 border-white/5 opacity-55 hover:opacity-100 hover:bg-white/[0.01]'
              }`}
            >
              <span className="text-xs font-semibold text-white">Development Sandbox</span>
              <p className="text-[10px] text-white/50 leading-relaxed">Secure keyless mockup sandbox running on client local-storage engines.</p>
            </button>

            <button
              onClick={() => handleToggleMode('live')}
              className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition-all text-left cursor-pointer ${
                apiMode === 'live'
                  ? 'bg-accent-blue/10 border-accent-blue'
                  : 'bg-black/10 border-white/5 opacity-55 hover:opacity-100 hover:bg-white/[0.01]'
              }`}
            >
              <span className="text-xs font-semibold text-white">Live Production API</span>
              <p className="text-[10px] text-white/50 leading-relaxed">Reads NEXT_PUBLIC_API_URL and attaches Supabase JWT tokens to actions.</p>
            </button>
          </div>
        </section>

        {/* BILLING AND USAGE */}
        <section className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6">
          <span className="text-[10px] text-accent-blue font-bold uppercase tracking-widest block mb-4">
            03 &bull; Membership & Billing caps
          </span>

          <div className="bg-black/25 rounded-xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider block">MEMBERSHIP PLAN</span>
              <span className="text-sm font-bold text-white uppercase mt-1 block">{billingInfo.planName}</span>
              <span className="text-[10px] text-green-400 font-semibold uppercase tracking-widest block mt-0.5">&bull; Active & verified</span>
            </div>

            <button
              onClick={handleManageBilling}
              className="bg-white hover:bg-vanilla-cream text-midnight-ink font-semibold text-xs px-5 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Manage Billing
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>Monthly scraping processing volumes</span>
              <span className="font-semibold text-white">
                {billingInfo.used} of {billingInfo.unlimited ? 'Unlimited' : billingInfo.limit} reports used
              </span>
            </div>
            
            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-goldenrod-orange to-accent-blue h-full rounded-full transition-all duration-500"
                style={{ width: `${billingInfo.unlimited ? 10 : (billingInfo.used / billingInfo.limit) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* COMPLIANCE SECURITY TERMS */}
        <div className="text-[10px] text-center text-white/20 flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck className="w-4 h-4 text-goldenrod-orange/40" />
          <span>Verified compliant under DotConnect security codes 2026.</span>
        </div>

      </div>

    </div>
  );
}
