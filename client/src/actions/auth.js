import axios from "axios";

// export const fetchUser = () => async dispatch => {
//   try {
//     const res = await axios.get("/api/current_user");
//     dispatch({ type: "FETCH_USER", payload: res.data });
//   } catch (e) {
//     console.log(e);
//   }
// };

export const setUser = userData => ({
  type: "FETCH_USER",
  payload: userData
});

// export const registerUser = displayName => async dispatch => {
//   try {
//     const res = await axios.post("/auth/register", { displayName });

//     dispatch({ type: "FETCH_USER", payload: res.data });
//   } catch (e) {
//     return e.response.data.error;
//   }
// };

export const updateMboxNotif = size => ({
  type: "UPDATE_MBOX_NOTIF",
  payload: size
});

export const updateProfile = updates => ({
  type: "UPDATE_PROFILE",
  payload: updates
});

export const logout = () => ({
  type: "LOGOUT"
});
