import axios from 'axios';

export const fetchUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/current_user');
    dispatch({ type: 'FETCH_USER', payload: res.data});
  } catch (e) {
    console.log(e);
  }
}

export const logout = () => ({
  type: 'LOGOUT'
});
