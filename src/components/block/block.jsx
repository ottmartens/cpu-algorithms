import React from 'react';
import classnames from 'classnames';
import { colors } from '../../utils/constants';

import styles from './block.module.scss';

const Block = ({ isInvisible, value, inbound, size }) => (
  <div
    className={classnames(styles.block, {
      [styles.inbound]: inbound
    })}
    style={{
      background: isInvisible ? 'transparent' : colors[value],
      width: `${size}px`,
      height: `${size}px`,
      margin: `${size / 10}px`
    }}
  />
);

export default Block;
