/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getGraveyard } from '../api';
import { Workspace } from '../types';
import { Skull, Loader2, ArrowRight, Flame, Sparkles } from 'lucide-react';

interface GraveyardProps {
  onSelectIdea: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function Graveyard({ onSelectIdea, onNavigate }: GraveyardProps) {
  const [ideas, setIdeas] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraveyardDetails() {
      setLoading(true);
      setErrorText(null);
      try {
        const resp = await getGraveyard();
        setIdeas(resp.ideas || []);
      } catch (err) {
        setErrorText('Failed to pull compilation detail coordinates of killed ideas.');
      } finally {
        setLoading(false);
      }
    }
    fetchGraveyardDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">RETRIEVING KILLED PROFILE REGISTRIES...</span>
      </div>
    );
  }

  return (
    <div className="text-vanilla-cream font-aeonikpro max-w-4xl mx-auto selection:bg-goldenrod-orange selection:text-midnight-ink animate-fade-in animate-duration-300">
      
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold uppercase text-white tracking-tight flex items-center gap-2">
            <Skull className="w-6 h-6 text-red-500" />
            The Graveyard
          </h1>
          <p className="text-xs text-white/40 mt-1">
            An archive of validated concepts you consciously chose to retire. No wasted effort — only lessons preserved.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors"
        >
          Validate new idea
        </button>
      </div>

      {errorText && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-105 mb-6 max-w-md">
          {errorText}
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="text-center py-24 bg-[#0a0304]/40 border border-red-500/5 rounded-2xl flex flex-col items-center justify-center p-8">
          <Skull className="w-12 h-12 text-red-500/15 mb-4 animate-pulse" />
          <h3 className="text-sm font-semibold text-white mb-2">The Graveyard is currently empty</h3>
          <p className="text-xs text-white/40 max-w-sm mb-6 text-center leading-relaxed">
            All your validated ideas are currently thriving! Ideas only appear here when you change their workspace stage to "Killed" inside active note details.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => onSelectIdea(idea.id)}
              className="bg-[#0b0304] border border-red-500/10 hover:border-red-500/25 p-6 rounded-2xl group cursor-pointer flex flex-col justify-between h-48 hover:scale-101 transition-all relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-4 p-2 bg-red-500/5 text-red-500 rounded-b-xl border-x border-b border-red-500/10">
                <Skull className="w-3.5 h-3.5" />
              </div>

              <div>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-2">
                  CONSCIOUSLY RETIRED
                </span>
                
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors uppercase truncate">
                  {idea.title}
                </h3>

                <p className="text-[11px] text-white/40 line-clamp-2 mt-2 leading-relaxed italic">
                  "Killed to save capital. Target users reported unviable levels of pricing resistance compared to broad agency solution suites."
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4">
                <span className="text-[10px] text-white/30 font-mono uppercase font-bold">
                  Killed &bull; {new Date(idea.created_at).toLocaleDateString()}
                </span>
                
                <span className="text-[10px] text-red-400 font-bold group-hover:translate-x-1 duration-255 transition-transform flex items-center gap-1">
                  View Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
