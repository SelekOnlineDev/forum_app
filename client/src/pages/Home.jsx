import { Link } from 'react-router';
import { Button } from '../components/atoms/Button';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
`;

const TitleBox = styled.div`
  background-color: #000;
  border: 2px solid #00ff00;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
`;

export const Home = () => {
  return (
    <HomeContainer>
      <TitleBox>
        <Title>Secret Questions and Answers</Title>
      </TitleBox>
      
      <Link to="/forum">
        <Button size="large">Go to Forum</Button>
      </Link>
    </HomeContainer>
  );
};