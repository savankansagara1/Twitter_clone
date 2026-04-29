import React, { useState } from "react";
import type { Comment } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { deleteComment, replyToComment, getCommentReplies } from "../../api/comments.api";
import { likeComment, unlikeComment } from "../../api/reactions.api";
import { formatDate } from "../../utils/formatDate";
import Avatar from "../shared/Avatar";
import toast from "react-hot-toast";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { authUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isOwner = authUser?.username === comment.username;

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeComment(comment.comment_id);
        setLiked(false);
      } else {
        await likeComment(comment.comment_id);
        setLiked(true);
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(comment.comment_id);
      toast.success("Comment deleted");
      onDelete(comment.comment_id);
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await replyToComment(comment.comment_id, replyText.trim());
      toast.success("Reply added!");
      setReplyText("");
      setShowReplyBox(false);
      // Reload replies to show new one
      loadReplies();
    } catch {
      toast.error("Failed to add reply");
    }
  };

  const loadReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await getCommentReplies(comment.comment_id);
      setReplies(res.data.replies || []);
      setShowReplies(true);
    } catch {
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border">
      <Avatar src={comment.profile_pic} username={comment.username} size="sm" />

      <div className="flex-1 min-w-0">
        {/* Comment header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-textPrimary text-sm">{comment.fullname}</span>
          <span className="text-textSecondary text-xs">@{comment.username}</span>
          <span className="text-textSecondary text-xs">· {formatDate(comment.created_at)}</span>
          {isOwner && (
            <button onClick={handleDelete} className="ml-auto text-xs text-textSecondary hover:text-red-500">
              🗑
            </button>
          )}
        </div>

        {/* Comment content */}
        <p className="text-textPrimary text-sm mt-1 break-words">{comment.comment_content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2 text-textSecondary text-xs">
          <button onClick={handleLike} className={`hover:text-red-500 transition-colors ${liked ? "text-red-500" : ""}`}>
            {liked ? "❤️" : "🤍"}
          </button>
          <button onClick={() => setShowReplyBox(!showReplyBox)} className="hover:text-primary transition-colors">
            Reply
          </button>
          {/* Load replies button */}
          <button onClick={loadReplies} disabled={loadingReplies} className="hover:text-primary transition-colors">
            {loadingReplies ? "Loading..." : "Replies"}
          </button>
        </div>

        {/* Reply input box */}
        {showReplyBox && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-surface border border-border rounded-full px-3 py-1 text-sm text-textPrimary outline-none focus:border-primary"
            />
            <button
              onClick={handleReply}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Reply
            </button>
          </div>
        )}

        {/* Nested replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-2 pl-4 border-l border-border space-y-2">
            {replies.map((reply) => (
              <div key={reply.comment_id} className="flex gap-2">
                <Avatar src={reply.profile_pic} username={reply.username} size="sm" />
                <div>
                  <span className="font-semibold text-textPrimary text-xs">{reply.username}</span>
                  <p className="text-textPrimary text-xs">{reply.comment_content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
