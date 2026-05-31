import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import User from './models/User.js';
import Trainer from './models/Trainer.js';
import Member from './models/Member.js';
import Payment from './models/Payment.js';
import Attendance from './models/Attendance.js';
import WorkoutPlan from './models/WorkoutPlan.js';
import DietPlan from './models/DietPlan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');
const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB at ' + MONGODB_URI + '...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');

    // Read local db.json
    if (!fs.existsSync(DB_FILE)) {
      console.log('❌ No local db.json file found to migrate!');
      process.exit(1);
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const localDb = JSON.parse(raw);

    // Clear existing DB
    console.log('🗑️ Clearing existing collections...');
    await User.deleteMany({});
    await Trainer.deleteMany({});
    await Member.deleteMany({});
    await Payment.deleteMany({});
    await Attendance.deleteMany({});
    await WorkoutPlan.deleteMany({});
    await DietPlan.deleteMany({});

    // Import collections
    if (localDb.users && localDb.users.length > 0) {
      console.log(`👤 Importing ${localDb.users.length} Users...`);
      await User.insertMany(localDb.users);
    }
    if (localDb.trainers && localDb.trainers.length > 0) {
      console.log(`🏋️‍♂️ Importing ${localDb.trainers.length} Trainers...`);
      await Trainer.insertMany(localDb.trainers);
    }
    if (localDb.members && localDb.members.length > 0) {
      console.log(`💪 Importing ${localDb.members.length} Members...`);
      await Member.insertMany(localDb.members);
    }
    if (localDb.payments && localDb.payments.length > 0) {
      console.log(`💳 Importing ${localDb.payments.length} Payments...`);
      await Payment.insertMany(localDb.payments);
    }
    if (localDb.attendance && localDb.attendance.length > 0) {
      console.log(`📅 Importing ${localDb.attendance.length} Attendance logs...`);
      await Attendance.insertMany(localDb.attendance);
    }
    if (localDb.workoutPlans && localDb.workoutPlans.length > 0) {
      console.log(`🏋️‍♀️ Importing ${localDb.workoutPlans.length} Workout plans...`);
      await WorkoutPlan.insertMany(localDb.workoutPlans);
    }
    if (localDb.dietPlans && localDb.dietPlans.length > 0) {
      console.log(`🥗 Importing ${localDb.dietPlans.length} Diet plans...`);
      await DietPlan.insertMany(localDb.dietPlans);
    }

    console.log('🎉 Database seeding and migration completed successfully!');
    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
