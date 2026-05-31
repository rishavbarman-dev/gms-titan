import express from 'express';
import Attendance from '../models/Attendance.js';
import Member from '../models/Member.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Attendance Logs
router.get('/', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    let query = {};
    
    // If member, scope the logs to only their own attendance
    if (req.user.role === 'member') {
      const member = await Member.findOne({ email: req.user.email });
      if (member) {
        query = { memberId: member.id };
      } else {
        return res.json([]);
      }
    }
    
    const logs = await Attendance.find(query);
    res.json(logs);
  } catch (error) {
    console.error('Fetch attendance error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Member Check-in
router.post('/checkin', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    let { memberId, memberName } = req.body;

    // Secure check-in: If member, force they can only check in themselves
    if (req.user.role === 'member') {
      const member = await Member.findOne({ email: req.user.email });
      if (!member) {
        return res.status(404).json({ error: 'Member profile not found' });
      }
      memberId = member.id;
      memberName = member.name;
    }

    let targetMemberId = memberId;
    let targetMemberName = memberName;

    // If memberId is provided, attempt to resolve actual member details
    if (memberId) {
      const member = await Member.findOne({ id: memberId });
      if (member) {
        targetMemberName = member.name;
      }
    } else if (memberName) {
      // If only name provided, search matching member
      const member = await Member.findOne({ name: { $regex: new RegExp(`^${memberName}$`, 'i') } });
      if (member) {
        targetMemberId = member.id;
        targetMemberName = member.name;
      } else {
        targetMemberId = 'guest';
      }
    } else {
      return res.status(400).json({ error: 'Member ID or Member Name is required' });
    }

    // Check if member already has an active session today (checked in but not checked out)
    const todayStr = new Date().toISOString().split('T')[0];
    const activeSession = await Attendance.findOne({
      memberId: targetMemberId,
      date: todayStr,
      checkOut: '--:--'
    });

    if (activeSession) {
      return res.status(400).json({ error: 'You are already checked in for today' });
    }

    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const checkInTime = now.toLocaleTimeString('en-US', timeOptions);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newLog = await Attendance.create({
      id: `att${randomSuffix}`,
      memberId: targetMemberId,
      memberName: targetMemberName,
      date: now.toISOString().split('T')[0],
      checkIn: checkInTime,
      checkOut: '--:--',
      status: 'Present'
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Member Check-out
router.post('/checkout/:id', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    const log = await Attendance.findOne({ id: req.params.id });
    if (!log) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Secure check-out: If member, make sure it is their own attendance log
    if (req.user.role === 'member') {
      const member = await Member.findOne({ email: req.user.email });
      if (!member || String(log.memberId) !== String(member.id)) {
        return res.status(403).json({ error: 'Access forbidden: Cannot check out other members' });
      }
    }

    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const checkOutTime = now.toLocaleTimeString('en-US', timeOptions);

    const updated = await Attendance.findOneAndUpdate(
      { id: req.params.id },
      { checkOut: checkOutTime },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
