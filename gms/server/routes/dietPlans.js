import express from 'express';
import DietPlan from '../models/DietPlan.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Diet Plans
router.get('/', requireRole(['admin', 'trainer', 'member']), async (req, res) => {
  try {
    const plans = await DietPlan.find({});
    res.json(plans);
  } catch (error) {
    console.error('Fetch diet plans error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create Diet Plan
router.post('/', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    const { name, calories, macros, meals } = req.body;

    if (!name || !calories) {
      return res.status(400).json({ error: 'Name and calorie target are required' });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newPlan = await DietPlan.create({
      id: `dp${randomSuffix}`,
      name,
      calories: parseInt(calories),
      macros: macros || { protein: '30%', carbs: '40%', fat: '30%' },
      meals: meals || []
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Diet Plan
router.delete('/:id', requireRole(['admin', 'trainer']), async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ id: req.params.id });
    if (!plan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    await DietPlan.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Diet plan deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete diet plan error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
