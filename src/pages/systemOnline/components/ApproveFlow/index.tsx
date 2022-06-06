import React, { useEffect, useState } from 'react';
import { Timeline } from 'antd';
import {
  PlusSquareOutlined,
  CloseCircleOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import PersonSelector, { OptionType } from '../PersonSelector';
import cls from 'classnames';
import styles from './index.less';

interface IFlow {
  disabled?: boolean;
  data: any;
  // onAdd: (data: any[]) => void;
  // onConfirm: (data: any) => void;
  // onCancel: () => void;
}

const ApproveFlow = ({ data, disabled }: IFlow) => {
  const [list, setList] = useState<OptionType[]>([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className={styles.approveFlow}>
      <Timeline>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p>发起人</p>
            <p>test</p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p style={{ marginBottom: 10 }}>
              开发值班人：<span className={'color-prefix'}>会签</span>
            </p>
            <div className={'flex-row'}>
              <div className={'flex-row'}>
                {list.map((it, index) => (
                  <div key={it.value} className={cls(styles.signWrap, 'ellipsis')}>
                    <span>{it.label}</span>
                    <CloseCircleOutlined
                      disabled={disabled}
                      onClick={() => {
                        list.splice(index, 1);
                        setList([...list]);
                      }}
                    />
                  </div>
                ))}
              </div>
              <PlusSquareOutlined
                disabled={disabled}
                onClick={() => setShow(true)}
                className={styles.addAnticon}
              />
            </div>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<UserOutlined />}>
          <div>
            <p>
              总监审批：<span className={'color-prefix'}>会签</span>
            </p>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<SendOutlined />}>
          <div>
            <p>抄送人</p>
          </div>
        </Timeline.Item>
      </Timeline>
      <PersonSelector
        visible={show}
        data={list}
        onOk={(v) => {
          setList(v);
          setShow(false);
        }}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};
export default ApproveFlow;
