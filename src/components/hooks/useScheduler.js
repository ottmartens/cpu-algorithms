import { useState, useEffect } from 'react';
import { useInterval } from '.';

const getInboundRows = timeline => {
  const inboundRows = timeline.split(';').map((processString, index) => {
    const processInfo = processString.split(',');
    const arrival = Number(processInfo[0]);
    const duration = Number(processInfo[1]);
    return {
      arrival,
      duration,
      consumed: 0,
      id: index + 1
    };
  });

  return inboundRows;
};

const useScheduler = (timeline, algorithm, started, setStarted) => {
  const [inboundRows, setInboundRows] = useState(getInboundRows(timeline));
  const [doneBlocks, setDoneBlocks] = useState([]);
  const [stepCount, setStepCount] = useState(0);

  const [readyQueue, setReadyQueue] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(0);

  const [lowPriorityQueue, setLowPriorityQueue] = useState([]);
  const [highPriorityQueue, setHighPriorityQueue] = useState([]);

  const [waitTimes, setWaitTimes] = useState([]);

  const step = () => {
    if (inboundRows.length === 0) {
      setStarted(false);
      return;
    }

    let pickedRow;

    const egibleRows = inboundRows.filter(row => stepCount >= row.arrival);

    if (egibleRows.length >= 1) {
      switch (algorithm) {
        case 'FCFS':
          egibleRows.sort((r1, r2) => r1.arrival - r2.arrival);
          pickedRow = egibleRows[0];
          break;
        case 'SRTF':
          egibleRows.sort(
            (r1, r2) =>
              r1.duration - r1.consumed - (r2.duration - r2.consumed) ||
              r2.consumed - r1.consumed
          );
          pickedRow = egibleRows[0];
          break;
        case 'RR':
          let queue = readyQueue.slice(0);
          let resetTime = false;

          egibleRows.forEach(row => {
            if (!queue.includes(row.id)) queue.push(row.id);
          });

          if (timeQuantum === 4) {
            const lastJob = queue.shift();
            queue.push(lastJob);
            resetTime = true;
          }

          queue.forEach(id => {
            const job = egibleRows.find(row => row.id === id);
            if (!job) {
              const index = queue.indexOf(id);
              queue.splice(index, 1);
              if (index === 0) resetTime = true;
            }
          });

          pickedRow = egibleRows.find(row => row.id === queue[0]);

          setTimeQuantum(resetTime ? 1 : timeQuantum + 1);
          setReadyQueue(queue);

          break;

        case 'FCFS2':
          const arrivingRows = inboundRows.filter(
            row => row.arrival === stepCount
          );
          const highPriorityArrivingRows = arrivingRows.filter(
            row => row.duration <= 5
          );
          const lowPriorityArrivingRows = arrivingRows.filter(
            row => row.duration > 5
          );

          const highPriorityRows = highPriorityQueue
            .map(queueRow => {
              const row = egibleRows.find(
                inboundRow => inboundRow.id === queueRow.id
              );
              return row || null;
            })
            .concat(highPriorityArrivingRows)
            .filter(row => row !== null)
            .filter(row => row.duration - row.consumed !== 0);

          const lowPriorityRows = lowPriorityQueue
            .map(queueRow => {
              const row = egibleRows.find(
                inboundRow => inboundRow.id === queueRow.id
              );
              return row || null;
            })
            .concat(lowPriorityArrivingRows)
            .filter(row => row !== null)
            .filter(row => row.duration - row.consumed !== 0);

          if (highPriorityRows.length > 0) {
            pickedRow = highPriorityRows[0];
          } else if (lowPriorityRows.length > 0) {
            pickedRow = lowPriorityRows[0];
          }

          setHighPriorityQueue(highPriorityRows);
          setLowPriorityQueue(lowPriorityRows);
          break;
        default:
          console.log('This is not quite right');
      }
    }

    if (pickedRow) {
      setDoneBlocks(doneBlocks.concat(pickedRow.id));

      setInboundRows(
        inboundRows
          .map(row =>
            row.id === pickedRow.id
              ? {
                  ...row,
                  consumed: row.consumed + 1
                }
              : row
          )
          .filter(row => {
            if (row.consumed < row.duration) {
              return true;
            }

            setWaitTimes(waitTimes.concat([stepCount - row.arrival + 1 - row.duration]));
            return false;
          })
      );
    }
    setStepCount(stepCount + 1);
  };

  useEffect(() => {
    if (started) {
      setInboundRows(getInboundRows(timeline));
      setDoneBlocks([]);
      setStepCount(0);
      setTimeQuantum(0);
      setReadyQueue([]);
      setLowPriorityQueue([]);
      setHighPriorityQueue([]);
      setWaitTimes([]);
    }
  }, [started, timeline]);

  useEffect(() => {
    setInboundRows(getInboundRows(timeline));
    setDoneBlocks([]);
    setStepCount(0);
    setTimeQuantum(0);
    setReadyQueue([]);
    setLowPriorityQueue([]);
    setHighPriorityQueue([]);
    setWaitTimes([]);
  }, [timeline, algorithm]);

  useInterval(
    () => {
      step();
    },
    started ? 1000 : null
  );

  return {
    inboundRows,
    doneBlocks,
    stepCount,
    waitTimes
  };
};

export default useScheduler;
