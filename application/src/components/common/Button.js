import React from 'react';
import classNames from 'classnames';

import styles from './Button.css';

const Button = ({
  component = 'button',
  pink,
  yellow,
  cyan,
  grey,
  className,
  children,
  ...props
}) =>
  React.createElement(
    component,
    {
      className: classNames(
        {
          [styles.Button]: true,
          [styles.Pink]: pink,
          [styles.Yellow]: yellow,
          [styles.Cyan]: cyan,
          [styles.Grey]: grey,
        },
        className
      ),
      ...props,
    },
    children
  );

export default Button;
