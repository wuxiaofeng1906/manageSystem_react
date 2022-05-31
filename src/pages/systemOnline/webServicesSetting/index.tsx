import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Row, Select, Tag, Col, Modal, Button } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';

import { AgGridReact } from 'ag-grid-react';
import type { GridApi, CellClickedEvent } from 'ag-grid-community';
import { initGridTable, SETTING_STATUS } from '../constants';
import { servicesSettingColumn } from '../column';
import { ExclamationCircleOutlined, FolderAddTwoTone } from '@ant-design/icons';
import IPagination from '@/components/IPagination';
import { useModel } from 'umi';
import OnlineServices from '@/services/online';
import { IRecord } from '@/namespaces/interface';

const EditSetting = (props: { data?: any } & ModalFuncProps) => {
  const [form] = Form.useForm();
  const [projectSelectors, frontSelector] = useModel('systemOnline', (system) => [
    system.projectSelectors,
    system.frontSelector,
  ]);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        app_name: props.data?.app_name?.split(','),
        // time: props.data?.time ? moment(props.data.time) : null,
      });
    } else form.resetFields();
  }, [props.visible]);

  const onFinish = async () => {
    const result = await form.validateFields();
    await OnlineServices.addProjectServer({ ...result, app_name: result.app_name.join(',') });
    props.onCancel?.(true);
  };

  const isEdit = useMemo(() => !!props.data, [props.data]);

  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}前端服务设置`}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onFinish}
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Form.Item
          name="project_id"
          label="所属执行"
          rules={[{ required: true, message: '请选择所属执行!' }]}
        >
          <Select options={projectSelectors} />
        </Form.Item>
        <Form.Item
          name="app_name"
          label="涉及前端应用"
          rules={[{ required: true, message: '请选择涉及前端应用!' }]}
        >
          <Select mode="multiple">
            {frontSelector?.map((it: any) => (
              <Select.Option key={it.app_name}>{it.app_name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item name="status" label="项目状态">
          <Select options={SETTING_STATUS} disabled={isEdit} />
        </Form.Item> */}
        {/* <Form.Item name="editor" label="编辑人">
          <Select options={[]} disabled={isEdit} />
        </Form.Item>
        <Form.Item name="time" label="编辑时间">
          <DatePicker format={MOMENT_FORMAT.utc} style={{ width: '100%' }} disabled={isEdit} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

const WebServicesSetting = () => {
  const [form] = Form.useForm();
  const gridApi = useRef<GridApi>();
  const [projectSelectors, frontSelector] = useModel('systemOnline', (system) => [
    system.projectSelectors,
    system.frontSelector,
  ]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [source, setSource] = useState<IRecord[]>([]);
  const [editSetting, setEditSetting] = useState<{ visible: boolean; data?: any } | null>();

  const getTableList = async () => {
    const values = await form.getFieldsValue();
    const res = await OnlineServices.projectServerList({ ...values, page: 0, page_size: 20 });
    setSource(res);
  };

  const onRemove = (data: any) => {
    Modal.confirm({
      title: '提示：',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该数据么？',
      cancelText: '取消',
      okText: '确认',
      onOk: async () => {
        if (!user?.userid || !data?.pro_server_id) return;
        const res = await OnlineServices.removeProjectServer({
          user_id: user.userid,
          pro_server_id: data.pro_server_id,
        });
        console.log(res);
      },
    });
  };

  useEffect(() => {
    getTableList();
  }, []);

  return (
    <PageContainer>
      <Form form={form}>
        <Row justify="space-between">
          <Col flex={2}>
            <Button
              icon={<FolderAddTwoTone />}
              type="primary"
              style={{ marginBottom: 5 }}
              onClick={() => setEditSetting({ visible: true })}
            >
              新增
            </Button>
          </Col>
          <Col flex={3}>
            <Row justify={'end'}>
              <Col span={12}>
                <Form.Item name="pro_id" label="所属执行">
                  <Select options={projectSelectors} />
                </Form.Item>
              </Col>
              <Col span={9} offset={1}>
                <Form.Item name="status" label="项目状态">
                  <Select mode="multiple">
                    {frontSelector?.map((it: any) => (
                      <Select.Option key={it.app_name}>{it.app_name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
                  onClick={() => onRemove(data)}
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
        onCancel={(status) => {
          if (status == true) getTableList();
          setEditSetting({ visible: false, data: null });
        }}
      />
    </PageContainer>
  );
};
export default WebServicesSetting;
