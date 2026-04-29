import api from "./axios";

// POST /api/auth/signup
// Body: { fullname, username, email, dob, hashed_password, bio, country }
export const signUp = (data: {
  fullname: string;
  username: string;
  email: string;
  dob: string;
  hashed_password: string;
  bio?: string;
  country: string;
}) => api.post("/auth/signup", data);

// POST /api/auth/signin
// Body: { identifier (username or email), password }
// Returns: { accessToken, message }
export const signIn = (identifier: string, password: string) =>
  api.post("/auth/signin", { identifier, password });
