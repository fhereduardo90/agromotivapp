import actionNamespace from '../utils/action-namespace';

export const ROLE_MAPPING = [
    {
        type: 'USER',
        name: 'Usuario'
    },
    {
        type: 'SELLER',
        name: 'Agricultor'
    },
    {
        type: 'ADMIN',
        name: 'Administrador'
    },
];

// Users actions
export const USER = actionNamespace('user', [ 'fetch' ]);

// User actions
export const USERS = actionNamespace('users', [ 'fetch', 'create', 'update', 'delete', 'search' ]);