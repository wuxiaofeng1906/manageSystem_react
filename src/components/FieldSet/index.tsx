import React from 'react';
import styles from './index.less';

interface IField {
  data: { title: string; mark?: string; dot?: boolean };
  children: React.ReactNode;
}

const FieldSet = ({ data, children }: IField) => {
  return (
    <fieldset className={styles.fieldset} style={data?.dot ? { border: '1px dotted silver' } : {}}>
      <legend className={styles.legend}>
        {data.title}
        <label>{data?.mark}</label>
      </legend>
      <div>{children}</div>
    </fieldset>
  );
};
export default FieldSet;
