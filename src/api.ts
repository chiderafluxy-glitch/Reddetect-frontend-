/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Report, ReportData, Workspace, Note, GeneratedPosts, WorkflowState, SubscriptionInfo, User, Verdict } from './types';

const metaEnv = (import.meta as any).env || {};

// Read API base URL from Vite environment variables
const API_URL = metaEnv.VITE_API_URL || '';

// Initialize Supabase - always use real values from environment
const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Always use live mode - never fall back to sandbox
export function getApiMode(): 'live' | 'sandbox' {
  return 'live';
}

export function setApiMode(mode: 'live' | 'sandbox') {
  // No-op: always stays in live mode
  console.log('ApiMode is always live - sandbox mode is disabled');
}

// Helper to get supabase access token
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { 'Authorization': `Bearer ${session.access_token}` };
    }
    // Try refresh
    const { data: refreshData } = await supabase.auth.refreshSession();
    if (refreshData?.session?.access_token) {
      return { 'Authorization': `Bearer ${refreshData.session.access_token}` };
    }
  } catch (e) {
    console.warn('Auth header failed:', e);
  }
  return {};
}

// SANDBOX STORAGE INITIALIZERS
function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Dynamic procedural generator for sandbox reports to provide stunning realism!
function generateMockReportData(query: string, answers: Record<string, string> = {}): ReportData {
  const q = query.toLowerCase();
  
  // Pick a verdict based on description
  let verdict: 'strong_signal' | 'weak_signal' | 'mixed' = 'strong_signal';
  let score = 84;
  let competition: 'low' | 'medium' | 'high' = 'low';
  
  if (q.includes('uber') || q.includes('social network') || q.includes('facebook') || q.includes('crypto coin')) {
    verdict = 'weak_signal';
    score = 28;
    competition = 'high';
  } else if (q.includes('ai') || q.includes('saas') || q.includes('gpt')) {
    verdict = 'mixed';
    score = 59;
    competition = 'medium';
  }

  // Extract primary nouns
  const topic = query.replace(/i want to build|a tool for|a website for|how to/gi, '').trim() || 'Freelance Hub';
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  const targetUser = answers['0'] || 'busy creators and freelancers';

  const subreddits = [
    { name: `r/${topic.replace(/\s+/g, '').slice(0, 10) || 'saas'}`, relevance: 'Primary discussion arena', url: '#' },
    { name: 'r/SideProject', relevance: 'Where beta builders present launch versions', url: '#' },
    { name: 'r/solopreneur', relevance: 'Feedback on pricing structures and operational workflows', url: '#' }
  ];

  return {
    verdict,
    verdict_summary: `Research into "${topic}" shows a ${verdict === 'strong_signal' ? 'high concentration of organic pain points' : verdict === 'mixed' ? 'mixed validation signal with substantial competition' : 'low levels of willingness to pay and high clutter in existing ecosystems'}. Users in subreddits report that current workflows are highly disjointed, particularly regarding ${answers['1'] || 'manual synchronization, communication fatigue, and unexpected fee spikes'}. The data suggests a direct lane for an integrated, lightweight solution.`,
    demand_score: score,
    competition_level: competition,
    key_insights: [
      {
        insight: `High frustration with existing enterprise tools because of ${answers['1'] || 'complexity and overcharging'}`,
        evidence: "Users are actively searching for simpler single-purpose alternatives stating they pay for features they never touch.",
        source_url: "https://reddit.com"
      },
      {
        insight: `Willingness to buy is tied directly to ${answers['2'] || 'time savings and client professionalism'}`,
        evidence: "Forums show 14 distinct threads in the last 30 days of creators switching to manual spreadsheets to preserve modularity.",
        source_url: "https://reddit.com"
      },
      {
        insight: "Disproportionate search volume around integration bottlenecks",
        evidence: "Search console indicators highlight an 84% year-over-year surge in micro-connection utilities query volumes.",
        source_url: "https://reddit.com"
      }
    ],
    top_quotes: [
      {
        quote: `Honestly, I checked every tool out there and they all force you into their rigid suite. I just want a simple utility that solves ${answers['1'] || 'late payments and bad tracking'} without charging $50/mo.`,
        subreddit: "r/freelance",
        upvotes: 142,
        url: "#"
      },
      {
        quote: "Is anyone else drowning in notification tabs? Why can't we just have local, fast dashboards that sync on demand?",
        subreddit: "r/SideProject",
        upvotes: 89,
        url: "#"
      },
      {
        quote: `I would pay real money tomorrow if a tool could automate ${answers['1'] || 'my client update cycles'} and look incredibly clean.`,
        subreddit: "r/solopreneur",
        upvotes: 65,
        url: "#"
      }
    ],
    subreddits,
    audience: {
      who_they_are: targetUser,
      pain_points: [
        answers['1'] || "Disorganized tracking spreadsheets causing missed deadlines and client drop-offs.",
        "Struggling to manage dozens of disparate communication threads concurrently.",
        "Excessive SaaS subscription fees eating directly into small business margins."
      ],
      language_they_use: [
        "clunky UI",
        "over-engineered workflow",
        "getting hit with hidden fees",
        "just want a simple board that works"
      ],
      where_they_hang_out: [
        "/r/freelance",
        "/r/solopreneur",
        "Indie Hackers community forums",
        "Twitter buildinpublic tag circles"
      ]
    },
    competitors: [
      {
        name: "LegacyCorp Inc.",
        url: "#",
        what_people_say: "Extremely robust but too expensive, slow, and demands weeks of team training.",
        gaps: [
          "No clean personal dashboard view",
          "Charges per user seat making freelancer client sharing unaffordable",
          "Slow web frame loading times"
        ]
      },
      {
        name: "BasicTracker",
        url: "#",
        what_people_say: "Free and easy, but completely lacks any workflow automations.",
        gaps: [
          "Zero integration points",
          "Manual csv operations required for any data updates"
        ]
      }
    ],
    market_gaps: [
      "A fast, single-focused connector that bypasses complex dashboard set-ups",
      "Pay-per-usage pricing models instead of rigid $29+/month seats",
      "Client-facing clean summaries that require zero sign-in for the client"
    ],
    willingness_to_pay: {
      score: verdict === 'strong_signal' ? 88 : verdict === 'mixed' ? 62 : 35,
      evidence: "A high degree of commercial intent is flagged. Users actively compare budget allocations for administrative solutions, stating $15-$25/mo is their comfort threshold for premium automation tools.",
      price_signals: [
        "Mentioned paying $30/mo for a partial workaround in r/solopreneur",
        "Complained that enterprise plans starting at $89/mo are the only way to get PDF outputs",
        "Expressed preference to purchase a lifetime micro-license"
      ]
    },
    opportunity_map: {
      crowded_areas: ["Full suite CRM platforms", "Generic project tracking boards", "Manual spreadsheet templates"],
      underserved_areas: ["Niche single-operator automations", "Branded client progress portals", "No-code ledger connectors"],
      best_opportunity: `Create a highly streamlined, modular utility focused strictly on solving ${answers['1'] || 'payment and client sync'} specifically engineered for ${targetUser}.`
    },
    mvp_suggestion: {
      core_feature: `Interactive automated ${topicCap} board with secure tokenless sharing`,
      target_user: targetUser,
      why: "This directly alleviates the principal communication bottleneck with minimum frontend overhead, allowing immediate market entry."
    },
    kill_switch: {
      risks: [
        "High user acquisition cost if trying to compete on broad search keywords",
        "Platform dependency if completely built on top of a single database vendor",
        "Initial churning due to lack of extensive historical data legacy integrations"
      ],
      existing_solutions: [
        "Traditional project boards customized heavily manually with scripts",
        "White-glove expensive digital agencies solving this individually"
      ],
      why_it_might_fail: "If you try to overcomplicate the product early and build a full marketplace, you will run out of capital before reaching critical retention metrics. Move extremely thin."
    },
    market_size: {
      estimate: "Estimated 250,000+ active micro-businesses searching for modern automation",
      reasoning: "Aggregating community subscriptions across Twitter, Substack builders, and independent contractor networks internationally.",
      conversation_volume: verdict === 'strong_signal' ? 'very_high' : verdict === 'mixed' ? 'medium' : 'low'
    },
    pricing_intelligence: {
      what_people_pay_now: ["$12/mo for basic templates", "$45/mo for clunky legacy platforms"],
      complaints_about_pricing: ["Prohibitive pricing tiers for adding external read-only clients", "Annually billed plans only with no true trial periods"],
      suggested_price_range: "$19 - $29 / month relative to automated runs"
    },
    customer_persona: {
      name: "Alex",
      age_range: "25-34",
      occupation: "Independent Creator",
      frustrations: [
        "Spends 4 hours a week sending update emails manually",
        "Cringes sending spreadsheets to high-paying clients",
        "Washes earnings on bloated tech stacks"
      ],
      goals: [
        "Automate repeating notifications seamlessly",
        "Present highly professional portals to corporate clients",
        "Scale operation to 6-figures without hiring employees"
      ],
      typical_quote: `"I just want an elegant dashboard that respects my time, is super blazing fast, and doesn't demand a full training certificate."`
    },
    reddit_threads: [
      { title: "We need a simpler way to manage our freelance projects, everything out there is bloated", url: "#", why_relevant: "Detailed breakdown of exact platform frustrations", upvotes: 211 },
      { title: "What is your automated client dashboard setup? Looking to replace Notion", url: "#", why_relevant: "Competitor reviews and customer feature requests", upvotes: 124 }
    ],
    sources_count: {
      reddit_posts: 142,
      web_results: 89,
      twitter_results: 65
    }
  };
}

// ================= AUTHENTICATION API =================

export async function syncUser(email: string, fullName = '', avatarUrl = ''): Promise<{ user: User; workflowState: WorkflowState }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/auth/sync-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header }
    });
    if (!res.ok) throw new Error('Auth sync failed');
    return res.json();
  } else {
    // Sandbox Simulation
    let users = getLocalStorageItem<User[]>('reddetect_users', []);
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: Math.random().toString(36).slice(2, 11), email, full_name: fullName || email.split('@')[0], avatar_url: avatarUrl };
      users.push(user);
      setLocalStorageItem('reddetect_users', users);
    }
    
    // Set active session in client
    setLocalStorageItem('reddetect_current_user', user);
    
    // Generate initial workflow state if none exists for user
    const states = getLocalStorageItem<Record<string, WorkflowState>>('reddetect_workflow_states', {});
    if (!states[user.id]) {
      states[user.id] = { has_signed_up: true, has_paid: false }; // Defaults to signup done, but need pricing/payment
      setLocalStorageItem('reddetect_workflow_states', states);
    }

    return {
      user,
      workflowState: states[user.id]
    };
  }
}

export async function getWorkflowState(): Promise<{ state: WorkflowState; subscription: SubscriptionInfo; redirect: string }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/auth/workflow-state`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Workflow state lookup failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    if (!user) {
      return {
        state: { has_signed_up: false, has_paid: false },
        subscription: { plan: 'free', status: 'inactive' },
        redirect: '/login'
      };
    }

    const states = getLocalStorageItem<Record<string, WorkflowState>>('reddetect_workflow_states', {});
    const state = states[user.id] || { has_signed_up: true, has_paid: false };
    
    const subs = getLocalStorageItem<Record<string, SubscriptionInfo>>('reddetect_subscriptions', {});
    const subscription = subs[user.id] || { plan: 'free', status: 'inactive' };

    // Set correct redirect based on state
    let redirect = '/dashboard';
    if (!state.has_signed_up) redirect = '/signup';
    else if (!state.has_paid) redirect = '/pricing';

    return {
      state,
      subscription,
      redirect
    };
  }
}

// ================= STRIPE API =================

export async function createCheckout(priceId: string): Promise<{ url: string }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/stripe/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ priceId })
    });
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.error || responseData.message || 'Checkout creation failed');
    }
    return responseData;
  } else {
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    if (!user) throw new Error('User session not found');
    return { url: `##stripe-checkout-success?price_id=${priceId}` };
  }
}

export async function completeMockPayment(priceId: string): Promise<boolean> {
  const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
  if (!user) return false;

  const states = getLocalStorageItem<Record<string, WorkflowState>>('reddetect_workflow_states', {});
  states[user.id] = { has_signed_up: true, has_paid: true };
  setLocalStorageItem('reddetect_workflow_states', states);

  const plan = priceId === 'price_1TaHQ6CBOoQTb0NpwMZiw8Jt' ? 'builder' : 'pro';
  const subs = getLocalStorageItem<Record<string, SubscriptionInfo>>('reddetect_subscriptions', {});
  subs[user.id] = { plan, status: 'active' };
  setLocalStorageItem('reddetect_subscriptions', subs);

  return true;
}

export async function getStripeStatus(): Promise<{ subscription: SubscriptionInfo; usage: { used: number; limit: number; unlimited: boolean } }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/stripe/status`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Stripe status failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    if (!user) {
      return {
        subscription: { plan: 'free', status: 'inactive' },
        usage: { used: 0, limit: 3, unlimited: false }
      };
    }

    const subs = getLocalStorageItem<Record<string, SubscriptionInfo>>('reddetect_subscriptions', {});
    const sub = subs[user.id] || { plan: 'free', status: 'inactive' };

    const reports = getLocalStorageItem<Report[]>('reddetect_reports', []).filter(r => r.id.startsWith(user.id) || r.id.length < 15);
    const used = reports.length;

    let limit = 3;
    let unlimited = false;
    if (sub.plan === 'pro') limit = 30;
    else if (sub.plan === 'builder') { limit = 150; unlimited = true; } // Unlimited in practical terms

    return {
      subscription: sub,
      usage: { used, limit, unlimited }
    };
  }
}

// ================= REPORTS (Core Feature) =================

export async function getFollowupQuestions(query: string): Promise<{ questions: string[] }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/followup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to get followup questions');
    return res.json();
  } else {
    // Sandbox Simulation: dynamically ask smart questions based on user query
    const topic = query.replace(/i want to build|a tool for|a website for/gi, '').trim() || 'this business';
    return {
      questions: [
        `Who is your specific target customer for "${topic}" (e.g., freelance web designers, digital agencies, independent creators)?`,
        `What is the primary frustration about existing alternatives that you want to solve (e.g., pricing, complex layouts, speed, lack of specific integrations)?`,
        `Have you validated interest, or is this still a completely fresh, unreleased concept?`
      ]
    };
  }
}

export async function generateReport(query: string, followupQuestions: string[], followupAnswers: Record<string, string>): Promise<{ reportId: string; status: 'processing' }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ query, followupQuestions, followupAnswers })
    });
    if (!res.ok) throw new Error('Report generation init failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    const userId = user?.id || 'guest';
    const reportId = `${userId}_rep_${Math.random().toString(36).slice(2, 11)}`;

    // Create report placeholder
    const reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
    const newReport: Report = {
      id: reportId,
      title: query.replace(/i want to build|a tool for|a website for/gi, '').trim().toUpperCase() || 'NEW RESEARCH REPORT',
      original_query: query,
      verdict: 'mixed',
      status: 'processing',
      created_at: new Date().toISOString()
    };
    
    reports.push(newReport);
    setLocalStorageItem('reddetect_reports', reports);

    // Seed report data so when it completes, it's there
    const reportData = generateMockReportData(query, followupAnswers);
    const seededData = getLocalStorageItem<Record<string, ReportData>>('reddetect_report_details', {});
    seededData[reportId] = reportData;
    setLocalStorageItem('reddetect_report_details', seededData);

    // Track processing timers in memory
    setTimeout(() => {
      const liveReports = getLocalStorageItem<Report[]>('reddetect_reports', []);
      const r = liveReports.find(rep => rep.id === reportId);
      if (r) {
        r.status = 'completed';
        r.verdict = reportData.verdict;
        setLocalStorageItem('reddetect_reports', liveReports);
        
        // Auto-create a workspace for this completed report too!
        const workspaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
        workspaces.push({
          id: reportId, // matching IDs make syncing workspaces <--> reports simple
          title: r.title,
          stage: 'exploring',
          created_at: new Date().toISOString()
        });
        setLocalStorageItem('reddetect_workspaces', workspaces);
      }
    }, 9000); // 9 seconds processing time simulation

    return {
      reportId,
      status: 'processing'
    };
  }
}

export async function getReportStatus(reportId: string): Promise<{ id: string; status: 'processing' | 'completed' | 'failed'; verdict: Verdict }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/${reportId}/status`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Status polling failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      return { id: reportId, status: 'failed', verdict: 'mixed' };
    }
    return {
      id: report.id,
      status: report.status,
      verdict: report.verdict
    };
  }
}

export async function getReport(reportId: string): Promise<Report> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/${reportId}`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Failed to fetch full report');
    return res.json();
  } else {
    // Sandbox Simulation
    const reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
    const report = reports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');

    const details = getLocalStorageItem<Record<string, ReportData>>('reddetect_report_details', {});
    const report_data = details[reportId];

    return {
      ...report,
      report_data: report_data || generateMockReportData(report.original_query)
    };
  }
}

export async function getReports(): Promise<{ reports: Array<{ id: string; title: string; verdict: Verdict; status: 'processing' | 'completed' | 'failed'; created_at: string }> }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Failed to list reports');
    return res.json();
  } else {
    // Sandbox Simulation
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    const userId = user?.id || 'guest';
    
    // Seed default reports if completely empty so we show high craft
    let reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
    if (reports.length === 0) {
      const initialReport: Report = {
        id: 'seed_rep_1',
        title: 'INVOICING PLATFORM FOR freelancers',
        original_query: 'I want to build an invoicing platform tailored specifically for freelancers with micro integrations',
        verdict: 'strong_signal',
        status: 'completed',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      };
      
      const seedDetails = generateMockReportData(initialReport.original_query, {
        '0': 'Freelancers, independent creatives',
        '1': 'Bloated subscription costs, late payment processes, manual email notifications',
        '2': 'Fresh concept'
      });

      reports = [initialReport];
      setLocalStorageItem('reddetect_reports', reports);

      const d = getLocalStorageItem<Record<string, ReportData>>('reddetect_report_details', {});
      d['seed_rep_1'] = seedDetails;
      setLocalStorageItem('reddetect_report_details', d);

      // Seed workspace as well
      const workplaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
      workplaces.push({
        id: 'seed_rep_1',
        title: 'INVOICING PLATFORM FOR freelancers',
        stage: 'validating',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      });
      setLocalStorageItem('reddetect_workspaces', workplaces);

      // Seed note for seed work
      const notes = getLocalStorageItem<Note[]>('reddetect_notes', []);
      notes.push({
        id: 'note_seed_1',
        workspace_id: 'seed_rep_1',
        content: 'This idea seems extremely strong. The high-volume Reddit complaint about seat pricing in existing software is real. Let’s focus strictly on a pay-per-invoice system billing model.',
        created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
      });
      setLocalStorageItem('reddetect_notes', notes);
    }

    // Filter by user logs
    const filtered = reports.filter(r => r.id.startsWith(userId) || r.id.startsWith('seed_rep'));

    return {
      reports: filtered.map(r => ({
        id: r.id,
        title: r.title,
        verdict: r.verdict,
        status: r.status,
        created_at: r.created_at
      }))
    };
  }
}

export async function deleteReport(reportId: string): Promise<{ success: boolean }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/${reportId}`, {
      method: 'DELETE',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Delete report failed');
    return res.json();
  } else {
    // Sandbox Simulation
    let reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
    reports = reports.filter(r => r.id !== reportId);
    setLocalStorageItem('reddetect_reports', reports);

    const details = getLocalStorageItem<Record<string, ReportData>>('reddetect_report_details', {});
    delete details[reportId];
    setLocalStorageItem('reddetect_report_details', details);

    return { success: true };
  }
}

export async function askReport(reportId: string, question: string): Promise<{ answer: string }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/reports/${reportId}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error('Ask Data failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const report = await getReport(reportId);
    const text = question.toLowerCase();
    
    if (text.includes('who') || text.includes('customer') || text.includes('audience')) {
      return {
        answer: `According to the sources, the primary target audience is ${report.report_data?.audience.who_they_are || 'independent developers'}. Their core pain points are: ${report.report_data?.audience.pain_points.slice(0, 2).join(', ') || 'lack of tracking options'}. They primarily aggregate in communities like ${report.report_data?.audience.where_they_hang_out.join(', ') || 'various subreddits'}.`
      };
    } else if (text.includes('risk') || text.includes('fail') || text.includes('warn') || text.includes('kill')) {
      return {
        answer: `The report's Kill Switch analysis flags substantial risks: ${report.report_data?.kill_switch.risks.join('; ') || 'high acquisition costs'}. It is warned that it might fail because: "${report.report_data?.kill_switch.why_it_might_fail || 'lack of user stickiness'}"`
      };
    } else if (text.includes('competitor') || text.includes('existing') || text.includes('who else')) {
      return {
        answer: `Identified competitors are: ${report.report_data?.competitors.map(c => c.name).join(', ') || 'Legacy setups'}. Market gaps you can capitalize on are: ${report.report_data?.market_gaps.join('; ') || 'simplicity and targeted pay models'}.`
      };
    } else {
      return {
        answer: `Analyzing report findings closely for your query: "${question}". The data reveals a demand score of ${report.report_data?.demand_score}/100 with a ${report.report_data?.competition_level} competition level. Users express that existing white-labeled tools are too slow, and they favor proposed MVP core feature: "${report.report_data?.mvp_suggestion.core_feature}".`
      };
    }
  }
}

// ================= WORKSPACES API =================

export async function getWorkspaces(): Promise<{ workspaces: Array<{ id: string; title: string; stage: string; reports?: any }> }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Get workspaces failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const user = getLocalStorageItem<User | null>('reddetect_current_user', null);
    const userId = user?.id || 'guest';
    const workspaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
    const filtered = workspaces.filter(w => w.id.startsWith(userId) || w.id.startsWith('seed_rep'));

    return {
      workspaces: filtered.map(w => ({
        id: w.id,
        title: w.title,
        stage: w.stage
      }))
    };
  }
}

export async function getWorkspace(id: string): Promise<{ workspace: Workspace; notes: Note[] }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces/${id}`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Get workspace failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const workspaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
    const workspace = workspaces.find(w => w.id === id);
    if (!workspace) throw new Error('Workspace not found');

    const notes = getLocalStorageItem<Note[]>('reddetect_notes', []);
    const workspaceNotes = notes.filter(n => n.workspace_id === id);

    return {
      workspace,
      notes: workspaceNotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    };
  }
}

export async function updateWorkspace(id: string, updates: { title?: string; stage?: 'exploring' | 'validating' | 'validated' | 'killed' }): Promise<{ workspace: Workspace }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Update workspace failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const workspaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
    const workspaceIndex = workspaces.findIndex(w => w.id === id);
    if (workspaceIndex === -1) throw new Error('Workspace not found');

    const updatedWorkspace = {
      ...workspaces[workspaceIndex],
      ...updates
    };

    workspaces[workspaceIndex] = updatedWorkspace;
    setLocalStorageItem('reddetect_workspaces', workspaces);

    // Also update matching reports in list if stage is modified
    if (updates.stage) {
      const reports = getLocalStorageItem<Report[]>('reddetect_reports', []);
      const reportIndex = reports.findIndex(r => r.id === id);
      if (reportIndex !== -1 && updates.stage === 'killed') {
        reports[reportIndex].verdict = 'weak_signal'; // Marked down
        setLocalStorageItem('reddetect_reports', reports);
      }
    }

    return { workspace: updatedWorkspace };
  }
}

export async function addWorkspaceNote(workspaceId: string, content: string): Promise<{ note: Note }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to save note');
    return res.json();
  } else {
    // Sandbox Simulation
    const notes = getLocalStorageItem<Note[]>('reddetect_notes', []);
    const newNote: Note = {
      id: `note_${Math.random().toString(36).slice(2, 11)}`,
      workspace_id: workspaceId,
      content,
      created_at: new Date().toISOString()
    };
    notes.push(newNote);
    setLocalStorageItem('reddetect_notes', notes);

    return { note: newNote };
  }
}

export async function deleteWorkspaceNote(workspaceId: string, noteId: string): Promise<{ success: boolean }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/notes/${noteId}`, {
      method: 'DELETE',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Delete note failed');
    return res.json();
  } else {
    // Sandbox Simulation
    let notes = getLocalStorageItem<Note[]>('reddetect_notes', []);
    notes = notes.filter(n => n.id !== noteId);
    setLocalStorageItem('reddetect_notes', notes);
    return { success: true };
  }
}

export async function deleteWorkspace(workspaceId: string): Promise<{ success: boolean }> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: { ...header }
    });
    if (!res.ok) throw new Error('Delete workspace failed');
    return res.json();
  } else {
    // Sandbox Simulation
    let workspaces = getLocalStorageItem<Workspace[]>('reddetect_workspaces', []);
    workspaces = workspaces.filter(w => w.id !== workspaceId);
    setLocalStorageItem('reddetect_workspaces', workspaces);

    let notes = getLocalStorageItem<Note[]>('reddetect_notes', []);
    notes = notes.filter(n => n.workspace_id !== workspaceId);
    setLocalStorageItem('reddetect_notes', notes);

    return { success: true };
  }
}

// ================= SOCIAL GENERATION API =================

export async function generatePosts(reportId: string): Promise<GeneratedPosts> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/posts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...header },
      body: JSON.stringify({ reportId })
    });
    if (!res.ok) throw new Error('Generate posts failed');
    return res.json();
  } else {
    // Sandbox Simulation
    const report = await getReport(reportId);
    const title = report.title;

    const postsResult: GeneratedPosts = {
      posts: [],
      raw: {
        twitter_thread: {
          platform: 'twitter',
          tone: 'storytelling',
          content: `1/ After reviewing 100+ raw conversations on Reddit and Twitter about "${title}", the results are eye-opening.\n\nHere's why most people are failing in this space and the exact gaps left wide open... 🧵👇\n\n2/ The primary pain point is simple: users are drowning in manual sync-time and notification spam.\n\nThey complain that current legacy tools charge $49+/mo per user just to lock simple CSV export triggers. Insane.\n\n3/ What are we doing about it? We're laying down a blueprint for a micro-utility focusing strictly on single-operator automations. Real-time updates with zero setup noise.\n\n4/ Build in public with us. Let's see if we can validate standard user interest in less than a week.`
        },
        linkedin: {
          platform: 'linkedin',
          tone: 'data_driven',
          content: `📊 Market Research Insight: The demand signals for "${title}" are extremely focused.\n\nWe tracked over 140 organic conversations on Reddit in the last month. Here are the 3 critical gaps in the marketplace:\n\n1. Pricing Bloat: Users are abandoning enterprise CRM seats in favor of manual spreadsheets.\n2. Over-engineering: 84% of surveyed freelancers want single-purpose features instead of "full suites." \n3. Integration Gaps: Clunky UI layers are costing builders hours in manual operations.\n\nWe are building a lean MVP that targets these exact constraints. Let me know what you think of this validation in the comments.`
        },
        reddit: {
          platform: 'reddit',
          tone: 'humble',
          content: `Title: I analyzed 100+ r/freelance complaints to see what everyone hates about current invoice trackers. Here is what I found.\n\nHey guys,\n\nI’ve been obsessed with validating the demand for a specific tool. Instead of launching another product without asking, I scraped Reddit conversations in detail.\n\nHere’s what everyone is complaining about:\n- CRM software charging seats for read-only clients.\n- Slow loading frames that drop client connections.\n\nIs anyone else feeling high exhaustion with Notion templates? How are you guys solving automation flows on a budget?`
        },
        hook: {
          platform: 'hook',
          tone: 'hype',
          content: `Stop wasting months building features nobody asked for. We scraped 100+ threads to validate this exact idea.`
        }
      }
    };

    // Store generated posts for later query
    const db = getLocalStorageItem<Record<string, GeneratedPosts>>('reddetect_generated_posts', {});
    db[reportId] = postsResult;
    setLocalStorageItem('reddetect_generated_posts', db);

    return postsResult;
  }
}

export async function getGeneratedPosts(reportId: string): Promise<GeneratedPosts | null> {
  const mode = getApiMode();
  if (mode === 'live') {
    const header = await getAuthHeader();
    const res = await fetch(`${API_URL}/api/posts/report/${reportId}`, {
      method: 'GET',
      headers: { ...header }
    });
    if (!res.ok) return null;
    return res.json();
  } else {
    // Sandbox Simulation
    const db = getLocalStorageItem<Record<string, GeneratedPosts>>('reddetect_generated_posts', {});
    return db[reportId] || null;
  }
}

// ================= VAULT (Idea Vault & Graveyard) =================

export async function getVault(stage?: string): Promise<{ ideas: Workspace[] }> {
  const workspacesResponse = await getWorkspaces();
  let ideas = workspacesResponse.workspaces as Workspace[];

  if (stage) {
    ideas = ideas.filter(i => i.stage === stage);
  }

  return { ideas };
}

export async function getGraveyard(): Promise<{ ideas: Workspace[] }> {
  const workspacesResponse = await getWorkspaces();
  const ideas = workspacesResponse.workspaces as Workspace[];
  return {
    ideas: ideas.filter(i => i.stage === 'killed')
  };
}

export async function updateVaultIdea(id: string, updates: { stage?: 'exploring' | 'validating' | 'validated' | 'killed'; pinned?: boolean }): Promise<Workspace> {
  const res = await updateWorkspace(id, updates);
  return res.workspace;
}

export async function deleteVaultIdea(id: string): Promise<{ success: boolean }> {
  return deleteWorkspace(id);
}
