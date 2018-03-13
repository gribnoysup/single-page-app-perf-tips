import { connect as reduxConnect } from 'react-redux';
import { REQUEST_STATUS, CatalogApi } from '../util';

export const actionTypes = {
  GET_PRODUCT: 'GET_PRODUCT',
  GET_PRODUCT_RESULT: 'GET_PRODUCT_RESULT',
};

export const selectors = {
  getAllProducts(state) {
    return Object.keys(state.product).reduce((acc, objectNumber) => {
      acc[objectNumber] = state.product[objectNumber].data || {};
      return acc;
    }, {});
  },
  getProductData(state, ownProps) {
    return state.product[ownProps.objectNumber]
      ? state.product[ownProps.objectNumber].data
        ? state.product[ownProps.objectNumber].data
        : {}
      : {};
  },
  getProductStatus(state, ownProps) {
    return state.product[ownProps.objectNumber]
      ? state.product[ownProps.objectNumber].status
        ? state.product[ownProps.objectNumber].status
        : REQUEST_STATUS.Initial
      : REQUEST_STATUS.Initial;
  },
  getIsProductReady(state, ownProps) {
    return (
      selectors.getProductStatus(state, ownProps) === REQUEST_STATUS.Success
    );
  },
};

export const actionCreators = {
  getProduct(id) {
    return { type: actionTypes.GET_PRODUCT, payload: id };
  },
  getProductResult(response) {
    return {
      type: actionTypes.GET_PRODUCT_RESULT,
      payload: response,
      error: response instanceof Error,
    };
  },
  fetchProduct(id) {
    return (dispatch, getState) => {
      const status = selectors.getProductStatus(getState(), {
        objectNumber: id,
      });

      if (
        status === REQUEST_STATUS.Success ||
        status === REQUEST_STATUS.Fetching
      ) {
        return;
      }

      dispatch(actionCreators.getProduct(id));

      return CatalogApi.getCatalogItem(id).then(
        data => {
          dispatch(actionCreators.getProductResult(data));
        },
        err => {
          err.objectNumber = id;
          dispatch(actionCreators.getProductResult(err));
        }
      );
    };
  },
};

export const reducer = (state = {}, action) => {
  const { type, error, payload } = action;

  switch (type) {
    case actionTypes.GET_PRODUCT:
      return {
        ...state,
        [payload]: {
          ...(state[payload] || {}),
          status: REQUEST_STATUS.Fetching,
        },
      };
    case actionTypes.GET_PRODUCT_RESULT:
      if (error === true) {
        return {
          ...state,
          [payload.objectNumber]: {
            ...(state[payload.objectNumber] || {}),
            status: REQUEST_STATUS.Error,
          },
        };
      } else {
        return {
          ...state,
          [payload.objectNumber]: {
            ...(state[payload.objectNumber] || {}),
            status: REQUEST_STATUS.Success,
            data: payload,
          },
        };
      }
    default:
      return state;
  }
};

export const connect = reduxConnect(
  (state, ownProps) => ({
    allProducts: selectors.getAllProducts(state),
    product: selectors.getProductData(state, ownProps),
    isProductReady: selectors.getIsProductReady(state, ownProps),
  }),
  actionCreators
);
