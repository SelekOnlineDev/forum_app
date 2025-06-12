import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../atoms/Button';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #000;
  border-bottom: 2px solid #00ff00;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff00;
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const UserGreeting = styled.span`
  color: #00ff00;
  margin-right: 10px;
  font-weight: bold;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  return (
    <HeaderContainer>
      <Logo>
        <Link to="/">Quantum Forum</Link>
      </Logo>
      
      <Button onClick={() => navigate('/ask')} size="medium">
        Ask Question
      </Button>
      
      <Navigation>
        {user ? (
          <>
            <UserGreeting>Welcome, {user.name}</UserGreeting>
            <Button onClick={() => history.push('/ask')} size="medium">
              Ask Question
            </Button>
            <Button onClick={() => history.push('/user')} size="medium">
              Profile
            </Button>
            <Button onClick={logout} size="medium" variant="danger">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button size="medium">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="medium">Sign Up</Button>
            </Link>
          </>
        )}
      </Navigation>
    </HeaderContainer>
  );
};

export default Header;