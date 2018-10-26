export default (state = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload ? { ...action.payload, mBoxNotif: 0 } : false;
    case "SET_REGISTERED":
      return { ...state, registered: true };
    case "LOGOUT":
      return false;
    case "UPDATE_MBOX_NOTIF":
      return { ...state, mBoxNotif: action.payload };
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...action.payload.profile } };
    default:
      return state;
  }
};
