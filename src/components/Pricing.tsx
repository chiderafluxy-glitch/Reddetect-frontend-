/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { createCheckout, syncUser, getWorkflowState } from '../api';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface PricingProps {
  onBackToLanding?: () => void;
  onPaymentSuccess: () => void;
  currentEmail?: string;
}

export default function Pricing({ onBackToLanding, onPaymentSuccess, currentEmail }: PricingProps) {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      color: 'border-white/5 bg-white/[0.02] backdrop-blur-xl',
      badge: 'FREE ACCESS',
      features: [
        '3 Research Reports total',
        'Basic report only',
        'No workspace features'
      ],
      btnText: 'Continue with free access →',
      accent: false,
      isFree: true
    },
    {
      id: 'price_1TaHOtCBOoQTb0NpOd2zePu8',
      name: 'Pro Pack',
      price: '$20',
      period: 'month',
      color: 'border-goldenrod-orange bg-goldenrod-orange/5 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)]',
      badge: 'POPULAR CHOICE',
      features: [
        '30 Full Research Reports per month',
        'Reddit sentiment, keyword & post tracker',
        'Competitor radar analysis panel',
        'Interactive AI chat capability ("Ask the Data")',
        'Launch Voice draft synthesis (LinkedIn/Twitter/Reddit)',
        'Persistent Idea Vault track record'
      ],
      btnText: 'Activate Pro Mode',
      accent: true,
      isFree: false
    },
    {
      id: 'price_1TaHQ6CBOoQTb0NpwMZiw8Jt',
      name: 'Builder Pack',
      price: '$50',
      period: 'month',
      color: 'border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)]',
      badge: '100 RESEARCH REPORTS',
      features: [
        '100 Research Reports per month',
        'Priority high-speed agent scraper queue (60s)',
        'Comprehensive bespoke Customer Personas',
        'Custom web search engine scraping inclusions',
        'Bespoke competitor product feature scoring matrix',
        'Dedicated workspace channels'
      ],
      btnText: 'Activate Builder Mode',
      accent: false,
      isFree: false
    }
  ];

  const handleCheckout = async (priceId: string) => {
    // Handle free plan - skip Stripe
    if (priceId === 'free') {
      await handleFreeAccess();
      return;
    }
    
    setLoading(true);
    setErrorText(null);
    try {
      console.log('Creating checkout for priceId:', priceId);
      const resp = await createCheckout(priceId);
      console.log('Checkout response:', resp);
      if (resp.url) {
        // Redirect to real Stripe Checkout URL
        window.location.href = resp.url;
      }
    } catch (e: any) {
      console.error('Checkout error:', e);
      const errorMsg = e?.response?.data?.error || e?.message || 'Checkout creation failed';
      setErrorText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeAccess = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      // Sync user with backend
      await syncUser(currentEmail || '', '');
      // Check workflow state and navigate to dashboard
      const state = await getWorkflowState();
      if (state.state.has_paid) {
        onPaymentSuccess();
      } else {
        // User is on free plan, go to dashboard
        onPaymentSuccess();
      }
    } catch (e: any) {
      console.error('Free access error:', e);
      setErrorText(e?.message || 'Failed to activate free access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-ink text-vanilla-cream font-aeonikpro flex flex-col justify-between py-12 px-6 relative selection:bg-goldenrod-orange selection:text-midnight-ink">
      
      {/* Background ambient noise patterns */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-goldenrod-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between mb-12">
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="group flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return
            </button>
          )}
          <div className="flex items-center">
            <span className="font-dotconnect text-lg font-semibold text-white">Reddetect</span>
          </div>
        </div>

        {/* Dynamic Titles */}
        <div className="text-center mb-12">
          <span className="text-goldenrod-orange text-xs font-semibold tracking-wider uppercase bg-goldenrod-orange/10 px-3 py-1 rounded-full">
            MEMBERSHIP GATEWAY
          </span>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mt-4 mb-4">
            Activate your custom scrapper system
          </h1>
          <p className="text-white/50 text-base max-w-lg mx-auto">
            All reports require live server processing runs. Connect a subscription tier to begin validating concepts immediately.
          </p>
          {currentEmail && (
            <p className="text-xs text-white/30 mt-3">
              Logged in as: <strong className="text-white/60">{currentEmail}</strong>
            </p>
          )}
        </div>

        {errorText && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-red-100">{errorText}</span>
          </div>
        )}

        {/* Pricing options grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-4xl mx-auto w-full mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-6 rounded-2xl border-2 flex flex-col justify-between transition-all hover:scale-101 ${
                plan.isFree 
                  ? 'border-white/5 bg-white/[0.02] backdrop-blur-xl w-full md:w-48 flex-shrink-0' 
                  : plan.color
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white/40 tracking-wider bg-white/5 px-2 py-1 rounded-md mb-3 inline-block">
                  {plan.badge}
                </span>
                <h3 className="text-lg font-medium text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50 text-sm">/ {plan.period}</span>
                </div>

                <div className="border-t border-white/5 my-4" />

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.isFree ? (
                <button
                  disabled={loading}
                  onClick={() => handleCheckout(plan.id)}
                  className="w-full py-2.5 rounded-full text-sm font-medium text-white/70 hover:text-white cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? 'Activating...' : 'Continue with free access →'}
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all ${
                    plan.accent 
                      ? 'bg-goldenrod-orange hover:bg-orange-600 text-white shadow-lg shadow-goldenrod-orange/15' 
                      : 'bg-white hover:bg-vanilla-cream text-midnight-ink'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Initializing Stripe Secure...' : plan.btnText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trust terms footer banner */}
      <div className="max-w-md mx-auto text-center mt-12 text-white/20 text-[10px] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-goldenrod-orange/40" />
        <span>SECURED PAYMENTS PROCESSED BY STRIPE DIGITAL SYSTEM</span>
      </div>
    </div>
  );
}
