import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import authReducer from '../reducers/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  authReducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default store;
