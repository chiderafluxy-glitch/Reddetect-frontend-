/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';
import AuthPages from './components/AuthPages';
import Sidebar from './components/Sidebar';
import PromptBox from './components/PromptBox';
import ReportView from './components/ReportView';
import ReportsList from './components/ReportsList';
import WorkspacesList from './components/WorkspacesList';
import WorkspaceDetail from './components/WorkspaceDetail';
import IdeaVault from './components/IdeaVault';
import Graveyard from './components/Graveyard';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { getWorkflowState, setApiMode, getApiMode, supabase, syncUser } from './api';
import { User, WorkflowState } from './types';
import { Sparkles, Terminal, AlertTriangle, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>({ has_signed_up: false, has_paid: false });
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuth = async (session: any) => {
      if (!session?.access_token) {
        setCurrentPage('landing');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        await fetch(`${apiUrl}/api/auth/sync-user`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        const stateRes = await fetch(`${apiUrl}/api/auth/workflow-state`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const stateData = await stateRes.json();
        if (stateData.state?.has_paid) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('pricing');
        }
      } catch (e) {
        setCurrentPage('landing');
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleAuth(session);
        }
        if (event === 'SIGNED_OUT') {
          setCurrentPage('landing');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const checkPaid = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const apiUrl = import.meta.env.VITE_API_URL;
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const res = await fetch(`${apiUrl}/api/auth/workflow-state`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          });
          const data = await res.json();
          if (data.state?.has_paid) {
            clearInterval(interval);
            window.history.replaceState({}, '', '/');
            setCurrentPage('dashboard');
          }
          if (attempts >= 10) clearInterval(interval);
        }, 2000);
      };
      checkPaid();
    }
  }, []);

const handleSupabaseSession = async (session: any) => {
  const user: User = {
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
  };
  
  setUser(user);
  
  try {
    // Step 1 - Call POST /api/auth/sync-user
    await syncUser(user.email, user.full_name || '');
    
    // Step 2 - Call GET /api/auth/workflow-state
    const stateResponse = await getWorkflowState();
    setWorkflowState(stateResponse.state);
    
    // Step 3 - Read response and redirect
    if (!stateResponse.state.has_paid) {
      // If has_paid is false → /pricing
      setCurrentPage('pricing');
    } else {
      // If has_paid is true → /dashboard
      setCurrentPage('dashboard');
    }
  } catch (e) {
    console.warn('Session handling error:', e);
    // On error, default to pricing
    setCurrentPage('pricing');
  }
};

  const verifyStateAndRedirect = async (activeUser: User) => {
    try {
      const stateResponse = await getWorkflowState();
      setWorkflowState(stateResponse.state);
      
      // Determine correct landing redirect based on instructions
      if (!stateResponse.state.has_signed_up) {
        setCurrentPage('signup');
      } else if (!stateResponse.state.has_paid) {
        setCurrentPage('pricing');
      } else {
        // Both validations verified! Head directly into dashboard command center
        setCurrentPage('dashboard');
      }
    } catch (e) {
      console.warn('Redirect verification issue, defaulting to sandbox dashboard', e);
      setCurrentPage('dashboard');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
    // Write session
    localStorage.setItem('reddetect_current_user', JSON.stringify(newUser));
    verifyStateAndRedirect(newUser);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('reddetect_current_user');
    localStorage.removeItem('reddetect_use_live');
    handleNavigate('landing');
  };

  const handleSelectPlan = (planId: string) => {
    // Set mock user if choosing plan instantly from landing to ensure a smooth flow
    if (!user) {
      const mockUser: User = { id: 'guest_creator_123', email: 'creator.test@google.com', full_name: 'Guest Maker' };
      setUser(mockUser);
      localStorage.setItem('reddetect_current_user', JSON.stringify(mockUser));
    }
    handleNavigate('pricing');
  };

  const handlePaymentCompleted = () => {
    setWorkflowState({ has_signed_up: true, has_paid: true });
    handleNavigate('dashboard');
    setSystemAlert('Subscription successfully verified. Scrappers activated!');
    setTimeout(() => setSystemAlert(null), 5000);
  };

  const renderProtectedView = () => {
    // Show loading spinner while auth is processing
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-goldenrod-orange animate-spin" />
          <p className="text-vanilla-cream text-lg">Loading...</p>
        </div>
      );
    }

    try {
    if (currentPage === 'dashboard') {
      return (
        <div className="flex flex-col gap-10 py-8">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-2 font-dotconnect">
              Welcome, <span className="text-goldenrod-orange">{user?.full_name || 'Innovate'}.</span>
            </h1>
            <p className="text-xs text-white/50 max-w-lg leading-relaxed">
              Analyze commercial intent, competitor radar charts, pain points, and user pricing compliance dynamically.
            </p>
          </div>

          <PromptBox 
            onReportCompleted={(repId) => handleNavigate(`report/${repId}`)} 
            onSeeExample={() => handleNavigate('report/seed_rep_1')}
            onNavigateToPricing={() => handleNavigate('pricing')}
          />
        </div>
      );
    }

    if (currentPage === 'reports') {
      return (
        <ReportsList 
          onSelectReport={(id) => handleNavigate(`report/${id}`)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPage === 'workspaces') {
      return (
        <WorkspacesList 
          onSelectWorkspace={(id) => handleNavigate(`workspace/${id}`)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPage === 'vault') {
      return (
        <IdeaVault 
          onSelectIdea={(id) => handleNavigate(`workspace/${id}`)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPage === 'graveyard') {
      return (
        <Graveyard 
          onSelectIdea={(id) => handleNavigate(`workspace/${id}`)}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPage === 'settings') {
      return (
        <Settings 
          currentEmail={user?.email} 
          fullName={user?.full_name} 
          onPlanChanged={() => verifyStateAndRedirect(user!)} 
        />
      );
    }

    if (currentPage.startsWith('report/')) {
      const repId = currentPage.split('/')[1];
      return (
        <ReportView 
          reportId={repId} 
          onBackToDashboard={() => handleNavigate('reports')} 
          onNavigate={handleNavigate} 
        />
      );
    }

    if (currentPage.startsWith('workspace/')) {
      const wsId = currentPage.split('/')[1];
      return (
        <WorkspaceDetail 
          id={wsId} 
          onNavigate={handleNavigate} 
          onBackToWorkspaces={() => handleNavigate('workspaces')} 
        />
      );
    }

    return (
      <div className="py-20 text-center text-xs text-white/40 italic">
        Route "{currentPage}" not configured or is missing properties.
      </div>
    );
    } catch (err) {
      console.error('Dashboard render error:', err);
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-goldenrod-orange animate-spin" />
          <p className="text-vanilla-cream text-lg">Something went wrong. Please refresh.</p>
        </div>
      );
    }
  };

  // 1. PUBLIC LANDING PAGE
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={handleNavigate} onSelectPlan={handleSelectPlan} />;
  }

  // 2. AUTHENTICATION PAGES
  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <AuthPages 
        type={currentPage === 'signup' ? 'signup' : 'login'} 
        onNavigate={handleNavigate} 
        onAuthComplete={handleAuthComplete} 
      />
    );
  }

  // 3. PRICING GATE COMPONENT
  if (currentPage === 'pricing') {
    return (
      <Pricing 
        onBackToLanding={() => handleNavigate('landing')} 
        onPaymentSuccess={handlePaymentCompleted}
        currentEmail={user?.email}
      />
    );
  }

  // 4. PRIVATE APP SHELL WITH SIDEBAR (Protected Pages Layout)
  return (
    <ProtectedRoute onNavigate={handleNavigate}>
    <div className="min-h-screen bg-midnight-ink text-vanilla-cream font-aeonikpro flex flex-row relative overflow-x-hidden">
      
      {/* Absolute Header Ambient Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-goldenrod-orange via-accent-blue to-goldenrod-orange/20 z-50 pointer-events-none" />

      {/* Persistent Navigation left sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onSignOut={handleSignOut} 
      />

      {/* Main viewport framing area */}
      <div className="flex-grow flex flex-col min-h-screen relative">
        
        {/* Top telemetry status bar */}
        <header className="border-b border-white/[0.08] px-8 py-3.5 flex items-center justify-end bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-goldenrod-orange/25 border border-goldenrod-orange/50 flex items-center justify-center text-[10px] font-bold text-goldenrod-orange uppercase">
              {user?.full_name?.slice(0, 1) || 'I'}
            </div>
          </div>
        </header>

        {/* Floating live success notifications toast */}
        {systemAlert && (
          <div className="absolute top-16 right-8 z-50 bg-[#0c1c1e] border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center gap-3 shadow-2xl animate-fade-in text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-goldenrod-orange animate-bounce" />
            <span>{systemAlert}</span>
          </div>
        )}

        {/* Content View Framing with comfortable layouts */}
        <main className="flex-grow px-6 md:px-10 py-10 max-w-5xl w-full mx-auto relative overflow-y-auto">
          {renderProtectedView()}
        </main>
      </div>

    </div>
    </ProtectedRoute>
  );
}
