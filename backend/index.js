import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dormRoutes from './routes/dormRoutes.js';
import { connectMongo } from './db/connection.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req, res) => res.send("API running"));
app.use('/api', dormRoutes);

async function start() {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

start();