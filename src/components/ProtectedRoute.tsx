/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { getWorkflowState, supabase } from '../api';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

// Public pages that don't require authentication
const PUBLIC_PAGES = ['landing', 'login', 'signup', 'pricing'];

export default function ProtectedRoute({ children, onNavigate }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // No session at all - redirect to login
          setRedirectTarget('login');
          setIsLoading(false);
          return;
        }

        // User exists - verify workflow state
        const stateResponse = await getWorkflowState();
        
        if (!stateResponse.state.has_paid) {
          // User hasn't paid - redirect to pricing
          setRedirectTarget('pricing');
        } else {
          // User has paid - allow through (stay on current page)
          setRedirectTarget(null);
        }
      } catch (e) {
        console.warn('ProtectedRoute check failed:', e);
        // On error, redirect to login for safety
        setRedirectTarget('login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Perform redirect if needed
  useEffect(() => {
    if (redirectTarget && PUBLIC_PAGES.includes(redirectTarget)) {
      onNavigate(redirectTarget);
    }
  }, [redirectTarget, onNavigate]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-goldenrod-orange animate-spin" />
          <p className="text-vanilla-cream text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If redirecting, show minimal loading state
  if (redirectTarget) {
    return (
      <div className="min-h-screen bg-midnight-ink flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-goldenrod-orange animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}