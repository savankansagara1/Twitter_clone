import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../config/db"
import dotenv from "dotenv";
import { User } from "../types/index";
import { RowDataPacket } from "mysql2";

dotenv.config();



interface AuthenticatedRequest extends Request {
    user?: User,
    
}


const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.headers["authorization"];
    if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Token not found" });
    }
    if (token?.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "JWT_SECRET not configured" });
        }

        const decoded = jwt.verify(token, secret) as JwtPayload
        console.log(decoded);

         const [rows] = await db.query<User[]>(
      `SELECT * FROM users WHERE user_id = ?`,
      [decoded.id],
    );
    console.log(rows);
    

    if (rows.length == 0) {
      res.status(404).json({ message: "User Not found." });
      return;
    }
    req.user = rows[0];

        next()
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export { verifyToken };