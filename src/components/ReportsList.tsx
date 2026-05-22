/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../api';
import { FileText, Loader2, ArrowRight, Trash2, Calendar, FileCheck2, Search } from 'lucide-react';

interface ReportsListProps {
  onSelectReport: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function ReportsList({ onSelectReport, onNavigate }: ReportsListProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setErrorText(null);
      try {
        const resp = await getReports();
        setReports(resp.reports || []);
      } catch (err) {
        setErrorText('Failed to pull past report catalogs from backend.');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you absolute sure you want to permanently discard this validation report? This will delete all generated quotes and competitor graphs.')) return;
    try {
      const resp = await deleteReport(id);
      if (resp.success) {
        setReports(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete report failure', err);
    }
  };

  const verdictStyles = {
    strong_signal: { text: 'Strong Signal', cls: 'bg-green-500/10 border-green-500/20 text-green-400' },
    weak_signal: { text: 'Weak Signal', cls: 'bg-red-500/10 border-red-500/20 text-red-500' },
    mixed: { text: 'Mixed', cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' }
  } as const;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">LOADING AUDITED REPORTS FEED...</span>
      </div>
    );
  }

  return (
    <div className="text-vanilla-cream font-aeonikpro max-w-4xl mx-auto selection:bg-goldenrod-orange selection:text-midnight-ink animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/[0.08] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold uppercase text-white tracking-tight">
            My Audits
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Browse and query historical research reports. Dive back into full breakdowns of quotes, competitor radars, and willingness to pay.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="bg-[#007aff] hover:bg-blue-600 px-5 py-2.5 rounded-full text-xs text-white font-semibold cursor-pointer transition-colors"
        >
          Generate new report
        </button>
      </div>

      {errorText && (
        <div className="bg-red-500/10 border border-red-505/30 p-4 rounded-xl text-xs text-red-105 mb-6 max-w-md">
          {errorText}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col items-center justify-center p-8">
          <FileText className="w-10 h-10 text-white/10 mb-4 animate-bounce" />
          <h3 className="text-sm font-semibold text-white mb-1">No reports generated yet</h3>
          <p className="text-xs text-white/40 max-w-xs mb-6 leading-relaxed">
            Run your first idea through our Reddit & web deep crawler to compile beautiful data boards.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs bg-white text-midnight-ink font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-vanilla-cream"
          >
            Launch Scrapper
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {reports.map((rep) => {
              const verd = verdictStyles[rep.verdict as keyof typeof verdictStyles] || verdictStyles.mixed;
              return (
                <div
                  key={rep.id}
                  onClick={() => onSelectReport(rep.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] text-goldenrod-orange flex-shrink-0 mt-0.5">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-goldenrod-orange transition-colors uppercase truncate">
                        {rep.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1">
                        <span className="flex items-center gap-1 font-mono uppercase font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-white/20" />
                          {new Date(rep.created_at).toLocaleDateString()}
                        </span>
                        <span>&bull;</span>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{rep.original_query}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end flex-shrink-0">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border text-center ${verd.cls}`}>
                      {verd.text}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteItem(e, rep.id)}
                        className="text-white/20 hover:text-red-400 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="text-white/20 group-hover:text-goldenrod-orange group-hover:translate-x-0.5 transition-all text-sm hidden sm:block pl-2">
                        &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
