import {
  SESSION,
} from '../constants/session';

const initialState = {
  loginLoading: false,
  loggedIn: false,
  user: {},
};

const failedActions = (state, action) => {
  switch(true) {
    case action.type.indexOf('_FAILED'):
      return { ...state, loginLoading: false };
    default:
      return state;
  }
}

const mapActions = (state, action) => {
  switch(action.type) {
    case SESSION.LOGIN.REQUEST:
    case SESSION.PROFILE.REQUEST:
      return { ...state, loginLoading: true };
    case SESSION.LOGIN.SUCCESS:
      return { ...state, loginLoading: false, loggedIn: true };
    case SESSION.PROFILE.SUCCESS:
      return { ...state, loginLoading: false, loggedIn: true, user: action.payload };
    case SESSION.LOGIN.FAILED:
      return { ...state, loginLoading: false };
    case SESSION.LOGOUT.REQUEST:
      return initialState;
    default:
      return state;
  }
}

const sessionReducer = (state = initialState, action) => {
  let nextState = failedActions(state, action);
  nextState = mapActions(state, action);
  return nextState;
};

export default sessionReducer;