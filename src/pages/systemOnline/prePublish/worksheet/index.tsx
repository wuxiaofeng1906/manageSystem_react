import React, { useState, useEffect } from 'react';
import FieldSet from '@/components/FieldSet';
import {
  Form,
  InputNumber,
  Col,
  Checkbox,
  Row,
  Select,
  Table,
  Tabs,
  Space,
  Button,
  Input,
} from 'antd';
import {
  worksheetServiceColumn,
  worksheetFormColumn,
  worksheetServiceGreyColumn,
  worksheetFormGreyColumn,
} from '@/pages/systemOnline/Column';
import { IRecord } from '@/namespaces';
import { mergeCellsTable } from '@/utils/utils';
import { ColumnType } from 'antd/lib/table';

const Worksheet = () => {
  const [tabs, setTabs] = useState<IRecord[]>([]);
  const [activeTab, setActiveTab] = useState('11');
  const [subTab, setSubTab] = useState('info');

  const onAdd = () => {
    const add = [...tabs];
    add.push({ title: `工单${tabs.length + 1}`, id: Math.random() * 100, status: '' });
    setTabs(add);
  };

  useEffect(() => {
    setTabs([
      { title: '工单1', id: '11', status: 'success' },
      { title: '工单2', id: '22', status: 'error' },
      { title: '工单3', id: '33', status: '' },
    ]);
  }, []);

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onEdit={onAdd}
        type="editable-card"
        onChange={(v) => setActiveTab(v)}
      >
        {tabs.map((it) => {
          return (
            <Tabs.TabPane tab={it.title} key={it.id} closable={false}>
              <Tabs
                activeKey={subTab}
                onChange={(v) => setSubTab(v)}
                tabBarExtraContent={
                  <Space size={16}>
                    <Button type={'primary'} onClick={() => {}} size={'small'}>
                      保存草稿
                    </Button>
                    <Button type={'primary'} onClick={() => {}} size={'small'}>
                      提交工单
                    </Button>
                  </Space>
                }
              >
                <Tabs.TabPane tab={`${it.title}(${it.status})`} key={'info'}>
                  {activeTab == '11' ? <WorksheetGrey data={it} /> : <WorksheetHot data={it} />}
                </Tabs.TabPane>
                <Tabs.TabPane tab={'审批信息'} key={'approve'}>
                  <div>审批信息</div>
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
export default Worksheet;

// 热更、灰度
const WorksheetHot = ({ data }: { data: any }) => {
  const [form] = Form.useForm();
  const watchType = Form.useWatch('type', form);

  const [selected, setSelected] = useState<{ id: number; index: number }[]>([]);
  const [serviceSource, setServiceSource] = useState<IRecord[]>([]);
  const [formSource, setFormSource] = useState<IRecord[]>([]);
  const onIgnore = (checked: boolean, record: any, index: number) => {
    let data = [...selected];
    if (checked) {
      data.push({ id: record.id, index: index });
    } else {
      data = data.filter((it) => it.index !== index);
    }
    setSelected(data);
  };

  useEffect(() => {
    setServiceSource([
      {
        id: 1111,
        services: 'qbos',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
      {
        id: 1222,
        services: 'h5',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
      {
        id: 1222,
        services: 'web',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
    ]);
    setFormSource([
      {
        id: 1,
        env: '集群1',
        application: 'web',
        services: 'release',
        cache: 'yes',
        batch_version: '',
        dbs_version: '',
        recovery: 'no',
        update: '',
        add: '',
        mark: '',
      },
      {
        id: 2,
        env: '集群2',
        application: 'web',
        services: 'release',
        cache: 'yes',
        batch_version: '',
        dbs_version: '',
        recovery: 'no',
        update: '',
        add: '',
        mark: '',
      },
      {
        id: 2,
        env: '集群2',
        application: 'h5',
        services: 'release',
        cache: 'yes',
        batch_version: '',
        dbs_version: '',
        recovery: 'no',
        update: '',
        add: '',
        mark: '',
      },
    ]);
  }, []);

  useEffect(() => {
    // fresh
    // console.log(selected);
  }, [selected]);

  return (
    <div>
      <FieldSet data={{ title: '分支环境对应服务最新镜像包' }}>
        <Table
          columns={worksheetServiceColumn.concat([
            {
              title: '操作',
              align: 'center',
              render: (_, record, index) => (
                <Checkbox onChange={(e) => onIgnore(e.target.checked, record, index)}>
                  忽略
                </Checkbox>
              ),
            },
          ])}
          dataSource={mergeCellsTable(serviceSource, 'id')}
          className={'initial-ant-table'}
          pagination={false}
          bordered
        />
      </FieldSet>
      <div className={'formItem'} style={{ margin: '10px 0' }}>
        <FieldSet data={{ title: '一、工单-基础设置' }}>
          <Form form={form}>
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item name={'type'} label={'工单类型选择'}>
                  <Select
                    options={[
                      { value: '1', label: '蓝绿发布' },
                      { value: '2', label: '接口工单' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'id'} label={'工单名称'}>
                  <Select />
                </Form.Item>
              </Col>
              {watchType !== '2' ? (
                <Col span={4}>
                  <Form.Item name={'count'} label={'并发数'}>
                    <InputNumber style={{ width: '100%' }} min={0} precision={0} maxLength={11} />
                  </Form.Item>
                </Col>
              ) : (
                <div />
              )}
              <Col span={6}>
                <Form.Item name={'add'}>
                  <Checkbox>仅需发布一次，在灰度推线上时不会算做积压</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </FieldSet>
      </div>
      <FieldSet data={{ title: '二、工单-表单设置' }}>
        <Table
          bordered
          columns={worksheetFormColumn}
          dataSource={mergeCellsTable(formSource, 'id')}
          className={'initial-ant-table'}
          pagination={false}
        />
      </FieldSet>
    </div>
  );
};

// 灰度推线上
const WorksheetGrey = ({ data }: { data: any }) => {
  const [form] = Form.useForm();

  const [selected, setSelected] = useState<{ id: number; index: number }[]>([]);
  const [serviceSource, setServiceSource] = useState<IRecord[]>([]);
  const [formSource, setFormSource] = useState<IRecord[]>([]);
  const onIgnore = (checked: boolean, record: any, index: number) => {
    let data = [...selected];
    if (checked) {
      data.push({ id: record.id, index: index });
    } else {
      data = data.filter((it) => it.index !== index);
    }
    setSelected(data);
  };

  useEffect(() => {
    setServiceSource([
      {
        id: 1111,
        services: 'qbos',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
      {
        id: 1222,
        services: 'h5',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
      {
        id: 1222,
        services: 'web',
        nx: 'hotfix-nx',
        commiter: '钉钉',
        startTime: '2022-03-10',
        endTime: '2022-09-10',
        status: 'success',
      },
    ]);
    setFormSource([
      {
        id: 1,
        application: 'web',
        services: 'release1',
        form: 'yes',
        user: '',
      },
      {
        id: 2,
        application: 'web',
        services: 'release2',
        form: 'yes',
        user: '',
      },
      {
        id: 2,
        application: 'h5',
        services: 'release3',
        form: 'ffff',
        user: '',
      },
    ]);
  }, []);

  useEffect(() => {
    // fresh
  }, [selected]);

  const envColumn: ColumnType<any>[] = [
    {
      title: '发布环境',
      dataIndex: 'env',
      onCell: (record, index) => ({ rowSpan: index == 0 ? formSource.length : 0 }),
      render: () => <Select options={[]} style={{ width: '100%' }} />,
    },
  ];
  const operationColumn: ColumnType<any>[] = [
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (_, record, index) => (
        <>
          <Checkbox onChange={(e) => onIgnore(e.target.checked, record, index)}>
            忽略本次上线
          </Checkbox>
          <Checkbox onChange={(e) => onIgnore(e.target.checked, record, index)}>
            上线后继续保留灰度积压
          </Checkbox>
          <Button
            type={'text'}
            className={'color-failure'}
            onClick={() => {
              console.log(index, record);
            }}
          >
            删除积压工单
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <FieldSet data={{ title: '灰度积压列表' }}>
        <Table
          columns={worksheetServiceGreyColumn.concat(operationColumn)}
          dataSource={mergeCellsTable(serviceSource, 'id')}
          className={'initial-ant-table'}
          pagination={false}
          bordered
        />
      </FieldSet>
      <div className={'formItem'} style={{ margin: '10px 0' }}>
        <FieldSet data={{ title: '一、工单-基础设置' }}>
          <Form form={form}>
            <Row gutter={8}>
              <Col span={7}>
                <Form.Item name={'type'} label={'工单类型选择'}>
                  <Select
                    options={[
                      { value: '1', label: '蓝绿发布' },
                      { value: '2', label: '接口工单' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name={'id'} label={'工单名称'}>
                  <Select />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name={'mark'} label={'工单说明'}>
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </FieldSet>
      </div>
      <FieldSet data={{ title: '二、工单-表单设置' }}>
        <Table
          bordered
          columns={envColumn.concat(worksheetFormGreyColumn)}
          dataSource={mergeCellsTable(formSource, 'id')}
          className={'initial-ant-table'}
          pagination={false}
        />
      </FieldSet>
    </div>
  );
};
