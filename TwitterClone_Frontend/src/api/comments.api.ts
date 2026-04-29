import api from "./axios";

// GET /api/comments/tweet/:tweetId  → returns { comments: Comment[] }
export const getCommentsByTweet = (tweetId: number) =>
  api.get(`/comments/tweet/${tweetId}`);

// POST /api/comments/:tweetId  → create a top-level comment
// Body: { content }
export const createComment = (tweetId: number, content: string) =>
  api.post(`/comments/${tweetId}`, { content });

// POST /api/comments/reply/:commentId  → reply to a comment
// Body: { content }
export const replyToComment = (commentId: number, content: string) =>
  api.post(`/comments/reply/${commentId}`, { content });

// GET /api/comments/reply/:commentId  → get replies to a comment
export const getCommentReplies = (commentId: number) =>
  api.get(`/comments/reply/${commentId}`);

// DELETE /api/comments/:id
export const deleteComment = (commentId: number) =>
  api.delete(`/comments/${commentId}`);
