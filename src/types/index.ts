import { RowDataPacket } from "mysql2";

export interface jwtPayload {
    id: number;
    username: string;
    email:string;
}

export interface JWT_SECRET{
    secret: string;
}

export interface User extends RowDataPacket {
    user_id: number;
    fullname: string;
    username: string;
    email: string;
    dob: Date;
    hashed_password: string;
    bio?: string;
    country?: string;
    profile_image_url?: string;
    cover_image_url?: string;
    created_at: Date;
}
