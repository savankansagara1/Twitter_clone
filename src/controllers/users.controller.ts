import { Request, Response } from "express";
import db from "../config/db";
import { AuthenticateRequest, User } from "../types";
import { ResultSetHeader } from "mysql2";

// Controller for user-related operations

// Function to get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  // TODO: Implement user profile retrieval
  try {
    const userId = req.params.id;
    console.log(req.params.id);

    // Fetch user profile from database
    const [rows] = await db.query<User[]>(
      "SELECT * FROM users WHERE user_id = ?",
      [Number(userId)],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = rows[0];
    res.json(userProfile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error as any });
  }
};

// Function to update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const {
    fullname,
    username,
    email,
    dob,
    bio,
    country,
    profile_pic,
    cover_pic,
  } = req.body;

  try {
    const [result] = await db.query<User[]>(
      `UPDATE users SET fullname = ?, username = ?, email = ?, dob = ?, bio = ?, country = ?, profile_pic = ?, cover_pic = ? WHERE user_id = ?`,
      [
        fullname,
        username,
        email,
        dob,
        bio,
        country,
        profile_pic,
        cover_pic,
        Number(userId),
      ],
    );
    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error as any });
  }
};

// Function to get followers
export const getFollowers = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement followers retrieval
  const id = req.params.userId;
  console.log(id);

  try {
    const [result] = await db.query<ResultSetHeader>(
      `SELECT u.user_id, u.username, u.fullname, u.profile_pic
FROM follows f
JOIN users u ON f.follower_id = u.user_id
WHERE f.followee_id = ?;`,
      [id],
    );
    res.json({ message: "followers has been fetched" });
    console.log(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user profile", error: error as any });
  }
};

// Function to get following
export const getFollowing = async (req: Request, res: Response) => {
  // TODO: Implement following retrieval

  const id = req.params.userId;
  console.log(id);

  try {
    const [result] = await db.query<ResultSetHeader>(
      `SELECT u.user_id, u.username, u.fullname, u.profile_pic
FROM follows f
JOIN users u ON f.followee_id = u.user_id
WHERE f.follower_id = ?;`,
      [id],
    );
    res.json({ message: "following has been fetched" });
    console.log(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user profile", error: error as any });
  }
};

export const getUserTweets = async (req: AuthenticateRequest, res: Response) => {
  const { username } = req.params;
  const currentUserId = req.user?.user_id || null;

  try {
    // Step 1: Get user_id from username
    const [userRows]: any = await db.query(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].user_id;

    // Step 2: Fetch tweets + retweets
    const [tweets]: any = await db.query(
      `SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.username,
        u.fullname,
        u.profile_pic,
        m.media_url,
        m.media_type,

        (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
        (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,

        EXISTS (
          SELECT 1 FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked,

        EXISTS (
          SELECT 1 FROM retweets rt2 
          WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
        ) AS isRetweeted,

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

        (SELECT COUNT(*) FROM reactions r3 WHERE r3.tweet_id = t.tweet_id),
        (SELECT COUNT(*) FROM retweets rt3 WHERE rt3.tweet_id = t.tweet_id),

        EXISTS (
          SELECT 1 FROM reactions r4 
          WHERE r4.tweet_id = t.tweet_id AND r4.user_id = ?
        ),

        EXISTS (
          SELECT 1 FROM retweets rt4 
          WHERE rt4.tweet_id = t.tweet_id AND rt4.user_id = ?
        ),

        'retweet' AS type

      FROM retweets r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id = ?

      ORDER BY created_at DESC`,
      [
        currentUserId, currentUserId, userId,   // first SELECT
        currentUserId, currentUserId, userId    // second SELECT
      ]
    );

    res.status(200).json({
      message: "User tweets fetched successfully",
      tweets
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const getUserReply = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    // Step 1: Get user_id from username
    const [userRows]: any = await db.query(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].user_id;

    // Step 2: Fetch replies (only comments that are replies)
    const [replies]: any = await db.query(
      `SELECT 
        c.comment_id,
        c.comment_content,
        c.created_at,
        t.tweet_id,
        t.content AS tweet_content,
        u.username,
        u.fullname,
        u.profile_pic
      FROM comments c
      JOIN tweets t ON c.tweet_id = t.tweet_id
      JOIN users u ON c.user_id = u.user_id
      WHERE c.user_id = ?
      AND c.parent_comment_id IS NOT NULL
      ORDER BY c.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      message: "User replies fetched successfully",
      replies
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const getUserLikes = async (req: AuthenticateRequest, res: Response) => {
  const { username } = req.params;
  const currentUserId = req.user?.user_id || null;

  try {
    // Step 1: Get user_id from username
    const [userRows]: any = await db.query(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].user_id;

    // Step 2: Fetch liked tweets
    const [likes]: any = await db.query(
      `SELECT 
        t.tweet_id,
        t.content,
        t.created_at,
        u.username,
        u.fullname,
        u.profile_pic,
        m.media_url,
        m.media_type,

        (SELECT COUNT(*) FROM reactions r WHERE r.tweet_id = t.tweet_id) AS like_count,
        (SELECT COUNT(*) FROM retweets rt WHERE rt.tweet_id = t.tweet_id) AS retweet_count,

        EXISTS (
          SELECT 1 FROM reactions r2 
          WHERE r2.tweet_id = t.tweet_id AND r2.user_id = ?
        ) AS isLiked,

        EXISTS (
          SELECT 1 FROM retweets rt2 
          WHERE rt2.tweet_id = t.tweet_id AND rt2.user_id = ?
        ) AS isRetweeted

      FROM reactions r
      JOIN tweets t ON r.tweet_id = t.tweet_id
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN tweet_media m ON t.tweet_id = m.tweet_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC`,
      [currentUserId, currentUserId, userId]
    );

    res.status(200).json({
      message: "User liked tweets fetched successfully",
      likes
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};