import { connect as reduxConnect } from 'react-redux';

import { REQUEST_STATUS, CatalogApi } from '../util';

export const actionTypes = {
  GET_CART_ITEMS: 'GET_CART_ITEMS',
  GET_CART_ITEMS_RESULT: 'GET_CART_ITEMS_RESULT',
};

export const selectors = {
  getCartItemsData(state) {
    return state.cartItems.data;
  },
  getIsCartItemsReady(state) {
    return state.cartItems.status === REQUEST_STATUS.Success;
  },
};

export const actionCreators = {
  getCartItems(items) {
    return { type: actionTypes.GET_CART_ITEMS, payload: items };
  },
  getCartItemsResult(response) {
    return {
      type: actionTypes.GET_CART_ITEMS_RESULT,
      payload: response,
      error: response instanceof Error,
    };
  },
  fetchCartItems(items) {
    return dispatch => {
      dispatch(actionCreators.getCartItems(items));

      return Promise.all(
        items.map(objectNumber => CatalogApi.getCatalogItemSmall(objectNumber))
      ).then(
        response => {
          const flat = response.map(
            item => (Array.isArray(item) ? item[0] : item)
          );
          dispatch(actionCreators.getCartItemsResult(flat));
        },
        err => {
          dispatch(actionCreators.getCartItemsResult(err));
        }
      );
    };
  },
};

export const reducer = (
  state = { data: [], status: REQUEST_STATUS.Initial },
  action
) => {
  const { type, error, payload } = action;

  switch (type) {
    case actionTypes.GET_CART_ITEMS:
      return { ...state, status: REQUEST_STATUS.Fetching };
    case actionTypes.GET_CART_ITEMS_RESULT:
      if (error === true) return { ...state, status: REQUEST_STATUS.Error };
      return { status: REQUEST_STATUS.Success, data: payload };
    default:
      return state;
  }
};

export const connect = reduxConnect(
  state => ({
    cartItems: selectors.getCartItemsData(state),
    isCartItemsReady: selectors.getIsCartItemsReady(state),
  }),
  actionCreators
);
