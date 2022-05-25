import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';

import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Select, DatePicker } from 'antd';
import type { CellDoubleClickedEvent, GridApi } from 'ag-grid-community';

import { history, Link, useModel } from 'umi';
import moment from 'moment';
import { publishColumn } from '../column';
import { initGridTable } from '../constants';
import IPagination from '@/components/IPagination';
import './index.less';

const PublishList: React.ReactNode = () => {
  const gridApi = useRef<GridApi>();

  const [setDisabled, setSetting] = useModel('systemOnline', (system) => [
    system.setDisabled,
    system.setSetting,
  ]);
  const [publishSource, setPublishSource] = useState<Record<string, any>[]>([]);
  const [publishForm] = Form.useForm();
  const [publishCondition] = useState({
    publish_result: ['all'],
    publish_type: ['all'],
    publish_by: ['all'],
    // publish_project: '1',
    publish_date: [moment().startOf('years'), moment()],
  });

  useEffect(() => {
    setSetting(null);
    setDisabled(false);
    setPublishSource([
      {
        id: 1,
        publish_version: '001',
        publish_project: '测试项目001',
        publish_result: 'success',
        publish_person: '张三',
        publish_branch: 'master',
        publish_type: '灰度堆线上',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/03 14:30',
        rowSpan: 2,
      },
      {
        id: 2,
        publish_version: '003',
        publish_project: '测试项目002',
        publish_result: 'failure',
        publish_person: '李四',
        publish_branch: 'develop',
        publish_type: '热更',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/01 18:30',
      },
      {
        id: 3,
        publish_version: '002',
        publish_project: '测试项目002',
        publish_result: 'failure',
        publish_person: '李四',
        publish_branch: 'develop',
        publish_type: '热更',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/01 18:30',
        rowSpan: 1,
      },
      {
        id: 4,
        publish_version: '002',
        publish_project: '测试项目002',
        publish_result: 'failure',
        publish_person: '李四',
        publish_branch: 'develop',
        publish_type: '热更',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/01 18:30',
        rowSpan: 3,
      },
      {
        id: 5,
        publish_version: '002',
        publish_project: '测试项目002',
        publish_result: 'failure',
        publish_person: '李四',
        publish_branch: 'develop',
        publish_type: '热更',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/01 18:30',
      },
      {
        id: 6,
        publish_version: '002',
        publish_project: '测试项目002',
        publish_result: 'failure',
        publish_person: '李四',
        publish_branch: 'develop',
        publish_type: '热更',
        publish_by: '停服',
        publish_env: '集群1',
        publish_date: '2022/05/01 18:30',
      },
    ]);
  }, []);

  return (
    <PageContainer>
      <Link to={'/systemOnline/prePublish/projectServices'}>新增发布</Link>
      <Form form={publishForm} initialValues={publishCondition}>
        <Row justify={'space-between'}>
          <Col span={4}>
            <Form.Item label="发布项目:" name="publish_project">
              <Select
                showSearch
                options={[{ value: '1', label: '项目1' }]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布结果:" name="publish_result">
              <Select
                showArrow
                showSearch={false}
                mode="multiple"
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: '全部' },
                  { value: '', label: '空' },
                  { value: '1', label: '发布成功' },
                  { value: '0', label: '发布失败' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布类型:" name="publish_type">
              <Select
                showArrow
                mode="multiple"
                showSearch={false}
                options={[
                  { value: 'all', label: '全部' },
                  { value: '1', label: '灰度发布' },
                  { value: '2', label: '灰度推线上' },
                  { value: '3', label: '热更线上' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布方式:" name="publish_by">
              <Select
                options={[
                  { value: 'all', label: '全部' },
                  { value: '0', label: '停服' },
                  { value: '1', label: '不停服' },
                ]}
                showArrow
                showSearch={false}
                mode="multiple"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="发布日期:" name="publish_date">
              <DatePicker.RangePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          {...initGridTable(gridApi)}
          rowData={publishSource}
          columnDefs={publishColumn}
          onCellDoubleClicked={({ data }: CellDoubleClickedEvent) => {
            setDisabled(true);
            setSetting(data);
            history.push({
              pathname: '/systemOnline/prePublish/projectServices',
              // query: { idx: data.id, disabled: '1' },
            });
          }}
        />
      </div>

      <IPagination
        onChange={(it) => {
          console.log(it);
        }}
        page={{
          pageSize: 20,
          total: 100,
          current: 1,
          pages: 5,
        }}
        showQuickJumper={(v) => {
          console.log(v);
        }}
        onShowSizeChange={(v) => {
          console.log(v);
        }}
      />
    </PageContainer>
  );
};
export default PublishList;
