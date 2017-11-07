import { apiRoute, post, get } from '../utils/request'
import {
  SESSION,
} from '../constants/session'

export const login = (payload, next = () => {}) => {
  return dispatch => {
    const data = {
      ...payload,
      grant_type: 'password',
      scope: 'admin'
    };

    dispatch({ type: SESSION.LOGIN.REQUEST, payload: payload });

    post(apiRoute('oauth/token'), data).then((response) => {
      dispatch({ type: SESSION.LOGIN.SUCCESS, payload: response });

      localStorage.setItem('token', response.access_token);

      next(response);
    }).catch((err) => {
      dispatch({ type: SESSION.LOGIN.FAILED, error: err.toString() });
    });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({ type: SESSION.LOGOUT.REQUEST });
  };
};

export const getUserData = (next) => {
  return dispatch => {
    dispatch({ type: SESSION.PROFILE.REQUEST, payload: {} });

    return new Promise( (resolve, reject) => {
      get(apiRoute('cms/admins/me')).then((response) => {
        dispatch({ type: SESSION.PROFILE.SUCCESS, payload: { ...response, role: 'admins' } });
        
        resolve();
        next();
      }).catch((err) => {
        dispatch({ type: SESSION.LOGIN.FAILED });
        dispatch({ type: SESSION.PROFILE.FAILED });

        reject(err);
        next(err);
      });
    } );
  };
};