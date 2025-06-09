import { client } from '../index.js';
import { ObjectId } from 'mongodb';

const db = client.db(process.env.DB_NAME);
const answers = db.collection('answers');

export const getAnswersByQuestionId = async (req, res) => {
  const { id } = req.params;
  const result = await answers.find({ questionId: id }).toArray();
  res.json(result);
};

export const createAnswer = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const newAnswer = {
    questionId: id,
    content,
    creatorId: req.user.id,
    createdAt: new Date(),
  };

  await answers.insertOne(newAnswer);
  res.status(201).json({ message: 'Answer created' });
};

export const updateAnswer = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  await answers.updateOne(
    { _id: new ObjectId(id) },
    { $set: { content } }
  );

  res.json({ message: 'Answer updated' });
};

export const deleteAnswer = async (req, res) => {
  const { id } = req.params;
  await answers.deleteOne({ _id: new ObjectId(id) });
  res.json({ message: 'Answer deleted' });
};
