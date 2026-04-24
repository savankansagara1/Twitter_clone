import express from "express";
import type { Request, Response, Application } from "express";
import db from "./config/db"
import authRoutes from "./routes/auth.routes"

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
app.use("/api/auth",authRoutes)




// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
