import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';

import { authenticateToken } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import membersRouter from './routes/members.js';
import trainersRouter from './routes/trainers.js';
import attendanceRouter from './routes/attendance.js';
import paymentsRouter from './routes/payments.js';
import workoutPlansRouter from './routes/workoutPlans.js';
import dietPlansRouter from './routes/dietPlans.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/titan_gms';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Direct status route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/members', authenticateToken, membersRouter);
app.use('/api/trainers', authenticateToken, trainersRouter);
app.use('/api/attendance', authenticateToken, attendanceRouter);
app.use('/api/payments', authenticateToken, paymentsRouter);
app.use('/api/workout-plans', authenticateToken, workoutPlansRouter);
app.use('/api/diet-plans', authenticateToken, dietPlansRouter);
app.use('/api/analytics', authenticateToken, analyticsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB and then start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`=========================================`);
    console.log(`🚀 TITAN GMS CONNECTED TO MONGO DATABASE`);
    console.log(`🌐 Mongo URI: ${MONGODB_URI}`);
    console.log(`=========================================`);
    
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 TITAN GMS SERVER LAUNCHED ON PORT ${PORT}`);
      console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    console.log('⚠️ Running Express server anyway (Database actions will fail until MongoDB is active)...');
    
    app.listen(PORT, () => {
      console.log(`🚀 TITAN GMS SERVER BOOTED ON PORT ${PORT} (Database Offline)`);
    });
  });
