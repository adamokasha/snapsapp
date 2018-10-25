export const setUser = userData => ({
  type: "SET_USER",
  payload: userData
});

export const setRegistered = () => ({
  type: "SET_REGISTERED"
});

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
