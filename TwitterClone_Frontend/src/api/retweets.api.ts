import api from "./axios";

// POST /api/retweets/:tweetId  → retweet a tweet
export const retweetTweet = (tweetId: number) =>
  api.post(`/retweets/${tweetId}`);

// DELETE /api/retweets/:tweetId  → undo a retweet
export const undoRetweet = (tweetId: number) =>
  api.delete(`/retweets/${tweetId}`);
