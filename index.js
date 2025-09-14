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

// Routes
// app.get("/", (req, res) => res.send("Express on Vercel"));
// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

//API routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Use the client app
app.use(express.static(path.join(__dirname,"/Client/dist")))

// Render client for any other route - Using regex pattern for compatibility
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, '/Client/dist/index.html')));

// Error logging for undefined routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Connect DB and then start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1); // Exit the process with an error code
    }
}

startServer();

export default app;
