import React from 'react';

import styles from './link.module.scss';

const Link = () => (
  <div className={styles.link}>
    <a href="https://ottmartens.github.io/ram-algorithms/">RAM Scheduler</a>
    <a href="https://ottmartens.github.io/disk-algorithms/">Disk Scheduler</a>
    <a href="https://ottmartens.github.io/file-allocation/">File allocation</a>
  </div>
);

export default Link;