import actionNamespace from '../utils/action-namespace';

// Session actions
export const SESSION = actionNamespace('session', [ 'login', 'profile', 'logout' ]);