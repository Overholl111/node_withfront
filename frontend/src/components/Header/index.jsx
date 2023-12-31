import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

import { useSelector, useDispatch } from "react-redux";
import { logout, selectorIsAuth } from "../../redux/slices/auth.js";
import { useNavigate } from "react-router-dom";


export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorIsAuth);
  const navigate = useNavigate()

  const onClickLogout = () => {
    if (window.confirm('Log out?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
      navigate('/')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>My BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
