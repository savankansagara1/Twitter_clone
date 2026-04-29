import { Request, Response } from 'express';
import { AuthenticateRequest } from '../types';
import db from '../config/db';

// Controller for follow operations

// Function to follow a user
export const followUser = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement follow logic 
  const user_id = req.user?.user_id;
  const followee_id = req.params.userId;
  console.log(user_id);
  console.log(followee_id);

  try {
    const [result] = await db.query(
      `INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)`,
      [user_id, followee_id]
    );
    console.log(result);
    res.status(201).json({ message: "Followed successfully", result });    
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  } 
  
};

// Function to unfollow a user
export const unfollowUser = async (req: AuthenticateRequest, res: Response) => {
  // TODO: Implement unfollow logic
  const user_id = req.user?.user_id;
  const followee_id = req.params.id;
  console.log(user_id);
  console.log(followee_id);

  try {
    const [result] = await db.query(
      `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`,
      [user_id, followee_id]
    );
    console.log(result);
    res.status(200).json({ message: "Unfollowed successfully", result });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }   
};