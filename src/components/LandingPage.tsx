/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Radar, Flame, Fingerprint, Compass, Gem, Zap, Brain, Infinity, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSelectPlan: (plan: string) => void;
}

export default function LandingPage({ onNavigate, onSelectPlan }: LandingPageProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { title: "Research Report", desc: "Real signal from real people. Not surveys. Not guesses. Get real organic conversations.", icon: Radar },
    { title: "Kill Switch", desc: "The honest case against your idea. Know the critical existential risks before writing any code.", icon: Flame },
    { title: "Audience Finder", desc: "Discover exactly where your potential high-intent customers hang out and converse online.", icon: Fingerprint },
    { title: "Competitor Radar", desc: "Pinpoint who is already in your lane and uncover exact gaps between customer wishes and current products.", icon: Compass },
    { title: "Idea Vault", desc: "Save, query, and track every product concept across every stage of your validation journey.", icon: Gem },
    { title: "Launch Voice", desc: "Synthesize research data into ready-to-post, high-relevance Twitter, LinkedIn, and Reddit draft copies.", icon: Zap },
    { title: "Ask The Data", desc: "Deploy AI chat interface directly on top of your final report. Ask custom queries and find evidence.", icon: Brain },
    { title: "The Graveyard", desc: "A psychological and strategic archive for ideas you decided to kill. Learn from past reflections.", icon: Infinity }
  ];

  return (
    <div className="min-h-screen bg-midnight-ink text-vanilla-cream font-aeonikpro selection:bg-goldenrod-orange selection:text-midnight-ink">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-midnight-ink/80 backdrop-blur-md border-b border-white/[0.08] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="font-dotconnect text-xl font-bold tracking-tight text-white select-none">
            Reddetect
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-white/60 hover:text-white transition-colors text-sm hover:underline hover:decoration-goldenrod-orange hover:underline-offset-4"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-white/60 hover:text-white transition-colors text-sm hover:underline hover:decoration-goldenrod-orange hover:underline-offset-4"
          >
            Pricing
          </button>
          <button 
            onClick={() => onNavigate('login')} 
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Sign in
          </button>
          <button 
            onClick={() => onNavigate('signup')} 
            className="bg-white text-midnight-ink hover:bg-vanilla-cream transition-all px-4 py-2 rounded-full text-xs font-semibold py-1.5 cursor-pointer shadow-sm hover:scale-102"
          >
            Get Started
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => onNavigate('login')} 
            className="text-white/85 hover:text-white px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('signup')} 
            className="bg-white text-midnight-ink hover:bg-vanilla-cream px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content Container with spacing constraints */}
      <main className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
        
        {/* HERO SECTION */}
        <section className="text-center py-16 md:py-24 relative overflow-hidden flex flex-col items-center">
          {/* Ambient Orange Wash overlay in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-goldenrod-orange/10 blur-[120px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-full bg-white/[0.03] mb-8"
          >
            <Sparkles className="w-4 h-4 text-goldenrod-orange" />
            <span className="text-xs text-white/80 font-medium">REAL-TIME REDDIT & WEB SCANNERS</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-tight max-w-4xl"
          >
            Stop guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
              Start building what people want.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mb-12 leading-relaxed"
          >
            Reddetect searches Reddit, forums, and the web in real time to validate your SaaS idea, identify your exact customer pain points, and map your market competitors — in under 3 minutes.
          </motion.p>

          {/* Call to action panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              id="landing-cta"
              onClick={() => onNavigate('signup')}
              className="group bg-goldenrod-orange text-white hover:bg-orange-600 px-8 py-4 rounded-full text-base font-medium flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-goldenrod-orange/20 hover:scale-102"
            >
              Start validating free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-white/40">No credit card required to sign up</span>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 border-t border-white/[0.08]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-white mb-4">How Reddetect works</h2>
            <p className="text-white/50 text-base">We scan real internet conversations from real people, bypassing biased surveys or market guesses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="absolute top-4 right-6 text-5xl font-dotconnect text-white select-none font-bold opacity-100">01</div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-midnight-ink font-black text-sm mb-6 shadow-md border border-white">1</div>
              <h3 className="text-lg font-medium text-white mb-3">Describe your idea</h3>
              <p className="text-white/50 text-sm leading-relaxed">Tell us what you're building or researching in any language. Be as high-level or rich in details as you want — we handle the context.</p>
            </div>

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="absolute top-4 right-6 text-5xl font-dotconnect text-white select-none font-bold opacity-100">02</div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-midnight-ink font-black text-sm mb-6 shadow-md border border-white">2</div>
              <h3 className="text-lg font-medium text-white mb-3">We scrape the web</h3>
              <p className="text-white/50 text-sm leading-relaxed">Our smart agents dynamically target Reddit, Twitter, and index portals, downloading discussions in real time with precise source attribution.</p>
            </div>

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="absolute top-4 right-6 text-5xl font-dotconnect text-white select-none font-bold opacity-100">03</div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-midnight-ink font-black text-sm mb-6 shadow-md border border-white">3</div>
              <h3 className="text-lg font-medium text-white mb-3">Get your complete report</h3>
              <p className="text-white/50 text-sm leading-relaxed">In under 3 minutes, access a comprehensive validation report detailing customer quotes, willingness to pay, competitor gaps, and MVP suggestion.</p>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 border-t border-white/[0.08]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-white mb-4">Go from raw idea to confident decision</h2>
            <p className="text-white/50 text-base">A complete feature suite built strictly for digital builders and indie validations.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div key={idx} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-6 rounded-2xl flex flex-col items-start hover:border-white/20 hover:bg-white/[0.05] transition-all">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] mb-4 text-goldenrod-orange">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-medium text-white mb-2">{feature.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-24 border-t border-white/[0.08]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-white mb-4">Simple pricing, built for makers</h2>
            <p className="text-white/50 text-base">Choose a plan to instantly deploy your real-market scanners and unlock reports.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* FREE TIER CARD */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl flex flex-col justify-between hover:scale-101 transition-transform relative">
              <div>
                <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">STANDARD DISCOVERY</span>
                <h3 className="text-xl font-medium text-white mt-1 mb-3">Free</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-white/40 text-xs">/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-sm text-white/60">
                  <li className="flex items-center gap-2">✔ 3 micro research reports / mo</li>
                  <li className="flex items-center gap-2">✔ Standard analytics dashboard</li>
                  <li className="flex items-center gap-2">❌ Workspace note managers</li>
                  <li className="flex items-center gap-2">❌ AI Copilot ("Ask the Data")</li>
                  <li className="flex items-center gap-2">❌ Launch Voice generators</li>
                </ul>
              </div>
              <div>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-full text-xs font-medium cursor-pointer transition-all border border-white/10"
                >
                  Get started free
                </button>
                <p className="text-center text-[10px] text-white/30 mt-3">Free preview limited sandbox</p>
              </div>
            </div>

            {/* PRO TIER CARD */}
            <div className="bg-white/[0.05] backdrop-blur-xl border-2 border-goldenrod-orange shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl flex flex-col justify-between hover:scale-101 transition-transform relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-goldenrod-orange text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
                Most Popular
              </div>
              
              <div>
                <span className="text-goldenrod-orange text-xs font-semibold tracking-wider uppercase">BUILD & VALIDATE</span>
                <h3 className="text-xl font-medium text-white mt-1 mb-3">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$20</span>
                  <span className="text-white/40 text-sm">/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-sm text-white/80">
                  <li className="flex items-center gap-2 text-white">✔ <strong className="text-white">30 premium reports</strong> / mo</li>
                  <li className="flex items-center gap-2">✔ Full detailed internet mapping</li>
                  <li className="flex items-center gap-2">✔ Active workspace note integrations</li>
                  <li className="flex items-center gap-2">✔ "Ask the Data" immediate chat</li>
                  <li className="flex items-center gap-2">✔ Launch Voice (Instant posts helper)</li>
                  <li className="flex items-center gap-2">✔ Persistent Idea Vault state</li>
                </ul>
              </div>
              
              <div>
                <button 
                  onClick={() => onSelectPlan('price_1TaHOtCBOoQTb0NpOd2zePu8')}
                  className="w-full bg-goldenrod-orange hover:bg-orange-600 text-white py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all shadow-md shadow-goldenrod-orange/20"
                >
                  Get Started with Pro
                </button>
                <p className="text-center text-[10px] text-white/30 mt-3">Cancel or downgrade securely anytime</p>
              </div>
            </div>

            {/* BUILDER TIER CARD */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.5)] p-8 rounded-2xl flex flex-col justify-between hover:scale-101 transition-transform relative">
              <div>
                <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">PROFESSIONAL FOUNDER</span>
                <h3 className="text-xl font-medium text-white mt-1 mb-3">Builder</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">$50</span>
                  <span className="text-white/40 text-xs">/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-sm text-white/60">
                  <li className="flex items-center gap-2 text-white">✔ <strong className="text-white">100 research reports</strong></li>
                  <li className="flex items-center gap-2">✔ Priority research speeds (60s)</li>
                  <li className="flex items-center gap-2">✔ Everything listed inside Pro suite</li>
                  <li className="flex items-center gap-2">✔ Comprehensive competitor trackers</li>
                  <li className="flex items-center gap-2">✔ Tailored bespoke customer personas</li>
                </ul>
              </div>
              <div>
                <button 
                  onClick={() => onSelectPlan('price_1TaHQ6CBOoQTb0NpwMZiw8Jt')}
                  className="w-full bg-white text-midnight-ink hover:bg-vanilla-cream py-3 rounded-full text-xs font-semibold cursor-pointer transition-all"
                >
                  Get Started with Builder
                </button>
                <p className="text-center text-[10px] text-white/30 mt-3">Designed for continuous product validation</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] mt-20 bg-black/40">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <span className="font-dotconnect text-lg font-semibold text-white">Reddetect</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/50">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it works</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">Sign in</button>
          </div>

          <span className="text-xs text-white/30">
            &copy; 2026 Reddetect. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
