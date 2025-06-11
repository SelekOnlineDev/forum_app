import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

const Card = styled.div`
  background-color: #000;
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.3);
  }
`;

const Title = styled.h3`
  color: #00ff00;
  margin-top: 0;
`;

const Meta = styled.div`
  color: #aaa;
  font-size: 0.9rem;
`;

export const QuestionCard = ({ question, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Title>{question.question}</Title>
      <Meta>
        Asked by {question.userName} • {new Date(question.createdAt).toLocaleDateString()}
      </Meta>
    </Card>
  );
};