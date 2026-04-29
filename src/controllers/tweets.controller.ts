import { Request, Response } from "express";
import { User } from "../types/index";
import { AuthenticateRequest } from "../types/index";
import db from "../config/db";
import { ResultSetHeader } from "mysql2";
import { uploadToImagekit } from "../utils/uploadToimagekit";

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
    const files = req.file;
    console.log(files);

    const imageUrl = await uploadToImagekit(files!);
    console.log(imageUrl);
    if (!tweetContent) {
      return res.status(400).json({ message: "Tweet Content required" });
    }
    const [result] = await db.query<ResultSetHeader>(
      `Insert into tweets(user_id,content) values (?,?)`,
      [userId, tweetContent],
    );

    const tweetId = result.insertId;
    //  console.log(tweetId);
    res.status(201).json({ message: "Tweet created successfully", tweetId });

    const [mediaResult] = await db.query<ResultSetHeader>(
      `Insert into tweet_media(tweet_id,media_type, media_url) values (?,?,?)`,
      [tweetId, files?.mimetype, imageUrl],
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error as Error });
  }
};

// Function to get tweets by user
export const getTweetsByUser = async (
  req: AuthenticateRequest,
  res: Response,
) => {
  // TODO: Implement tweets retrieval
  const loogedInUserId = req.user?.user_id;
  console.log(loogedInUserId);

  const user_id = req.params.userId;
  console.log(user_id)


  const [rows] = await db.query(`SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.username,
        u.fullname,
        u.profile_pic,
        m.media_url,
        m.media_type,

        (
          SELECT COUNT(*) 
          FROM reactions r 
          WHERE r.tweet_id = t.tweet_id
        ) AS like_count,

        (
          SELECT COUNT(*) 
          FROM retweets rt 
          WHERE rt.tweet_id = t.tweet_id
        ) AS retweet_count,

        EXISTS (
  SELECT 1
  FROM retweets rt
  WHERE rt.tweet_id = t.tweet_id 
    AND rt.user_id = ?
) AS isRetweeted,

        EXISTS (
          SELECT 1 
          FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked,

        'tweet' AS type

      FROM tweets t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE t.user_id = ?

      UNION ALL

      SELECT 
        t.tweet_id,
        t.content,
        r.created_at,
        u.username,
        u.fullname,
        u.profile_pic,
        m.media_url,
        m.media_type,

        (
          SELECT COUNT(*) 
          FROM reactions r3 
          WHERE r3.tweet_id = t.tweet_id
        ) AS like_count,

        (
          SELECT COUNT(*) 
          FROM retweets rt2 
          WHERE rt2.tweet_id = t.tweet_id
        ) AS retweet_count,
         EXISTS (
  SELECT 1
  FROM retweets rt
  WHERE rt.tweet_id = t.tweet_id 
    AND rt.user_id = ?
) AS isRetweeted,

        EXISTS (
          SELECT 1 
          FROM reactions r4 
          WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
        ) AS isLiked,

        'retweet' AS type

      FROM retweets r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id = ?

      ORDER BY created_at DESC`, [loogedInUserId,loogedInUserId,user_id,loogedInUserId,loogedInUserId,user_id ]
    );
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

  const [rows] = await db.query(`SELECT * FROM tweets WHERE tweet_id = ? AND user_id = ?`, [
    tweetId,userId
  ]);
  console.log(rows);
  res.status(200).json({ rows });
};

// Function to get feed
export const getFeedTweets = async (
  req: AuthenticateRequest,
  res: Response,
) => {
  // TODO: Implement user feed retrieval
  const userId = req.user?.user_id;
  console.log(userId);

  try {
    const [rows] = await db.query(
      `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_pic,
  m.media_url,
  m.media_type,

  EXISTS (
    SELECT 1 FROM reactions r 
    WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id AND rt.user_id = ?
  ) AS isRetweeted,

  'tweet' AS type

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

UNION ALL

SELECT 
  t.tweet_id,
  t.content,
  r.created_at,
  u.username,
  u.fullname,
  u.profile_pic,
  m.media_url,
  m.media_type,

  EXISTS (
    SELECT 1 FROM reactions r2 
    WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
  ),

  EXISTS (
    SELECT 1 FROM retweets rt2 
    WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
  ),

  'retweet'

FROM retweets r
JOIN tweets t ON r.tweet_id = t.tweet_id
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE r.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = ?
)

ORDER BY created_at DESC`,
      [userId, userId, userId, userId, userId, userId],
    );
    console.log(rows);
    res.status(200).json({ rows });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error as Error });
  }
};

export const getTweetsByID = async (
  req: AuthenticateRequest,
  res: Response,
) => {
  const user_id = req.user?.user_id;
  console.log(user_id);

  const tweet_id  = req.params.id;
  console.log(tweet_id);
  try {
    const [rows] = await db.query(
      `SELECT 
  t.tweet_id,
  t.content,
  t.created_at,
  u.username,
  u.fullname,
  u.profile_pic,
  m.media_url,
  m.media_type,

  (SELECT COUNT(*) FROM reactions WHERE tweet_id = t.tweet_id) AS like_count,

  EXISTS (
    SELECT 1 FROM reactions r 
    WHERE r.tweet_id = t.tweet_id AND r.user_id = ?
  ) AS isLiked,

  EXISTS (
    SELECT 1 FROM retweets rt 
    WHERE rt.tweet_id = t.tweet_id AND rt.user_id = ?
  ) AS isRetweeted

FROM tweets t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
WHERE t.tweet_id = ?`,
      [user_id, user_id, tweet_id],
    );
    res.status(201).json(rows)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error as Error });
  }
};
