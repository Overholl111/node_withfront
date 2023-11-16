
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';


import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPostsByTags, fetchTags } from '../redux/slices/posts.js';
import { useParams } from 'react-router-dom';



export const SearchResult = () => {
    const params = useParams();
    const tag = params.tag;
    const dispatch = useDispatch();
    const { tagPosts, tags } = useSelector(state => state.posts);
    const userData = useSelector(state => state.auth.data);

    const isPostsLoading = tagPosts.status ===  'loading';
    const isTagsLoading = tags.status === 'loading';

    React.useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchPostsByTags(tag));
    }, [dispatch ,tag]);


    return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : tagPosts.items).map((obj, index) => isPostsLoading ? (
          <Post key={index} isLoading={true}/>
          ) : (
            <Post key={index}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl? `http://localhost:4444/api/tmp/${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={obj.commentsCount}
              tags={obj.tags}
              isEditable={userData?.userData._id 
                === obj?.user._id}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          
        </Grid>
      </Grid>
    </>
  );
};
