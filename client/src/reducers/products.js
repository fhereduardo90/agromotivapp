import {
  PRODUCT,
  PRODUCTS,
  PRODUCT_IMAGE,
} from '../constants/products';

const initialState = {
  total: 0,
  current: 1,
  pageSize: 10,
  list: [],
  product: {
    fetching: false,
    uploading: false,
    data: {}
  },
  loading: true,
  saving: false,
};

const { FETCH:SINGLE_FETCH, CREATE, UPDATE } = PRODUCT;
const { FETCH } = PRODUCTS;

const sessionReducer = (state = initialState, action) => {
  let nextState = state;
  let product;

  switch(action.type) {
    case FETCH.REQUEST:
      product = { ...initialState.product, fetching: true };
      const { params: { page: current } } = action.payload;
      nextState = { ...state, loading: true, product, current };
      break;
    case SINGLE_FETCH.REQUEST:
      product = { ...initialState.product, fetching: true };
      nextState = { ...state, loading: true, product };
      break;
    case FETCH.SUCCESS:
      const { data, total = 10 } = action.payload;
      const products = {
        list: data,
        total,
      };

      nextState = { ...state, ...products, loading: false, product: { ...state.product, fetching: false } };
      break;
    case SINGLE_FETCH.SUCCESS:
      const { data: productResponse } = action.payload;
      const productData = {
        fetching: false,
        uploading: false,
        data: productResponse
      };
      nextState = { ...state, product: productData, loading: false };
      break;
    case FETCH.FAILED:
    case SINGLE_FETCH.FAILED:
      nextState = { ...state, loading: false, product: { ...state.product, fetching: false } };
      break;
    case CREATE.REQUEST:
    case UPDATE.REQUEST:
      nextState = { ...state, saving: true };
      break;
    case CREATE.SUCCESS:
    case CREATE.FAILED:
    case UPDATE.SUCCESS:
    case UPDATE.FAILED:
      nextState = { ...state, saving: false };
      break;
    case PRODUCT_IMAGE.UPLOAD.REQUEST:
      nextState = { ...state, product: { ...state.product, uploading: true } };
      break;
    case PRODUCT_IMAGE.UPLOAD.SUCCESS:
    case PRODUCT_IMAGE.UPLOAD.FAILED:
      nextState = { ...state, product: { ...state.product, uploading: false } };
      break;
    default:
      nextState = state;
      break;
  };

  return nextState;
};

export default sessionReducer;