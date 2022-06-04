import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useModel } from 'umi';
import { Button, Divider, Space } from 'antd';
import styles from './index.less';
import ApproveFlow from '../../components/ApproveFlow';
import { valueMap } from '@/utils/utils';
import { SERVERINFO } from '../../constants';

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

const BuildProject = () => {
  const [upgrade_project] = useModel('systemOnline', (system) => [system.proInfo?.upgrade_project]);
  return (
    <ul style={{ marginLeft: 40 }}>
      {upgrade_project?.map((it) => {
        return (
          <li key={it.pro_id}>
            <div className={'flex-row'}>
              <div style={{ width: '260px' }}>{it.project_name}</div>
              <span>项目负责人： {it.manager || '-'}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Approve = () => {
  const [checkSource, setCheckSource] = useState<Record<keyof typeof checkInfo, string> | null>();
  const [disabled, typeSelectors, methodSelectors, proInfo] = useModel('systemOnline', (system) => [
    system.disabled,
    system.typeSelectors,
    system.methodSelectors,
    system.proInfo,
  ]);

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

  const types = useMemo(() => valueMap(typeSelectors || [], ['value', 'label']), [typeSelectors]);
  const methods = useMemo(() => valueMap(methodSelectors || [], ['value', 'label']), [
    methodSelectors,
  ]);

  return (
    <div className={styles.approve}>
      <div>
        <h3>一、发布项目：</h3>
        <BuildProject />
      </div>
      <div style={{ margin: '16px 0' }}>
        <h3>二、发布服务</h3>
        <ul style={{ marginLeft: 40 }}>
          {Object.entries(SERVERINFO).map(([k, v]) => (
            <li key={k}>
              <div className={'flex-row'}>
                <div style={{ width: 100 }}>{v}</div>
                <span>{'-'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        <li>
          <strong style={{ marginRight: 20 }}>三、发布分支：</strong>
          {proInfo?.release_project?.release_branch || '-'}
        </li>
        <li>
          <strong style={{ marginRight: 20 }}>四、发布类型：</strong>
          {types[proInfo?.release_project?.release_type] || '-'}
        </li>
        <li>
          <strong style={{ marginRight: 20 }}>五、发布方式：</strong>
          {methods[proInfo?.release_project?.release_method] || '-'}
        </li>
        <li>
          <strong style={{ marginRight: 20 }}>六、发布时间：</strong>
          {proInfo?.release_project?.release_date || '-'}
        </li>
      </ul>
      <div style={{ margin: '16px 0' }}>
        <h3>七、检查信息：</h3>
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
        <h3>九、审批流程：</h3>
        <ApproveFlow
          data={[
            {
              label: '张三',
              value: '101',
              key: '101',
            },
            {
              label: '丸子',
              value: '102',
              key: '102',
            },
          ]}
        />
      </div>
      <Space size={8}>
        <Button type={'primary'} disabled={disabled}>
          提交审批
        </Button>
        <Button type={'primary'} style={{ color: '#ffb012' }}>
          撤销审批
        </Button>
      </Space>
    </div>
  );
};
export default Approve;
