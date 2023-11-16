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
import axios from '../../axios';


import styles from './Login.module.scss';


export const Registration = () => {
  const isAuth = useSelector(selectorIsAuth);
  const dispatch = useDispatch();
  const inputPicRef = React.useRef(null);
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {register, formState: { errors, isValid }} = useForm({
    defaultValues: {
      fullName: "IVAN IVANOV",
      email: "III@e-mail.com",
      password: ""
    },
    mode: 'onChange'
  });

  const handleChangeFile = async (event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/tmp', formData);
      setAvatarUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Не удалось загрузить аватар');
    }
  };

  const onClickRemoveImage = async () => {
    try{ 
      const data = {url: avatarUrl}
      await axios.delete(`/tmp/`, { data });
      setAvatarUrl('');
    } catch (err){
      alert('Не удалось удалить аватар')
    }};

  const onSubmit = async () => {
    const fields = {
      fullName,
      email,
      password,
      avatarUrl
    }
    const data = await dispatch(fetchRegister(fields));
    if(!data.payload) {
      return alert("Не удалось зарегестрироваться");
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
      <form>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      {avatarUrl ? (
      <Avatar className={styles.avatar} id="img" src={`http://localhost:4444/api/tmp/${avatarUrl}`} alt="Uploaded"  sx={{ width: 100, height: 100 }} display="flex" align-items="center"
      justify-content="center"/>
      ) : (
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      )}
      <Button onClick={() => inputPicRef.current.click()} variant="outlined" fullWidth>
        Загрузить аватар
      </Button>
      <input ref={inputPicRef} type="file" onChange={handleChangeFile}  hidden />
      {avatarUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage} fullWidth>
          Удалить
        </Button>
        </>
      )}
      <br />
      <br />
      <TextField 
      className={styles.field} label="Имя пользователя" 
      helperText={errors.fullName?.message}
      {... register('fullName', {required: 'Укажите имя', minLength: 3})}
      value={fullName}
      onChange={e => setFullName(e.target.value)}
       fullWidth />
      <TextField
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {... register('email', {required: 'Укажите почту'})}
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
      />
      <TextField 
      className={styles.field} label="Пароль" 
      helperText={errors.password?.message}
      {... register('password', {required: 'Укажите пароль'})}
      value={password}
      onChange={e => setPassword(e.target.value)}
       fullWidth />
      <Button disabled={!isValid} onClick={onSubmit} type='submit' size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
      </form>
    </Paper>
  );
};
