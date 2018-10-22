export default (state = [], action) => {
  switch (action.type) {
    case "SET_ALBUMS":
      return [...state, action.payload];
    default:
      return state;
  }
};
