import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../index.js'; 

// Gaunu visus atsakymus pagal klausimo ID

export const getAnswersByQuestionId = async (req, res) => {
  try {
    const db = await getDb(); 
    const { id } = req.params;
    const result = await db.collection('answers').find({ questionId: id }).toArray(); 
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Sukuriu naują atsakymą į klausimąs

export const createAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { content } = req.body;

    // Patikrinu, ar klausimas egzistuoja

    const newAnswer = {
       _id: uuidv4(),
      questionId: id, // Klausimo ID, į kurį atsakoma
      answer: content, // Atsakymo turinys
      userId: req.user.id, // Prisijungusio vartotojo ID
      createdAt: new Date().toISOString(),
    };

    // Patikrinimas, ar vartotojas yra prisijungęs
    
    await db.collection('answers').insertOne(newAnswer);
    await db.collection('questions').updateOne(
      { _id: id }, 
      { $inc: { answerCount: 1 } } 
    );
    res.status(201).json({ message: 'Answer created' });
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Atnaujinu atsakymą pagal ID

export const updateAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { content } = req.body;

    // Pridedu savininko patikrinimą
    
    const answer = await db.collection('answers').findOne({ _id: id }); // Patikrinimas, ar atsakymas egzistuoja

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Tikrinu ar vartotojas yra atsakymo savininkas

    if (answer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Atnaujinimas

    const result = await db.collection('answers').updateOne(
      { _id: id },
      { 
      $set: { 
        answer: content,
        updatedAt: new Date().toISOString() 
      } 
    }
  );

    // Patikrinimas, ar atsakymas egzistuoja

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Answer not found' }); 
    }

    // Patikrinu ar ID yra teisingas

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    res.status(200).json({ message: 'Answer updated' });
  } catch (err) {
    console.error('Error updating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ištrinu atsakymą pagal ID

export const deleteAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    // Patikrinu savininką

    const answer = await db.collection('answers').findOne({ _id: id }); //Patikrinimas, ar atsakymas egzistuoja
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Tikrinu ar vartotojas yra atsakymo savininkas ir turi teisę ištrinti

    if (answer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this answer' });
    }

    // Ištrinu atsakymą

    const result = await db.collection('answers').deleteOne({ _id: id }); 
    await db.collection('questions').updateOne(
         { _id: answer.questionId },
         { $inc: { answerCount: -1 } }
    );

    // Patikrinu ar atsakymas buvo ištrintas

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Answer not found' });
    } 

    // Patikrinu ar ID yra teisingas

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    // Atsakymas sėkmingai ištrintas

    res.status(200).json({ message: 'Answer deleted' });
  } catch (err) {
    console.error('Error deleting answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
