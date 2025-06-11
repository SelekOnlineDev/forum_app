import { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Tikrinu ar vartotojas prisijungęs

  useEffect(() => {
    const token = localStorage.getItem('quantum_token');
    
    if (token) {
      try {
        // Dekoduoju JWT tokeną

        const decoded = jwt.decode(token);
        
        // Tikrinu ar tokenas nepasibaigęs

        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        
        // Nustatau vartotojo duomenis

        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email
        });
        
        // Paleidžiu automatinio atsijungimo laikmatį

        startLogoutTimer();
      } catch (err) {
        console.error('Token decoding error:', err);
        logout();
      }
    }
  }, []);

  const startLogoutTimer = () => {

    // Išvalau esamą laikmatį

    if (logoutTimer) clearTimeout(logoutTimer);
    
    // Nustatau naują laikmatį 5 min.

    const timer = setTimeout(() => {
      logout();
    }, 5 * 60 * 1000); // 5 min
    setLogoutTimer(timer);
  };

  const resetLogoutTimer = () => {
    startLogoutTimer();
  };

  const login = (token, userData) => {
    localStorage.setItem('quantum_token', token);
    
    // Išsaugau tik būtinus vartotojo duomenis

    localStorage.setItem('quantum_user', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email
    }));
    
    setUser(userData);
    startLogoutTimer();
  };

  const logout = () => {
    localStorage.removeItem('quantum_token');
    localStorage.removeItem('quantum_user');
    setUser(null);
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('quantum_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser,
      resetLogoutTimer // Eksportuoju laikmačio atstatymo funkciją
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);