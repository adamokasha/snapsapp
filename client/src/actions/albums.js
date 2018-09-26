import axios from 'axios';

export const createAlbum = (albumPosts, albumName) => async dispatch => {
  const res = await axios.post('/api/albums', {albumPosts, albumName});
}