import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dormRoutes from './routes/dormRoutes.js';
import Dorm from './models/dormModel.js';
import dormData from './dormData.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect('mongodb+srv://amandaadjei128:A0607A2004@cluster0.159unzv.mongodb.net/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    await Dorm.deleteMany(); // Clear existing dorm data
    await Dorm.insertMany(dormData);
    console.log('Database seeded with dorm data');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  seedDatabase();
});

app.use('/api', dormRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});