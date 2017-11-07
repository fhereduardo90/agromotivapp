import { apiRoute, post, get, destroy, put } from '../utils/request'
import {
  UNIT,
  UNITS,
} from '../constants/app'

export const fetchUnits = (next = () => {}) => {
  return dispatch => {

    return new Promise( ( resolve, reject ) => {
      dispatch({ type: UNITS.FETCH.REQUEST });

      get(apiRoute(`cms/units`)).then((data) => {
        dispatch({ type: UNITS.FETCH.SUCCESS, payload: { data } });

        resolve({ data });
        next(null, data);
      }).catch((error) => {
        dispatch({ type: UNITS.FETCH.FAILED, error: error.toString() });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const fetchUnit = (unitId, next = () => {}) => {
  return dispatch => {
    dispatch({ type: UNIT.FETCH.REQUEST });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/units/${ unitId }`)).then((data) => {
        dispatch({ type: UNIT.FETCH.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: UNIT.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const createUnit = (data, next = () => {}) => {
  return dispatch => {
    dispatch({ type: UNIT.CREATE.REQUEST });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/units/`), data).then((data) => {
        dispatch({ type: UNIT.CREATE.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
        dispatch(fetchUnits());
      }).catch((error) => {
        dispatch({ type: UNIT.CREATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const updateUnit= ({ unitId, data }, next = () => {}) => {
  return dispatch => {
    dispatch({ type: UNIT.UPDATE.REQUEST });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/units/${ unitId }`), data).then((data) => {
        dispatch({ type: UNIT.UPDATE.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
        dispatch(fetchUnits());
      }).catch((error) => {
        dispatch({ type: UNIT.UPDATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const deleteUnit = (unitId, next = () => {}) => {
  return dispatch => {
    dispatch({ type: UNIT.DELETE.REQUEST });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/units/${ unitId }`)).then((data) => {
        dispatch({ type: UNIT.DELETE.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
        dispatch(fetchUnits());
      }).catch((error) => {
        dispatch({ type: UNIT.DELETE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};