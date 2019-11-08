import React from 'react';

import styles from './link.module.scss';

const Link = () => (
  <a
    className={styles.link}
    href="https://ottmartens.github.io/ram-algorithms/"
  >
    RAM Scheduler
  </a>
);

export default Link;
