import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Import routes
import projectRoutes from './routes/projects';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

// Export auth middleware for use in other files
export { authMiddleware, requireRole, requireAuth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check (no database required)
app.use('/api', healthRoutes);

// API Routes (require database)
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Try to connect to database, but don't fail if it's not available
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.warn('⚠️ Database not available, running in limited mode');
      console.warn('Database error:', dbError);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend: http://localhost:3000`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer(); 