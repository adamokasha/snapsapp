import axios from 'axios';

export const fetchUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/current_user');
    dispatch({ type: 'FETCH_USER', payload: res.data });
  } catch (e) {
    console.log(e);
  }
};

export const registerUser = displayName => async dispatch => {
  try {
    const res = await axios.post('/auth/register', { displayName });

    dispatch({ type: 'FETCH_USER', payload: res.data });
  } catch (e) {
    console.log(e);
  }
};

export const updateMboxNotif = size => ({
  type: 'UPDATE_MBOX_NOTIF',
  payload: size
});

export const updateProfile = updates => ({
  type: 'UPDATE_PROFILE',
  payload: updates
});

export const logout = () => ({
  type: 'LOGOUT'
});
