import React, { useState, useEffect } from "react";
import { getFeed } from "../api/tweets.api";
import type { Tweet } from "../types";
import Sidebar from "../components/layout/Sidebar";
import TweetForm from "../components/tweets/TweetForm";
import TweetFeed from "../components/tweets/TweetFeed";
import toast from "react-hot-toast";

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch feed on mount
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await getFeed();
      // Backend returns: { rows: Tweet[] }
      console.log("FEED:", res.data.rows);
      setTweets(res.data.rows || []);
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  // Remove deleted tweet from state without refetching
  const handleDelete = (tweetId: number) => {
    setTweets((prev) => prev.filter((t) => t.tweet_id !== tweetId));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main feed column */}
      <main className="flex-1 max-w-2xl border-x border-border">
        {/* Page header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 z-10">
          <h1 className="text-xl font-bold text-textPrimary">Home</h1>
        </div>

        {/* Tweet compose box */}
        <TweetForm onTweetCreated={fetchFeed} />

        {/* Feed */}
        <TweetFeed
          tweets={tweets}
          loading={loading}
          onDelete={handleDelete}
          emptyMessage="Your feed is empty. Follow some people to see their tweets!"
        />
      </main>

      {/* Optional right panel (spacer on smaller screens) */}
      <aside className="hidden lg:block w-80 px-4 py-4" />
    </div>
  );
};

export default HomePage;
