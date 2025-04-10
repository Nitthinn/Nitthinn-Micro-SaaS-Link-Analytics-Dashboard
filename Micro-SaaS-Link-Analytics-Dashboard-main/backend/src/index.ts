import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute';
import urlRoutes from './routes/urlRoute';
import redirectRoutes from './routes/redirectRoute';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || '3001';
const mongoUri = process.env.MONGO_URI!;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', urlRoutes);
app.use('/api/auth/analytics', analyticsRoutes);
app.use((req, res) => {
  res.status(404).send('Not Found');
});
app.use('/', redirectRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>This is backend</h1>');
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
