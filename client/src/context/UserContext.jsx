import { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Reducerio būsenos schema

const initialState = {
  user: null,
  loading: true,
  error: null
};

// Reducerio veiksmų tipai

const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducerio funkcija

function userReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
      
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
      
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const logoutTimerRef = useRef(null);

  // Tikrinu ar vartotojas prisijungęs

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem('quantum_token');
        
        if (!token) {
          dispatch({ type: actionTypes.SET_LOADING, payload: false });
          return;
        }
        
        // Dekoduoju JWT 

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const decoded = JSON.parse(jsonPayload);
        
        // Tikrinu ar tokenas nepasibaigęs

        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        
        // Nustatau vartotojo duomenis

        dispatch({ 
          type: actionTypes.LOGIN, 
          payload: {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
          } 
        });
        
        startLogoutTimer();
      } catch (err) {
        console.error('Token decoding error:', err);
        dispatch({ 
          type: actionTypes.SET_ERROR, 
          payload: 'Failed to authenticate user' 
        });
        logout();
      }
    };
    
    initializeUser();
  }, []);

  const startLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, 5 * 60 * 1000); // 5 min
  };

  const resetLogoutTimer = () => {
    startLogoutTimer();
  };

  const login = (token, userData) => {
    localStorage.setItem('quantum_token', token);
    localStorage.setItem('quantum_user', JSON.stringify(userData));
    
    dispatch({ 
      type: actionTypes.LOGIN, 
      payload: userData 
    });
    
    startLogoutTimer();
  };

  const logout = () => {
    localStorage.removeItem('quantum_token');
    localStorage.removeItem('quantum_user');
    
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    
    dispatch({ type: actionTypes.LOGOUT });
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...state.user, ...updatedData };
    localStorage.setItem('quantum_user', JSON.stringify(updatedUser));
    
    dispatch({ 
      type: actionTypes.UPDATE_USER, 
      payload: updatedData 
    });
  };

  return (
    <UserContext.Provider value={{ 
      user: state.user,
      loading: state.loading,
      error: state.error,
      login, 
      logout, 
      updateUser,
      resetLogoutTimer
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);