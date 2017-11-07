import { apiRoute, post, get, put, destroy } from '../utils/request'
import {
  STATES,
  STATE,
  CITIES,
} from '../constants/app'

export const fetchStateCities = (stateId, next = () => {}) => {
  return dispatch => {

    dispatch({ type: CITIES.FETCH.REQUEST, payload: { stateId } });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`states/${ stateId }/cities`)).then((cities) => {
        dispatch({ type: CITIES.FETCH.SUCCESS, payload: { cities, stateId } });

        resolve({ cities, stateId });
        next(null, cities);
      }).catch((error) => {
        dispatch({ type: CITIES.FETCH.FAILED, payload: { error: error.toString(), stateId } });

        reject({ error, stateId });
        next(error);
      });
    } );
  };
};

export const fetchCitiesBulk = () => {
  return (dispatch, getState) => {
    const { app: { states } } = getState();

    const total = states.data.length;
    let loaded = [];
    let totalLoaded = 0;

    const loopLoad = () => {

      const state = states.data[totalLoaded];

      dispatch( fetchStateCities(state.id, () => {
        loaded.push(state.id);
        totalLoaded = loaded.length;

        if ( totalLoaded < total ) {
          loopLoad();
        }
      }) );
    };

    loopLoad();
  };
};

export const fetchStates = (next = () => {}) => {
  return dispatch => {

    return new Promise( ( resolve, reject ) => {
      dispatch({ type: STATES.FETCH.REQUEST });

      get(apiRoute(`states`)).then((states) => {
        dispatch({ type: STATES.FETCH.SUCCESS, payload: { states } });

        dispatch(fetchCitiesBulk());

        resolve({ states });
        next(null, states);
      }).catch((error) => {
        dispatch({ type: STATES.FETCH.FAILED, error: error.toString() });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const fetchState = (id, next = () => {}) => {
  return dispatch => {
    dispatch({ type: STATE.FETCH.REQUEST });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/states/${ id }`)).then((data) => {
        dispatch({ type: STATE.FETCH.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: STATE.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const createState = (data, next = () => {}) => {
  return dispatch => {
    dispatch({ type: STATE.CREATE.REQUEST });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/states/`), data).then((data) => {
        dispatch({ type: STATE.CREATE.SUCCESS, payload: { data } });

        resolve(data);

        dispatch(fetchStates());
        next(null, data);
      }).catch((error) => {
        dispatch({ type: STATE.CREATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const updateState= ({ id, data }, next = () => {}) => {
  return dispatch => {
    dispatch({ type: STATE.UPDATE.REQUEST });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/states/${ id }`), data).then((data) => {
        dispatch({ type: STATE.UPDATE.SUCCESS, payload: { data } });

        resolve(data);

        dispatch(fetchStates());
        next(null, data);
      }).catch((error) => {
        dispatch({ type: STATE.UPDATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const deleteState = (id, next = () => {}) => {
  return dispatch => {
    dispatch({ type: STATE.DELETE.REQUEST });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/states/${ id }`)).then((data) => {
        dispatch({ type: STATE.DELETE.SUCCESS, payload: { data } });

        resolve(data);

        dispatch(fetchStates());
        next(null, data);
      }).catch((error) => {
        dispatch({ type: STATE.DELETE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};