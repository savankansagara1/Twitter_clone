import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Tweet } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { likeTweet, unlikeTweet } from "../../api/reactions.api";
import { retweetTweet, undoRetweet } from "../../api/retweets.api";
import { deleteTweet } from "../../api/tweets.api";
import { formatDate, formatCount } from "../../utils/formatDate";
import Avatar from "../shared/Avatar";
import toast from "react-hot-toast";

interface TweetCardProps {
  tweet: Tweet;
  onDelete?: (tweetId: number) => void; // callback to remove from parent list
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onDelete }) => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  // Local state for optimistic updates (like/retweet)
  const [liked, setLiked] = useState(!!tweet.isLiked);
  const [likeCount, setLikeCount] = useState(Number(tweet.like_count) || 0);
  const [retweeted, setRetweeted] = useState(!!tweet.isRetweeted);
  const [retweetCount, setRetweetCount] = useState(Number(tweet.retweet_count) || 0);

  // Toggle like with optimistic UI
 const handleLike = async (e: React.MouseEvent) => {
  e.stopPropagation();

  const prevLiked = liked;

  // optimistic update
  setLiked(!prevLiked);
  setLikeCount((c) =>
    prevLiked ? Math.max(0, c - 1) : c + 1
  );

  try {
    if (prevLiked) {
      await unlikeTweet(tweet.tweet_id);
    } else {
      await likeTweet(tweet.tweet_id);
    }
  } catch {
    // rollback
    setLiked(prevLiked);
    setLikeCount((c) =>
      prevLiked ? c + 1 : Math.max(0, c - 1)
    );

    toast.error("Failed to update like");
  }
};

  // Toggle retweet with optimistic UI
const handleRetweet = async (e: React.MouseEvent) => {
  e.stopPropagation();

  const prevRetweeted = retweeted;

  // optimistic update
  setRetweeted(!prevRetweeted);
  setRetweetCount((c) =>
    prevRetweeted ? Math.max(0, c - 1) : c + 1
  );

  try {
    if (prevRetweeted) {
      await undoRetweet(tweet.tweet_id);
      toast.success("Retweet removed");
    } else {
      await retweetTweet(tweet.tweet_id);
      toast.success("Retweeted!");
    }
  } catch {
    // rollback
    setRetweeted(prevRetweeted);
    setRetweetCount((c) =>
      prevRetweeted ? c + 1 : Math.max(0, c - 1)
    );

    toast.error("Failed to retweet");
  }
};

  // Delete tweet (only shown for own tweets)
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this tweet?")) return;

    try {
      await deleteTweet(tweet.tweet_id);
      toast.success("Tweet deleted");
      onDelete?.(tweet.tweet_id);
    } catch {
      toast.error("Failed to delete tweet");
    }
  };

  const isOwner = authUser?.username === tweet.username;

  return (
    <article
      onClick={() => navigate(`/tweet/${tweet.tweet_id}`)}
      className="flex gap-3 p-4 border-b border-border hover:bg-white/[0.03] cursor-pointer transition-colors"
    >
      {/* Avatar — clicking goes to profile */}
      <div onClick={(e) => { e.stopPropagation(); navigate(`/profile/${tweet.username}`); }}>
        <Avatar src={tweet.profile_pic} username={tweet.username} size="md" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Retweet indicator */}
        {tweet.type === "retweet" && (
          <p className="text-textSecondary text-xs mb-1 flex items-center gap-1">
            <span>🔁</span> Retweeted
          </p>
        )}

        {/* Header: name, username, date, delete */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/profile/${tweet.username}`}
            onClick={(e) => e.stopPropagation()}
            className="font-bold text-textPrimary hover:underline truncate"
          >
            {tweet.fullname}
          </Link>
          <span className="text-textSecondary text-sm">@{tweet.username}</span>
          <span className="text-textSecondary text-sm">·</span>
          <span className="text-textSecondary text-sm">{formatDate(tweet.created_at)}</span>

          {/* Delete button — only visible on own tweets */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="ml-auto text-textSecondary hover:text-red-500 transition-colors text-sm"
              title="Delete tweet"
            >
              🗑
            </button>
          )}
        </div>

        {/* Tweet content */}
        <p className="text-textPrimary mt-1 break-words whitespace-pre-wrap">
          {tweet.content}
        </p>

      {tweet.media_url ? (
  tweet.media_type?.startsWith("image") ? (
    <img
      src={tweet.media_url}
      alt="tweet media"
      className="mt-2 rounded-2xl max-h-72 object-cover w-full"
      onClick={(e) => e.stopPropagation()}
    />
  ) : (
    <video
      src={tweet.media_url}
      className="mt-2 rounded-2xl max-h-72 w-full object-cover"
      controls
      onClick={(e) => e.stopPropagation()}
    />
  )
) : null}

        {/* Action bar: like, retweet, comment count */}
        <div className="flex items-center gap-6 mt-3 text-textSecondary">
          {/* Comment icon (just navigates to detail, no standalone action) */}
          <ActionBtn
            icon="💬"
            count={undefined}
            active={false}
            activeColor=""
            onClick={(e) => { e.stopPropagation(); navigate(`/tweet/${tweet.tweet_id}`); }}
          />

          {/* Retweet */}
          <ActionBtn
            icon="🔁"
            count={retweetCount}
            active={retweeted}
            activeColor="text-green-400"
            onClick={handleRetweet}
          />

          {/* Like */}
          <ActionBtn
            icon={liked ? "❤️" : "🤍"}
            count={likeCount}
            active={liked}
            activeColor="text-red-500"
            onClick={handleLike}
          />
        </div>
      </div>
    </article>
  );
};

// Small action button used in the tweet footer
interface ActionBtnProps {
  icon: string;
  count?: number;
  active: boolean;
  activeColor: string;
  onClick: (e: React.MouseEvent) => void;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, count, active, activeColor, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors group ${active ? activeColor : ""}`}
  >
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    {count !== undefined && <span>{formatCount(count)}</span>}
  </button>
);

export default TweetCard;
