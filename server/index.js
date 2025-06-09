import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

dotenv.config(); // .env su visais kintamaisiais veiks nepriklausomai nuo OS ar paleidimo metodo.

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`;

export const client = new MongoClient(mongoURI); // naudoju MongoDB client kitur controllers/userController.js

const startServer = async () => { 
  try {
    await client.connect(); //iš karto pasiektiu await client.connect() kaip asinchroninį veiksmą
    console.log('Connected to MongoDB');

    app.use('/api', userRoutes);
    app.use('/api', questionRoutes);
    app.use('/api', answerRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on PORT:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

startServer();
