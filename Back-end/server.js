// app.js or server.js
import express from 'express';
import connectDb from './config/db.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import routes
import authRoutes from './Routes/authRoute.js';
import blogsRoutes from './Routes/blogsRoutes.js';
import categoryRote from './Routes/categoryRote.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Required for cookie handling

connectDb();
const apiOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ['http://localhost:5173'];

// CORS configuration
app.use(cors({
  origin: apiOrigin,
  credentials: true // Important for cookies
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/categories', categoryRote);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;