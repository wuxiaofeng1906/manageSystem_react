import React, { useRef, useState, useEffect } from 'react';
import { Tabs, Button, Space, Modal, message } from 'antd';
import { isEmpty } from 'lodash';
import { COMMON_STATUS, initGridTable } from '@/pages/systemOnline/constants';
import { publishDetailColumn, publishBackColumn } from '@/pages/systemOnline/Column';
import { AgGridReact } from 'ag-grid-react';
import type { GridApi } from 'ag-grid-community';
import { IRecord } from '@/namespaces';
import FlowArrow from '@/pages/systemOnline/components/FlowArrow';

const Content = ({ id, domRef }: { id: string; domRef: any }) => {
  const detailRef = useRef<GridApi>();

  const [publishData, setPublishData] = useState<IRecord[]>([]);
  const [backInfo, setBackInfo] = useState<IRecord[]>([]);
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
    setBackInfo([
      {
        cluster_name: '集群1',
        task_id: 1234,
      },
      {
        cluster_name: '集群2',
        task_id: 2345,
      },
      {
        cluster_name: 'global',
        task_id: 2344,
      },
    ]);
  }, [id]);

  return (
    <div>
      <div style={{ height: 200, marginBottom: 10 }}>
        <AgGridReact
          {...initGridTable(domRef)}
          columnDefs={publishBackColumn}
          rowData={backInfo}
          rowSelection={'multiple'}
        />
      </div>
      <div style={{ height: 300, marginBottom: 20 }}>
        <AgGridReact
          {...initGridTable(detailRef)}
          columnDefs={publishDetailColumn}
          rowData={publishData}
        />
      </div>
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
            status: 'partReject',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: 'allReject',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: 'no',
            info: '测试数据',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '1',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '2',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '3',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '4',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '41',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '42',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '4',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '41',
          },
          {
            start: '2022-03-04 08:12:10',
            end: '2022-03-04 12:12:10',
            status: '',
            info: '测试数据',
            title: '42',
          },
        ]}
      />
    </div>
  );
};

const Publish = () => {
  const backRef = useRef<GridApi>();
  const [tabs] = useState([
    { title: '工单1', status: 'success', id: '1' },
    { title: '工单2', status: 'start', id: '2' },
    { title: '工单3', status: 'start', id: '3' },
  ]);
  const fallback = async () => {
    const selected = backRef.current?.getSelectedRows();
    if (isEmpty(selected)) {
      message.destroy();
      message.info('请先选择需要回退的工单！');
      return;
    }
    Modal.confirm({
      title: '回退提醒：',
      content: '请确认是否回退该工单对应集群？',
      onOk: () => {
        console.log(selected);
      },
    });
  };
  const submit = async () => {
    Modal.confirm({
      title: '发布提醒：',
      content: '请确认是否一键发布工单？',
      onOk: () => {},
    });
  };

  return (
    <div>
      <div>
        <Tabs
          tabBarExtraContent={
            <Space size={16}>
              <Button type={'primary'} onClick={fallback}>
                点击回退
              </Button>
              <Button type={'primary'} onClick={submit}>
                一键发布
              </Button>
            </Space>
          }
        >
          {tabs.map((it) => {
            return (
              <Tabs.TabPane
                key={it.id}
                tabKey={it.id}
                tab={<span>{`${it.title}(${COMMON_STATUS[it.status] ?? '未开始'})`}</span>}
              >
                <Content id={it.id} domRef={backRef} />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};
export default Publish;
