import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

dotenv.config(); // .env su visais kintamaisiais veiks nepriklausomai nuo OS ar paleidimo metodo.

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
};

// const fixLikesDislikes = async () => {
//   try {
//     const db = await getDb();
    
//     // Pridėudu trūkstamus laukus naujiems klausimams
    
//     await db.collection('questions').updateMany(
//       { 
//         $or: [
//           { likes: { $exists: false } },
//           { dislikes: { $exists: false } },
//           { likedBy: { $exists: false } },
//           { dislikedBy: { $exists: false } }
//         ]
//       },
//       { 
//         $set: { 
//           likes: 0,
//           dislikes: 0,
//           likedBy: [],
//           dislikedBy: [] 
//         } 
//       }
//     );

//     const questionsToFix = await db.collection('questions').find({
//       $or: [
//         { likes: { $type: 'array' } },
//         { dislikes: { $type: 'array' } }
//       ]
//     }).toArray();

//     for (const question of questionsToFix) {
//       await db.collection('questions').updateOne(
//         { _id: question._id },
//         { 
//           $set: { 
//             likes: Array.isArray(question.likes) ? question.likes.length : question.likes,
//             dislikes: Array.isArray(question.dislikes) ? question.dislikes.length : question.dislikes
//           } 
//         }
//       );
//     }

//     console.log('Likes and dislikes fixed successfully');
//   } catch (err) {
//     console.error('Error fixing likes and dislikes:', err);
//   }
// };

// // Iškviečiu funkciją fixLikesDislikes() prieš serverio paleidimą

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

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(mongoURI);

let db = null;

// Exportuojama funkcija, kuria naudojasi visi controlleriai

export const getDb = async () => {
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

const startServer = async () => {
  try {
    await getDb(); // prisijungimas įvyksta prieš paleidžiant serverį
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
