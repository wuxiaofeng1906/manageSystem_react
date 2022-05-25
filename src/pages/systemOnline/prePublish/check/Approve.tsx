import React, { useEffect, useState, useCallback } from 'react';
import { Button, Space } from 'antd';
import styles from './index.less';
import ApproveFlow from '../../components/ApproveFlow';

const checkStatus = {
  green: '#099409',
  red: '#e02c2c',
  blue: '#21aff3',
  yellow: '#d4d453',
};
const checkInfo = {
  web: '前端单元测试运行是否通过',
  backend: '后端单元测试运行是否通过',
  icon: '图标一致性检查是否通过',
  version: '版本检查是否通过',
  dbs: '创建库对比校验是否通过',
  env: '环境一致性检查是否通过',
  onlineBefore: '上线前自动化检查是否通过',
  upgradeAfter: '升级后自动化检查是否通过',
  webVersion: '前端是否封板',
  backendVersion: '后端是否封板',
};

const Approve = () => {
  const [checkSource, setCheckSource] = useState<Record<keyof typeof checkInfo, string> | null>(
    null,
  );

  useEffect(() => {
    setCheckSource({
      web: '暂无',
      backend: '是',
      icon: '是',
      version: '是',
      dbs: '否',
      env: '进行中',
      onlineBefore: '未开始',
      upgradeAfter: '忽略',
      webVersion: '未封板',
      backendVersion: '已封板',
    });
  }, []);

  const renderColor = useCallback((v: string): React.CSSProperties => {
    let color = '#2f2f2f';
    if (v == '否') color = checkStatus.red;
    if (['已封板', '是'].includes(v)) color = checkStatus.green;
    if (v == '进行中') color = checkStatus.blue;
    if (v == '忽略') color = checkStatus.yellow;
    return { color };
  }, []);
  return (
    <div className={styles.approve}>
      <div>
        <h3>一、发布项目：</h3>
        <ul style={{ marginLeft: 40 }}>
          <li>
            <Space size={40}>
              <span>笑果文化</span>
              <span>项目负责人： 张三</span>
            </Space>
          </li>
          <li>
            <Space size={40}>
              <span>采购发票</span>
              <span>项目负责人： 李珊珊</span>
            </Space>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          <strong>二、发布分支：</strong>release
        </li>
        <li>
          <strong>三、发布类型：</strong>灰度发布
        </li>
        <li>
          <strong>四、发布方式：</strong>不停服
        </li>
        <li>
          <strong>五、发布时间：</strong>2022-03-08 12：11
        </li>
      </ul>
      <div style={{ margin: '16px 0' }}>
        <h3>六、检查信息：</h3>
        <ul style={{ marginLeft: 40 }}>
          {Object.entries(checkInfo).map(([k, v], index) => {
            const status = checkSource && checkSource[k];
            return (
              <li key={v}>
                {`${index + 1}、${v}：`}
                <span style={renderColor(status)}>{status}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h3>七、审批流程：</h3>
        <ApproveFlow
          data={[
            {
              label: '张三',
              value: '101',
              key: '101',
            },
            {
              label: '刘德饭',
              value: '102',
              key: '102',
            },
          ]}
        />
      </div>
      <Space size={8}>
        <Button type={'primary'}>提交审批</Button>
        <Button type={'primary'} style={{ color: '#ffb012' }}>
          撤销审批
        </Button>
      </Space>
    </div>
  );
};
export default Approve;
