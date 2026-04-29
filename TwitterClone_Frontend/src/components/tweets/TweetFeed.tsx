import React from "react";
import type { Tweet } from "../../types";
import TweetCard from "./TweetCard";
import Loader from "../shared/Loader";

interface TweetFeedProps {
  tweets: Tweet[];
  loading: boolean;
  onDelete?: (tweetId: number) => void;
  emptyMessage?: string;
}

// Renders a list of TweetCards with loading and empty states
const TweetFeed: React.FC<TweetFeedProps> = ({
  tweets,
  loading,
  onDelete,
  emptyMessage = "No tweets yet",
}) => {
  if (loading) return <Loader />;

  if (tweets.length === 0) {
    return (
      <div className="py-16 text-center text-textSecondary">
        <p className="text-xl">🐦</p>
        <p className="mt-2">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard
          key={`${tweet.tweet_id}-${tweet.type}`}
          tweet={tweet}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TweetFeed;
