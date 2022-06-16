import React, { useRef, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { COMMON_STATUS, initGridTable } from '@/pages/systemOnline/constants';
import { publishDetailColumn } from '@/pages/systemOnline/column';
import { AgGridReact } from 'ag-grid-react';
import type { GridApi } from 'ag-grid-community';
import { IRecord } from '@/namespaces';
import FlowArrow from '@/pages/systemOnline/components/FlowArrow';

const Content = ({ id }: { id: string }) => {
  const gridApi = useRef<GridApi>();
  const [publishData, setPublishData] = useState<IRecord[]>([]);
  useEffect(() => {
    setPublishData([
      {
        cluster_name: '集群1',
        status: 'success',
        start_time: '2022-04-10',
        end_time: '2022-04-10',
        content: '测试测试',
        id: '1',
      },
      {
        cluster_name: '集群2',
        status: 'failure',
        start_time: '2022-04-10',
        end_time: '2022-04-13',
        content: '测试测试',
        id: '2',
      },
    ]);
  }, [id]);
  return (
    <div>
      <AgGridReact
        {...initGridTable(gridApi)}
        columnDefs={publishDetailColumn}
        rowData={publishData}
      />
      <FlowArrow
        data={[
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: 'success',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
          },
        ]}
      />
    </div>
  );
};

const Publish = () => {
  const [tabs] = useState([
    { title: '工单1', status: 'success', id: '1' },
    { title: '工单2', status: 'start', id: '2' },
    { title: '工单3', status: 'start', id: '3' },
  ]);
  return (
    <div>
      <div>
        <Tabs>
          {tabs.map((it) => {
            return (
              <Tabs.TabPane
                key={it.id}
                tabKey={it.id}
                tab={<span>{`${it.title}(${COMMON_STATUS[it.status] ?? '未开始'})`}</span>}
              >
                <Content id={it.id} />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};
export default Publish;
