export default (state = null, action) => {
  switch (action.type) {
    case 'SET_SLIDES_CONTEXT':
      return action.payload
    default:
      return state;
  }
}