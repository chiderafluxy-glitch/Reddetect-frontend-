/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { createCheckout, completeMockPayment } from '../api';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface PricingProps {
  onBackToLanding?: () => void;
  onPaymentSuccess: () => void;
  currentEmail?: string;
}

export default function Pricing({ onBackToLanding, onPaymentSuccess, currentEmail }: PricingProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showSimulatedCheckout, setShowSimulatedCheckout] = useState(false);
  const [simulateSuccess, setSimulateSuccess] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const plans = [
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
      accent: true
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
      accent: false
    }
  ];

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setErrorText(null);
    try {
      console.log('Creating checkout for priceId:', priceId);
      const resp = await createCheckout(priceId);
      console.log('Checkout response:', resp);
      if (resp.url.startsWith('##stripe-checkout-success')) {
        // We are in simulated mode!
        setSelectedPlanId(priceId);
        setShowSimulatedCheckout(true);
      } else if (resp.url) {
        // Redirection to real Stripe Checkout URL
        window.location.href = resp.url;
      }
    } catch (e: any) {
      console.error('Checkout error:', e);
      // Show the actual error message from the server
      const errorMsg = e?.response?.data?.error || e?.message || 'Checkout creation failed';
      setErrorText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSimulation = async (success: boolean) => {
    if (!selectedPlanId) return;
    setLoading(true);
    setSimulateSuccess(success);
    
    setTimeout(async () => {
      try {
        if (success) {
          const ok = await completeMockPayment(selectedPlanId);
          if (ok) {
            onPaymentSuccess();
          } else {
            setErrorText("Stripe sandbox processor rejected the credentials.");
          }
        } else {
          setShowSimulatedCheckout(false);
          setSimulateSuccess(null);
        }
      } catch (e) {
        setErrorText("Critical transaction syncing error.");
      } finally {
        setLoading(false);
      }
    }, 1500);
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
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto w-full mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-8 rounded-2xl border-2 flex flex-col justify-between transition-all hover:scale-101 ${plan.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-goldenrod-orange tracking-wider bg-goldenrod-orange/10 px-2.5 py-1 rounded-md">
                    {plan.badge}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50 text-sm">/ {plan.period}</span>
                </div>

                <div className="border-t border-white/5 my-6" />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-goldenrod-orange flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Payment Mock Interface Modal */}
      {showSimulatedCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#142325] border border-white/10 rounded-2xl max-w-md w-full p-6 text-vanilla-cream shadow-2xl relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-goldenrod-orange to-accent-blue" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-goldenrod-orange">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Stripe Checkout Sandbox</h4>
                <p className="text-[10px] text-white/40">Secure Test Pipeline</p>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-6 text-xs">
              <div className="flex justify-between mb-2 pb-2 border-b border-white/5 text-white/60">
                <span>Selected Plan</span>
                <span className="font-semibold text-white">
                  {selectedPlanId === 'price_free_tier' ? 'Sandbox Free Limit' : selectedPlanId === 'price_1TaHQ6CBOoQTb0NpwMZiw8Jt' ? 'Builder (100 Scans)' : 'Pro Premium'}
                </span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Due Today</span>
                <span className="font-bold text-white text-sm">
                  {selectedPlanId === 'price_free_tier' ? '$0' : selectedPlanId === 'price_1TaHQ6CBOoQTb0NpwMZiw8Jt' ? '$50.00' : '$20.00'}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              In this preview environment, live Stripe payment gates operate in simulation mode. Click approve to securely credit your workspace session with live access tokens.
            </p>

            {simulateSuccess === true ? (
              <div className="text-center py-6 flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce mb-3" />
                <span className="text-sm font-semibold text-white">Transaction Verified!</span>
                <span className="text-xs text-white/40 mt-1">Routing to the command center...</span>
              </div>
            ) : simulateSuccess === false ? (
              <div className="text-center py-6 flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-red-500 animate-pulse mb-3" />
                <span className="text-sm font-semibold text-white">Transaction Aborted</span>
                <span className="text-xs text-white/40 mt-1">Resetting details...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  disabled={loading}
                  onClick={() => handleCompleteSimulation(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Processing Transaction...' : 'Approve & Sync Account'}
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleCompleteSimulation(false)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/70 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Decline Transaction
                </button>
              </div>
            )}
            
            <p className="text-[10px] text-center text-white/20 mt-4">
              Your actual customer data is encrypted according to standard digital blueprints.
            </p>
          </div>
        </div>
      )}

      {/* Trust terms footer banner */}
      <div className="max-w-md mx-auto text-center mt-12 text-white/20 text-[10px] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-goldenrod-orange/40" />
        <span>SECURED PAYMENTS PROCESSED BY STRIPE DIGITAL SYSTEM</span>
      </div>
    </div>
  );
}
