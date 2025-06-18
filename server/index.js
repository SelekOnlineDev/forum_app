import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

dotenv.config(); // .env su visais kintamaisiais veiks nepriklausomai nuo OS ar paleidimo metodo.

// Patikrinimas, ar .env faile yra apibrėžtas JWT_SECRET

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
};

// Patikrinimas, ar .env faile yra apibrėžtas DB_USER ir DB_USER_PASSWORD

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors({ 
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json());

// Serverio diagnostika: Middleware, kuris logina kiekvieną užklausą

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB prisijungimo nustatymai

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; // Sukuriu MongoDB URI su aplinkos kintamaisiais
const client = new MongoClient(mongoURI); // Sukuriu MongoDB klientą su URI

let db = null; // MongoDB bazės objekto nustatymas

// Exportuojama funkcija, kuria naudojasi visi controlleriai

export const getDb = async () => { // Funkcija, kuri grąžina MongoDB duomenų bazės objektą
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
  return db;
};

// Funkcija, kuri taiso atsakymų skaičių kiekvienam klausimui

const fixAnswerCounts = async () => {
  try {
    const db = await getDb(); // Gaunu duomenų bazę
    const questions = await db.collection('questions').find({}).toArray(); // Gaunu visus klausimus
    
    for (const q of questions) {
      const answerCount = await db.collection('answers') // Skaičiuoju atsakymų skaičių kiekvienam klausimui
        .countDocuments({ questionId: q._id });
      
      await db.collection('questions').updateOne( // Atlieku atnaujinimą klausimo dokumente
        { _id: q._id },
        { $set: { answerCount } }
      );
    }
    console.log('Answer counts fixed!');
  } catch (err) {
    console.error('Error fixing answer counts:', err);
  }
};

// Pagrindinė funkcija, kuri paleidžia serverį ir prisijungia prie DB

const startServer = async () => { 
  try {
    await getDb(); // prisijungimas įvyksta prieš paleidžiant serverį
    await fixAnswerCounts(); // Ištaisau atsakymų skaičių prieš paleidžiant serverį
    // await fixLikesDislikes(); // Ištaisau likes ir dislikes prieš paleidžiant serverį

    app.use('/api', userRoutes);
    app.use('/api', questionRoutes);
    app.use('/api', answerRoutes);

    // Testinis maršrutas, kad patikrinti ar serveris veikia

    app.get('/api/test', (req, res) => {
     console.log('Test route reached!');
     res.status(200).json({ message: 'Server is working!' });
      });


    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // išeina jei nepavyksta prisijungti prie DB
  }
};

startServer();
