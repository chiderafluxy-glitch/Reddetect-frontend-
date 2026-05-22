/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Verdict = 'strong_signal' | 'weak_signal' | 'mixed';

export interface KeyInsight {
  insight: string;
  evidence: string;
  source_url: string;
}

export interface TopQuote {
  quote: string;
  subreddit: string;
  upvotes: number;
  url: string;
}

export interface Subreddit {
  name: string;
  relevance: string;
  url: string;
}

export interface Competitor {
  name: string;
  url: string;
  what_people_say: string;
  gaps: string[];
}

export interface RedditThread {
  title: string;
  url: string;
  why_relevant: string;
  upvotes: number;
}

export interface ReportData {
  verdict: Verdict;
  verdict_summary: string;
  demand_score: number; // 0-100
  competition_level: 'low' | 'medium' | 'high';
  key_insights: KeyInsight[];
  top_quotes: TopQuote[];
  subreddits: Subreddit[];
  audience: {
    who_they_are: string;
    pain_points: string[];
    language_they_use: string[];
    where_they_hang_out: string[];
  };
  competitors: Competitor[];
  market_gaps: string[];
  willingness_to_pay: {
    score: number; // 0-100
    evidence: string;
    price_signals: string[];
  };
  opportunity_map: {
    crowded_areas: string[];
    underserved_areas: string[];
    best_opportunity: string;
  };
  mvp_suggestion: {
    core_feature: string;
    target_user: string;
    why: string;
  };
  kill_switch: {
    risks: string[];
    existing_solutions: string[];
    why_it_might_fail: string;
  };
  market_size: {
    estimate: string;
    reasoning: string;
    conversation_volume: 'low' | 'medium' | 'high' | 'very_high';
  };
  pricing_intelligence: {
    what_people_pay_now: string[];
    complaints_about_pricing: string[];
    suggested_price_range: string;
  };
  customer_persona: {
    name: string;
    age_range: string;
    occupation: string;
    frustrations: string[];
    goals: string[];
    typical_quote: string;
  };
  reddit_threads: RedditThread[];
  sources_count: {
    reddit_posts: number;
    web_results: number;
    twitter_results: number;
  };
}

export interface Report {
  id: string;
  title: string;
  original_query: string;
  verdict: Verdict;
  status: 'processing' | 'completed' | 'failed';
  report_data?: ReportData;
  created_at: string;
}

export interface Workspace {
  id: string;
  title: string;
  stage: 'exploring' | 'validating' | 'validated' | 'killed';
  reports?: Report[];
  created_at: string;
}

export interface Note {
  id: string;
  workspace_id: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface WorkflowState {
  has_signed_up: boolean;
  has_paid: boolean;
}

export interface SubscriptionInfo {
  plan: 'free' | 'pro' | 'builder';
  status: 'active' | 'inactive';
}

export interface GeneratedPosts {
  posts: string[];
  raw: {
    twitter_thread: { platform: 'twitter'; tone: 'storytelling'; content: string };
    linkedin: { platform: 'linkedin'; tone: 'data_driven'; content: string };
    reddit: { platform: 'reddit'; tone: 'humble'; content: string };
    hook: { platform: 'hook'; tone: 'hype'; content: string };
  };
}
