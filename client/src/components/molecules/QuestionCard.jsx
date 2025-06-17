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
  margin-bottom: 20px;
  
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

const Answer = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #333;
`;

const QuestionCard = ({ 
  questionData, 
  onDelete, 
  isOwner, 
  onLike, 
  onDislike,
  onAnswer,
  onShowMore,
  expanded = false
}) => {

   // Visi atsakymai

  const allAnswers = questionData.answers || [];
  
  // Pirmi 3 atsakymai

  const firstThreeAnswers = allAnswers.slice(0, 3);
  
  // Papildomi atsakymai rodomi tik kai išskleista

  const additionalAnswers = allAnswers.slice(3);

  return (
    <Card>
      <Title>{questionData.question}</Title>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <LikeButton onClick={() => onLike(questionData._id)}>
          👍 {questionData.likes || 0}
        </LikeButton>
        <LikeButton onClick={() => onDislike(questionData._id)}>
          👎 {questionData.dislikes || 0}
        </LikeButton>
      </div>

      {/* Rodau pirmus 3 atsakymus */}

      {firstThreeAnswers.map((answer) => (
        <Answer key={answer._id}>
          <div>
            <strong>{answer.userName || 'User'}:</strong> {answer.answer}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666666' }}>
            {new Date(answer.createdAt).toLocaleDateString()}
            {answer.updatedAt && ' (edited)'}
          </div>
        </Answer>
      ))}

      {/* Rodau papildomus atsakymus kai išskleista */}

      {expanded && additionalAnswers.map((answer) => (
        <Answer key={answer._id}>
          <div>
            <strong>{answer.userName || 'User'}:</strong> {answer.answer}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666666' }}>
            {new Date(answer.createdAt).toLocaleDateString()}
            {answer.updatedAt && ' (edited)'}
          </div>
        </Answer>
      ))}

      {/* Rodau "read more" tik jei yra daugiau nei 3 atsakymai ir nėra išskleista */}

      {!expanded && allAnswers.length > 3 && (
        <div 
          style={{ 
            color: '#00ff00', 
            marginTop: '5px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => onShowMore(questionData._id)}
        >
          +{allAnswers.length - 3} more answers
        </div>
      )}

      <Meta>
        <div>
          Author: {questionData.userName} •{' '}
          {new Date(questionData.createdAt).toLocaleDateString()}
          {questionData.updatedAt && ' (edited)'}
        </div>
      </Meta>

       {isOwner && (
        <DeleteButton
          variant="danger"
          size="small"
          onClick={() => onDelete(questionData._id)}
        >
          Delete
        </DeleteButton>
      )}
      
      <AnswerButton 
        size="small"
        onClick={() => onAnswer(questionData._id)}
      >
        Answer
      </AnswerButton>
    </Card>
  );
};

export default QuestionCard;
