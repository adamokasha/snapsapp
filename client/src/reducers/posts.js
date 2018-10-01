export default (state = { context: null, postData: []}, action) => {
  switch (action.type) {
    case 'SET_CONTEXT':
      return {...state, postData: [], context: action.payload}
    case 'SET_POSTS':
      return {...state, postData: [...state.postData, action.payload]}
    default:
    return state;
  }
}