import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getTweetsByID,
  getFeedTweets,
  getTweetsByUser,
} from "../controllers/tweets.controller";
import { verifyToken } from "../middleware/auth.jwt";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Route to create a tweet
router.post("/", verifyToken, upload.single("file"), createTweet);

// Route to get tweets by user
router.get("/user/:userId", verifyToken, getTweetsByUser);

// Route to get feed
router.get("/feed", verifyToken, getFeedTweets);

router.get("/:id",verifyToken, getTweetsByID);

// Route to delete a tweet
router.delete("/:id", verifyToken, deleteTweet);

export default router;
