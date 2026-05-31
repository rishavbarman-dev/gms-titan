import express from 'express';
import WorkoutPlan from '../models/WorkoutPlan.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Workout Plans
router.get('/', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({});
    res.json(plans);
  } catch (error) {
    console.error('Fetch workout plans error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create Workout Plan
router.post('/', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    const { name, level, exercises } = req.body;

    if (!name || !level) {
      return res.status(400).json({ error: 'Name and difficulty level are required' });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newPlan = await WorkoutPlan.create({
      id: `wp${randomSuffix}`,
      name,
      level,
      exercises: exercises || []
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Create workout plan error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Workout Plan
router.delete('/:id', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ id: req.params.id });
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    await WorkoutPlan.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Workout plan deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
