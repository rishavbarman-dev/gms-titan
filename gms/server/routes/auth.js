import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register User
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default Avatar
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      role: role || 'member',
      avatar,
      phone: phone || ''
    });

    const mappedUserId = newUser._id.toString();

    // If role is member or trainer, synchronize their respective collection
    if (newUser.role === 'member') {
      await Member.create({
        id: `m${mappedUserId.slice(-6)}`, // generate unique member ID suffix
        name,
        email,
        phone: phone || '',
        joinDate: new Date().toISOString().split('T')[0],
        plan: 'Basic', // Default plan
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        trainer: 'Jane Smith', // Assigned default trainer
        status: 'Active',
        avatar
      });
    } else if (newUser.role === 'trainer') {
      await Trainer.create({
        id: `t${mappedUserId.slice(-6)}`,
        name,
        email,
        specialization: 'General Fitness',
        experience: '1 year',
        rating: 5.0,
        members: 0,
        avatar
      });
    }

    res.status(201).json({ message: 'Account created successfully! Proceed to login.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const payload = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: payload
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Current User (authenticated)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone || ''
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Profile Details (avatar, phone, password)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { avatar, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle password change if specified
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (avatar) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    // Sync other linked collections (Member, Trainer)
    if (user.role === 'member') {
      await Member.findOneAndUpdate(
        { email: user.email },
        { 
          ...(avatar && { avatar }), 
          ...(phone !== undefined && { phone }) 
        }
      );
    } else if (user.role === 'trainer') {
      await Trainer.findOneAndUpdate(
        { email: user.email },
        { ...(avatar && { avatar }) }
      );
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone || ''
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mock Forgot / Reset Password Endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email' });
    }
    
    res.json({ message: 'A reset password link has been sent to your email (simulated)' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
