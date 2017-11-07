import {
  USER,
} from '../constants/users';

const initialState = {
  data: null,
  loading: true
};

const { FETCH } = USER;

const sessionReducer = (state = initialState, action) => {
  let nextState = state;

  switch(action.type) {
    case FETCH.REQUEST:
      nextState = { ...state, loading: true };
      break;
    case FETCH.SUCCESS:
      const { type: role, data } = action.payload;

      nextState = { ...state, data: {
        ...data,
        role
      }, loading: false };
      break;
    case FETCH.FAILED:
      nextState = { ...state, loading: false };
      break;
    default:
      nextState = state;
      break;
  };

  return nextState;
};

export default sessionReducer;