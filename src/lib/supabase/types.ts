export type Locale = 'fr' | 'en';

export interface Fragment {
  id: string;
  language: Locale;
  content: string;
  mood: string | null;
  is_premium: boolean;
  is_active: boolean;
  reaction_count: number;
  sort_order: number;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  language: Locale;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  reaction_count: number;
  created_at: string;
}

export interface Circle {
  id: string;
  language: Locale;
  status: 'forming' | 'active' | 'closed';
  created_at: string;
}

export interface CircleMessage {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
