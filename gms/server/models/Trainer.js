import mongoose from 'mongoose';

const TrainerSchema = new mongoose.Schema({
  id: { type: String }, // support migrating local custom id
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  members: { type: Number, default: 0 },
  avatar: { type: String }
});

export default mongoose.model('Trainer', TrainerSchema);
