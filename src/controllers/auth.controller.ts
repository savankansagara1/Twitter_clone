import db from "../config/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";
import { jwtPayload, JWT_SECRET } from "../types";
import env from "dotenv";

dotenv.config();

// In-memory store for OTPs to avoid DB changes.
// Key: email, Value: { otp: string, expiresAt: number }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

async function signUp(req: Request, res: Response) {
    try {
        console.log(req.body);

        const { fullname, username, email, dob, bio, country, profile_pic, cover_pic } = req.body;
        console.log(req.body);

        const hashed_password = await bcrypt.hash(req.body.hashed_password, 8);
        // const role_name = "user";
        console.log(hashed_password);

        // const [roleRows] = await db.query<RowDataPacket[]>(
        //   `SELECT role_id,role_name From roles WHERE role_name = ? `,
        //   [role_name],
        // );

        // const role_id: number = roleRows[0].role_id;
        // console.log(role_id);

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (fullname, username, email, dob, hashed_password, bio, country, profile_pic, cover_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullname, username, email, dob, hashed_password, bio, country, profile_pic, cover_pic],
        );

        res.status(201).json({
            id: result.insertId,    
            user: { username, email },
            message: "user created successfully",
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: "Identifier and password are required" })
        }

        const [rows] = await db.query<RowDataPacket[]>(
            `select * from users where username = ? or email = ?`,
            [identifier, identifier]
        );
        console.log([rows]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }
        const user = rows[0];
        // console.log(user);
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const payload: jwtPayload = {
            id: user.user_id,
            username: user.username,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            algorithm: "HS256",
            expiresIn: 86400,
        });
        console.log(token);

        res.status(200).json({
            accessToken: token,
            message: "Login successful",
        });

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
async function forgotPassword(req: Request, res: Response) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        // Generate 6 digit random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiration in 5 minutes
        const expiresAt = Date.now() + 5 * 60 * 1000;
        
        otpStore.set(email, { otp, expiresAt });

        res.status(200).json({
            message: "OTP generated successfully",
            otp: otp // Sending OTP in response as a mock for email
        });

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

async function resetPassword(req: Request, res: Response) {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const storedOtpData = otpStore.get(email);

        if (!storedOtpData) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (Date.now() > storedOtpData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // Valid OTP, hash new password
        const hashed_password = await bcrypt.hash(newPassword, 8);

        await db.query(
            `UPDATE users SET hashed_password = ? WHERE email = ?`,
            [hashed_password, email]
        );

        // Clear the OTP from memory
        otpStore.delete(email);

        res.status(200).json({ message: "Password reset successfully" });

    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}

export { signUp, signIn, forgotPassword, resetPassword };