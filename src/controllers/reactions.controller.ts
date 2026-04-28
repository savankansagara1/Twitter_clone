import { Request, Response } from "express";
import { AuthenticateRequest } from "../types";
import db from "../config/db";

// Controller for reaction operations

// Function to like a tweet
export const likeTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement like toggle
  const tweetId = req.params.id;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `insert into reaction (user_id,tweet_id,isLiked) values (?,?,?)`,
      [user_id, tweetId, true],
    );
    console.log(result);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Function to unlike a tweet
export const unlikeTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement unlike logic
   const tweetId = req.params.id;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `DELETE from reaction where user_id = ? And tweet_id = ?`,
      [user_id, tweetId],
    );
    console.log(result);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
