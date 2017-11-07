import { createReducer } from 'redux-create-reducer';
import {
  STATES,
  UNIT,
  UNITS,
  CATEGORY,
  CATEGORIES,
  CITIES,
} from '../constants/app';

const resourceList = (extra = {}) => ({
  fetched: false,
  data: [],
  ...extra
});

const resourceModel = (extra = {}) => ({
  saving: false,
  fetching: false,
  data: {},
  ...extra
});

const initialState = {
  states: resourceList(),
  cities: {},
  units: resourceList({ byId: {} }),
  categories: resourceList(),

  // singles to track edit/single view
  state: resourceModel(),
  city: resourceModel(),
  unit: resourceModel(),
  category: resourceModel(),
};

const mapUnitsById = units => {
  let byId = {};
  units.forEach( unit => {
    byId[unit.id] = unit;
  } );

  return byId;
};

const mapStatesForCities = (states = []) => {
  let cities = {};

  states.forEach( state => {
    cities[ state.id ] = {
      fetched: false,
      data: []
    };
  } );

  return cities;
};

const events = {
  [STATES.FETCH.SUCCESS]: (state, { payload: { states: data } }) => {
    const cities = mapStatesForCities(data);
    const states = {
      data,
      fetched: true,
    };
    
    return { ...state, states, cities };
  },
  [CITIES.FETCH.SUCCESS]: (state, { payload: { stateId, cities: citiesResult } }) => {
    const cities = {
      ...state.cities,
      [stateId]: {
        fetched: true,
        data: citiesResult
      }
    };

    return { ...state, cities };
  },
  [CITIES.FETCH.FAILED]: (state, { payload: { stateId } }) => {
    const cities = {
      ...state.cities,
      [stateId]: {
        ...state.cities[stateId],
        fetched: true,
      }
    };

    return { ...state, cities };
  },
  [UNITS.FETCH.SUCCESS]: (state, { payload: { data } }) => {
    const byId = mapUnitsById(data);

    return {
      ...state,
      units: {
        data,
        byId,
        fetched: true
      }
    };
  },

  [CATEGORIES.FETCH.SUCCESS]: (state, { payload: { data } }) => {
    const categories = {
      data,
      fetched: true,
    };

    return { 
      ...state, 
      categories,
    };
  },

  [CATEGORY.FETCH.REQUEST]: (state, { payload }) => {
    const category = resourceModel({ fetching: true });

    return {
      ...state,
      category
    };
  },
  
  [CATEGORY.FETCH.SUCCESS]: (state, { payload: { data } }) => {
    const category = resourceModel({ data });

    return {
      ...state,
      category
    };
  },
  
  [CATEGORY.FETCH.FAILED]: (state, { payload }) => {
    const category = resourceModel();

    return {
      ...state,
      category
    };
  },

  [CATEGORY.CREATE.REQUEST]: (state, { payload }) => {
    const category = resourceModel({ saving: true });

    return {
      ...state,
      category
    };
  },
  
  [CATEGORY.CREATE.SUCCESS]: (state, { payload: { data } }) => {
    const category = resourceModel({ data });

    return {
      ...state,
      category
    };
  },

  [CATEGORY.CREATE.FAILED]: (state, { payload }) => {
    const category = resourceModel();

    return {
      ...state,
      category
    };
  },

  [CATEGORY.UPDATE.REQUEST]: (state, { payload }) => {
    const category = resourceModel({ ...state.category, saving: true });

    return {
      ...state,
      category
    };
  },
  
  [CATEGORY.UPDATE.SUCCESS]: (state, { payload: { data } }) => {
    const category = resourceModel({ data });

    return {
      ...state,
      category
    };
  },

  [CATEGORY.UPDATE.FAILED]: (state, { payload }) => {
    const category = resourceModel({ data: state.category.data });

    return {
      ...state,
      category
    };
  },

  [CATEGORY.DELETE.REQUEST]: (state, { payload }) => {
    const category = resourceModel({ saving: true });

    return {
      ...state,
      category
    };
  },
  
  [CATEGORY.DELETE.SUCCESS]: (state, { payload }) => {
    const category = resourceModel();

    return {
      ...state,
      category
    };
  },

  [CATEGORY.DELETE.FAILED]: (state, { payload }) => {
    const category = resourceModel();

    return {
      ...state,
      category
    };
  },
  
  [UNIT.FETCH.REQUEST]: (state, { payload }) => {
    const unit = resourceModel({ fetching: true });

    return {
      ...state,
      unit
    };
  },
  
  [UNIT.FETCH.SUCCESS]: (state, { payload: { data } }) => {
    const unit = resourceModel({ data });

    return {
      ...state,
      unit
    };
  },
  
  [UNIT.FETCH.FAILED]: (state, { payload }) => {
    const unit = resourceModel();

    return {
      ...state,
      unit
    };
  },

  [UNIT.CREATE.REQUEST]: (state, { payload }) => {
    const unit = resourceModel({ saving: true });

    return {
      ...state,
      unit
    };
  },
  
  [UNIT.CREATE.SUCCESS]: (state, { payload: { data } }) => {
    const unit = resourceModel({ data });

    return {
      ...state,
      unit
    };
  },

  [UNIT.CREATE.FAILED]: (state, { payload }) => {
    const unit = resourceModel();

    return {
      ...state,
      unit
    };
  },

  [UNIT.UPDATE.REQUEST]: (state, { payload }) => {
    const unit = resourceModel({ ...state.unit, saving: true });

    return {
      ...state,
      unit
    };
  },
  
  [UNIT.UPDATE.SUCCESS]: (state, { payload: { data } }) => {
    const unit = resourceModel({ data });

    return {
      ...state,
      unit
    };
  },

  [UNIT.UPDATE.FAILED]: (state, { payload }) => {
    const unit = resourceModel({ data: state.unit.data });

    return {
      ...state,
      unit
    };
  },

  [UNIT.DELETE.REQUEST]: (state, { payload }) => {
    const unit = resourceModel({ saving: true });

    return {
      ...state,
      unit
    };
  },
  
  [UNIT.DELETE.SUCCESS]: (state, { payload }) => {
    const unit = resourceModel();

    return {
      ...state,
      unit
    };
  },

  [UNIT.DELETE.FAILED]: (state, { payload }) => {
    const unit = resourceModel();

    return {
      ...state,
      unit
    };
  },
};

export default createReducer(initialState, events);