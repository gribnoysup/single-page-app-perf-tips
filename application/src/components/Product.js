import React from 'react';
import { Link } from 'react-router-dom';

import { connect as productConnect } from '../store/product';
import { connect as cartConnect } from '../store/cart';

import { getMiddle } from '../util';

import ImagePreview from './ImagePreview';

import LoadingIndicator from './common/LoadingIndicator';
import Button from './common/Button';

import styles from './Product.css';

class Product extends React.Component {
  constructor() {
    super();

    this.state = {
      isPreviewVisible: false,
    };

    this.togglePreview = () => {
      this.setState(prevState => ({
        isPreviewVisible: !prevState.isPreviewVisible,
      }));
    };
  }

  componentDidMount() {
    this.props.fetchProduct(this.props.objectNumber);
  }

  render() {
    const { isPreviewVisible } = this.state;
    const { product: item, isProductReady, addToCart } = this.props;

    if (isProductReady === false) return <LoadingIndicator />;

    return (
      <div className={styles.Product}>
        <ImagePreview
          isVisible={isPreviewVisible}
          imgSrc={item.webImage.url}
          onCloseClick={this.togglePreview}
        />

        <div
          onClick={this.togglePreview}
          className={styles.Image}
          style={{
            backgroundColor: getMiddle(item.colors),
            backgroundImage: `url(${item.webImage.url})`,
          }}
        >
          <div className={styles.Heading}>
            <h1 className={styles.Title}>{item.title}</h1>
            <h2 className={styles.Subtitle}>{item.scLabelLine}</h2>
            <p className={styles.Subtitle}>{item.subTitle}</p>
            <p className={styles.Subtitle}>Rijksmuseum Collection</p>
          </div>
        </div>

        <Button
          className={styles.Button}
          onClick={() => addToCart(item.objectNumber)}
          cyan
        >
          Add&nbsp;to&nbsp;cart
        </Button>

        <Button component={Link} to="/cart" className={styles.Button} yellow>
          Go&nbsp;to&nbsp;checkout
        </Button>

        {item.label.description && (
          <div className={styles.Details}>
            <p className={styles.Paragraph}>{item.label.description}</p>
          </div>
        )}
      </div>
    );
  }
}

export default cartConnect(productConnect(Product));
