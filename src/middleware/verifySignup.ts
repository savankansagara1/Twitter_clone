import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { RowDataPacket } from "mysql2";
// import { User } from "../types";


export const checkDuplicateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { username, email } = req.body;
        console.log(req.body);
        const [rows] = await db.query<RowDataPacket[]>(
            `
            SELECT * from users WHERE email = ? or username = ?`,
            [email, username],
        );
        console.log(rows);
        // res.json({ email: rows[0].email });
        if (rows.length > 0) {
            res.status(404).json({
                message: "user already exist",
            });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
