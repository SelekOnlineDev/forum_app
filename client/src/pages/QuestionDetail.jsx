import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Button from '../components/atoms/Button';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const AnswerForm = styled.div`
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  background-color: #111;
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Courier New', monospace;
`;

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
      setAnswers(res.data.answers || []);
    } catch (err) {
      console.error(err);
      setMsg('Failed to load question');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const postAnswer = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/questions/${id}/answers`, { content: newAnswer });
      setNewAnswer('');
      setMsg('Answer posted!');
      load();
    } catch (err) {
      console.error(err);
      setMsg('Failed to post answer');
    }
  };

  if (loading) return <div style={{ color: '#00ff77' }}>Loading...</div>;
  if (!question) return <div style={{ color: '#ff0000' }}>No question found</div>;

  return (
    <Container>
      <h2>{question.question}</h2>
      {msg && <div style={{ margin: '10px 0', color: '#00ff00' }}>{msg}</div>}
      <h3>Answers ({answers.length})</h3>
      {answers.map(a => (
        <div key={a._id} style={{ padding: '10px', borderBottom: '1px solid #333' }}>
          <p>{a.answer}</p>
          <small style={{ color: '#666' }}>
            By {a.userName} at {new Date(a.createdAt).toLocaleString()}
          </small>
        </div>
      ))}

      <AnswerForm>
        <TextArea
          rows="4"
          placeholder="Your answer..."
          value={newAnswer}
          onChange={e => setNewAnswer(e.target.value)}
        />
        <Button size="medium" onClick={postAnswer} style={{ marginTop: '10px' }}>
          Post Answer
        </Button>
      </AnswerForm>
    </Container>
  );
}
