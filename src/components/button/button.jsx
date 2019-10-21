import React from 'react';

import styles from './button.module.scss';

const Button = ({ label, onClick, disabled }) => (
  <button className={styles.button} disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

export default Button;
