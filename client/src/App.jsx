import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { UserProvider } from './context/UserContext';
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

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
  color: #00ff00;
`;

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContainer>
          <Header />
          
          <Routes>
            <Route path="/" element={<MainOutlet background="url('/src/assets/matrix.jpg')" />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forum" element={<Forum />} />
              <Route path="ask" element={<Ask />} />
              <Route path="user" element={<User />} />
            </Route>
          </Routes>
          
          <Footer />
        </AppContainer>
      </Router>
    </UserProvider>
  );
}

export default App;