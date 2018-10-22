import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import albumReducer from "../reducers/albums";
import authReducer from "../reducers/auth";
import postsReducer from "../reducers/posts";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  albums: albumReducer,
  auth: authReducer,
  posts: postsReducer
});

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default store;
