/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getVault, updateVaultIdea, deleteVaultIdea } from '../api';
import { Archive, Loader2, ArrowRight, Compass, Target, BadgeCheck, Skull, Pin, Trash2 } from 'lucide-react';

interface IdeaVaultProps {
  onSelectIdea: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function IdeaVault({ onSelectIdea, onNavigate }: IdeaVaultProps) {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'exploring' | 'validating' | 'validated' | 'killed'>('all');

  useEffect(() => {
    async function fetchVaultDetails() {
      setLoading(true);
      setErrorText(null);
      try {
        const resp = await getVault(activeTab === 'all' ? undefined : activeTab);
        setIdeas(resp.ideas || []);
      } catch (err) {
        setErrorText('Failed to pull idea profiles from central vault.');
      } finally {
        setLoading(false);
      }
    }
    fetchVaultDetails();
  }, [activeTab]);

  const togglePin = async (e: React.MouseEvent, id: string, currentlyPinned: boolean) => {
    e.stopPropagation();
    try {
      const resp = await updateVaultIdea(id, { pinned: !currentlyPinned });
      // Reload matching list details representation
      setIdeas(prev => 
        prev.map(idea => idea.id === id ? { ...idea, pinned: !currentlyPinned } : idea)
      );
    } catch (e) {
      console.error('Pin idea update issue', e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Discard this idea from your persistent Vault? All notes will be discarded.')) return;
    try {
      const resp = await deleteVaultIdea(id);
      if (resp.success) {
        setIdeas(prev => prev.filter(idea => idea.id !== id));
      }
    } catch (e) {
      console.error('Delete idea issue', e);
    }
  };

  const tabs = [
    { value: 'all', label: 'All Ideas' },
    { value: 'exploring', label: 'Exploring' },
    { value: 'validating', label: 'Validating' },
    { value: 'validated', label: 'Validated' },
    { value: 'killed', label: 'Killed' }
  ] as const;

  const bStyles = {
    exploring: { tag: 'Exploring', cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500', icon: Compass },
    validating: { tag: 'Validating', cls: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue', icon: Target },
    validated: { tag: 'Validated', cls: 'bg-green-400/10 border-green-400/20 text-green-400', icon: BadgeCheck },
    killed: { tag: 'Killed', cls: 'bg-red-400/10 border-red-400/20 text-red-500', icon: Skull }
  } as const;

  if (loading && ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">LOADING IDEA VAULT INDEXING...</span>
      </div>
    );
  }

  return (
    <div className="text-vanilla-cream font-aeonikpro max-w-4xl mx-auto selection:bg-goldenrod-orange selection:text-midnight-ink animate-fade-in animate-duration-300">
      
      {/* Title */}
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <h1 className="text-2xl font-semibold uppercase text-white tracking-tight">
          Idea Vault
        </h1>
        <p className="text-xs text-white/40 mt-1">
          Save, pin, and categorize every product validation. Track ideas chronologically to discover high-value trends.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-1 bg-black/35 p-1 rounded-xl mb-8 border border-white/5 max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === tab.value 
                ? 'bg-goldenrod-orange text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {errorText && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-100 mb-6 max-w-md">
          {errorText}
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col items-center justify-center p-8">
          <Archive className="w-10 h-10 text-white/10 mb-4 animate-bounce" />
          <h3 className="text-sm font-semibold text-white mb-1">Vault quadrant is empty</h3>
          <p className="text-xs text-white/40 max-w-xs mb-6 text-center leading-relaxed">
            No ideas match the "{activeTab}" filter. Complete validations or modify stages inside workspace details to populate this quadrant.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {ideas.map((idea) => {
            const phase = (idea.stage || 'exploring') as keyof typeof bStyles;
            const config = bStyles[phase] || bStyles.exploring;
            const Icon = config.icon;
            const isPinned = !!idea.pinned;

            return (
              <div
                key={idea.id}
                onClick={() => onSelectIdea(idea.id)}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:border-white/20 p-6 rounded-2xl group cursor-pointer flex flex-col justify-between h-48 hover:scale-101 transition-all relative overflow-hidden hover:bg-white/[0.05]"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border flex items-center gap-1 ${config.cls}`}>
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      {config.tag}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => togglePin(e, idea.id, isPinned)}
                        className={`p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer ${isPinned ? 'text-goldenrod-orange' : 'text-white/20 hover:text-white/50'}`}
                        title={isPinned ? 'Unpin idea' : 'Pin idea to top'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, idea.id)}
                        className="text-white/20 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-goldenrod-orange transition-colors uppercase truncate">
                    {idea.title}
                  </h3>
                  
                  <p className="text-[10px] text-white/40 font-mono mt-2 uppercase">
                    ADDED &bull; {new Date(idea.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                    Idea Portal
                  </span>
                  <span className="text-[10px] text-accent-blue font-bold group-hover:translate-x-1 duration-255 transition-transform flex items-center gap-1">
                    Manage Notes
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
