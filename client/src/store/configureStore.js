import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import authReducer from "../reducers/auth";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  auth: authReducer
});

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default store;
