import axios from 'axios';

export const setPostContext = context => ({
  type: 'SET_CONTEXT',
  payload: context
});

export const setPosts = posts => ({ type: 'SET_POSTS', payload: posts });

// Needs to be moved
export const fetchUserPosts = () => async dispatch => {
  const res = await axios.get('/api/posts/myposts/all');
  return res.data;
};