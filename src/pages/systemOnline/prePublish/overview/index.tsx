import React, { useEffect, useRef, useState } from 'react';
import {
  OverviewBug,
  OverviewBugLog,
  OverviewInfo,
  OverviewSummary,
} from '@/pages/systemOnline/Column';
import { IRecord } from '@/namespaces';
import { Table, Checkbox, Form, Select, Row, Col } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { GridApi } from 'ag-grid-community';
import { initGridTable, PROJECT_SUMMARY } from '@/pages/systemOnline/constants';
import { mergeCellsTable } from '@/utils/utils';
import styles from './overview.less';

const mock = [
  {
    key: '0',
    project_name:
      '笑果文化测试测试笑果文化测试测试笑果文化测试测试笑果文化测试测试笑果文化测试测试笑果文化测试测试',
    taskNum: '6172',
    title:
      '笑果文化的标题标题标题标题标题笑果文化的标题标题标题标题标题笑果文化的标题标题标题标题标题',
    demandStatus: '激活',
    taskStage: '立项中',
    taskID: '47115',
    taskName: '【开发】资源数',
    pointer: '王久中-1',
    finishedPerson: '张娥',
    taskStatus: '未开始',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '1',
    project_name: '笑果文化',
    taskNum: '6172',
    title: '笑果文化的标题-2',
    demandStatus: '激活',
    taskStage: '立项中',
    taskID: '47116',
    taskName: '【开发】资源数',
    pointer: '王尔中',
    finishedPerson: '黄娥',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '2',
    project_name: '笑果文化',
    taskNum: '6172',
    title: '笑果文化的标题-3',
    demandStatus: '未开始',
    taskStage: '立项中',
    taskID: '47117',
    taskName: '【开发】资源数-2',
    pointer: '王尔中',
    finishedPerson: '黄娥',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '3',
    project_name: '额外',
    taskNum: '6173',
    title: '额外的标题',
    demandStatus: '激活',
    taskStage: '立项中',
    taskID: '47118',
    taskName: '【开发】资源数-3',
    pointer: '邓登',
    finishedPerson: '冉斓',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '4',
    project_name: '额外-4',
    taskNum: '6175',
    title: '额外的标题',
    demandStatus: '未开始',
    taskStage: '立项中',
    taskID: '47119',
    taskName: '【开发】资源数',
    pointer: '谢囍',
    finishedPerson: '冉斓',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '5',
    project_name: '额外-5',
    taskNum: '6175',
    title: '额外的标题-5',
    demandStatus: '激活',
    taskStage: '立项中',
    taskID: '47120',
    taskName: '【开发】资源数-5',
    pointer: '邓林',
    finishedPerson: '冉斓',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
  {
    key: '7',
    project_name: '额外-8',
    taskNum: '6178',
    title: '额外的标题-8',
    demandStatus: '未开始',
    taskStage: '立项中',
    taskID: '47123',
    taskName: '【开发】资源数-7',
    pointer: '邓亿登',
    finishedPerson: '薛斓',
    taskStatus: '进行中',
    planStartTime: '',
    planEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
  },
];
const Overview = () => {
  const summaryRef = useRef<GridApi>();
  const bugLogRef = useRef<GridApi>();
  const bugRef = useRef<GridApi>();
  const [infoForm] = Form.useForm();
  const [bugLogForm] = Form.useForm();
  const [bugForm] = Form.useForm();

  const [summary, setSummary] = useState<IRecord[]>([mock]);

  useEffect(() => {
    setSummary(mergeCellsTable(mock, 'taskNum'));
  }, []);

  return (
    <div className={styles.overview}>
      <ul className={styles.tagList}>
        {PROJECT_SUMMARY.map((text, i) => (
          <li key={i}>{`${i + 1}、 ${text}`}</li>
        ))}
      </ul>
      <div className={'AgGridReactTable'} style={{ height: 300 }}>
        <AgGridReact {...initGridTable(summaryRef)} columnDefs={OverviewSummary} rowData={[]} />
      </div>
      <Form form={infoForm}>
        <Row justify={'space-between'} gutter={6}>
          <Col span={4}>
            <Form.Item label={'归属执行'} name={'project_id'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'需求状态'} name={'demand_status'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'需求编号'} name={'demand_num'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'任务状态'} name={'task_status'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'任务编号'} name={'task_num'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name={'show'}>
              <Checkbox
                defaultChecked={true}
                onChange={({ target: { checked } }) => {
                  let result = mergeCellsTable(mock, 'taskNum', !checked);
                  if (!checked) {
                    result = result.filter((it) => it.rowSpan !== 0);
                  }
                  setSummary(result);
                }}
              >
                是否显示需求下的任务
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        className={'initial-ant-table'}
        columns={OverviewInfo}
        dataSource={summary}
        tableLayout={'auto'}
        scroll={{ x: 'max-content' }}
        bordered
      />
      <Form form={bugLogForm}>
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item label={'归属执行'} name={'project_id'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'BUG状态'} name={'bug_status'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'BUG编号'} name={'bug_num'}>
              <Select />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={'AgGridReactTable'} style={{ height: 300 }}>
        <AgGridReact {...initGridTable(bugLogRef)} columnDefs={OverviewBugLog} rowData={[]} />
      </div>
      <Form form={bugForm}>
        <Row gutter={10}>
          <Col span={4}>
            <Form.Item label={'归属执行'} name={'project_id'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'测试单名称'} name={'name'}>
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'状态'} name={'status'}>
              <Select />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={'AgGridReactTable'} style={{ height: 300 }}>
        <AgGridReact {...initGridTable(bugRef)} columnDefs={OverviewBug} rowData={[]} />
      </div>
    </div>
  );
};
export default Overview;
