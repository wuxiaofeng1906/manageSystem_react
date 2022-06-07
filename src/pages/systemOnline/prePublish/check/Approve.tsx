import React, { useMemo, useEffect, useState } from 'react';
import { useModel, history, useLocation } from 'umi';
import { Button, Input, Space } from 'antd';
import styles from './index.less';
import ApproveFlow, { TagSource } from '../../components/ApproveFlow';
import { valueMap } from '@/utils/utils';
import { COMMON_STATUS } from '../../constants';
import { useCheckDetail } from '@/hooks/online';
import OnlineServices from '@/services/online';

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
  const { source, formatStatus } = useCheckDetail();
  const {
    query: { idx },
  } = useLocation() as any;
  const [disabled, typeSelectors, methodSelectors, proInfo] = useModel('systemOnline', (system) => [
    system.disabled,
    system.typeSelectors,
    system.methodSelectors,
    system.proInfo,
  ]);
  const [remark, setRemark] = useState('');
  const [flag, setFlag] = useState(false);

  const [approveDetail, setApproveDetail] = useState<Record<string, any> | undefined>();
  const [initSource, setIntSource] = useState<TagSource>();
  const types = useMemo(() => valueMap(typeSelectors || [], ['value', 'label']), [typeSelectors]);
  const methods = useMemo(
    () => valueMap(methodSelectors || [], ['value', 'label']),
    [methodSelectors],
  );

  // technical_side group
  const formatServerInfo = useMemo(() => {
    let result: any[] = [];
    ['businessFront', 'businessBackend', 'platformBackend', 'process'].map((it, i) => {
      proInfo?.upgrade_app?.map((obj) => {
        if (obj.technical_side == it) {
          result[i] = {
            app_name: [...(result[i]?.app_name || ''), obj.app_name],
            technical_side: COMMON_STATUS[obj.technical_side] || '',
            server_id: obj.server_id || 1,
          };
        }
      });
    });
    return result || [];
  }, [proInfo?.upgrade_app]);

  const getApproval = async () => {
    const res = await OnlineServices.getApproval(idx);
    setApproveDetail(res);
    // 检查是否存在未通过选项
    checkPass();
  };

  const getInitApproval = async () => {
    // 默认审批人
    const result = await OnlineServices.getApplicant(idx);
    setIntSource({
      duty:
        approveDetail?.sp_record?.length > 0
          ? approveDetail?.sp_record[0]?.detail?.map((it: any) => ({
              key: it.approver,
              label: it.approver_name,
              value: it.approver,
              status: it.sp_status,
            }))
          : result?.duty?.map((it: any) => ({
              key: it.user_id,
              label: it.user_name,
              value: it.user_id,
            })),
      director:
        approveDetail?.sp_record?.length > 1
          ? approveDetail?.sp_record[1]?.detail?.map((it: any) => ({
              key: it.approver,
              label: it.approver_name,
              value: it.approver,
              status: it.sp_status,
            }))
          : result?.director?.map((it: any) => ({
              key: it.user_id,
              label: it.user_name,
              value: it.user_id,
            })),
      cc: result?.cc?.map((it: any) => ({
        key: it.user_id,
        label: it.user_name,
        value: it.user_id,
      })),
    });
  };

  const checkPass = () => {
    const status = source.some((it) => ['feature', 'error'].includes(it.status));
    setFlag(status);
    if (status) {
      getInitApproval();
    }
  };

  useEffect(() => {
    getApproval();
  }, []);

  return (
    <div className={styles.approve}>
      <div>
        <h3>一、发布项目：</h3>
        <BuildProject />
      </div>
      <div style={{ margin: '16px 0' }}>
        <h3>二、发布服务</h3>
        <ul style={{ marginLeft: 40 }}>
          {formatServerInfo?.map((it) => {
            return (
              <li key={it.server_id}>
                <div className={'flex-row'}>
                  <div style={{ width: 110 }}>{it.technical_side}:</div>
                  <span>{it.app_name?.join() || '-'}</span>
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
          {proInfo?.upgrade_app?.map((it) => it.cluster_name)?.join(',') || '-'}
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
              query: { ...history.location.query, active: 'detail' },
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
          {source.map((it, index) => {
            return (
              <li key={it.key + index}>
                <span style={{ marginRight: 10 }}>{`${index + 1}、${it.type}：`}</span>
                {formatStatus({ data: it, rowIndex: index })}
              </li>
            );
          })}
        </ul>
      </div>
      {flag && (
        <>
          <div style={{ margin: '10px 0' }}>
            <h3>十、备注</h3>
            <Input.TextArea
              rows={5}
              showCount
              maxLength={500}
              style={{ width: 512, marginLeft: 40 }}
              placeholder={'审批备注...'}
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value?.trim());
              }}
            />
          </div>
          <div>
            <h3>十一、审批流程：</h3>
            <ApproveFlow
              data={initSource}
              disabled={disabled}
              remark={remark}
              approveDetail={approveDetail}
              onConfirm={getApproval}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default Approve;
