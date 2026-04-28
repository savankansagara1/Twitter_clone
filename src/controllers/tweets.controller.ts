import { Request, Response } from 'express';
import { User } from '../types/index';
import { AuthenticateRequest } from '../types/index';
import db from '../config/db';
import { ResultSetHeader } from 'mysql2';
import { uploadToImagekit } from '../utils/uploadToimagekit';

// Controller for tweet-related operations

// Function to create a tweet

export const createTweet = async (req: AuthenticateRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    console.log("Creating tweet for user ID:", userId);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const tweetContent = req.body.content?.trim() || "";
    const files = req.file
    console.log(files);

    const imageUrl = await uploadToImagekit(files!)
    console.log(imageUrl)
    if (!tweetContent) {
      return res.status(400).json({ message: "Tweet Content required" })
    }
    const [result] = await db.query<ResultSetHeader>(`Insert into tweets(user_id,content) values (?,?)`, [userId, tweetContent]);

    const tweetId = result.insertId;
    //  console.log(tweetId);
    res.status(201).json({ message: "Tweet created successfully", tweetId });


    const [mediaResult] = await db.query<ResultSetHeader>(`Insert into tweet_media(tweet_id,media_type, media_url) values (?,?,?)`, [tweetId, files?.mimetype, imageUrl]);


  }
  catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error as Error });
  }
}


// Function to get tweets
export const getTweets = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement tweets retrieval
  const userId = req.user?.user_id;
  console.log(userId);

  const [rows] = await db.query(`SELECT * FROM tweets WHERE user_id = ?`, [userId]);
  console.log(rows);
  res.status(200).json({ rows });
};

// Function to delete a tweet
export const deleteTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement tweet deletion
  const tweetId = req.params.id;
  const userId = req.user?.user_id;
  console.log(tweetId);
  console.log(userId);

  const [rows] = await db.query(`SELECT * FROM tweets WHERE tweet_id = ?`, [tweetId]);
  console.log(rows);
  res.status(200).json({ rows });
};

// Function to get feed
export const getFeed = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement user feed retrieval
  const userId = req.user?.user_id;
  console.log(userId);

  const [rows] = await db.query(`SELECT * FROM tweets  JOIN users ON tweets.user_id = users.user_id  ORDER BY tweets.created_at DESC LIMIT 10`);
  console.log(rows);
  res.status(200).json({ rows });
};