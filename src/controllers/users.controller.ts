import { Request, Response } from "express";
import db from "../config/db";
import { User } from "../types";

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
export const getFollowers = async (req: Request, res: Response) => {
  // TODO: Implement followers retrieval
 
};

// Function to get following
export const getFollowing = async (req: Request, res: Response) => {
  // TODO: Implement following retrieval
};
