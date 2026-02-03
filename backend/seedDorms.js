import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Dorm from './models/dormModel.js';
import dormData from './dormData.js';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment (.env)');
    process.exit(1);
  }

  const shouldDrop = process.argv.includes('--drop') || process.argv.includes('-d');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  if (shouldDrop) {
    const result = await Dorm.deleteMany({});
    console.log(`Dropped ${result.deletedCount ?? 0} existing dorm(s)`);
  }

  const count = await Dorm.countDocuments();
  if (count > 0 && !shouldDrop) {
    console.log(
      `Dorm collection already has ${count} dorm(s). Skipping seed. (Run: npm run seed:drop to reseed)`
    );
    await mongoose.disconnect();
    return;
  }

  const inserted = await Dorm.insertMany(dormData);
  console.log(`Seeded ${inserted.length} dorm(s)`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seeding failed:', err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
