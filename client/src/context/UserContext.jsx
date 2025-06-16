import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';

const initialState = { user: null, loading: true };
const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING'
};


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

const UserContext = createContext();

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const logoutTimer = useRef(null);
  const [redirectAfterLogout, setRedirectAfterLogout] = useState(false);

  const startTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => handleLogout(), 5 * 60 * 1000);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('quantum_token', token);
    dispatch({ type: ACTIONS.LOGIN, payload: userData });
    startTimer();
  };

  const handleLogout = () => {
    localStorage.removeItem('quantum_token');
    dispatch({ type: ACTIONS.LOGOUT });
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    setShowTimeoutModal(true);
    setRedirectAfterLogout(true);
  };

  const closeTimeoutModal = () => {
    setShowTimeoutModal(false);
  };

  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
  };

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

  useEffect(() => {
    const token = localStorage.getItem('quantum_token');
    
    if (!token) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return;
    }
    
    try {
      const decoded = jwt_decode(token);
      const expirationTime = decoded.exp * 1000;
      
      if (Date.now() > expirationTime) {
        handleLogout();
      } else {
        const timeUntilExpiration = expirationTime - Date.now();
        logoutTimer.current = setTimeout(handleLogout, timeUntilExpiration);
      }
    } catch (err) {
      console.error('Token decode error:', err);
      handleLogout();
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

export const AutoLogoutHandler = ({ children }) => {
  const { resetLogoutTimer, logout } = useUser();

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    let timeoutId;

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
