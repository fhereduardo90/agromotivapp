import actionNamespace from '../utils/action-namespace';

/**
 * This will return something like: PRODUCTS.FETCH.[REQUEST|SUCCESS|FAILED]
 */
export const PRODUCT = actionNamespace('product', [ 'fetch', 'create', 'update', 'delete' ]);
export const PRODUCT_IMAGE = actionNamespace('product_image', [ 'upload', 'delete' ]);
export const PRODUCTS = actionNamespace('products', [ 'fetch' ]);