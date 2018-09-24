import axios from 'axios';

export const submitPost = (post, file, history) => async dispatch => {
  const data = new FormData();
    // name must match multer upload('name')
    data.append('image', file);
  data.append('data', JSON.stringify(post));

  fetch('/api/upload', {
    mode: 'no-cors',
    method: "POST",
    body: data
  }).then(res => console.log(res)).catch(e => console.log(e))
}

export const fetchPosts = (page) => async dispatch => {
  const res = await axios.get(`/api/posts/${page}`);
  // console.log(res.data.length);
  dispatch({ type: 'FETCH_POSTS', payload: res.data});
  return res.data.length;
}

export const favePost = (imgId) => async dispatch => {
  try {
    await axios.post(`/api/posts/fave/${imgId}`);
  } catch (e) {
    console.log(e);
  }
}

export const unFavePost = (imgId) => async dispatch => {
  try {
    await axios.post(`/api/posts/unfave/${imgId}`);
  } catch (e) {
    console.log(e);
  }
}