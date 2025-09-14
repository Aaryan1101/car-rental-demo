import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import connectDB from "./Configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

// Resolving dirname issue in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
       origin: "http://localhost:5173", // set to your frontend URL
       credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//API routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Serve static files from React build
const staticPath = path.join(__dirname, "Client", "dist");
console.log('Static files path:', staticPath);
app.use(express.static(staticPath));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  console.log('Catch-all route hit for path:', req.path);
  
  if (req.path.startsWith('/api/')) {
    console.log('Returning 404 for API route:', req.path);
    return res.status(404).json({ message: 'API route not found' });
  }
  
  const indexPath = path.join(__dirname, "Client", "dist", "index.html");
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// Connect DB and then start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on host 0.0.0.0 port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1);
    }
}

startServer();

export default app;
