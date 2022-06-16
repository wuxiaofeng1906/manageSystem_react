import OnlineServices from '@/services/online';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, List } from 'antd';
import { useLocation } from 'umi';
import { IRecord } from '@/namespaces';
import { CHECK_LIST } from '@/pages/systemOnline/constants';

export const useCheckDetail = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [checkSource, setCheckSource] = useState(CHECK_LIST);
  const [spinning, setSpinning] = useState(false);

  // detail
  const getList = useCallback(async () => {
    if (!idx) return;
    setSpinning(true);
    const res = await OnlineServices.getCheckDetail(idx).finally(() => setSpinning(false));
    const result = checkSource.map((it, index) => {
      const front = res?.test_unit[index]?.test_case_technical_side == 'front';
      const obj = it.key == 'test_unit' ? res?.[it.key]?.[front ? 0 : 1] : res?.[it.key];
      it = {
        ...it,
        status:
          obj?.check_result == 'unknown' || it.key == 'test_unit' // [单元测试、检查结果unknown] 取值：check_status，反之check_result
            ? obj?.check_status
            : obj?.check_result,
        start_time: obj?.check_start_time,
        end_time: obj?.check_end_time,
        version_time:
          index > 5
            ? obj.check_result == 'failure'
              ? ''
              : obj.check_log?.[0]?.sealing_version_time
            : '',
        check_log: obj?.check_log,
      };
      return it;
    });
    setCheckSource(result);
  }, []);

  // format check status
  const formatCheckStatus = useCallback(
    ({ data, rowIndex }: { data: IRecord; rowIndex: number }) => {
      let it = { value: '', color: '#2f2f2f' };
      switch (data.status) {
        case 'success':
          it = { value: rowIndex <= 5 ? '通过' : '已封板', color: '#099409' };
          break;
        case 'error':
        case 'failure':
          it = { value: rowIndex <= 5 ? '不通过' : '未封板', color: '#e02c2c' };
          break;
        case 'running':
        case 'doing':
          it = { value: '进行中', color: '#21aff3' };
          break;
        case 'wait':
          it = { value: '未开始', color: '' };
          break;
        case 'skip':
          it = { value: '忽略', color: '#d4d453' };
          break;
        case 'no_branch':
          it = { value: '暂无分支', color: '#2f2f2f' };
          break;
        case 'done':
          it = { value: '已封版', color: '#099409' };
          break;
        default:
          it = { value: Number(rowIndex) > 5 ? '不涉及' : '暂无', color: '#2f2f2f' };
      }
      return <span style={{ color: it.color || 'initial' }}>{it.value}</span>;
    },
    [],
  );

  useEffect(() => {
    getList();
  }, []);

  return { getList, formatCheckStatus, checkSource, setCheckSource, spinning };
};

export const useShowLog = () => {
  const [logs, setLogs] = useState([]);
  const [showLog, setShowLog] = useState<{
    visible: boolean;
    data: Record<'operation_id' | 'operation_address', string>;
    title?: string;
  }>();

  const getLogs = useCallback(async () => {
    if (!showLog?.data) return;
    const res = await OnlineServices.optionsLog(showLog.data);
    setLogs(res);
  }, [showLog?.data]);

  const showModal = () => {
    Modal.info({
      width: logs.length == 0 ? 520 : 800,
      title: showLog?.title,
      centered: true,
      closable: true,
      okButtonProps: { style: { display: 'none' } },
      onCancel: () => setShowLog(undefined),
      content:
        logs.length == 0 ? (
          '暂无操作日志'
        ) : (
          <List style={{ maxHeight: 600, overflow: 'auto', marginTop: 8 }}>
            {logs?.map((it: { option_content: string; option_time: string }, index: number) => {
              return (
                <List.Item key={it.option_time + index}>
                  <List.Item.Meta
                    title={`操作内容： ${it.option_content}`}
                    description={`操作时间： ${it.option_time}`}
                  />
                </List.Item>
              );
            })}
          </List>
        ),
    });
  };

  useEffect(() => {
    if (showLog?.data) {
      getLogs();
    }
  }, [showLog]);

  useEffect(() => {
    if (!showLog?.visible) return;
    showModal();
  }, [logs]);

  return { setShowLog };
};
