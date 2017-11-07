import { apiRoute, post, get, destroy, put, getHeaders } from '../utils/request'
import {
  USER,
  USERS,
  ROLE_MAPPING,
} from '../constants/users'

export const fetchUsers = (type = 'users', params = {}, next = () => {}) => {
  return (dispatch, getState) => {
    const { users } = getState();
    const filtered_users = users[type] || {};
    const { pageSize: per_page = 10, current: page = 1 } = filtered_users;

    dispatch({ type: USERS.FETCH.REQUEST, payload: { type, per_page, page, params } });

    const xhr = get(apiRoute(`cms/${ type }`), { per_page, page, ...params }).then((data) => {
      const headers = getHeaders(xhr.request);
      const total = + headers('x-total');

      dispatch({ type: USERS.FETCH.SUCCESS, payload: { type, data, total } });
      next(null, data);
    }).catch((error) => {
      dispatch({ type: USERS.FETCH.FAILED, error: error.toString() });

      if ( next && typeof next === 'function' ) {
        next({ error });
      }
    });
  };
};

export const searchSellers = (q, next = () => {}) => {
  return dispatch => {
    const per_page = 10;
    const page = 1;
    const type = 'sellers';
    const params = {
      per_page,
      page,
      type,
      q,
    };

    dispatch({ type: USERS.SEARCH.REQUEST, payload: { type, per_page, page, params } });

    const xhr = get(apiRoute(`cms/${ type }`), { per_page, page, q }).then((data) => {
      const headers = getHeaders(xhr.request);
      const total = + headers('x-total');

      dispatch({ type: USERS.SEARCH.SUCCESS, payload: { type, data, total } });
      next(null, data);
    }).catch((error) => {
      dispatch({ type: USERS.SEARCH.FAILED, error: error.toString() });

      if ( next && typeof next === 'function' ) {
        next({ error });
      }
    });
  };
};

export const fetchUser = (type = 'user', id, next = () => {}) => {
  return dispatch => {
    dispatch({ type: USER.FETCH.REQUEST, payload: { type, id } });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/${ type }/${ id }`)).then((data) => {
        dispatch({ type: USER.FETCH.SUCCESS, payload: { type, data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: USER.FETCH.FAILED, error: error.toString() });

        reject({ error });
        next(error);
      });
    } );
  };
};

const transformUserData = ( data = {}, createUser = true, type) => {
  const { password, confirm: password_confirmation } = data;

  const { name, email, phone, address = '', residence = [] } = data;
  const [ state_id, city_id ] = residence;

  let user = {
    name,
    email,
  };


  if ( createUser || ( data.isProfileOwner && data.password ) ) {
    user = {
      ...user,
      password,
      password_confirmation,
    };
  }

  let residenceFieldAddon = city_id ? { city_id } : { state_id };

  if ( type !== 'admins' ) {
    user = {
      ...user,
      phone,
      address,
    };

    if ( state_id ) {
      user = {
        ...user,
        ...residenceFieldAddon,
      }
    }
  }

  return user;
};

export const createUser = ({ role: roleValue, ...data }, next = () => {}) => {
  return dispatch => {
    const role = ROLE_MAPPING[roleValue];
    const type = role.type.toLowerCase();
    const userTypeRoute = `${ type }s`;
    const userData = transformUserData(data, true, userTypeRoute);

    dispatch({ type: USERS.CREATE.REQUEST, payload: { role, data: userData } });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/${ userTypeRoute }`), userData).then((data) => {
        dispatch({ type: USERS.CREATE.SUCCESS, payload: { role, data: userData } });

        resolve({ user: data });
        next(null, data);
      }).catch((error) => {
        dispatch({ type: USERS.CREATE.FAILED, error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const updateUser = (userId, { role, ...data }, next = () => {}) => {
  return dispatch => {
    const userTypeRoute = role.toLowerCase();
    const userData = transformUserData(data, false, userTypeRoute);

    dispatch({ type: USERS.UPDATE.REQUEST, payload: { role, data, userId } });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/${ userTypeRoute }/${ userId }`), userData).then((data) => {
        dispatch({ type: USERS.UPDATE.SUCCESS, payload: { role, data, userId } });

        resolve();
        next(null, data);
      }).catch((error) => {
        dispatch({ type: USERS.UPDATE.FAILED, error: error.toString() });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const changePassword = (userId, { role, ...data }, next = () => {}) => {
  return dispatch => {
    const userTypeRoute = role.toLowerCase();
    const userData = transformUserData(data, true);

    dispatch({ type: USERS.UPDATE.REQUEST, payload: { role, data, userId } });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/${ userTypeRoute }/${ userId }`), userData).then((data) => {
        dispatch({ type: USERS.UPDATE.SUCCESS, payload: { role, data, userId } });

        resolve();
      }).catch((error) => {
        dispatch({ type: USERS.UPDATE.FAILED, error: error.toString() });

        reject({ error });
      });
    } );
  };
};

export const deleteUser = (userId, { role }, next = () => {}) => {
  return dispatch => {
    const userTypeRoute = role.toLowerCase();

    dispatch({ type: USERS.DELETE.REQUEST, payload: { role, userId } });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/${ userTypeRoute }/${ userId }`)).then(() => {
        dispatch({ type: USERS.DELETE.SUCCESS, payload: { role, userId } });

        resolve();
        next();
      }).catch((error) => {
        dispatch({ type: USERS.DELETE.FAILED, error: error.toString() });

        reject({ error });
        next(error);
      });
    } );
  };
};