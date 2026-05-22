/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getReport, askReport, generatePosts, getGeneratedPosts } from '../api';
import { Report, GeneratedPosts } from '../types';
import { 
  FileText, 
  Sparkles, 
  Activity, 
  MessageSquare, 
  Share2, 
  Briefcase, 
  ChevronRight, 
  Flame, 
  Users, 
  Search, 
  ShieldAlert, 
  DollarSign, 
  User, 
  Target, 
  TrendingUp, 
  Map, 
  Copy, 
  Check, 
  Loader2, 
  ArrowLeft,
  X,
  ExternalLink
} from 'lucide-react';

interface ReportViewProps {
  reportId: string;
  onBackToDashboard: () => void;
  onNavigate: (page: string) => void;
}

export default function ReportView({ reportId, onBackToDashboard, onNavigate }: ReportViewProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Voice Launch Drawer Panel State
  const [showDrawer, setShowDrawer] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPosts | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ask The Data Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLogs, setChatLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hi! I’ve indexed this entire report’s Reddit quotes, competitor files, and audience metrics. What specific fact would you like to ask?' }
  ]);

  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      setErrorText(null);
      try {
        const item = await getReport(reportId);
        setReport(item);
        
        // Check if posts were already generated
        const existPosts = await getGeneratedPosts(reportId);
        if (existPosts) {
          setGeneratedPosts(existPosts);
        }
      } catch (e) {
        setErrorText('Failed to pull compilation details from server.');
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [reportId]);

  const handleTriggerGeneratePosts = async () => {
    setShowDrawer(true);
    if (generatedPosts) return; // Already loaded!
    setPostsLoading(true);
    try {
      const posts = await generatePosts(reportId);
      setGeneratedPosts(posts);
    } catch (e) {
      console.warn('Draft compilation failed', e);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || chatLoading) return;
    const itemQuery = chatQuery;
    setChatLogs(prev => [...prev, { sender: 'user', text: itemQuery }]);
    setChatQuery('');
    setChatLoading(true);

    try {
      const resp = await askReport(reportId, itemQuery);
      setChatLogs(prev => [...prev, { sender: 'bot', text: resp.answer }]);
    } catch (err) {
      setChatLogs(prev => [...prev, { sender: 'bot', text: 'Apologies, failed to index query coordinates.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-vanilla-cream">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">LOADING DETAILED AUDIT SPECIFICATIONS...</span>
      </div>
    );
  }

  if (errorText || !report || !report.report_data) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-xl mx-auto my-12 text-center flex flex-col items-center gap-4">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <span className="text-sm font-semibold text-white">Validation Retrieval Error</span>
        <p className="text-xs text-red-100">{errorText || 'Report could not be initialized or is missing structured metadata.'}</p>
        <button 
          onClick={onBackToDashboard}
          className="bg-white/10 hover:bg-white/15 px-5 py-2 rounded-full text-xs text-white cursor-pointer"
        >
          Return to home
        </button>
      </div>
    );
  }

  const { report_data: d } = report;

  // Verdict design values according to guidelines
  const verdictStyleMap = {
    strong_signal: {
      bg: 'bg-green-500/10 border-green-500/20 text-green-400',
      tag: 'Strong Signal',
      dot: 'bg-green-400'
    },
    weak_signal: {
      bg: 'bg-red-500/10 border-red-500/20 text-red-400',
      tag: 'Weak Signal',
      dot: 'bg-red-400'
    },
    mixed: {
      bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
      tag: 'Mixed Signal',
      dot: 'bg-yellow-500'
    }
  };

  const vInfo = verdictStyleMap[d.verdict] || verdictStyleMap.mixed;

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 text-vanilla-cream font-aeonikpro relative selection:bg-goldenrod-orange selection:text-midnight-ink">
      
      {/* Main Report Column */}
      <div className="flex-grow max-w-4xl flex flex-col">
        
        {/* UPPER NAVIGATION TITLE BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
          <div>
            <button 
              onClick={onBackToDashboard}
              className="group flex items-center gap-1 text-xs text-white/40 hover:text-white mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Main Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white leading-tight uppercase flex items-center gap-3">
              {report.title}
            </h1>
            <p className="text-[10px] text-white/30 font-semibold tracking-wider uppercase mt-1">
              GENERATED RUN &bull; {new Date(report.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleTriggerGeneratePosts}
              className="bg-white/10 hover:bg-white/15 text-white hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-goldenrod-orange" />
              Generate Posts
            </button>

            <button
              onClick={() => onNavigate(`workspace/${report.id}`)}
              className="bg-goldenrod-orange hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-goldenrod-orange/15"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Open Workspace
            </button>
          </div>
        </div>

        {/* VERDICT SUMMARY PANEL */}
        <div id="report-summary" className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6 mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-goldenrod-orange to-accent-blue" />
          
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border flex items-center gap-1.5 ${vInfo.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${vInfo.dot} animate-pulse`} />
                {vInfo.tag}
              </span>
              <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">CORE VERDICT SUMMARY</span>
            </div>
            
            <p className="text-sm text-white/85 leading-relaxed">
              {d.verdict_summary}
            </p>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0 self-stretch md:self-auto justify-around bg-black/20 border border-white/5 p-4 rounded-xl">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block">DEMAND</span>
              <span className="text-3xl font-bold font-dotconnect text-goldenrod-orange mt-1 block">
                {d.demand_score}<span className="text-xs text-white/50">/100</span>
              </span>
            </div>
            
            <div className="h-8 border-l border-white/10" />

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block">COMPETITION</span>
              <span className="text-xs uppercase font-bold text-white block mt-2 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                {d.competition_level}
              </span>
            </div>
          </div>
        </div>

        {/* SECTIONS GRID COLLAPSE */}
        <div className="space-y-6">
          
          {/* SECTION 1: KEY INSIGHTS */}
          <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-4.5 h-4.5 text-goldenrod-orange" />
              01 &bull; Key Signals Explored
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {d.key_insights.map((insight, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 p-5 rounded-xl text-xs hover:border-white/10 transition-colors">
                  <span className="text-[10px] font-bold text-goldenrod-orange uppercase tracking-wider block mb-1">
                    INSIGHT #{idx + 1}
                  </span>
                  <p className="text-white/90 font-medium mb-3 leading-relaxed">{insight.insight}</p>
                  <p className="text-white/40 leading-relaxed mb-4">"{insight.evidence}"</p>
                  <a 
                    href={insight.source_url} 
                    target="_blank" 
                    rel="referrer noopener"
                    className="text-[10px] font-semibold text-accent-blue hover:underline inline-flex items-center gap-1"
                  >
                    View active post &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* TWO COLUMN GRID INDEX */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* SECTION 2: WHAT PEOPLE ARE SAYING */}
            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <MessageSquare className="w-4.5 h-4.5 text-accent-blue" />
                  02 &bull; What people say
                </h3>
                <div className="space-y-4">
                  {d.top_quotes.map((qt, idx) => (
                    <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl border-l-2 border-l-accent-blue relative">
                      <p className="text-xs text-white/80 leading-relaxed italic mb-3">
                        "{qt.quote}"
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-white/40">
                        <span className="font-semibold text-white/50">{qt.subreddit} &bull; {qt.upvotes} upvotes</span>
                        <a href={qt.url} className="text-accent-blue hover:underline">Link &rarr;</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-4 text-[10px] text-white/30 flex items-center justify-between">
                <span>SCANNED SOURCES</span>
                <span className="font-mono text-white/50">{d.sources_count.reddit_posts} reddit posts &bull; {d.sources_count.web_results} web hits</span>
              </div>
            </div>

            {/* SECTION 3: YOUR AUDIENCE */}
            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <Users className="w-4.5 h-4.5 text-goldenrod-orange" />
                  03 &bull; Target Audience
                </h3>
                
                <div className="mb-4">
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">WHO THEY ARE</span>
                  <p className="text-xs text-white font-medium pl-2 border-l-2 border-l-goldenrod-orange">{d.audience.who_they_are}</p>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1.5">ORGANIC PAIN POINTS</span>
                  <ul className="space-y-1.5">
                    {d.audience.pain_points.map((p, idx) => (
                      <li key={idx} className="text-xs text-white/70 flex items-start gap-1">
                        <span className="text-goldenrod-orange flex-shrink-0 mt-0.5">&bull;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1.5">THEIR VOCABULARY</span>
                    <div className="flex flex-wrap gap-1">
                      {d.audience.language_they_use.map((lang, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1.5">THEIR HANGOUTS</span>
                    <div className="flex flex-wrap gap-1">
                      {d.audience.where_they_hang_out.map((hang, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
                          {hang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 4: COMPETITORS AND GAPS */}
          <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Target className="w-4.5 h-4.5 text-goldenrod-orange" />
              04 &bull; Competitor Radar & Market Gaps
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {d.competitors.map((comp, idx) => (
                <div key={idx} className="p-5 bg-black/20 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">{comp.name}</span>
                    <a href={comp.url} className="text-[9px] text-accent-blue hover:underline flex items-center gap-1">
                      Profile <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-white/55 italic mb-4">"People say: {comp.what_people_say}"</p>
                  
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1.5 font-bold">THEIR PRODUCT GAPS</span>
                  <ul className="space-y-1">
                    {comp.gaps.map((gp, i) => (
                      <li key={i} className="text-[11px] text-red-300 flex items-start gap-1">
                        <span className="text-red-400">&times;</span>
                        <span>{gp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-[#ededea]/5 p-5 rounded-xl border border-white/5">
              <span className="text-[10px] text-goldenrod-orange uppercase tracking-wider font-bold block mb-2">
                EXPLOITABLE MARKET GAPS IDENTIFIED
              </span>
              <div className="grid md:grid-cols-3 gap-4">
                {d.market_gaps.map((gap, idx) => (
                  <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-white/80 flex items-start gap-2">
                    <span className="font-dotconnect text-goldenrod-orange text-xs">#{idx + 1}</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: OPPORTUNITY MAP & WILLINGNESS TO PAY */}
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <Map className="w-4.5 h-4.5 text-accent-blue" />
                  05 &bull; Opportunity Map
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">CROWDED (AVOID)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {d.opportunity_map.crowded_areas.map((c, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-white/40 line-through">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">UNDERSERVED (BUILD)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {d.opportunity_map.underserved_areas.map((u, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-350">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-goldenrod-orange/10 p-4 rounded-xl border border-goldenrod-orange/20 mt-4">
                    <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-wider block mb-1">
                      BEST RETURNING CONVERSION ANGLE
                    </span>
                    <p className="text-xs text-white/90 leading-relaxed font-semibold">
                      {d.opportunity_map.best_opportunity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <DollarSign className="w-4.5 h-4.5 text-goldenrod-orange" />
                  06 &bull; Commercial Intent & Pricing
                </h3>

                <div className="flex items-center gap-4 mb-4 bg-black/25 p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] text-white/30 font-bold block">BUYING POWER</span>
                    <span className="text-2xl font-bold text-goldenrod-orange font-dotconnect">{d.willingness_to_pay.score}<span className="text-xs text-white/50">/100</span></span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {d.willingness_to_pay.evidence}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-white/30 font-bold uppercase block">PRICE SIGNALS DETECTED IN THE WILD</span>
                  {d.willingness_to_pay.price_signals.map((ps, idx) => (
                    <div key={idx} className="text-[11px] text-white/80 bg-white/[0.02] border border-white/5 p-2 rounded-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-goldenrod-orange" />
                      <span>{ps}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 6: MVP SUGGESTION & THE KILL SWITCH */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <TrendingUp className="w-4.5 h-4.5 text-accent-blue" />
                  07 &bull; Suggested MVP Strategy
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-0.5">CORE FEATURE MATRIX</span>
                    <p className="text-sm font-semibold text-white pl-2 border-l-2 border-l-accent-blue">{d.mvp_suggestion.core_feature}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-0.5">TARGET USERS</span>
                    <p className="text-xs text-white/70">{d.mvp_suggestion.target_user}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-0.5">WHY THIS WORKS SPECIFICALLY</span>
                    <p className="text-xs text-white/60 leading-relaxed">{d.mvp_suggestion.why}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/35 p-4 rounded-xl border border-white/5 mt-4 text-xs font-mono">
                <span className="text-[9px] text-white/30 uppercase block font-semibold mb-1">MARKET SIZE ESTIMATION</span>
                <span className="text-white block font-semibold text-[11px]">{d.market_size.estimate}</span>
                <span className="text-white/40 block text-[9px] mt-1 italic">Reasoning: {d.market_size.reasoning}</span>
              </div>
            </div>

            <div className="bg-[#120203] border-2 border-red-500/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <ShieldAlert className="w-4.5 h-4.5 text-red-500 animate-pulse" />
                  08 &bull; Existential Kill Switch
                </h3>
                <p className="text-[11px] text-red-100/60 mb-4 leading-relaxed">
                  Before investing weeks, confront the actual reasons why this setup might fall short dynamically. No sugar coating.
                </p>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-red-400/50 font-bold uppercase tracking-wider block mb-1">CRITICAL THREAT RISKS</span>
                    <ul className="space-y-1">
                      {d.kill_switch.risks.map((rk, i) => (
                        <li key={i} className="text-xs text-red-200/80 flex items-start gap-1">
                          <span className="text-red-500">&bull;</span>
                          <span>{rk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] text-red-400/50 font-bold uppercase tracking-wider block mb-0.5">WHY IT MIGHT FAIL</span>
                    <p className="text-xs text-red-100 bg-red-950/20 border border-red-900/40 p-3 rounded-lg leading-relaxed italic">
                      "{d.kill_switch.why_it_might_fail}"
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-red-900/20 pt-4 mt-4 text-[11px] text-red-400/40">
                SCANNED SOLUTIONS: {d.kill_switch.existing_solutions.join(', ')}
              </div>
            </div>

          </div>

          {/* SECTION 7: PRICING INTELLIGENCE & PERSONA */}
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                <DollarSign className="w-4.5 h-4.5 text-goldenrod-orange" />
                09 &bull; Pricing Intelligence Range
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">WHAT PEOPLE PAY TODAY</span>
                  <div className="grid grid-cols-2 gap-2">
                    {d.pricing_intelligence.what_people_pay_now.map((pay, i) => (
                      <span key={i} className="bg-black/25 p-2 rounded border border-white/5 text-center text-white/80 font-semibold">{pay}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block mb-1">PRICING GRIPES</span>
                  <ul className="space-y-1">
                    {d.pricing_intelligence.complaints_about_pricing.map((grip, i) => (
                      <li key={i} className="text-xs text-white/60 flex items-start gap-1">
                        <span className="text-red-400">-</span>
                        <span>{grip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3">
                  <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-wider block mb-0.5">REASONABLE PRICE ZONE RECOMMENDED</span>
                  <p className="text-sm font-bold text-white font-dotconnect">{d.pricing_intelligence.suggested_price_range}</p>
                </div>
              </div>
            </div>

            {/* PERSONA CARD ELEMENT */}
            <div className="bg-[#021112] border-2 border-accent-blue/15 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <User className="w-4.5 h-4.5 text-accent-blue" />
                  10 &bull; Archetype Customer Persona
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue text-sm font-bold">
                    {d.customer_persona.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{d.customer_persona.name}</h4>
                    <p className="text-[10px] text-white/40">{d.customer_persona.occupation} &bull; Age {d.customer_persona.age_range}</p>
                  </div>
                </div>

                <p className="text-xs text-accent-blue bg-accent-blue/5 border border-accent-blue/25 p-3 rounded-lg mb-4 italic leading-relaxed">
                  "{d.customer_persona.typical_quote}"
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider block mb-1">CORE GOALS</span>
                    <ul className="space-y-0.5 text-white/70">
                      {d.customer_persona.goals.slice(0, 2).map((g, i) => (
                        <li key={i}>&bull; {g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider block mb-1">FRUSTRATIONS</span>
                    <ul className="space-y-0.5 text-white/70">
                      {d.customer_persona.frustrations.slice(0, 2).map((f, i) => (
                        <li key={i}>&bull; {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 8: REDDIT DIRECT THREADS FEED */}
          <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <ChevronRight className="w-4.5 h-4.5 text-goldenrod-orange" />
              11 &bull; Selected Reddit Threads Worth Reading
            </h3>
            
            <div className="space-y-3">
              {d.reddit_threads.map((thread, idx) => (
                <div key={idx} className="bg-black/25 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-goldenrod-orange block uppercase tracking-wider">THREAD #{idx + 1} &bull; {thread.upvotes} upvotes</span>
                    <h4 className="text-xs font-semibold text-white truncate my-1">{thread.title}</h4>
                    <p className="text-[11px] text-white/40 truncate italic">"{thread.why_relevant}"</p>
                  </div>
                  <a 
                    href={thread.url}
                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-white/80 p-2.5 rounded-lg border border-white/5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT WITH REPORT MODULE: ASK THE DATA */}
          <div id="ask-the-data" className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6">
            <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
              <MessageSquare className="w-4.5 h-4.5 text-goldenrod-orange animate-pulse" />
              Ask the Data &bull; Virtual Copilot
            </h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Explore secondary points or request data drilldowns. This AI indexes the report's metrics, quotes, and radar charts.
            </p>

            <div className="bg-black/30 border border-white/5 rounded-xl p-4 gap-3 flex flex-col max-h-64 overflow-y-auto mb-4">
              {chatLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl text-xs max-w-sm leading-relaxed ${
                    log.sender === 'user' 
                      ? 'bg-accent-blue/10 border border-accent-blue/20 self-end text-white' 
                      : 'bg-white/5 border border-white/5 self-start text-white/90'
                  }`}
                >
                  <span className="text-[8px] uppercase tracking-wider text-white/30 block mb-1 font-bold">
                    {log.sender === 'user' ? 'YOUR QUERY' : 'REPORT CONSOLE'}
                  </span>
                  <span>{log.text}</span>
                </div>
              ))}
              {chatLoading && (
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs self-start max-w-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-goldenrod-orange" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest animate-pulse">Running data lookup...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about this report (e.g., who is most frustrated about this?)..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs w-full focus:outline-none focus:border-goldenrod-orange text-white"
              />
              <button 
                type="submit"
                disabled={chatLoading || !chatQuery.trim()}
                className="bg-goldenrod-orange hover:bg-orange-600 disabled:opacity-40 text-white font-semibold text-xs px-6 rounded-xl cursor-pointer"
              >
                Query
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Social Drawer / Launch Voice Panel Side Panel */}
      {showDrawer && (
        <div className="w-full lg:w-80 border border-white/[0.08] bg-[#0b1718] p-6 rounded-2xl flex flex-col justify-between h-auto lg:h-[calc(100vh-140px)] sticky top-[80px] z-20">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4.5 h-4.5 text-goldenrod-orange animate-pulse" />
                <h3 className="font-semibold text-sm text-white uppercase tracking-wider">Launch Voice</h3>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="border-0 bg-transparent text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <p className="text-[11px] text-white/50 mb-6 leading-relaxed">
              Synthesize your completed report findings into ready-to-post build-in-public social media drafts. Expand with one click.
            </p>

            {postsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-goldenrod-orange mb-3" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Synthesizing platform posts...</span>
              </div>
            ) : generatedPosts ? (
              <div className="space-y-4 max-h-[80vh] lg:max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {/* TWITTER CARD */}
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-wider">TWITTER THREAD DRAFT</span>
                    <button
                      onClick={() => handleCopyText(generatedPosts.raw.twitter_thread.content, 'twitter')}
                      className="text-white/40 hover:text-goldenrod-orange p-1 rounded hover:bg-white/5 transition-all"
                    >
                      {copiedKey === 'twitter' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed font-mono select-all bg-black/[0.1] border border-white/[0.03] p-2.5 rounded h-32 overflow-y-auto">
                    {generatedPosts.raw.twitter_thread.content}
                  </p>
                </div>

                {/* LINKEDIN CARD */}
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-accent-blue font-bold uppercase tracking-wider">LINKEDIN POST</span>
                    <button
                      onClick={() => handleCopyText(generatedPosts.raw.linkedin.content, 'linkedin')}
                      className="text-white/40 hover:text-accent-blue p-1 rounded hover:bg-white/5 transition-all"
                    >
                      {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed font-mono select-all bg-black/[0.1] border border-white/[0.03] p-2.5 rounded h-32 overflow-y-auto">
                    {generatedPosts.raw.linkedin.content}
                  </p>
                </div>

                {/* REDDIT HUMBLE POST */}
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">REDDIT HUMBLE POST</span>
                    <button
                      onClick={() => handleCopyText(generatedPosts.raw.reddit.content, 'reddit')}
                      className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-all"
                    >
                      {copiedKey === 'reddit' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed font-mono select-all bg-black/[0.1] border border-white/[0.03] p-2.5 rounded h-32 overflow-y-auto">
                    {generatedPosts.raw.reddit.content}
                  </p>
                </div>

                {/* ONE SENTENCE HOOK */}
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-red-400/80 font-bold uppercase tracking-wider">ONELINE HOOK</span>
                    <button
                      onClick={() => handleCopyText(generatedPosts.raw.hook.content, 'hook')}
                      className="text-white/40 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all"
                    >
                      {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed font-mono select-all bg-black/[0.1] p-2 rounded">
                    {generatedPosts.raw.hook.content}
                  </p>
                </div>

              </div>
            ) : (
              <button
                onClick={handleTriggerGeneratePosts}
                className="w-full bg-goldenrod-orange hover:bg-orange-600 text-white py-3 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                disabled={postsLoading}
              >
                Synthesize Pitch
              </button>
            )}
          </div>

          <div className="text-[9px] text-white/25 mt-4 text-center">
            LAUNCH VOICE &bull; REDDETECT AI PUBLISHING
          </div>
        </div>
      )}

    </div>
  );
}
