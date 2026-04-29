import api from "./axios";

// POST /api/reactions/tweets/:tweetId/like
export const likeTweet = (tweetId: number) =>
  api.post(`/reactions/tweets/${tweetId}/like`);

// DELETE /api/reactions/tweets/:tweetId/like
export const unlikeTweet = (tweetId: number) =>
  api.delete(`/reactions/tweets/${tweetId}/like`);

// POST /api/reactions/comments/:commentId
export const likeComment = (commentId: number) =>
  api.post(`/reactions/comments/${commentId}`);

// DELETE /api/reactions/comments/:commentId
export const unlikeComment = (commentId: number) =>
  api.delete(`/reactions/comments/${commentId}`);
