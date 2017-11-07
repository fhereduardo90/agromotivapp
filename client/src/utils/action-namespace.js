export default (name = '', actions = [], extraSuffixes = []) => {
    const SUFFIXES = [ 'REQUEST', 'SUCCESS', 'FAILED' ];
    const ACTION_NAMESPACE = name ? name.toLocaleUpperCase() : 'ACTION';
    let actionsMap = {};

    actions.forEach( action => {
        const ACTION_NAME = action.toUpperCase();

        actionsMap[`${ ACTION_NAME }`] = {};

        [...SUFFIXES, ...extraSuffixes].forEach( SUFFIX => {
            actionsMap[`${ ACTION_NAME }`][`${ SUFFIX }`] = `@@action/${ ACTION_NAMESPACE }_${ ACTION_NAME }_${ SUFFIX }`;
        } );
    } );

    return actionsMap;
};