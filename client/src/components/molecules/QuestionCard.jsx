import React from 'react';
import styled from 'styled-components';
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
  margin-right: 100px;
`;

const LikeButton = styled.button`
  background-color: #000;
  color: #00FF00;
  border: 1px solid #00FF00;
  border-radius: 4px;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
`;

const Meta = styled.div`
  color: #666666;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Badge = styled.span`
  background-color: ${({ $answered }) => $answered ? '#00ff00' : '#666666'};
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

const AnswerButton = styled(Button)`
  position: absolute;
  top: 45px;
  right: 15px;
  padding: 5px 10px;
  font-size: 0.8rem;
`;

const QuestionCard = ({ 
  questionData, 
  onDelete, 
  isOwner, 
  onLike, 
  onDislike,
  onClick,
  onAnswer,
  showAllAnswers
}) => {
  const isAnswered = questionData.answerCount > 0;
  const displayedAnswers = questionData.answers?.slice(0, 3) || [];
  const shouldShowMore = questionData.answers?.length > 3 && !showAllAnswers;

  return (
    <Card onClick={onClick}>
      <Title>{questionData.question}</Title>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <LikeButton onClick={(e) => { e.stopPropagation(); onLike(); }}>
          👍 {questionData.likes || 0}
        </LikeButton>
        <LikeButton onClick={(e) => { e.stopPropagation(); onDislike(); }}>
          👎 {questionData.dislikes || 0}
        </LikeButton>
      </div>

      {displayedAnswers.map((answer) => (
        <div key={answer._id} style={{ marginTop: '10px', color: '#00ff00' }}>
          <div>
            <strong>{answer.userName || 'User'}:</strong> {answer.answer}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {new Date(answer.createdAt).toLocaleDateString()}
            {answer.updatedAt && ' (edited)'}
          </div>
        </div>
      ))}

      {shouldShowMore && (
        <div 
          style={{ 
            color: '#00ff00', 
            marginTop: '5px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          +{questionData.answers.length - 3} more answers
        </div>
      )}

      <Meta>
        <div>
          Author: {questionData.userName} •{' '}
          {new Date(questionData.createdAt).toLocaleDateString()}
          {questionData.updatedAt && ' (edited)'}
        </div>
        <Badge $answered={isAnswered}>
          {questionData.answerCount} {questionData.answerCount === 1 ? 'Answer' : 'Answers'}
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
      
      <AnswerButton 
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onAnswer();
        }}
      >
        Answer
      </AnswerButton>
    </Card>
  );
};

export default QuestionCard;
