import React from 'react';

import styles from './Footer.css';

/* eslint-disable jsx-a11y/anchor-has-content */
const ExternalLink = props => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    className={styles.FooterLink}
    {...props}
  />
);
/* eslint-enable jsx-a11y/anchor-has-content */

const Footer = () => (
  <div className={styles.Footer}>
    <p className={styles.FooterParagraph}>
      This is an example application, <strong>not a real shop</strong>. You
      can't actually order or buy anything.
    </p>
    <p className={styles.FooterParagraph}>
      This application was developed using the{' '}
      <ExternalLink href="https://www.rijksmuseum.nl/en/api/">
        Rijksmuseum API
      </ExternalLink>. All images are a part of Rijksmuseum Collection.
    </p>
    <p className={styles.FooterParagraph}>
      This application was developed by{' '}
      <ExternalLink href="https://github.com/gribnoysup">
        Sergey Petushkov
      </ExternalLink>{' '}
      <ExternalLink href="petushkov.sergey@gmail.com">
        &lt;petushkov.sergey@gmail.com&gt;
      </ExternalLink>.
    </p>
    <p className={styles.FooterParagraph}>
      Icons made by{' '}
      <ExternalLink
        href="https://www.flaticon.com/authors/chanut"
        title="Chanut"
      >
        Chanut
      </ExternalLink>,{' '}
      <ExternalLink
        href="https://www.flaticon.com/authors/anton-saputro"
        title="Anton Saputro"
      >
        Anton Saputro
      </ExternalLink>,{' '}
      <ExternalLink
        href="https://www.flaticon.com/authors/cole-bemis"
        title="Cole Bemis"
      >
        Cole Bemis
      </ExternalLink>,{' '}
      <ExternalLink
        href="https://www.flaticon.com/authors/gregor-cresnar"
        title="Gregor Cresnar"
      >
        Gregor Cresnar
      </ExternalLink>,{' '}
      <ExternalLink href="http://www.freepik.com" title="Freepik">
        Freepik
      </ExternalLink>{' '}
      from{' '}
      <ExternalLink href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </ExternalLink>{' '}
      is licensed by{' '}
      <ExternalLink
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
      >
        CC 3.0 BY
      </ExternalLink>
    </p>
  </div>
);

export default Footer;
