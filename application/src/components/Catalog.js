import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { connect as catalogConnect } from '../store/catalog';
import { connect as cartConnect } from '../store/cart';

import LoadingIndicator from './common/LoadingIndicator';
import Button from './common/Button';

import styles from './Catalog.css';

class CatalogItem extends React.PureComponent {
  render() {
    const { item, isItemActive, toggleActiveItem, addToCart } = this.props;

    return (
      <li className={styles.ListItem}>
        <div
          onClick={() => toggleActiveItem(item.objectNumber)}
          className={classNames({
            [styles.ItemImagePreview]: true,
            [styles.ItemImagePreviewActive]: isItemActive,
          })}
          style={{
            backgroundImage: `url(${item.webImage.url})`,
          }}
        >
          <div className={styles.ItemHeading}>
            <h3 className={styles.ItemTitle}>{item.title}</h3>
            <p className={styles.ItemSubtitle}>Rijksmuseum Collection</p>
          </div>
        </div>
        <div
          className={classNames({
            [styles.ItemActions]: true,
            [styles.ItemActionsActive]: isItemActive,
          })}
        >
          <Button
            component={Link}
            className={styles.ItemButton}
            to={'/product/' + item.objectNumber}
            cyan
          >
            Description
          </Button>
          <Button
            className={styles.ItemButton}
            onClick={() => addToCart(item.objectNumber)}
            yellow
          >
            Add&nbsp;to&nbsp;cart
          </Button>
        </div>
      </li>
    );
  }
}

class Catalog extends React.Component {
  constructor() {
    super();

    this.state = {
      activeItem: null,
    };

    this.toggleActiveItem = objectNumber => {
      this.setState(
        prevState =>
          prevState.activeItem === objectNumber
            ? { activeItem: null }
            : { activeItem: objectNumber }
      );
    };
  }

  componentDidMount() {
    this.props.fetchCatalog();
  }

  render() {
    const { isCatalogReady, catalog, addToCart } = this.props;
    const { activeItem } = this.state;

    if (isCatalogReady === false) return <LoadingIndicator />;

    return (
      <ul className={styles.List}>
        {catalog.map(item => (
          <CatalogItem
            key={item.objectNumber}
            item={item}
            isItemActive={item.objectNumber === activeItem}
            toggleActiveItem={this.toggleActiveItem}
            addToCart={addToCart}
          />
        ))}
      </ul>
    );
  }
}

export default cartConnect(catalogConnect(Catalog));
