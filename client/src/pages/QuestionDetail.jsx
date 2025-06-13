import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const AnswerForm = styled.div`
  margin-top: 20px;
`;

const Forum = () => {
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchAnswers = async () => {
      const res = await api.get(`/questions/${id}/answers`);
      setAnswers(res.data);
    };
    fetchAnswers();
  }, [id]);

  const handleSubmit = async () => {
    await api.post(`/questions/${id}/answers`, { content: newAnswer });
    setNewAnswer('');
    // Perkranu atsakymus
  };

  return (
    <Container>
      <AnswerForm>
        <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
        <button onClick={handleSubmit}>Post Answer</button>
      </AnswerForm>
    </Container>
  );
};