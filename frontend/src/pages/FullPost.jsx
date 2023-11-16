import React from "react";
import { useParams } from "react-router-dom"; 
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from 'react-redux';


import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchComments } from "../redux/slices/posts";
import { SideBlock } from "../components/SideBlock";


export const FullPost = () => {
  const [data, setData] = React.useState();
  const { comments } = useSelector(state => state.posts);
  const [isLoading, setLoading] = React.useState(true);
  const {id} = useParams();
  const dispatch = useDispatch();

  React.useEffect(() => {

    dispatch(fetchComments(id));

    (axios.get(`/posts/${id}`)
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    
    .catch(err => {
      console.warn(err);
      alert('Error');
    }))

  },[dispatch, id]);



  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>;
  }

  else return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444/api/tmp/${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        tags={data.tags}
        isFullPost
      >
<ReactMarkdown children={data.text}/>
      </Post>
      <SideBlock title="Комментарии">
      {(comments !== undefined) ? (comments.items).map((comment, index)  => (    
          <CommentsBlock key={index}
            postedBy={comment.postedBy.fullName}
            text={comment.text}D
            avatarUrl={comment.postedBy.avatarUrl}
            isLoading={false}
      >
            
          </CommentsBlock>
      )) : (
        <CommentsBlock
        postedBy="Это могли бы быть вы"
        text="Это мог бы быть ваш комментарий"
        isLoading={false}
        >
          </CommentsBlock>
      )}
      </SideBlock>
      <Index />
    </>
  );
};
