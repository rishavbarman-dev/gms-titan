import express from 'express';
import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get All Payments
router.get('/', requireRole(['admin', 'member']), async (req, res) => {
  try {
    let query = {};
    
    // If member, scope the payments to only their own payments
    if (req.user.role === 'member') {
      const member = await Member.findOne({ email: req.user.email });
      if (member) {
        query = { memberId: member.id };
      } else {
        return res.json([]);
      }
    }
    
    const payments = await Payment.find(query);
    res.json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create/Record Transaction
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { memberId, amount, method, status } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ error: 'Member ID and amount are required' });
    }

    const member = await Member.findOne({ id: memberId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newPayment = await Payment.create({
      id: `pay${randomSuffix}`,
      memberId,
      memberName: member.name,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      method: method || 'Credit Card',
      status: status || 'Paid'
    });

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
