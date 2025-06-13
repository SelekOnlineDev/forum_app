import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import MainOutlet from './components/MainOutlet';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Forum from './pages/Forum';
import Ask from './pages/Ask';
import User from './pages/User';
import QuestionDetail from './pages/QuestionDetail'; 
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
`;

const AutoLogoutHandler = ({ children }) => {
  const { resetLogoutTimer } = useUser();

  useEffect(() => {
    const resetTimer = () => resetLogoutTimer?.();
    
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [resetLogoutTimer]);

  return children;
};

function App() {
  return (
    <UserProvider>
      <AutoLogoutHandler>
        <Router>
          <AppContainer>
            <Routes>
              <Route element={<MainOutlet />}>
                <Route path="/" element={<Home />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/ask" element={<Ask />} />
                <Route path="/user" element={<User />} />
                <Route path="/question/:id" element={<QuestionDetail />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppContainer>
        </Router>
      </AutoLogoutHandler>
    </UserProvider>
  );
}

export default App;
