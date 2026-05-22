/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getWorkspaces, deleteWorkspace } from '../api';
import { Briefcase, Loader2, ArrowRight, Compass, Target, BadgeCheck, Skull, Trash2 } from 'lucide-react';

interface WorkspacesListProps {
  onSelectWorkspace: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function WorkspacesList({ onSelectWorkspace, onNavigate }: WorkspacesListProps) {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspaces() {
      setLoading(true);
      setErrorText(null);
      try {
        const resp = await getWorkspaces();
        setWorkspaces(resp.workspaces || []);
      } catch (e) {
        setErrorText('Failed to sync active workspaces list.');
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspaces();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you certain you want to permanently empty this workspace and discard all saved memos?')) return;
    try {
      const resp = await deleteWorkspace(id);
      if (resp.success) {
        setWorkspaces(prev => prev.filter(w => w.id !== id));
      }
    } catch (e) {
      console.error('Delete workspace issue', e);
    }
  };

  const stageBadges = {
    exploring: { tag: 'Exploring', cls: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500', icon: Compass },
    validating: { tag: 'Validating', cls: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue', icon: Target },
    validated: { tag: 'Validated', cls: 'bg-green-400/10 border-green-400/20 text-green-400', icon: BadgeCheck },
    killed: { tag: 'Killed', cls: 'bg-red-400/10 border-red-400/20 text-red-400', icon: Skull }
  } as const;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">RETRIEVING ACTIVE WORSPACE REGISTRIES...</span>
      </div>
    );
  }

  return (
    <div className="text-vanilla-cream font-aeonikpro max-w-4xl mx-auto selection:bg-goldenrod-orange selection:text-midnight-ink animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/[0.08] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold uppercase text-white tracking-tight">
            Idea Workspaces
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Build and iterate on report formulations. Log custom updates, pivots, or code blueprints as you validate.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="bg-goldenrod-orange hover:bg-orange-600 px-5 py-2.5 rounded-full text-xs text-white font-semibold cursor-pointer transition-colors"
        >
          Research new idea
        </button>
      </div>

      {errorText && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-100 mb-8 max-w-md">
          {errorText}
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col items-center justify-center p-8">
          <Briefcase className="w-10 h-10 text-white/10 mb-4 animate-bounce" />
          <h3 className="text-sm font-semibold text-white mb-1">Your ideation hub is empty</h3>
          <p className="text-xs text-white/40 max-w-xs mb-6 leading-relaxed">
            Workspaces are automatically provisioned the moment you initiate a comprehensive validation scan.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs bg-white text-midnight-ink font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-vanilla-cream"
          >
            Deploy first agent
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {workspaces.map((work) => {
            const stage = (work.stage || 'exploring') as keyof typeof stageBadges;
            const bConfig = stageBadges[stage] || stageBadges.exploring;
            const bIcon = bConfig.icon;
            
            return (
              <div
                key={work.id}
                onClick={() => onSelectWorkspace(work.id)}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:border-white/20 p-6 rounded-2xl group cursor-pointer flex flex-col justify-between h-44 hover:scale-101 transition-all relative overflow-hidden hover:bg-white/[0.05]"
              >
                {/* Discrete visual background lines */}
                <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-goldenrod-orange/20 to-transparent" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border flex items-center gap-1 ${bConfig.cls}`}>
                      {stageBadges[stage] ? stageBadges[stage].tag : 'Exploring'}
                    </span>

                    <button
                      onClick={(e) => handleDelete(e, work.id)}
                      className="text-white/20 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      title="Delete space"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-goldenrod-orange transition-colors truncate uppercase">
                    {work.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4">
                  <span className="text-[10px] text-white/35 font-medium uppercase font-mono">
                    Workspace Log
                  </span>
                  <span className="text-[10px] text-accent-blue font-bold group-hover:translate-x-1 duration-255 transition-transform flex items-center gap-1">
                    Open Channel
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
