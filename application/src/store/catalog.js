import { connect as reduxConnect } from 'react-redux';
import { REQUEST_STATUS, CatalogApi } from '../util';

export const actionTypes = {
  GET_CATALOG: 'GET_CATALOG',
  GET_CATALOG_RESULT: 'GET_CATALOG_RESULT',
};

export const selectors = {
  getCatalogData(state) {
    return state.catalog.data;
  },
  getCatalogStatus(state) {
    return state.catalog.status;
  },
  getIsCatalogReady(state) {
    return selectors.getCatalogStatus(state) === REQUEST_STATUS.Success;
  },
};

export const actionCreators = {
  getCatalog() {
    return { type: actionTypes.GET_CATALOG };
  },
  getCatalogResult(response) {
    return {
      type: actionTypes.GET_CATALOG_RESULT,
      payload: response,
      error: response instanceof Error,
    };
  },
  fetchCatalog() {
    return (dispatch, getState) => {
      const status = selectors.getCatalogStatus(getState());

      if (
        status === REQUEST_STATUS.Success ||
        status === REQUEST_STATUS.Fetching
      ) {
        return;
      }

      dispatch(actionCreators.getCatalog());

      return CatalogApi.getCatalog().then(
        data => {
          dispatch(actionCreators.getCatalogResult(data));
        },
        err => {
          dispatch(actionCreators.getCatalogResult(err));
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
    case actionTypes.GET_CATALOG:
      return { ...state, status: REQUEST_STATUS.Fetching };
    case actionTypes.GET_CATALOG_RESULT:
      if (error === true) return { ...state, status: REQUEST_STATUS.Error };
      return { ...state, status: REQUEST_STATUS.Success, data: payload };
    default:
      return state;
  }
};

export const connect = reduxConnect(
  (state, ownProps) => ({
    catalog: selectors.getCatalogData(state),
    isCatalogReady: selectors.getIsCatalogReady(state),
  }),
  actionCreators
);
