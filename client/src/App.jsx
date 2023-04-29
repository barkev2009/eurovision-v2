import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import styles from './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { useDispatch } from 'react-redux';
import { check } from './features/user/userAPI';
import { setIsAuth, setUser } from './features/user/userSlice';
import HeartLogo from './features/icons/HeartLogo';

function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const checkAuth = useCallback(
    () => {
      check().then(
        user => {
          dispatch(setUser(user));
          dispatch(setIsAuth(true));
        }
      ).finally(setLoading(false));
    }, [dispatch]
  )

  useEffect(
    () => {
      checkAuth()
    }, [checkAuth]
  )

  if (loading) {
    return <HeartLogo className={styles['heart-animate']} />
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
