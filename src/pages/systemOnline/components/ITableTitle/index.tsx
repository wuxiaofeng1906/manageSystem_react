import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styles from './index.less';

interface ITitle {
  data: {
    title: string;
    subTitle?: string;
  };
}

const ITableTitle = ({ data }: ITitle) => {
  return (
    <h4 className={styles.iTableTitle}>
      {data.title}
      {data.subTitle ? (
        <Tooltip
          // overlayClassName={styles.tooltipCard}
          className={styles.tooltip}
          title={data.subTitle}
        >
          <InfoCircleOutlined />
        </Tooltip>
      ) : (
        <React.Fragment />
      )}
    </h4>
  );
};
export default ITableTitle;
