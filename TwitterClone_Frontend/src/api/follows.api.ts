import api from "./axios";

// POST /api/follows/:userId  → follow a user
export const followUser = (userId: number) =>
  api.post(`/follows/${userId}`);

// DELETE /api/follows/:userId  → unfollow a user
export const unfollowUser = (userId: number) =>
  api.delete(`/follows/${userId}`);
