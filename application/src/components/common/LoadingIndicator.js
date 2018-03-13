import React from 'react';

import styles from './LoadingIndicator.css';

const LoadingIndicator = ({ size }) => (
  <div className={styles.Container}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={styles.Spinner}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#41ead4"
        strokeWidth="8"
        r="32"
        strokeDasharray="150.79644737231007 52.26548245743669"
        transform="rotate(162 50 50)"
        style={size && { width: size + 'px', height: size + 'px' }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default LoadingIndicator;
