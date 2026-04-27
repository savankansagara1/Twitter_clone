import express from "express";
import type { Request, Response, Application } from "express";
import db from "./config/db"

import { errorHandler } from './middleware/error.middleware';
import { Router } from 'express';

import authRoutes from "./routes/auth.routes"
import usersRoutes from './routes/users.routes';
import tweetsRoutes from './routes/tweets.routes';
import mediaRoutes from './routes/media.routes';
import followsRoutes from './routes/follows.routes';
import reactionsRoutes from './routes/reactions.routes';
import commentsRoutes from './routes/comments.routes';
import notificationsRoutes from './routes/notifications.routes';


import cors from "cors"


const app: Application = express();
const port = 3000; // The port your express server will be running on.
app.use(cors({
  origin: "http://localhost:5173", // Change to your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
}));
db
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());


//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tweets', tweetsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);




// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
