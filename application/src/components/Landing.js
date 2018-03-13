import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Landing.css';

const Landing = () => (
  <div className={styles.LandingContent}>
    <div className={styles.LandingContainer}>
      <div className={styles.TitleContainer}>
        <h3 className={styles.Title}>
          Get a <span className={styles.Pink}>poster</span> with{' '}
          <span className={styles.Yellow}>classical&nbsp;art</span>
        </h3>
      </div>
      <p className={styles.Paragraph}>
        <strong className={styles.Pink}>Disclaimer:</strong> this web
        application is <strong className={styles.Pink}>not a real shop</strong>,
        you can't actually order or buy anything here. If you really want some
        posters with classical art, visit{' '}
        <a
          href="https://www.rijksmuseum.nl/en/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.Link}
        >
          rijksmuseum.nl
        </a>
      </p>
      <p className={styles.Paragraph}>
        Sorry to disappoint, but this is kinda a fake landing page right here.
        You really can't order anything from this{' '}
        <Link to="/catalog" className={styles.Link}>
          catalog
        </Link>{' '}
        using this web application.
      </p>
      <p className={styles.Paragraph}>
        The good news is that hopefully, you can learn a thing or two about
        optimizing web application that are built with{' '}
        <strong className={styles.Pink}>React</strong>,{' '}
        <strong className={styles.Yellow}>Redux</strong> and{' '}
        <strong className={styles.Cyan}>Webpack</strong> inside this
        applications{' '}
        <a
          href="https://github.com/gribnoysup/single-page-application-optimization-tips"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.Link}
        >
          repository
        </a>
      </p>
    </div>
  </div>
);

export default Landing;
