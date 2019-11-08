import React, { useState, useEffect } from 'react';

import { Select, Button, Visualizer, Link } from './components';
import { timelineOptions, algoOptions } from './utils/constants';
import styles from './App.module.scss';

const App = () => {
  const [algo, setAlgo] = useState('FCFS');
  const [timeline, setTimeline] = useState(timelineOptions[0]);
  const [started, setStarted] = useState(false);

  const [customTimeline, setCustomTimeline] = useState('0,0');
  const [error, setError] = useState('');

  const onCustomTimelineChange = value => {
    try {
      if (value) {
        value.split(';').map(job => {
          const blocks = job.split(',');
          if (blocks.length !== 2) {
            throw new Error('Invalid timeline!');
          }
          return null;
        });
        setCustomTimeline(value);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setError('');
  }, [timeline, customTimeline]);

  useEffect(() => {
    if (timeline !== 'custom') setCustomTimeline('0,0');
  }, [timeline]);

  return (
    <div className={styles.scheduler}>
      <Link />
      <header className={styles.header}>
        <h1 className={styles.title}>CPU scheduler</h1>
        <div className={styles.controls}>
          <div className={styles.timeline}>
            <h3>Process timeline</h3>
            <Select
              options={timelineOptions}
              onChange={({ target: { value } }) => {
                setTimeline(value);
                setStarted(false);
              }}
            />
            {timeline === 'custom' && (
              <input
                className={styles.customTimeline}
                onBlur={e => onCustomTimelineChange(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    onCustomTimelineChange(e.target.value);
                  }
                }}
              />
            )}
          </div>
          <div className={styles.algo}>
            <h3>Algorithm</h3>
            <Select
              options={algoOptions}
              onChange={({ target: { value } }) => {
                setAlgo(value);
                setStarted(false);
              }}
            />
          </div>
        </div>
        <Button
          disabled={!!error}
          label={started ? 'STOP' : 'START'}
          onClick={() => {
            if (started) {
              setStarted(false);
            } else {
              setStarted(true);
            }
          }}
        />
        {error && <span className={styles.error}>{error}</span>}
      </header>
      <Visualizer
        algo={algo}
        timeline={timeline === 'custom' ? customTimeline : timeline}
        started={started}
        setStarted={setStarted}
      />
    </div>
  );
};

export default App;
