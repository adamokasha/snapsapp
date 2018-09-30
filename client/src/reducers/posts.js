export default (state = { context: null, postData: [], searchResults : []}, action) => {
  switch (action.type) {
    case 'SET_CONTEXT':
      return {...state, context: action.payload}
    case 'SET_POSTS':
      return {...state, postData: [...state.postData, action.payload]}
    case 'SET_SEARCHED_POSTS':
      return {...state, searchResults: [...state.searchResults, action.payload ] }
    default:
    return state;
  }
}