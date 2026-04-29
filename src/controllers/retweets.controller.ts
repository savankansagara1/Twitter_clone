import { Request, Response } from 'express';
import { AuthenticateRequest } from '../types';
import db from '../config/db';

// Controller for retweet operations

// Function to retweet
export const retweetTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement retweet logic
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `INSERT INTO retweets (user_id, tweet_id) VALUES (?, ?)`,
      [user_id, tweetId]
    );
    console.log(result);
    res.status(201).json({ message: "Retweeted successfully", result });    
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Function to unretweet
export const undoRetweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement unretweet logic
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `DELETE FROM retweets WHERE user_id = ? AND tweet_id = ?`,
      [user_id, tweetId]
    );
    console.log(result);
    res.status(200).json({ message: "Unretweeted successfully", result });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};