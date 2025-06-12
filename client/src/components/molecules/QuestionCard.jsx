import React from 'react';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import Button from '../atoms/Button';

const Card = styled.div`
  background-color: #000;
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 20px;
  position: relative;
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
  margin-right: 40px;
`;

const Meta = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Badge = styled.span`
  background-color: ${({ answered }) => answered ? '#00ff00' : '#ff0000'};
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 10px;
  font-size: 0.8rem;
`;

const QuestionCard = ({ question, onClick, onDelete, isOwner }) => {
  const { user } = useUser();
  const isAnswered = question.answerCount > 0;
  
  return (
    <Card onClick={onClick}>
      <Title>{question.question}</Title>
      
      <Meta>
        <div>
          <span>By: {question.userName}</span> • 
          <span> {new Date(question.createdAt).toLocaleDateString()}</span>
        </div>
        <Badge answered={isAnswered}>
          {isAnswered ? `${question.answerCount} answers` : 'No answers'}
        </Badge>
      </Meta>
      
      {isOwner && (
        <DeleteButton 
          variant="danger" 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </DeleteButton>
      )}
    </Card>
  );
};

export default QuestionCard;