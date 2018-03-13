import React from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Button from './common/Button';

import styles from './ImagePreview.css';

const ImagePreview = ({ imgSrc, isVisible, onCloseClick }) =>
  createPortal(
    <CSSTransition
      in={isVisible}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: styles.Enter,
        enterActive: styles.EnterActive,
        exit: styles.Exit,
        exitActive: styles.ExitActive,
      }}
    >
      <div className={styles.Container}>
        <Button className={styles.CloseButton} onClick={onCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 47.971 47.971"
            className={styles.CloseIcon}
          >
            <path d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z" />
          </svg>
        </Button>
        <div
          style={{ backgroundImage: `url(${imgSrc})` }}
          className={styles.Image}
        />
      </div>
    </CSSTransition>,
    document.querySelector('[data-modal-root="true"]')
  );

export default ImagePreview;
