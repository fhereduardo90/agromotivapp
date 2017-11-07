import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app';
import session from './session';
import users from './users';
import user from './user';
import products from './products';

export default combineReducers({
  routing: routerReducer,
  app,
  session,
  users,
  user,
  products,
});