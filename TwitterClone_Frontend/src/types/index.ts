// ─── Shared TypeScript types used across the whole frontend ───────────────────

// User object returned by the backend
export interface User {
  user_id: number;
  fullname: string;
  username: string;
  email: string;
  dob: string;
  bio?: string;
  country?: string;
  profile_pic?: string;
  cover_pic?: string;
  created_at: string;
}

// Tweet/retweet object returned by the feed and profile APIs
export interface Tweet {
  tweet_id: number;
  content: string;
  created_at: string;
  username: string;
  fullname: string;
  profile_pic?: string;
  cover_pic?: string;
  user_id?:any,
  media_url?: string;
  media_type?: string;
  like_count?: number;
  retweet_count?: number;
  isLiked: number | boolean; // backend returns 0/1
  isRetweeted: number | boolean;
  type: "tweet" | "retweet";
}

// Comment object returned by the comments API
export interface Comment {
  comment_id: number;
  comment_content: string;
  created_at: string;
  username: string;
  fullname: string;
  profile_pic?: string;
}

// Payload stored in localStorage after login
export interface AuthUser {
  token: string;
  user_id: number;
  username: string;
  email: string;
}

// Shape of the auth context value
export interface AuthContextType {
  authUser: AuthUser | null;
  login: (token: string, user_id: number, username: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
