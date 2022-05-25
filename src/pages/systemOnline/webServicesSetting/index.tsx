import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Row, Select, Tag, Col, Modal, DatePicker } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';

import { AgGridReact } from 'ag-grid-react';
import type { GridApi, CellClickedEvent } from 'ag-grid-community';
import { initGridTable, SETTING_STATUS } from '../constants';
import { servicesSettingColumn } from '../column';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import IPagination from '@/components/IPagination';

const EditSetting = (props: { data?: any } & ModalFuncProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        time: props.data?.time ? moment(props.data.time) : null,
      });
    } else form.resetFields();
  }, [props.visible]);

  const onFinish = async () => {
    const result = await form.validateFields();
    props.onOk?.(result);
  };

  const isEdit = useMemo(() => !!props.data, [props.data]);

  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}前端服务设置`}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onFinish}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item
          name="macking"
          label="所属执行"
          rules={[{ required: true, message: '请选择所属执行!' }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item
          name="application"
          label="涉及前端应用"
          rules={[{ required: true, message: '请选择涉及前端应用!' }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item name="status" label="项目状态">
          <Select options={SETTING_STATUS} disabled={isEdit} />
        </Form.Item>
        <Form.Item name="editor" label="编辑人">
          <Select options={[]} disabled={isEdit} />
        </Form.Item>
        <Form.Item name="time" label="编辑时间">
          <DatePicker format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} disabled={isEdit} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const WebServicesSetting = () => {
  const [form] = Form.useForm();
  const gridApi = useRef<GridApi>();
  const [source, setSource] = useState<Record<string, any>[]>([]);
  const [editSetting, setEditSetting] = useState<{ visible: boolean; data?: any } | null>();

  useEffect(() => {
    setSource([
      {
        id: 1,
        macking: '采购发票',
        application: 'web,h5',
        status: 'pending',
        editor: '旺旺',
        time: '',
      },
      {
        id: 2,
        macking: '薪资',
        application: 'web,h5',
        status: 'close',
        editor: '旺旺',
        time: '',
      },
      {
        id: 3,
        macking: '采购发票',
        application: 'web,h5',
        status: 'hang',
        editor: '旺旺',
        time: '',
      },
      {
        id: 4,
        macking: '迭代',
        application: 'web,h5',
        status: 'wait',
        editor: '旺旺',
        time: '',
      },
    ]);
  }, []);

  return (
    <PageContainer>
      <Form form={form}>
        <Row>
          <Col span={5}>
            <Form.Item name="" label="所属执行">
              <Select options={[]} />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item name="" label="项目状态">
              <Select options={[]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          {...initGridTable(gridApi)}
          rowData={source}
          columnDefs={servicesSettingColumn}
          frameworkComponents={{
            operation: ({ data }: CellClickedEvent) => (
              <div className={'operation'}>
                <img
                  src={require('../../../../public/add_1.png')}
                  onClick={() => setEditSetting({ visible: true })}
                />
                <img
                  src={require('../../../../public/edit.png')}
                  onClick={() => setEditSetting({ visible: true, data })}
                />
                <img
                  src={require('../../../../public/delete_2.png')}
                  onClick={() => {
                    Modal.confirm({
                      title: '提示：',
                      icon: <ExclamationCircleOutlined />,
                      content: '确认删除该数据么？',
                      cancelText: '取消',
                      okText: '确认',
                      onOk: () => {
                        console.log(data);
                      },
                    });
                  }}
                />
              </div>
            ),
            cellTag: ({ data }: CellClickedEvent) => {
              const item = SETTING_STATUS.find((it) => it.value == data.status);
              return <Tag color={item?.key}>{item?.label}</Tag>;
            },
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
      <EditSetting
        {...editSetting}
        onCancel={() => setEditSetting({ visible: false, data: null })}
      />
    </PageContainer>
  );
};
export default WebServicesSetting;
