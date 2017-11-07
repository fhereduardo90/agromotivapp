// import { createStore, applyMiddleware } from 'redux'
// import thunkMiddleware from 'redux-thunk'

// export const initStore = (initialState = {}) => {
//   return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
// }

import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './reducers';
import { remember, hydrate } from './middleware/storage';

function configureStoreProd(initialState = {}, history) {

  // Build the middleware for intercepting and dispatching navigation actions
  const routeMiddleware = routerMiddleware(history)

  const middlewares = [
    remember,
    thunk,
    routeMiddleware,
  ];

  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
    )
  );
}

function configureStoreDev(initialState = {}, history) {

  // Build the middleware for intercepting and dispatching navigation actions
  const routeMiddleware = routerMiddleware(history)

  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
    routeMiddleware,
  ];

  const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose; // add support for Redux dev tools
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  hydrate(store);

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;