import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' }
});

export default mongoose.model('Payment', PaymentSchema);
