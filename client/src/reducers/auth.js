export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      return action.payload ? {...action.payload, mBoxNotif: 0, profile: null} : false;
    case 'LOGOUT':
      return false;
    case 'UPDATE_MBOX_NOTIF':
      return {...state, mBoxNotif: action.payload}
    case 'UPDATE_PROFILE': 
      return {...state, profile: {...action.payload.profile}}
    default:
      return state;
  }
};
