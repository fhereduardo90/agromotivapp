import routes from '../routes'

export default (name = '', params = {}, query = {}) => {
    const filtered = routes.filter((route) => route.name === name);
    const keys = params ? Object.keys(params) : [];
    const queryKeys = query ? Object.keys(query) : [];

    if ( filtered.length ) {
        let route = filtered[0].path;
        let queryString = queryKeys.map((key) => {
            return `${key}=${query[key]}`;
        }).join('&');

        keys.forEach((key) => {
            route = route.replace(`:${key}`, params[key] || 'undef');
        });

        if ( queryKeys.length ) {
            return `${route}?${queryString}`;
        }

        return route;
    }

    return null;
}