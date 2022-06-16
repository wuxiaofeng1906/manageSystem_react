import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import cls from 'classnames';

const flowStatus = {
  noStart: '未开始',
  success: '成功',
  no: '不涉及',
  allReject: '全部失败',
  partReject: '部分失败',
};
const flowBg = {
  noStart: 'white',
  success: '#099409',
  no: '#21aff3',
  allReject: '#e02c2c',
  partReject: '#f68da0',
  init: '#e3e6ed',
};
const matrixArray = (list: any[], num = 2) => {
  if (num <= 1 || list.length < num) return [list];
  const group = [];
  const len = Math.ceil(list.length / num);
  for (let i = 0; i < len; i++) {
    const arr = list.slice(num * i, num * (i + 1));
    if ((i + 1) % 2 == 0) {
      arr.reverse();
    }
    group.push(arr);
  }
  return group;
};

const FlowArrow: React.FC<{ data: any[] }> = ({ data }) => {
  const onDoubleClick = (it: any) => {
    Modal.info({
      title: '状态信息',
      closable: true,
      centered: true,
      okButtonProps: { style: { display: 'none' } },
      content: (
        <div>
          <div className={'ellipsis'}>开始时间：{it?.start}</div>
          <div className={'ellipsis'}>结束时间：{it?.end}</div>
          <div className={'ellipsis'}>状态：{flowStatus[it?.status] ?? ''}</div>
          <div className={'ellipsis'}>信息：{it?.info}</div>
        </div>
      ),
    });
  };
  return (
    <div className={cls(styles.flowArrow)}>
      {matrixArray(data, 4)?.map((arr, i) => {
        const odd = (i + 1) % 2 == 0;
        return arr?.map((it: any, index: number) => (
          <div key={it?.title + index}>
            <div
              onDoubleClick={() => onDoubleClick(it)}
              className={cls(styles.wrapper, {
                [styles.leftArrow]: odd,
                [styles.bottomArrow]: odd && index == 0,
                [styles.topArrow]: odd && index == arr.length - 1,
              })}
            >
              <div className={styles.content} style={{ background: flowBg[it?.status || 'init'] }}>
                <div className={'ellipsis'}>步骤名：{it?.title}</div>
                <div className={'ellipsis'}>开始时间：{it?.start}</div>
                <div className={'ellipsis'}>结束时间：{it?.end}</div>
                <div className={'ellipsis'}>状态：{flowStatus[it?.status] ?? ''}</div>
                <div className={'ellipsis'}>信息：{it?.info}</div>
              </div>
              <div
                className={styles.left}
                style={{
                  borderColor: ` ${flowBg[it?.status]} transparent ${
                    flowBg[it?.status]
                  } transparent`,
                }}
              />
              <div
                className={styles.right}
                style={{
                  borderColor: `transparent transparent transparent ${flowBg[it?.status]}`,
                }}
              />
            </div>
          </div>
        ));
      })}
    </div>
  );
};
export default FlowArrow;
