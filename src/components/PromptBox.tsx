/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { getFollowupQuestions, generateReport, getReportStatus } from '../api';
import { Sparkles, MessageSquare, ArrowRight, Loader2, FileSearch, Terminal, Database, ShieldAlert, Cpu } from 'lucide-react';

interface PromptBoxProps {
  onReportCompleted: (reportId: string) => void;
  onSeeExample: () => void;
}

export default function PromptBox({ onReportCompleted, onSeeExample }: PromptBoxProps) {
  const [phase, setPhase] = useState<'input' | 'followup' | 'loading'>('input');
  const [query, setQuery] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  
  // Loading cycling text state
  const [cycleIndex, setCycleIndex] = useState(0);
  const cycleTexts = [
    'Scanning active Reddit discussions...',
    'Interrogating Twitter search indices in parallel...',
    'Parsing web forum transcripts for pricing complaints...',
    'Locating competitor positioning gaps...',
    'Synthesizing customer market-persona matrices...',
    'Running DeepSeek inference to compile full report...'
  ];

  const pollIntervalRef = useRef<number | null>(null);

  // Cycling text interval
  useEffect(() => {
    let textInterval: any = null;
    if (phase === 'loading') {
      textInterval = setInterval(() => {
        setCycleIndex((prev) => (prev + 1) % cycleTexts.length);
      }, 2500);
    }
    return () => {
      if (textInterval) clearInterval(textInterval);
    };
  }, [phase]);

  // Clean polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleStartValidation = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await getFollowupQuestions(query);
      setQuestions(resp.questions || []);
      // Initialize answer fields
      const initAnswers: Record<string, string> = {};
      resp.questions.forEach((_, idx) => {
        initAnswers[String(idx)] = '';
      });
      setAnswers(initAnswers);
      setPhase('followup');
    } catch (e) {
      console.error('Failed to get questions', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunReport = async () => {
    setLoading(true);
    try {
      const resp = await generateReport(query, questions, answers);
      setReportId(resp.reportId);
      setPhase('loading');
      
      // Start polling backend every 3 seconds for status completed
      const rId = resp.reportId;
      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const statusResult = await getReportStatus(rId);
          if (statusResult.status === 'completed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            onReportCompleted(rId);
          } else if (statusResult.status === 'failed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            alert('Scraper execution encountered a live server failure. Resetting...');
            setPhase('input');
          }
        } catch (e) {
          console.warn('Polling check failed, retrying in next frame', e);
        }
      }, 3000);

    } catch (e) {
      console.error('Failed to fire generate', e);
      setPhase('input');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnswer = (index: number, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [String(index)]: val
    }));
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_15px_35px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-8 max-w-2xl w-full mx-auto relative overflow-hidden z-10 selection:bg-goldenrod-orange selection:text-midnight-ink">
      {/* Visual blueprint accent borders for dotconnect design signature */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-goldenrod-orange via-accent-blue to-goldenrod-orange/40" />
      <div className="absolute top-2 right-4 text-[9px] font-mono text-white/10 select-none">ID: RM_VALIDATOR_9921</div>

      {phase === 'input' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-goldenrod-orange animate-pulse" />
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Concept Command Center</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-2">
            What are we validating today?
          </h2>
          <p className="text-white/40 text-xs mb-8">
            Tell us about your SaaS idea, problem statement, or custom tool concept. We will scan live forums in parallel to verify.
          </p>

          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] rounded-xl p-4 mb-6 focus-within:border-goldenrod-orange/40 focus-within:bg-white/[0.04] transition-all flex flex-col gap-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your idea, what you're building, or what you want to find out in detail..."
              className="bg-transparent border-0 text-white placeholder:text-white/20 text-xs w-full h-24 focus:outline-none focus:ring-0 resize-none leading-relaxed"
            />
            
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <button
                onClick={onSeeExample}
                className="text-[10px] text-white/40 hover:text-goldenrod-orange transition-colors font-medium cursor-pointer"
              >
                See an example report &rarr;
              </button>

              <button
                disabled={loading || !query.trim()}
                onClick={handleStartValidation}
                className="bg-goldenrod-orange hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-goldenrod-orange text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Generate Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-4.5 h-4.5 text-goldenrod-orange flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-white/40 leading-relaxed">
              <strong>Scraper coverage limit:</strong> We crawl 100+ channels on Reddit, Twitter, and index forums in parallel. Report generation parses commercial intent, competitor gaps, and consumer complaints.
            </div>
          </div>
        </div>
      )}

      {phase === 'followup' && (
        <div className="flex flex-col">
          <span className="text-[10px] text-goldenrod-orange uppercase tracking-widest font-bold block mb-1">
            STEP 1 OF 2 &bull; PROMPT REFINEMENT
          </span>
          <h2 className="text-xl font-medium text-white mb-2">
            A few quick questions to sharpen your results
          </h2>
          <p className="text-xs text-white/40 mb-6 truncate leading-relaxed">
            Original: "{query}"
          </p>

          <div className="flex flex-col gap-5 mb-8">
            {questions.map((question, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <span className="text-[11px] text-white/60 font-semibold leading-relaxed">
                  {idx + 1}. {question}
                </span>
                <input
                  type="text"
                  placeholder="Type your response here..."
                  value={answers[String(idx)] || ''}
                  onChange={(e) => handleUpdateAnswer(idx, e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-goldenrod-orange transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-5">
            <button
              onClick={() => setPhase('input')}
              className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Back to edit idea
            </button>

            <button
              disabled={loading || Object.values(answers).some((a: string) => !a.trim())}
              onClick={handleRunReport}
              className="bg-[#007aff] hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#007aff] text-white text-xs font-semibold px-6 py-3 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  Run My Report
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="flex flex-col items-center py-12 text-center">
          {/* Animated custom digital spinning matrix radar */}
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border border-dotted border-goldenrod-orange/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-2 rounded-full border border-dashed border-accent-blue/30 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-5 rounded-full border border-double border-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-goldenrod-orange animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg font-medium text-white mb-2 animate-pulse">
            Deep-Scraping Active Web Forums...
          </h3>
          <p className="text-white/50 text-xs max-w-sm mb-6 leading-relaxed">
            Reddetect is auditing multiple discussion networks. Gathering feedback, quotes, pricing, and competitors in under 3 minutes.
          </p>

          {/* Cycling Status Log Console */}
          <div className="bg-black/40 border border-white/10 rounded-xl px-5 py-3 w-full text-left font-mono text-[10px] flex items-center gap-2 max-w-md mx-auto relative overflow-hidden">
            <Terminal className="w-3.5 h-3.5 text-goldenrod-orange flex-shrink-0 animate-ping" />
            <span className="text-white/80 transition-opacity duration-300">
              {cycleTexts[cycleIndex]}
            </span>
          </div>

          {/* Artificial glowing progress indicator */}
          <div className="w-full max-w-md bg-white/[0.04] h-1 rounded-full overflow-hidden mt-6">
            <div className="bg-gradient-to-r from-goldenrod-orange to-accent-blue h-full animate-infinite-loading rounded-full" style={{ width: '40%' }} />
          </div>

          <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-4">
            Estimated wait time: &lt; 15 seconds remaining
          </span>
        </div>
      )}
    </div>
  );
}
