import cookies from 'js-cookie';

export const REQUEST_STATUS = {
  Initial: 'INITIAL',
  Fetching: 'FETCHING',
  Error: 'ERROR',
  Success: 'SUCCESS',
};

export const getMiddle = array => array[Math.floor(array.length / 2)];

export const buildLinearGradient = (arrayOfColors, deg = 0) =>
  `linear-gradient(${deg}deg, ${arrayOfColors
    .map(
      (color, index, array) =>
        color + ' ' + (index / array.length * 100).toString() + '%'
    )
    .join(', ')})`;

const CART_COOKIE_KEY = '__cart_items__';
const CART_COOKIE_SEPARATOR = '|';

export const Cookies = {
  getCartItems() {
    return !!cookies.get(CART_COOKIE_KEY)
      ? cookies.get(CART_COOKIE_KEY).split(CART_COOKIE_SEPARATOR)
      : [];
  },
  setCartItems(items = []) {
    if (items.length > 0) {
      return cookies.set(CART_COOKIE_KEY, items.join(CART_COOKIE_SEPARATOR), {
        expires: 14,
      });
    } else {
      return cookies.remove(CART_COOKIE_KEY);
    }
  },
};

export const CatalogApi = {
  getCatalog() {
    return fetch(`/api/catalog`)
      .then(_ => _.json())
      .then(({ artObjects }) => artObjects || []);
  },
  getCatalogItem(objectNumber) {
    return fetch(`/api/catalog/${objectNumber}`)
      .then(_ => _.json())
      .then(({ artObject }) => artObject || {});
  },
  getCatalogItemSmall(objectNumber) {
    return fetch(`/api/catalog/${objectNumber}/small`).then(_ => _.json());
  },
};

const sizeParamRegEx = /=s\d+$/;

export const devicePixelRatio = (window && window.devicePixelRatio) || 1;

export const innerWidth = (window && window.innerWidth) || 1920;

export const maxWidth = innerWidth * devicePixelRatio;

// Images that we are getting with Rijksmuseum API are
// stored in Google CDN. Fortunately for us, you can get
// a resized version of those with just an `=s` string
// at the end of the url
export const getUrlWithSize = (originalUrl, size = maxWidth) => {
  size = Math.floor(Math.min(maxWidth, size));

  if (sizeParamRegEx.test(originalUrl)) {
    return originalUrl.replace(sizeParamRegEx, `=s${size}`);
  } else {
    return `${originalUrl}=s${size}`;
  }
};
