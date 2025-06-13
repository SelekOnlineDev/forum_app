import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import * as jwtDecode from 'jwt-decode';

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

  const resetLogoutTimer = () => startTimer();

  useEffect(() => {
    const token = localStorage.getItem('quantum_token');
    if (!token) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        handleLogout();
      } else {
        handleLogin(token, {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email
        });
      }
    } catch {
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
        resetLogoutTimer
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser used outside UsersProvider');
  return ctx;
}
