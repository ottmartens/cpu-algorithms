import React from 'react';

import styles from './select.module.scss';

const select = ({ options = [], onChange }) => {
  const hasObjects = typeof options[0] === 'object';

  return (
    <select onChange={onChange} className={styles.select}>
      {options.map(option =>
        hasObjects ? (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ) : (
          <option key={option}>{option}</option>
        )
      )}
    </select>
  );
};

export default select;
