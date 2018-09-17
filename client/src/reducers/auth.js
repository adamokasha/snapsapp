export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      return action.payload || false;
    case 'LOGOUT':
      return false;
    default:
      return state;
  }
};
