import { client } from '../index.js';
const db = client.db(process.env.DB_NAME);
const questions = db.collection('questions');

export const getAllQuestions = async (req, res) => {
  const result = await questions.find().toArray();
  res.json(result);
};

export const createQuestion = async (req, res) => {
  const { title, content } = req.body;

  const newQ = {
    title,
    content,
    creatorId: req.user.id,
    createdAt: new Date(),
  };

  await questions.insertOne(newQ);
  res.status(201).json({ message: 'Question created' });
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  await questions.updateOne(
    { _id: id },
    { $set: { title, content } }
  );

  res.json({ message: 'Question updated' });
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  await questions.deleteOne({ _id: id });
  res.json({ message: 'Question deleted' });
};
