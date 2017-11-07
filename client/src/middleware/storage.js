import { LOAD_STORAGE } from '../actions/storage';

const STORAGE_KEY = '@agromotiva';

const clienStorage = process.BROWSER_BUILD ? localStorage : '';
const storedb = {};
const storesys = clienStorage || {
  setItem(key, value) {
    storedb[key] = value;

    return storedb;
  },
  getItem(key) {
    return storedb[key] || null;
  }
};

export const remember = store => {
  function persist() {
    storesys.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
  }

  return next => action => {
    next(action);
    persist();
    return action;
  };
};

export const hydrate = store => {
  const storage = JSON.parse(storesys.getItem(STORAGE_KEY));
  store.dispatch({ type: LOAD_STORAGE, localStorage: storage });
};