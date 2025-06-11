import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/atoms/Button';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 20px;
`;

const TitleBox = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  border-radius: 4px;
  padding: 30px 50px;
  margin-bottom: 40px;
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #00cc66;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButton = styled(Button)`
  margin-top: 20px;
  font-size: 1.2rem;
  padding: 15px 30px;
`;

export const Home = () => {
  return (
    <HomeContainer>
      <TitleBox>
        <Title>Secret Questions and Answers</Title>
        <Subtitle>Explore the mysteries of quantum physics</Subtitle>
      </TitleBox>
      
      <Link to="/forum">
        <ActionButton size="large">Go to Forum</ActionButton>
      </Link>
    </HomeContainer>
  );
};