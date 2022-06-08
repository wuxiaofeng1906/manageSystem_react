import OnlineServices from '@/services/online';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { IRecord } from '@/namespaces';
const initList = [
  {
    type: '前端单元测试运行是否通过',
    status: '',
    start_time: '',
    end_time: '',
    key: 'test_unit',
    check_log: '',
  },
  {
    type: '后端单元测试运行是否通过',
    status: '',
    start_time: '',
    end_time: '',
    key: 'test_unit',
    check_log: '',
  },
  {
    type: 'web与h5图标一致性检查是否通过',
    status: '',
    start_time: '',
    end_time: '',
    key: 'icon_check',
    check_log: '',
  },
  {
    type: '创建库对比校验是否通过',
    status: '',
    start_time: '',
    end_time: '',
    key: 'library_data',
    check_log: '',
  },
  {
    type: '应用版本代码遗漏检查是否通过',
    status: '',
    start_time: '',
    end_time: '',
    refresh: true,
    key: 'version_check',
    check_log: '',
  },
  {
    type: '环境一致性检查是否通过',
    status: '',
    start_time: '',
    end_time: '',
    refresh: true,
    key: 'check_env',
    check_log: '',
  },
  {
    type: '业务前端是否封板',
    status: '',
    start_time: '',
    end_time: '',
    colSpan: 2,
    key: 'front_seal_version',
    check_log: '',
  },
  {
    type: '业务后端是否封板',
    status: '',
    start_time: '',
    end_time: '',
    colSpan: 2,
    key: 'backend_seal_version',
    check_log: '',
  },
  {
    type: '平台后端是否封板',
    status: '',
    start_time: '',
    end_time: '',
    colSpan: 2,
    key: 'platform_backend_seal_version',
    check_log: '',
  },
  {
    type: '流程是否封板',
    status: '',
    start_time: '',
    end_time: '',
    colSpan: 2,
    key: 'platform_backend_seal_version',
    check_log: '',
  },
];
export const useCheckDetail = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [source, setSource] = useState(initList);
  const [spinning, setSpinning] = useState(false);

  // detail
  const getList = useCallback(async () => {
    if (!idx) return;
    setSpinning(true);
    const res = await OnlineServices.getCheckDetail(idx).finally(() => setSpinning(false));
    const result = source.map((it, index) => {
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
        check_log: obj?.check_log,
      };
      return it;
    });
    setSource(result);
  }, []);

  // format check status
  const formatStatus = useCallback(({ data, rowIndex }: { data: IRecord; rowIndex: number }) => {
    let it = { value: '', color: '#2f2f2f' };
    switch (data.status) {
      case 'success':
        it = { value: '是', color: '#099409' };
        break;
      case 'error':
      case 'failure':
        it = { value: '否', color: '#e02c2c' };
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
      case 'done':
        it = { value: '已封板', color: '#099409' };
        break;
      default:
        it = { value: Number(rowIndex) > 5 ? '不涉及' : '暂无', color: '#2f2f2f' };
    }
    return <span style={{ color: it.color || 'initial' }}>{it.value}</span>;
  }, []);

  useEffect(() => {
    getList();
  }, []);

  return { getList, formatStatus, source, setSource, spinning };
};
