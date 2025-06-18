import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';


const initialState = { user: null, loading: true }; // Pradinė vartotojo konteksto būsena

// Apibrėžiu reducer veiksmų tipus

const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING'
};

// Reducer, kuris tvarko vartotojo būsenos atnaujinimus

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { ...state, user: action.payload, loading: false };
    case ACTIONS.LOGOUT:
      return { ...state, user: null, loading: false };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.UPDATE_USER: 
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

const UserContext = createContext(); // Sukuriu vartotojo konteksto objektą

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const logoutTimer = useRef(null);
  const [redirectAfterLogout, setRedirectAfterLogout] = useState(false);

  // Funkcija, kuri pradeda atsijungimo laikmatį
  // Jei vartotojas neaktyvus 5 minutes, jis bus atsijungtas

  const startTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => handleLogout(), 5 * 60 * 1000);
  };

  // Funkcija, kuri tvarko vartotojo prisijungimą
  // Išsaugo tokeną ir vartotojo duomenis localStorage ir atnaujina būseną

  const handleLogin = (token, userData) => {
    localStorage.setItem('quantum_token', token);
    dispatch({ type: ACTIONS.LOGIN, payload: userData });
    startTimer();
  };

  // Funkcija, kuri tvarko vartotojo atsijungimą
  // Išsaugo tokeną ir vartotojo duomenis localStorage ir atnaujina būseną

  const handleLogout = () => {
    localStorage.removeItem('quantum_token');
    dispatch({ type: ACTIONS.LOGOUT });
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    setShowTimeoutModal(true);
    setRedirectAfterLogout(true);
  };

  // Funkcija, kuri uždaro modalą, kuris rodomas po atsijungimo dėl neaktyvumo

  const closeTimeoutModal = () => {
    setShowTimeoutModal(false);
  };

  // Funkcija, kuri atnaujina vartotojo duomenis
  // Tai gali būti naudinga, jei vartotojas atnaujina savo profilį

  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
  };

  // Funkcija, kuri atnaujina atsijungimo laikmatį
  
  const resetLogoutTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => handleLogout(), 5 * 60 * 1000); // 5 min
  };

   useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    
    const resetTimer = () => {
      resetLogoutTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetLogoutTimer]);

  // Funkcija, kuri iš pradžių inicijuoja vartotojo duomenis iš tokeno 

  const initializeUserFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email
      };
    } catch (err) {
      console.error('Token decode error:', err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('quantum_token'); // Paimu tokeną iš localStorage
    
    if (token) {
    const userData = initializeUserFromToken(token);
    if (userData) {
      dispatch({ type: ACTIONS.LOGIN, payload: userData });
    } else {
      localStorage.removeItem('quantum_token');
    }
  } else {
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }
}, []);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login: handleLogin,
        logout: handleLogout,
        resetLogoutTimer,
        updateUser,
        showTimeoutModal,
        closeTimeoutModal,
        redirectAfterLogout,
        setRedirectAfterLogout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook, kuris leidžia naudoti vartotojo kontekstą bet kurioje komponentėje
// Tai leidžia lengvai pasiekti vartotojo duomenis ir funkcijas

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser used outside UserProvider');
  return {
    ...ctx,
    resetLogoutTimer: ctx.resetLogoutTimer,
    showTimeoutModal: ctx.showTimeoutModal, 
    closeTimeoutModal: ctx.closeTimeoutModal
  };
}

// Komponentas, kuris tvarko automatinį atsijungimą po 5 minučių neaktyvumo

export const AutoLogoutHandler = ({ children }) => {
  const { resetLogoutTimer, logout } = useUser();

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    let timeoutId;

    // Funkcija, kuri pradeda atsijungimo laikmatį
    // Jei vartotojas neaktyvus 5 minutes, jis bus atsijungtas
    
    const startTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000); // 5 min
    };

    events.forEach(e => window.addEventListener(e, startTimer));
    startTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, startTimer));
      clearTimeout(timeoutId);
    };
  }, [resetLogoutTimer, logout]);

  return children;
};
