import { Link, useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { Button } from '../atoms/Button';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #000;
  border-bottom: 2px solid #00ff00;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const UserGreeting = styled.span`
  color: #00ff00;
  margin-right: 10px;
`;

export const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  return (
    <HeaderContainer>
      <Link to="/">
        <Button>Home</Button>
      </Link>
      
      <Navigation>
        {user ? (
          <>
            <UserGreeting>Welcome, {user.name}</UserGreeting>
            <Button onClick={() => navigate('/ask')}>Ask Question</Button>
            <Button onClick={() => navigate('/user')}>Profile</Button>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </Navigation>
    </HeaderContainer>
  );
};