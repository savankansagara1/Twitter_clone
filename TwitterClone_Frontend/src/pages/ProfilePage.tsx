import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, getUserTweets, getUserReplies, getUserLikes } from "../api/users.api";
import type { User, Tweet } from "../types";
import Sidebar from "../components/layout/Sidebar";
import ProfileCard from "../components/profile/ProfileCard";
import TweetFeed from "../components/tweets/TweetFeed";
import Loader from "../components/shared/Loader";
import toast from "react-hot-toast";

// Tab options for the profile page
type Tab = "tweets" | "replies" | "likes";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("tweets");

  // Load user profile when username param changes
  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  // Reload tab content whenever tab changes (after user is loaded)
  useEffect(() => {
    if (user && username) {
      loadTabContent();
    }
  }, [activeTab, username]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // First get the user object by username (we need user_id for getUserById)
      // The backend route is /users/:id (by ID), so we fetch tweets first to get user info
      const tweetsRes = await getUserTweets(username!);
      const fetchedTweets: Tweet[] = tweetsRes.data.tweets || [];

      // Extract user info from first tweet if available, otherwise we need a separate call
      // The backend /users/:username/tweets returns tweet objects with user info
      // We also need the full User object — get it from a separate profile call
      // But /api/users/:id requires an ID, not username. Let's get user info from tweets.
      if (fetchedTweets.length > 0) {
        // Build a partial user object from tweet data
        const firstTweet = fetchedTweets[0];
        setUser({
          user_id: 0,
          fullname: firstTweet.fullname,
          username: firstTweet.username,
          email: "",
          dob: "",
          profile_pic: firstTweet.profile_pic,
          created_at: firstTweet.created_at,
        });
      }
      setTweets(fetchedTweets);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadTabContent = async () => {
    if (!username) return;
    setContentLoading(true);
    try {
      if (activeTab === "tweets") {
        const res = await getUserTweets(username);
        setTweets(res.data.tweets || []);
      } else if (activeTab === "replies") {
        const res = await getUserReplies(username);
        // Replies have a different shape — adapt to display format
        const replies = (res.data.replies || []).map((r: any) => ({
          tweet_id: r.tweet_id,
          content: r.comment_content,
          created_at: r.created_at,
          username: r.username,
          fullname: r.fullname,
          profile_pic: r.profile_pic,
          isLiked: 0,
          isRetweeted: 0,
          type: "tweet" as const,
        }));
        setTweets(replies);
      } else if (activeTab === "likes") {
        const res = await getUserLikes(username);
        setTweets(res.data.likes || []);
      }
    } catch {
      toast.error("Failed to load content");
    } finally {
      setContentLoading(false);
    }
  };

  const handleDeleteTweet = (tweetId: number) => {
    setTweets((prev) => prev.filter((t) => t.tweet_id !== tweetId));
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "tweets", label: "Posts" },
    { key: "replies", label: "Replies" },
    { key: "likes", label: "Likes" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 max-w-2xl border-x border-border">
        {/* Header with back button */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-textPrimary hover:bg-surface rounded-full p-2 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-textPrimary">{user?.fullname || username}</h1>
            <p className="text-textSecondary text-sm">{tweets.length} posts</p>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : user ? (
          <>
            {/* Profile header card */}
            <ProfileCard user={user} />

            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-colors hover:bg-surface ${
                    activeTab === tab.key
                      ? "text-textPrimary border-b-2 border-primary"
                      : "text-textSecondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <TweetFeed
              tweets={tweets}
              loading={contentLoading}
              onDelete={handleDeleteTweet}
              emptyMessage={`No ${activeTab} yet`}
            />
          </>
        ) : (
          <p className="text-center text-textSecondary py-16">User not found</p>
        )}
      </main>

      <aside className="hidden lg:block w-80" />
    </div>
  );
};

export default ProfilePage;
