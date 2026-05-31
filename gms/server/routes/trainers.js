import express from 'express';
import bcrypt from 'bcryptjs';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Trainers
router.get('/', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    const trainers = await Trainer.find({});
    res.json(trainers);
  } catch (error) {
    console.error('Fetch trainers error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hire/Add Trainer
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, specialization, experience } = req.body;

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

    // Create User record first to get _id
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      role: 'trainer',
      avatar
    });

    const mappedUserId = newUser._id.toString();

    const newTrainer = await Trainer.create({
      id: `t${mappedUserId.slice(-6)}`,
      name,
      email,
      specialization: specialization || 'General Fitness',
      experience: experience || '1 Year',
      rating: 5.0, // default new trainer rating
      members: 0,  // default new trainer member count
      avatar
    });

    res.status(201).json(newTrainer);
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Trainer
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, specialization, experience, rating, members } = req.body || {};

    const trainer = await Trainer.findOne({ id: req.params.id });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const updated = await Trainer.findOneAndUpdate(
      { id: req.params.id },
      {
        name: name || trainer.name,
        email: email || trainer.email,
        specialization: specialization || trainer.specialization,
        experience: experience || trainer.experience,
        rating: rating !== undefined ? parseFloat(rating) : trainer.rating,
        members: members !== undefined ? parseInt(members) : trainer.members
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update trainer error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Trainer
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ id: req.params.id });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    await Trainer.findOneAndDelete({ id: req.params.id });
    // Also delete associated User record
    await User.findOneAndDelete({ email: trainer.email });

    res.json({ message: 'Trainer deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete trainer error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
