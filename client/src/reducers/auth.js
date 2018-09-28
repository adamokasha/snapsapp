export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      return action.payload || false;
    case 'LOGOUT':
      return false;
    case 'UPDATE_PROFILE': 
      return {...state, profile: {...action.payload.profile}}
    default:
      return state;
  }
};
