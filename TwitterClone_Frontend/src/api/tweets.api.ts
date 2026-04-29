import api from "./axios";

// GET /api/tweets/feed  → returns { rows: Tweet[] }
export const getFeed = () => api.get("/tweets/feed");

// GET /api/tweets/:id   → returns Tweet[]
export const getTweetById = (id: number) => api.get(`/tweets/${id}`);

// GET /api/tweets/user/:userId  → returns { rows: Tweet[] }
export const getTweetsByUserId = (userId: number) =>
  api.get(`/tweets/user/${userId}`);

// POST /api/tweets/
// Content-Type: multipart/form-data with fields: content + optional file
export const createTweet = (formData: FormData) =>
  api.post("/tweets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE /api/tweets/:id
export const deleteTweet = (id: number) => api.delete(`/tweets/${id}`);
