import React from 'react';

import { Block, Counter } from '..';
import { useScheduler } from '../hooks';

import styles from './visualizer.module.scss';

const Upcoming = ({ stepCount, rows, blockSize }) => {
  return (
    <div className={styles.upcoming}>
      {rows.map((row, index) => {
        let blocks = Array(row.duration - row.consumed).fill(row.id);
        if (row.arrival > stepCount)
          blocks = Array(row.arrival - stepCount)
            .fill(false)
            .concat(blocks);
        return (
          <div key={index} className={styles.blockRow}>
            {blocks.map((value, index) => (
              <Block size={blockSize} key={`${index}${value}`} value={value} inbound isInvisible={!value} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Done = ({ doneBlocks, blockSize }) => (
  <div className={styles.done}>
    {doneBlocks.slice(0).reverse().map((value, index) => (
      <Block size={blockSize} value={value} key={`${index}${value}`} />
    ))}
  </div>
);

const Visualizer = ({ timeline, algo, started, setStarted }) => {
  const { inboundRows, doneBlocks, stepCount, waitTimes } = useScheduler(
    timeline,
    algo,
    started,
    setStarted,
  );

  const blockSize = 250 / timeline.split(';').length;

  return (
    <>
      <div className={styles.visualizer}>
        <Upcoming blockSize={blockSize} rows={inboundRows} stepCount={stepCount} />
        <div className={styles.spacer} />
        <Done blockSize={blockSize} doneBlocks={doneBlocks} />
      </div>
      <Counter started={started} waitTimes={waitTimes} count={stepCount} />
    </>
  );
};

export default Visualizer;
