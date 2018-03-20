import React from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import { connect as cartItemsConnect } from '../store/cartItems';
import { connect as cartConnect } from '../store/cart';
import { getUrlWithSize, maxWidth } from '../util';

import LoadingIndicator from './common/LoadingIndicator';

import Button from './common/Button';

import { Flex } from './common/Flex';

import styles from './Cart.css';

class Cart extends React.Component {
  componentDidMount() {
    const { fetchCartItems, cartUniqueItems } = this.props;
    fetchCartItems(Object.keys(cartUniqueItems));
  }

  render() {
    const {
      cart,
      cartItems,
      isCartItemsReady,
      cartUniqueItems,
      clearCart,
    } = this.props;

    if (isCartItemsReady !== true) {
      return <LoadingIndicator />;
    }

    if (cart.length === 0) {
      return (
        <div className={styles.Cart}>
          <p className={classNames(styles.Paragraph, styles.ParagraphCentered)}>
            Your cart is empty<br />
            <Link className={styles.Link} to="/catalog">
              Back to catalog
            </Link>
          </p>
        </div>
      );
    }

    return (
      <div className={styles.Cart}>
        <p className={styles.Paragraph}>
          <strong>Disclaimer:</strong> this website is not a real shop. You
          can't order anything from this website, this is just an example
          application. Both 'Clear cart' and 'Order items' button at the bottom
          of the cart will just clear your cart.
        </p>
        <p className={styles.Paragraph}>
          If you really want to order a poster with these pieces of art, visit{' '}
          <a
            href="https://www.rijksmuseum.nl/en/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.Link}
          >
            rijksmuseum.nl
          </a>
        </p>
        <ul className={styles.List}>
          {cartItems.map(item => {
            const { objectNumber, headerImage, title } = item;
            const imgSrc = getUrlWithSize(headerImage.url, maxWidth * 0.8);

            return (
              <li
                key={objectNumber}
                style={{ backgroundImage: `url(${imgSrc})` }}
                className={styles.ListItem}
              >
                <div className={styles.ItemTitleGroup}>
                  <span className={styles.ListItemTitle}>{title}</span>
                  <span className={styles.ListItemCount}>
                    &nbsp;×&nbsp;{cartUniqueItems[objectNumber]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <Flex className={styles.ButtonGroup}>
          <Button onClick={clearCart} className={styles.Button} grey>
            Clear&nbsp;cart
          </Button>
          <Button onClick={clearCart} className={styles.Button} pink>
            Order&nbsp;items
          </Button>
        </Flex>
      </div>
    );
  }
}

export default cartConnect(cartItemsConnect(Cart));
