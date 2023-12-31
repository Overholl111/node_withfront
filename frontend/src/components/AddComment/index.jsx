import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { useSelector } from "react-redux";
import { selectorIsAuth } from "../../redux/slices/auth.js";
import axios from '../../axios';
import { useParams } from "react-router-dom";

export const Index = () => {
const [text, setText] = React.useState();
const isAuth = useSelector(selectorIsAuth);
const params = useParams();
const id = params.id;
const {avatarData} = useSelector(state => state.auth.data.userData.avatarUrl);
const [avatarUrl, setAvatarUrl] = React.useState();

React.useEffect(() => {
  setAvatarUrl(avatarData);
},[avatarData])


const onSubmit = async () => {
  try {

    const fields = {
      text
    }
  
    await axios.put(`/posts/${id}`, fields);
    window.location.reload();
    
      } catch (err) {
        console.warn(err);
        alert("Couldn't comment")
  }
};

  return (
    <>
      <div className={styles.root}>
        {isAuth? (   
        <>
          <Avatar alt={avatarUrl} src={`http://localhost:4444/api/tmp/${avatarUrl}`} />
        </>
        ) : (
          <>
           <Avatar className={styles.avatar}  src={'/noavatar.png'} />
          </>
        )}
   
        <div className={styles.form}>
          {isAuth ? (
            <>
            <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Текст" 
            value={text}
            onChange={e => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
             />
          
          <Button onClick={onSubmit} size="large" variant="contained">
          Отправить
        </Button>
            </>
          ) : (
            <>
          <TextField
          label="Чтобы комментировать, вы должны быть авторизованы"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          /> 
          </>          
          )}

        </div>
      </div>
    </>
  );
};
