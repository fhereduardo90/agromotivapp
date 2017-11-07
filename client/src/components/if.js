export default ({ condition = true, children }) => {
    if ( condition ) {
        return children;
    }

    return null;
};