import {
  USERS,
} from '../constants/users';

const emptyObject = {
  total: 0,
  current: 1,
  pageSize: 10,
  list: []
};

const initialState = {
  users: emptyObject,
  sellers: emptyObject,
  admins: emptyObject,
  loading: true,
  saving: false,
};

const { FETCH, CREATE, UPDATE } = USERS;

const mapUsersRole = (users = [], role) => {
  return users.map( user => {
    return {
      ...user,
      role
    };
  } );
};

const sessionReducer = (state = initialState, action) => {
  let nextState = state;
  switch(action.type) {
    case FETCH.REQUEST:
      const { type: userType, params: { page: current } } = action.payload;
      const userData = {
        ...state[userType],
        current,
      };

      nextState = { ...state, [userType]: userData, loading: true };
      break;
    case FETCH.SUCCESS:
      const { type, data, total = 10 } = action.payload;
      const resetUserData = {
        ...state[type],
        list: mapUsersRole(data, type),
        total,
      };

      nextState = { ...state, [type]: resetUserData, loading: false };
      break;
    case FETCH.FAILED:
      nextState = { ...state, loading: false };
      break;
    case CREATE.REQUEST:
    case UPDATE.REQUEST:
      nextState = { ...state, saving: true };
      break;
    case CREATE.SUCCESS:
    case CREATE.FAILED:
    case UPDATE.SUCCESS:
    case UPDATE.FAILED:
      nextState = { ...state, saving: false };
      break;
    default:
      nextState = state;
      break;
  };

  return nextState;
};

export default sessionReducer;