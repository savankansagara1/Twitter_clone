import { Request, Response } from 'express';
import db from '../config/db';
import { AuthenticateRequest } from '../types';

// Controller for comment operations

// Function to create a comment
export const createComment = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement comment creation
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `INSERT INTO comments (user_id, tweet_id, comment_content) VALUES (?, ?, ?)`,
      [user_id, tweetId, req.body.content]
    );
    console.log(result);
    res.status(201).json({ message: "Comment created successfully", result });    
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

//get commnets by tweetID

export const getCommentsByTweet = async (req: Request, res: Response) => {
  const tweetId = req.params.tweetId;

  try {
    const [comments]: any = await db.query(
      `SELECT 
         c.comment_id, 
         c.comment_content, 
         c.created_at, 
         u.username, 
         u.fullname, 
         u.profile_pic
       FROM comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.tweet_id = ? 
       AND c.parent_comment_id IS NULL
       ORDER BY c.created_at DESC`,
      [tweetId]
    );

    res.status(200).json({
      message: "Comments fetched successfully",
      comments
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const getCommentsReply = async (req: Request, res: Response) => {
  const parentCommentId = req.params.commentId;

  try {
    const [replies]: any = await db.query(
      `SELECT 
         c.comment_id, 
         c.comment_content, 
         c.created_at, 
         u.username, 
         u.fullname, 
         u.profile_pic
       FROM comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.parent_comment_id = ?
       ORDER BY c.created_at ASC`,
      [parentCommentId]
    );

    res.status(200).json({
      message: "Replies fetched successfully",
      replies
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const replyToComment = async (req: AuthenticateRequest, res: Response) => {
  const parentCommentId = req.params.commentId;
  const user_id = req.user?.user_id;
  const { content } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    // Get tweet_id from parent comment (important to maintain thread integrity)
    const [parent]: any = await db.query(
      `SELECT tweet_id FROM comments WHERE comment_id = ?`,
      [parentCommentId]
    );

    if (parent.length === 0) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const tweetId = parent[0].tweet_id;

    // Insert reply
    const [result] = await db.query(
      `INSERT INTO comments (user_id, tweet_id, comment_content, parent_comment_id)
       VALUES (?, ?, ?, ?)`,
      [user_id, tweetId, content, parentCommentId]
    );

    res.status(201).json({
      message: "Reply added successfully",
      result
    });

  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Function to delete a comment
export const deleteComment = async (req: AuthenticateRequest, res: Response) => {
  const commentId = req.params.id;
  const user_id = req.user?.user_id;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if comment exists and belongs to the user
    const [rows]: any = await db.query(
      `SELECT user_id FROM comments WHERE comment_id = ?`,
      [commentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Forbidden: You can't delete this comment" });
    }

    // Delete comment (replies will be handled by FK constraints)
    const [result] = await db.query(
      `DELETE FROM comments WHERE comment_id = ?`,
      [commentId]
    );

    res.status(200).json({
      message: "Comment deleted successfully",
      result
    });

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};