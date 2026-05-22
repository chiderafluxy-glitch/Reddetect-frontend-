/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getReports, getWorkspaces } from '../api';
import { 
  Compass, 
  Home, 
  Search, 
  FileText, 
  Briefcase, 
  Archive, 
  Skull, 
  Settings, 
  LogOut,
  FolderOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export default function Sidebar({ currentPage, onNavigate, onSignOut }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; type: 'report' | 'workspace' }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load items to allow searching
  useEffect(() => {
    async function loadSearchData() {
      try {
        const re = await getReports();
        const ws = await getWorkspaces();
        setReports(re.reports || []);
        setWorkspaces(ws.workspaces || []);
      } catch (err) {
        console.warn('Failed to pre-fetch search structures on sidebar', err);
      }
    }
    loadSearchData();
  }, [currentPage]);

  // Execute search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    
    const matchedReports = reports
      .filter(r => r.title.toLowerCase().includes(query))
      .map(r => ({ id: r.id, title: r.title, type: 'report' as const }));

    const matchedWorkspaces = workspaces
      .filter(w => w.title.toLowerCase().includes(query))
      .map(w => ({ id: w.id, title: w.title, type: 'workspace' as const }));

    // Merge and limit results
    setSearchResults([...matchedReports, ...matchedWorkspaces].slice(0, 5));
    setShowDropdown(true);
  }, [searchQuery, reports, workspaces]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'MAIN' },
    { id: 'reports', label: 'My Reports', icon: FileText, section: 'MAIN' },
    { id: 'workspaces', label: 'Workspaces', icon: Briefcase, section: 'MAIN' },
    { id: 'vault', label: 'Idea Vault', icon: Archive, section: 'TOOLS' },
    { id: 'graveyard', label: 'Graveyard', icon: Skull, section: 'TOOLS' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'ACCOUNT' }
  ];

  const handleResultClick = (id: string, type: 'report' | 'workspace') => {
    setSearchQuery('');
    setShowDropdown(false);
    if (type === 'report') {
      onNavigate(`report/${id}`);
    } else {
      onNavigate(`workspace/${id}`);
    }
  };

  const isCurrentActive = (id: string) => {
    if (id === 'dashboard') return currentPage === 'dashboard';
    if (id === 'reports') return currentPage === 'reports' || currentPage.startsWith('report/');
    if (id === 'workspaces') return currentPage === 'workspaces' || currentPage.startsWith('workspace/');
    return currentPage === id;
  };

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#001011] flex flex-col justify-between h-screen sticky top-0 left-0 text-vanilla-cream py-6 flex-shrink-0 z-40 selection:bg-goldenrod-orange selection:text-midnight-ink">
      
      {/* Upper Navigation Sections */}
      <div className="flex flex-col gap-6 px-4">
        {/* LOGO AREA */}
        <div className="flex items-center pl-2">
          <span className="font-dotconnect text-xl font-semibold tracking-tight text-white select-none">
            Reddetect
          </span>
        </div>

        {/* SEARCH BAR AREA WITH DROP-DOWN RESULTS */}
        <div className="relative">
          <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white/70 hover:border-white/20 focus-within:border-goldenrod-orange transition-all">
            <Search className="w-4 h-4 text-white/30 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search reports/ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              className="bg-transparent border-0 text-xs w-full focus:outline-none focus:ring-0 placeholder:text-white/25 text-white"
            />
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-[#081516] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1">
              <span className="text-[9px] text-white/30 font-semibold uppercase tracking-wider pl-2 pb-1 block border-b border-white/5">
                MATCHING CONCEPTS
              </span>
              {searchResults.map((res) => (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => handleResultClick(res.id, res.type)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <span className="text-[11px] font-medium text-white block group-hover:text-goldenrod-orange transition-colors truncate">
                      {res.title}
                    </span>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest block font-medium">
                      {res.type === 'report' ? 'Report Log' : 'Workspace'}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-goldenrod-orange group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex flex-col gap-6">
          {['MAIN', 'TOOLS', 'ACCOUNT'].map((sect) => (
            <div key={sect} className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest pl-2 mb-1 block select-none">
                {sect}
              </span>
              {navItems
                .filter(item => item.section === sect)
                .map((item) => {
                  const Icon = item.icon;
                  const active = isCurrentActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
                        active 
                          ? 'bg-goldenrod-orange/10 border-l-2 border-goldenrod-orange text-white font-medium' 
                          : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-goldenrod-orange' : 'text-white/40 group-hover:text-white/80'}`} />
                        <span className="text-xs truncate">{item.label}</span>
                      </div>
                      
                      {active && (
                        <div className="w-1.5 h-1.5 bg-goldenrod-orange rounded-full" />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area with Signout Action */}
      <div className="px-4">
        <div className="border-t border-white/5 my-4" />
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-red-500/10 transition-colors group cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-white/30 group-hover:text-red-500 transition-colors flex-shrink-0" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
