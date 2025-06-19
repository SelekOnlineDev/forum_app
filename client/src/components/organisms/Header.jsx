import React, { useState } from 'react';
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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;

  a {
    color: #00ff00;
    text-decoration: none;

    &:hover {
      color: #33ff33;
    }
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
    display: ${({ $isMobileMenuOpen }) => $isMobileMenuOpen ? 'flex' : 'none'};
    margin-top: 15px;
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

const MobileMenuButton = styled(Button)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Header komponentas, skirtas puslapio viršutinei daliai su logotipu, navigacija ir vartotojo informacija

const Header = () => {
  const { user, logout } = useUser(); 
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Būsenos kintamasis, skirtas mobiliojo meniu atidarymui/uždarymui valdyti

  // Funkcija, kuri tvarko vartotojo atsijungimą
  
  const handleLogout = () => { 
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Secret Quantum
          </Link>
        </Logo>
        
        <Button 
          onClick={() => {
            navigate('/ask');
            setIsMobileMenuOpen(false);
          }} 
          size="medium"
        >
          Ask Question
        </Button>
        
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="small"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </LeftSection>
      
      <Navigation $isMobileMenuOpen={isMobileMenuOpen}>
        {user ? (
          <>
            <UserGreeting>Welcome, {user.name}</UserGreeting>
            <Button 
              onClick={() => {
                navigate('/user');
                setIsMobileMenuOpen(false);
              }} 
              size="medium"
            >
              Profile
            </Button>
            <Button 
              onClick={handleLogout} 
              size="medium" 
              variant="danger"
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="medium">Sign Up</Button>
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="medium">Log In</Button>
            </Link>
          </>
        )}
      </Navigation>
    </HeaderContainer>
  );
};

export default Header;
