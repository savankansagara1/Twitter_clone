import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTweetById } from "../api/tweets.api";
import type { Tweet } from "../types";
import Sidebar from "../components/layout/Sidebar";
import TweetCard from "../components/tweets/TweetCard";
import CommentSection from "../components/comments/CommentSection";
import Loader from "../components/shared/Loader";
import toast from "react-hot-toast";

const TweetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTweet();
  }, [id]);

  const fetchTweet = async () => {
    setLoading(true);
    try {
      // Backend returns an array for this endpoint
      const res = await getTweetById(Number(id));
      const tweetData = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!tweetData) {
        toast.error("Tweet not found");
        navigate("/");
        return;
      }
      setTweet(tweetData);
    } catch {
      toast.error("Failed to load tweet");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-textPrimary">Post</h1>
        </div>

        {loading ? (
          <Loader />
        ) : tweet ? (
          <>
            {/* The tweet itself (not clickable here since we're already on detail) */}
            <TweetCard tweet={tweet} />

            {/* Comments section below the tweet */}
            <CommentSection tweetId={tweet.tweet_id} />
          </>
        ) : null}
      </main>

      <aside className="hidden lg:block w-80" />
    </div>
  );
};

export default TweetDetailPage;
