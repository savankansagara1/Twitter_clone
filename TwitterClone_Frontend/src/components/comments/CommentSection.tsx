import React, { useState, useEffect } from "react";
import type { Comment } from "../../types";
import { getCommentsByTweet, createComment } from "../../api/comments.api";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../shared/Avatar";
import CommentItem from "./CommentItem";
import Loader from "../shared/Loader";
import toast from "react-hot-toast";

interface CommentSectionProps {
  tweetId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ tweetId }) => {
  const { authUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  // Load comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [tweetId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getCommentsByTweet(tweetId);
      setComments(res.data.comments || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await createComment(tweetId, text.trim());
      setText("");
      toast.success("Comment posted!");
      // Reload comments to show the new one
      fetchComments();
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  // Remove deleted comment from state without re-fetching
  const handleDelete = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  };

  return (
    <div>
      {/* Comment compose box */}
      <div className="flex gap-3 p-4 border-b border-border">
        <Avatar username={authUser?.username} size="sm" />
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Post your reply"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-transparent text-textPrimary placeholder-textSecondary outline-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={posting || !text.trim()}
          className="bg-primary text-white font-semibold px-4 py-1.5 rounded-full text-sm disabled:opacity-50"
        >
          {posting ? "..." : "Reply"}
        </button>
      </div>

      {/* Comments list */}
      {loading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className="text-center text-textSecondary py-8">No comments yet. Be first!</p>
      ) : (
        <div className="px-4">
          {comments.map((c) => (
            <CommentItem key={c.comment_id} comment={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
