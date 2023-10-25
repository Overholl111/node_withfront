import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import {useForm} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchUserData, selectorIsAuth } from "../../redux/slices/auth.js";


import styles from "./Login.module.scss";


export const Login = () => {
  const isAuth = useSelector(selectorIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: 'test1@ya.ru',
      password: '123456'
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values));
    if(!data.payload) {
      return alert("Couldn't log in");
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
      window.location.reload();
    } else {
      alert("Couldn't log in");
    }
  };

  
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {... register('email', {required: 'Email is required'})}
        type="email"
        fullWidth
      />
      <TextField 
      className={styles.field} label="Пароль" 
      helperText={errors.password?.message}
       {... register('pass', {required: 'Password is required'})}
       fullWidth />
      <Button type="submit" size="large" variant="contained"
      fullWidth>
        Войти
      </Button>
      </form>
    </Paper>
  );
};
