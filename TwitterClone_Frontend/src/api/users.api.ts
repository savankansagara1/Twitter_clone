import api from "./axios";

// GET /api/users/:id  → returns User object
export const getUserById = (id: number) => api.get(`/users/${id}`);

// GET /api/users/:username/tweets  → returns { tweets: Tweet[] }
export const getUserTweets = (username: string) =>
  api.get(`/users/${username}/tweets`);

// GET /api/users/:username/replies  → returns { replies: Reply[] }
export const getUserReplies = (username: string) =>
  api.get(`/users/${username}/replies`);

// GET /api/users/:username/likes  → returns { likes: Tweet[] }
export const getUserLikes = (username: string) =>
  api.get(`/users/${username}/likes`);

// GET /api/users/:userId/followers
export const getFollowers = (userId: number) =>
  api.get(`/users/${userId}/followers`);

// GET /api/users/:userId/followings
export const getFollowing = (userId: number) =>
  api.get(`/users/${userId}/followings`);

// POST /api/users/:id  → update profile
// Body: { fullname, username, email, dob, bio, country, profile_pic, cover_pic }
export const updateProfile = (id: number, data: object) =>
  api.post(`/users/${id}`, data);
