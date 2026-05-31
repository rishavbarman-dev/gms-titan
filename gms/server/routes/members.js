import express from 'express';
import bcrypt from 'bcryptjs';
import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Members
router.get('/', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    let query = {};
    
    // If trainer, scope the members to only those assigned to them
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ email: req.user.email });
      if (trainer) {
        query = { trainer: trainer.name };
      } else {
        return res.json([]);
      }
    }
    
    const members = await Member.find(query);
    res.json(members);
  } catch (error) {
    console.error('Fetch members error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create Member
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, phone, plan, trainer, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // Hash default password 'password123'
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create User record first
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      role: 'member',
      avatar
    });

    const mappedUserId = newUser._id.toString();
    const joinDate = new Date().toISOString().split('T')[0];
    
    // Default 30-day expiry
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newMember = await Member.create({
      id: `m${mappedUserId.slice(-6)}`,
      name,
      email,
      phone: phone || '',
      joinDate,
      plan: plan || 'Basic',
      expiryDate,
      trainer: trainer || 'John Doe',
      status: status || 'Active',
      avatar
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Member
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, phone, plan, trainer, status, expiryDate } = req.body || {};
    
    const member = await Member.findOne({ id: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const updated = await Member.findOneAndUpdate(
      { id: req.params.id },
      {
        name: name || member.name,
        email: email || member.email,
        phone: phone !== undefined ? phone : member.phone,
        plan: plan || member.plan,
        trainer: trainer || member.trainer,
        status: status || member.status,
        expiryDate: expiryDate || member.expiryDate
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Member
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await Member.findOneAndDelete({ id: req.params.id });
    // Also delete associated User record
    await User.findOneAndDelete({ email: member.email });

    res.json({ message: 'Member deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
