import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
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
  const logoutTimer = useRef(null);

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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('quantum_token');
    
    if (!token) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return;
    }
    
    try {
      const decoded = jwt_decode(token);
      const expirationTime = decoded.exp * 1000;
      
      if (decoded.exp * 1000 < Date.now()) {
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
        updateUser
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
    resetLogoutTimer: ctx.resetLogoutTimer
  };
}


