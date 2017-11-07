import actionNamespace from '../utils/action-namespace';

// States actions
export const STATES = actionNamespace('states', [ 'fetch' ]);
export const STATE = actionNamespace('state', [ 'fetch', 'create', 'update', 'delete' ]);
export const CITIES = actionNamespace('cities', [ 'fetch' ]);

// Units actions
export const UNIT = actionNamespace('unit', [ 'fetch', 'create', 'update', 'delete' ]);
export const UNITS = actionNamespace('units', [ 'fetch' ]);

export const CATEGORY = actionNamespace('category', [ 'fetch', 'create', 'update', 'delete' ]);
export const CATEGORIES = actionNamespace('categories', [ 'fetch' ]);