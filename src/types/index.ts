import { RowDataPacket } from "mysql2";

export interface jwtPayload {
    id: number;
    username: string;
    email:string;
}

export interface JWT_SECRET{
    secret: string;
}