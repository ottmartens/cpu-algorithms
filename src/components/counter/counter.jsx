import React from 'react';

import styles from './counter.module.scss';

const Counter = ({ count, waitTimes, started }) => (
  <div className={styles.counter}>
    <div>
      tick count: <span className={styles.number}>{count}</span>
    </div>
    {waitTimes.length > 0 && (
      <div className={styles.average}>
        average wait time for process:{' '}
        <span className={styles.number}>
          {Math.round(waitTimes.reduce((total, num) => total + num, 0) / waitTimes.length * 1000) / 1000}
        </span>
      </div>
    )}
  </div>
);

export default Counter;
