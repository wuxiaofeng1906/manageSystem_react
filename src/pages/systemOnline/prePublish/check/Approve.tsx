import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useModel, history } from 'umi';
import { Button, Input, Space } from 'antd';
import styles from './index.less';
import ApproveFlow from '../../components/ApproveFlow';
import { valueMap } from '@/utils/utils';
import { COMMON_STATUS } from '../../constants';

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
      backend: '暂无',
      icon: '暂无',
      version: '暂无',
      dbs: '暂无',
      env: '暂无',
      onlineBefore: '未开始',
      upgradeAfter: '忽略',
      webVersion: '暂无',
      backendVersion: '暂无',
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
  const methods = useMemo(
    () => valueMap(methodSelectors || [], ['value', 'label']),
    [methodSelectors],
  );
  return (
    <div className={styles.approve}>
      <div>
        <h3>一、发布项目：</h3>
        <BuildProject />
      </div>
      <div style={{ margin: '16px 0' }}>
        <h3>二、发布服务</h3>
        <ul style={{ marginLeft: 40 }}>
          {proInfo?.upgrade_app.map((it) => {
            return (
              <li key={it.server_id}>
                <div className={'flex-row'}>
                  <div>{COMMON_STATUS[it.technical_side] || ''}:</div>
                  <span style={{ marginLeft: 40 }}>{it.app_name || '-'}</span>
                </div>
              </li>
            );
          })}
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
          <strong style={{ marginRight: 20 }}>六、发布集群：</strong>
          {methods[proInfo?.release_project?.release_method] || '-'}
        </li>
        <li>
          <strong style={{ marginRight: 20 }}>七、发布时间：</strong>
          {proInfo?.release_project?.release_date || '-'}
        </li>
      </ul>
      <div className={'flex-row'}>
        <h3 style={{ margin: 0 }}>八、检查详情：</h3>
        <Button
          onClick={() => {
            history.push({
              pathname: '/systemOnline/prePublish/check',
              query: { ...history.location.query },
              state: { key: 'detail' },
            });
          }}
          type={'link'}
        >
          点击进入
        </Button>
      </div>
      <div style={{ margin: '16px 0' }}>
        <h3>九、检查信息：</h3>
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
      <div style={{ margin: '10px 0' }}>
        <h3>十、备注</h3>
        <Input.TextArea
          rows={5}
          showCount
          maxLength={500}
          style={{ width: 500, marginLeft: 40 }}
          placeholder={'审批备注...'}
        />
      </div>
      <div>
        <h3>十一、审批流程：</h3>
        <ApproveFlow
          // data={[
          //   {
          //     label: '张三',
          //     value: '101',
          //     key: '101',
          //   },
          //   {
          //     label: '丸子',
          //     value: '102',
          //     key: '102',
          //   },
          // ]}
          data={[]}
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
