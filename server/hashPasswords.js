import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`;

async function hashExistingPasswords() {
  const client = new MongoClient(mongoURI);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection('users');
    
    const allUsers = await users.find({}).toArray();
    
    for (const user of allUsers) {
      if (!user.password.startsWith('$2a$')) { // Patikrinu ar ne hashintas
        const hashed = await bcrypt.hash(user.password, 10);
        await users.updateOne(
          { _id: user._id },
          { $set: { password: hashed } }
        );
        console.log(`Updated password for ${user.email}`);
      }
    }
    
    console.log('All passwords hashed successfully');
  } catch (err) {
    console.error('Error hashing passwords:', err);
  } finally {
    await client.close();
  }
}

hashExistingPasswords();