import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';

import { reducer as productReducer } from './product';
import { reducer as catalogReducer } from './catalog';
import { reducer as cartReducer } from './cart';
import { reducer as cartItemsReducer } from './cartItems';

export const createStore = (initialState = {}) =>
  reduxCreateStore(
    combineReducers({
      product: productReducer,
      catalog: catalogReducer,
      cart: cartReducer,
      cartItems: cartItemsReducer,
    }),
    initialState,
    applyMiddleware(thunk)
  );
