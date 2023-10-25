import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import { selectorIsAuth } from "../../redux/slices/auth.js";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate()
  const isAuth = useSelector(selectorIsAuth);
  const [value, setValue] = React.useState('');
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setLoading] = React.useState('');
  const inputPicRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try{
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/tmp', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Failed trying to upload');
    }
  };

  const onClickRemoveImage = () => {
    
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);



  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text
      }
    
      const url = imageUrl;
      const { data } = isEditing 
      ? await axios.patch(`/posts/${id}`, fields) 
      :  await axios.post('/posts', fields);
      

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
        } catch (err) {
          console.warn(err);
          alert("Couldn't create post")
    }
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title);
        setTags(data.tags.join(', '));
        setImageUrl(data.imageUrl);
        setText(data.text);
      })
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  
  if (window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputPicRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputPicRef} type="file" onChange={handleChangeFile}  hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage} >
          Удалить
        </Button>
        <img className={styles.image} src={`http://localhost:4444/api/${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" 
      value={tags}
      onChange={e => setTags(e.target.value)}
      fullWidth />
       <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Текст" 
      value={text}
      onChange={e => setText(e.target.value)}
      fullWidth />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
