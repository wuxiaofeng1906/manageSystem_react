import React, { useRef, useState, useEffect } from 'react';
import { checkDetailColumn } from '../../column';
import { AgGridReact } from 'ag-grid-react';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { initGridTable } from '@/pages/systemOnline/constants';

const Detail = () => {
  const gridApi = useRef<GridApi>();

  const [source, setSource] = useState<Record<string, any>[]>([]);
  useEffect(() => {
    setSource([
      { type: '前端单元测试运行是否通过', status: '暂无', start_time: '', end_time: '' },
      {
        type: '后端单元测试运行是否通过',
        status: '是',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
      },
      {
        type: 'web与h5图标一致性检查是否通过',
        status: '是',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
      },
      { type: '创建库对比校验是否通过', status: '暂无', start_time: '', end_time: '' },
      {
        type: '应用版本代码遗漏检查是否通过',
        status: '否',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
        refresh: true,
      },
      {
        type: '环境一致性检查是否通过',
        status: '进行中',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
        refresh: true,
      },
      {
        type: '上线环境与预发布集群环境版本检查是否通过',
        status: '暂无',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
        refresh: true,
      },
      {
        type: '上线自动化检查是否通过',
        status: '未开始',
        start_time: '2022-03-21 22:12:12',
        end_time: '2022-03-21 22:12:12',
        refresh: true,
      },
      { type: '升级后自动化检查是否通过', status: '未启用', start_time: '', end_time: '' },
      { type: '业务前端是否封板', status: '未封板', start_time: '', end_time: '', colSpan: 2 },
      {
        type: '业务后端是否封板',
        status: '已封板',
        start_time: '2022-03-21 22:12:12',
        end_time: '',
        colSpan: 2,
      },
      { type: '平台后端是否封板', status: '不涉及', start_time: '', end_time: '', colSpan: 2 },
      { type: '流程是否封板', status: '不涉及', start_time: '', end_time: '', colSpan: 2 },
    ]);
  }, []);

  return (
    <div className={'AgGridReactTable'} style={{ height: 610 }}>
      <AgGridReact
        columnDefs={checkDetailColumn}
        {...initGridTable(gridApi)}
        rowData={source}
        frameworkComponents={{
          operation: ({ data }: CellClickedEvent) => {
            return (
              <div className={'operation'}>
                {data?.refresh && (
                  <img
                    src={require('../../../../../public/excute.png')}
                    onClick={() => {
                      //auto check
                    }}
                  />
                )}
                <img
                  src={require('../../../../../public/logs.png')}
                  style={
                    data.status == '暂无' ? { filter: 'grayscale(1)', cursor: 'not-allowed' } : {}
                  }
                  onClick={() => {
                    if (data.status == '暂无') return;
                    console.log(data);
                  }}
                />
              </div>
            );
          },
        }}
      />
    </div>
  );
};
export default Detail;
