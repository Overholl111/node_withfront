import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';


import {useForm} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectorIsAuth, fetchRegister } from "../../redux/slices/auth.js";


import styles from './Login.module.scss';


export const Registration = () => {
  const isAuth = useSelector(selectorIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: 'Ivanov Ivan Ivanovich',
      email: 'III@email.ru',
      password: '123456'
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if(!data.payload) {
      return alert("Couldn't register");
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
      
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField 
      className={styles.field} label="fullName" 
      helperText={errors.fullname?.message}
       {... register('fullName', {required: 'Full Name is required'})}
       fullWidth />
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
       {... register('password', {required: 'Password is required'})}
       fullWidth />
      <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
      </form>
    </Paper>
  );
};
