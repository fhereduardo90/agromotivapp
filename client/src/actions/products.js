import { apiRoute, post, get, destroy, put, getHeaders } from '../utils/request'
import { PRODUCT, PRODUCTS, PRODUCT_IMAGE } from '../constants/products'
import { CATEGORY, CATEGORIES } from '../constants/app'

export const fetchProducts = ({ sellerId = null, ...params } = { sellerId: null, page: 1 }, next = () => {}) => {
  return (dispatch, getState) => {
    const { products } = getState();
    const { current: page = 1, pageSize: per_page } = products;

    dispatch({ type: PRODUCTS.FETCH.REQUEST, payload: { sellerId, page, per_page, params } });

    const route = sellerId ? `cms/sellers/${ sellerId }/products` : 'cms/products';

    return new Promise( (resolve, reject) => {
      const xhr = get(apiRoute(route), { per_page, page, ...params }).then((data) => {
        const headers = getHeaders(xhr.request);
        const total = + headers('x-total');

        dispatch({ type: PRODUCTS.FETCH.SUCCESS, payload: { sellerId, data, total } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: PRODUCTS.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const fetchProduct = (id, next = () => {}) => {
  return dispatch => {
    dispatch({ type: PRODUCT.FETCH.REQUEST, payload: { id } });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/products/${ id }`)).then((data) => {
        dispatch({ type: PRODUCT.FETCH.SUCCESS, payload: { id, data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: PRODUCT.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const createProduct = ({ sellerId, data }, next = () => {}) => {
  return dispatch => {
    
    dispatch({ type: PRODUCT.CREATE.REQUEST, payload: { sellerId, data } });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/sellers/${ sellerId }/products`), data).then((data) => {
        dispatch({ type: PRODUCT.CREATE.SUCCESS, payload: { sellerId, data } });

        resolve({ user: data });
        next(null, data);
      }).catch((error) => {
        dispatch({ type: PRODUCT.CREATE.FAILED, error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const updateProduct= ({ data }, next = () => {}) => {
  return (dispatch, getState) => {
    const { products: { product: { data: productData } } } = getState();
    const { id: productId, seller: { id: sellerId } } = productData;

    dispatch({ type: PRODUCT.UPDATE.REQUEST, payload: { productId, data, sellerId } });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/sellers/${ sellerId }/products/${ productId }`), data).then((response) => {
        dispatch({ type: PRODUCT.UPDATE.SUCCESS, payload: { productId, response, sellerId } });

        resolve(response);
        next(null, response);
      }).catch((error) => {
        dispatch({ type: PRODUCT.UPDATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const deleteProduct = (productId, next = () => {}) => {
  return dispatch => {
    dispatch({ type: PRODUCT.DELETE.REQUEST, payload: { productId } });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/products/${ productId }`)).then(() => {
        dispatch({ type: PRODUCT.DELETE.SUCCESS, payload: { productId } });

        resolve();
        next();
      }).catch((error) => {
        dispatch({ type: PRODUCT.DELETE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const uploadImage= (data, next) => {
  return (dispatch, getState) => {
    const { products: { product: { data: productData } } } = getState();
    const { id: productId, seller: { id: sellerId } } = productData;

    dispatch({ type: PRODUCT_IMAGE.UPLOAD.REQUEST, payload: { productId, data } });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/sellers/${ sellerId }/products/${ productId }/images`), data, { fileUpload: true }).then((response) => {
        dispatch({ type: PRODUCT_IMAGE.UPLOAD.SUCCESS, payload: { productId, response, sellerId } });

        resolve(response);
        next(null, response);
      }).catch((error) => {
        dispatch({ type: PRODUCT_IMAGE.UPLOAD.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const deleteImage = (imageId, next) => {
  return (dispatch, getState) => {
    const { products: { product: { data: productData } } } = getState();
    const { id: productId, seller: { id: sellerId } } = productData;

    dispatch({ type: PRODUCT_IMAGE.DELETE.REQUEST, payload: { productId, imageId } });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/sellers/${ sellerId }/products/${ productId }/images/${ imageId }`)).then(() => {
        dispatch({ type: PRODUCT_IMAGE.DELETE.SUCCESS, payload: { productId } });

        resolve();
        next();
      }).catch((error) => {
        dispatch({ type: PRODUCT_IMAGE.DELETE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const fetchCategories = (next = () => {}) => {
  return dispatch => {
    dispatch({ type: CATEGORIES.FETCH.REQUEST });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/categories`)).then((data) => {
        dispatch({ type: CATEGORIES.FETCH.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: CATEGORIES.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const fetchCategory = (categoryId, next = () => {}) => {
  return dispatch => {
    dispatch({ type: CATEGORY.FETCH.REQUEST });

    return new Promise( (resolve, reject) => {
      get(apiRoute(`cms/categories/${ categoryId }`)).then((data) => {
        dispatch({ type: CATEGORY.FETCH.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
      }).catch((error) => {
        dispatch({ type: CATEGORY.FETCH.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const createCategory = (data, next = () => {}) => {
  return dispatch => {
    dispatch({ type: CATEGORY.CREATE.REQUEST });

    return new Promise( (resolve, reject) => {
      post(apiRoute(`cms/categories/`), data, { fileUpload: true }).then((data) => {
        dispatch({ type: CATEGORY.CREATE.SUCCESS, payload: { data } });

        resolve(data);

        dispatch(fetchCategories());
        next(null, data);
      }).catch((error) => {
        dispatch({ type: CATEGORY.CREATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const updateCategory = ({ categoryId, data }, next = () => {}) => {
  return dispatch => {
    dispatch({ type: CATEGORY.UPDATE.REQUEST });

    return new Promise( (resolve, reject) => {
      put(apiRoute(`cms/categories/${ categoryId }`), data, { fileUpload: true }).then((data) => {
        dispatch({ type: CATEGORY.UPDATE.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
        dispatch(fetchCategories());
      }).catch((error) => {
        dispatch({ type: CATEGORY.UPDATE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};

export const deleteCategory = (categoryId, next = () => {}) => {
  return dispatch => {
    dispatch({ type: CATEGORY.DELETE.REQUEST });

    return new Promise( (resolve, reject) => {
      destroy(apiRoute(`cms/categories/${ categoryId }`)).then((data) => {
        dispatch({ type: CATEGORY.DELETE.SUCCESS, payload: { data } });

        resolve(data);
        next(null, data);
        dispatch(fetchCategories());
      }).catch((error) => {
        dispatch({ type: CATEGORY.DELETE.FAILED, error: error });

        reject({ error });
        next(error);
      });
    } );
  };
};