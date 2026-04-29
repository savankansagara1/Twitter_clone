import { Request, Response } from "express";
import { AuthenticateRequest } from "../types";
import db from "../config/db";

// Controller for reaction operations

// Function to like a tweet
export const likeTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement like toggle
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `insert into reactions(user_id,tweet_id,isLiked) values (?,?,?)`,
      [user_id, tweetId, true],
    );
    console.log(result);
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Function to unlike a tweet
export const unlikeTweet = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement unlike logic
   const tweetId = req.params.tweetId;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `DELETE from reactions where user_id = ? And tweet_id = ?`,
      [user_id, tweetId],
    );
    console.log(result);
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const likeComment = async (req: AuthenticateRequest, res: Response) => {
  const commentId = req.params.commentId;
  const user_id = req.user?.user_id;
  console.log(commentId)
  console.log(user_id);
  

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Optional: check if comment exists
    const [comment]: any = await db.query(
      `SELECT comment_id FROM comments WHERE comment_id = ?`,
      [commentId]
    );

    if (comment.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Like comment (ignore if already liked)
    const [result] = await db.query(
      `INSERT INTO comment_reaction (user_id, comment_id)
       VALUES (?, ?)`,
      [user_id, commentId]
    );

    res.status(200).json({
      message: "Comment liked successfully",
      result
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const unlikeComment = async (req: AuthenticateRequest, res: Response) => {
  const commentId = req.params.commentId;
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [result]: any = await db.query(
      `DELETE FROM comment_reaction 
       WHERE user_id = ? AND comment_id = ?`,
      [user_id, commentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Like not found or already removed"
      });
    }

    res.status(200).json({
      message: "Comment unliked successfully",
      result
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};