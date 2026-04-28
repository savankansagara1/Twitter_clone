import { Request, Response } from 'express';
import db from '../config/db';
import { AuthenticateRequest } from '../types';

// Controller for comment operations

// Function to create a comment
export const createComment = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement comment creation
  const tweetId = req.params.id;
  console.log(tweetId);

  const user_id = req.user?.user_id;
  console.log(user_id);

  try {
    const [result] = await db.query(
      `INSERT INTO comments (user_id, tweet_id, content) VALUES (?, ?, ?)`,
      [user_id, tweetId, req.body.content]
    );
    console.log(result);
    res.status(201).json({ message: "Comment created successfully", result });    
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Function to get comments
export const getComments = async (req: Request, res: Response) => {
  // TODO: Implement comments retrieval

  
};

// Function to delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  // TODO: Implement comment deletion
};