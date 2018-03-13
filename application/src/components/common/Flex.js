import React from 'react';
import classNames from 'classnames';

import styles from './Flex.css';

export const Flex = ({
  component = 'div',
  align,
  justify,
  direction,
  wrap,
  className,
  ...props
}) =>
  React.createElement(component, {
    className: classNames(styles.Flex, className),
    style: {
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      flexDirection: direction,
    },
    ...props,
  });

export const FlexItem = ({ component = 'div', size, className, ...props }) =>
  React.createElement(component, {
    className: classNames(styles.FlexItem, className),
    style: { flexBasis: !!size ? (size * 100).toString() + '%' : size },
    ...props,
  });
