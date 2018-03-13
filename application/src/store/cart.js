import { connect as reduxConnect } from 'react-redux';
import { Cookies } from '../util';

export const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
};

export const selectors = {
  getCartData(state) {
    return state.cart;
  },
  getCartUniqueItems(state) {
    const cart = selectors.getCartData(state);

    return cart.reduce((acc, objectNumber) => {
      if (typeof acc[objectNumber] === 'number') {
        acc[objectNumber] += 1;
      } else {
        acc[objectNumber] = 1;
      }

      return acc;
    }, {});
  },
};

export const actionCreators = {
  addToCart(id) {
    return (dispatch, getState) => {
      dispatch({ type: actionTypes.ADD_TO_CART, payload: id });
      Cookies.setCartItems(selectors.getCartData(getState()));
    };
  },
  removeFromCart(id) {
    return (dispatch, getState) => {
      dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: id });
      Cookies.setCartItems(selectors.getCartData(getState()));
    };
  },
  clearCart() {
    return (dispatch, getState) => {
      dispatch({ type: actionTypes.CLEAR_CART });
      Cookies.setCartItems(selectors.getCartData(getState()));
    };
  },
};

export const reducer = (state = Cookies.getCartItems(), action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.ADD_TO_CART:
      return [...state, payload];
    case actionTypes.REMOVE_FROM_CART:
      return state.filter(({ objectNumber }) => objectNumber !== payload);
    case actionTypes.CLEAR_CART:
      return [];
    default:
      return state;
  }
};

export const connect = reduxConnect(
  state => ({
    cart: selectors.getCartData(state),
    cartUniqueItems: selectors.getCartUniqueItems(state),
  }),
  actionCreators
);
