import express from 'express';
import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get Dashboard Analytics
router.get('/', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    let members = await Member.find({});
    let trainers = await Trainer.find({});
    let payments = await Payment.find({});
    let attendance = await Attendance.find({});

    const isTrainer = req.user.role === 'trainer';
    let trainerRating = 5.0;

    if (isTrainer) {
      const trainer = await Trainer.findOne({ email: req.user.email });
      if (trainer) {
        trainerRating = trainer.rating;
        const trainerName = trainer.name;
        // Scope collections to members assigned to this trainer
        members = members.filter(m => m.trainer === trainerName);
        payments = payments.filter(pay => members.some(m => String(m.id) === String(pay.memberId)));
        attendance = attendance.filter(log => members.some(m => String(m.id) === String(log.memberId)));
      } else {
        members = [];
        payments = [];
        attendance = [];
      }
    }

    // 1. Basic Stats
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Active').length;
    const totalTrainers = isTrainer ? trainerRating : trainers.length;
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);

    // 2. Compute dynamic Revenue by Month (past 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly tracker for the past 6 calendar months
    const now = new Date();
    const pastMonths = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      pastMonths.push({
        index: d.getMonth(),
        year: d.getFullYear(),
        name: months[d.getMonth()],
        value: 0
      });
    }

    // Accumulate actual payments
    payments.forEach(pay => {
      if (pay.status !== 'Paid') return;
      const payDate = new Date(pay.date);
      if (isNaN(payDate.getTime())) return;
      
      const pMonth = payDate.getMonth();
      const pYear = payDate.getFullYear();
      
      const bucket = pastMonths.find(m => m.index === pMonth && m.year === pYear);
      if (bucket) {
        bucket.value += pay.amount;
      }
    });

    const revenueChart = pastMonths.map(m => ({ name: m.name, value: m.value }));

    // 3. Compute dynamic Weekly Attendance
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const attendanceChart = weekdayNames.map(day => ({ name: day, value: 0 }));

    // Count present records per weekday
    attendance.forEach(att => {
      const attDate = new Date(att.date);
      if (isNaN(attDate.getTime())) return;
      
      const dayName = weekdayNames[attDate.getDay()];
      const bucket = attendanceChart.find(d => d.name === dayName);
      if (bucket) {
        bucket.value += 1;
      }
    });

    res.json({
      stats: {
        totalMembers,
        activeMembers,
        totalTrainers,
        totalRevenue
      },
      charts: {
        revenue: revenueChart,
        attendance: attendanceChart
      }
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
