/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getWorkspace, updateWorkspace, addWorkspaceNote, deleteWorkspaceNote } from '../api';
import { Workspace, Note } from '../types';
import { 
  ArrowLeft, 
  Loader2, 
  Trash2, 
  Plus, 
  Compass, 
  Sparkles, 
  FileText, 
  Target, 
  BadgeCheck, 
  Skull,
  FileCheck
} from 'lucide-react';

interface WorkspaceDetailProps {
  id: string;
  onNavigate: (page: string) => void;
  onBackToWorkspaces: () => void;
}

export default function WorkspaceDetail({ id, onNavigate, onBackToWorkspaces }: WorkspaceDetailProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspaceData() {
      setLoading(true);
      setErrorText(null);
      try {
        const resp = await getWorkspace(id);
        setWorkspace(resp.workspace);
        setNotes(resp.notes);
      } catch (e) {
        setErrorText('Failed to pull workspace details from backend.');
      } finally {
        setLoading(false);
      }
    }
    loadWorkspaceData();
  }, [id]);

  const handleStageChange = async (newStage: 'exploring' | 'validating' | 'validated' | 'killed') => {
    if (!workspace) return;
    try {
      const resp = await updateWorkspace(id, { stage: newStage });
      setWorkspace(resp.workspace);
    } catch (e) {
      console.error('Failed to change stage', e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const resp = await addWorkspaceNote(id, newNoteText);
      setNotes(prev => [resp.note, ...prev]);
      setNewNoteText('');
    } catch (e) {
      console.error('Failed to save note', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const ok = await deleteWorkspaceNote(id, noteId);
      if (ok.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
      }
    } catch (e) {
      console.error('Failed to delete note', e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-vanilla-cream">
        <Loader2 className="w-8 h-8 animate-spin text-goldenrod-orange mb-4" />
        <span className="text-xs text-white/50 animate-pulse font-mono">LOADING ACTIVE WORKSPACE NOTES...</span>
      </div>
    );
  }

  if (errorText || !workspace) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-xl mx-auto my-12 text-center flex flex-col items-center gap-4">
        <Skull className="w-8 h-8 text-red-500" />
        <span className="text-sm font-semibold text-white">Workspace Missing</span>
        <p className="text-xs text-red-100">{errorText || 'This workspace index does not exist in local records.'}</p>
        <button 
          onClick={onBackToWorkspaces}
          className="bg-white/10 hover:bg-white/15 px-5 py-2 rounded-full text-xs text-white cursor-pointer"
        >
          Workplaces List
        </button>
      </div>
    );
  }

  const stages = [
    { value: 'exploring', label: 'Exploring', icon: Compass, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
    { value: 'validating', label: 'Validating', icon: Target, color: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20' },
    { value: 'validated', label: 'Validated', icon: BadgeCheck, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
    { value: 'killed', label: 'Killed', icon: Skull, color: 'text-red-400 bg-red-400/10 border-red-400/20' }
  ] as const;

  return (
    <div className="max-w-3xl mx-auto text-vanilla-cream font-aeonikpro selection:bg-goldenrod-orange selection:text-midnight-ink">
      
      {/* Upper links */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-8">
        <div>
          <button 
            onClick={onBackToWorkspaces}
            className="group flex items-center gap-1.5 text-xs text-white/40 hover:text-white cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Saved Workspaces
          </button>
          
          <h1 className="text-2xl font-semibold uppercase text-white tracking-tight truncate leading-tight">
            {workspace.title}
          </h1>
          
          <p className="text-[10px] text-white/30 font-semibold uppercase font-mono mt-1">
            CREATOR WORKSPACE &bull; {new Date(workspace.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* VIEW FULL REPORT ANCHOR */}
        <button
          onClick={() => onNavigate(`report/${workspace.id}`)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-goldenrod-orange px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <FileCheck className="w-3.5 h-3.5" />
          View full report &rarr;
        </button>
      </div>

      {/* STAGE SELECTOR CONTROL */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl p-6 mb-8">
        <span className="text-[10px] text-goldenrod-orange font-bold uppercase tracking-widest block mb-4">
          MARKET STAGE COORDINATOR
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isSelected = workspace.stage === stg.value;
            return (
              <button
                key={stg.value}
                onClick={() => handleStageChange(stg.value)}
                className={`py-3.5 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected 
                    ? `${stg.color} ring-1 ring-goldenrod-orange font-semibold scale-102` 
                    : 'bg-black/10 border-white/5 text-white/30 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? '' : 'opacity-45'}`} />
                <span className="text-[11px] uppercase tracking-wider">{stg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTES MANAGER SUITE */}
      <div className="bg-[#021112] border border-white/[0.06] rounded-2xl p-6">
        <span className="text-[10px] text-accent-blue font-bold uppercase tracking-widest block mb-4">
          WORK WORKSPACE MEMOS & IDEATION LOGS
        </span>

        {/* Note input form */}
        <form onSubmit={handleAddNote} className="mb-8 flex flex-col gap-3">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add a progress log, research finding, or next steps checklist memo..."
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 w-full h-20 focus:outline-none focus:border-goldenrod-orange resize-none leading-relaxed"
          />
          <button
            type="submit"
            disabled={submitting || !newNoteText.trim()}
            className="self-end bg-accent-blue hover:bg-blue-600 disabled:opacity-40 text-white font-semibold text-xs px-5 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Save Note
          </button>
        </form>

        {/* Note listings list */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-xs italic">
              No custom memos recorded. Log project pivots, design tasks, or custom targets here.
            </div>
          ) : (
            notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-black/20 border border-white/5 p-4 rounded-xl flex justify-between items-start gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex-grow min-w-0">
                  <p className="text-xs text-white/90 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <span className="text-[9px] text-white/30 mt-2 block font-medium uppercase tracking-wider font-mono">
                    บันทึกเมื่อ &bull; {new Date(note.created_at).toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-white/30 hover:text-red-400 p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
