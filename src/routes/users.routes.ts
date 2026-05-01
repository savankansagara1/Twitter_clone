import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getFollowers,
  getFollowing,
  getUserReply,
  getUserLikes,
  getUserTweets,
  getUserByUsername,
} from "../controllers/users.controller";
import { verifyToken } from "../middleware/auth.jwt";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Route to get user profile
router.get("/:id", getUserProfile);

// Route to update user profile
router.post("/:id", verifyToken,upload.fields([
  { name: "profile_pic", maxCount: 1 },
  { name: "cover_pic", maxCount: 1 },
]), updateUserProfile);

//getUserTweets
router.get("/:username/tweets", getUserTweets);

//getUserReply
router.get("/:username/replies", getUserReply);

router.get("/:username/likes", getUserLikes);

// Route to get followers
router.get("/:userId/followers", verifyToken, getFollowers);

// Route to get following
router.get("/:userId/followings", getFollowing);

router.get("/username/:username", getUserByUsername);

export default router;
