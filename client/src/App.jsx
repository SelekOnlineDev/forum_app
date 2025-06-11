import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { MainOutlet } from './components/MainOutlet';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Forum } from './pages/Forum';
import { Ask } from './pages/Ask';
import { User } from './pages/User';
import styled from 'styled-components';

const history = createBrowserHistory();

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
`;

function App() {
  const { resetLogoutTimer } = useUser();

  // Automatinio atsijungimo valdymas

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

  return (
    <UserProvider>
      <Router history={history}>
        <AppContainer>
          <Header />
          
          <Switch>
            <Route path="/" render={({ location }) => {
              // Nustatau background pic pagal routus
              let background = '';
              if (['/', '/login', '/register'].includes(location.pathname)) {
                background = "url('/src/assets/matrix.jpg') no-repeat center center fixed";
              }
              
              return (
                <MainOutlet background={background}>
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/forum" component={Forum} />
                    <Route path="/ask" component={Ask} />
                    <Route path="/user" component={User} />
                    <Redirect to="/" />
                  </Switch>
                </MainOutlet>
              );
            }} />
          </Switch>
          
          <Footer />
        </AppContainer>
      </Router>
    </UserProvider>
  );
}

export default App;