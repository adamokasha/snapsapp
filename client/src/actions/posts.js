import axios from 'axios';

// Not an action creator, but keeping here to avoid code bloat and to find easily
export const submitPost = (post, file, history) => async dispatch => {
  const data = new FormData();
  // name must match multer upload('name')
  data.append('image', file);
  data.append('data', JSON.stringify(post));

  fetch('/api/upload', {
    mode: 'no-cors',
    method: 'POST',
    body: data
  })
    .then(res => console.log(res))
    .catch(e => console.log(e));
};

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

export const searchPosts = (searchTermsArr, page) => async dispatch => {
  const res = await axios.post(`/api/posts/search/${page}`, {
    searchTerms: searchTermsArr
  });

  dispatch({type: 'SET_SEARCHED_POSTS', payload: res.data});
}