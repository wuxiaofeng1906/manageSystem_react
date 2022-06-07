import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Row, Select, Tag, Col, Modal, Button, Spin } from 'antd';
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
import { omit } from '@/utils/utils';

const EditSetting = (props: { data?: any } & ModalFuncProps) => {
  const [form] = Form.useForm();
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
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
    await OnlineServices.addProjectServer({
      ...props.data,
      ...result,
      user_id: user?.userid || '',
      app_name: result.app_name.join(','),
    });
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
  const [projectSelectors] = useModel('systemOnline', (system) => [system.projectSelectors]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [spinning, setSpinning] = useState(false);
  const [source, setSource] = useState<IRecord[]>([]);
  const [editSetting, setEditSetting] = useState<{ visible: boolean; data?: any } | null>();
  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 0,
  });
  const getTableList = async (page = 0, page_size = 20) => {
    const values = await form.getFieldsValue();
    setSpinning(true);
    const res = await OnlineServices.projectServerList({
      ...values,
      page,
      page_size,
      project_status: values.project_status?.join(','),
    }).finally(() => setSpinning(false));
    setSource(
      res?.data?.map((it: any, index: number) => ({ ...it, num: page * page_size + index + 1 })),
    );
    setPages({
      page: res?.page,
      page_size: res?.page_size,
      total: res?.total || 0,
    });
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
        await OnlineServices.removeProjectServer({
          user_id: user.userid,
          pro_server_id: data.pro_server_id,
        });
        await getTableList();
      },
    });
  };

  useEffect(() => {
    getTableList();
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer>
        <Form form={form} onValuesChange={() => getTableList()}>
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
                  <Form.Item name="project_status" label="项目状态">
                    <Select mode="multiple" options={SETTING_STATUS} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <div style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            {...initGridTable(gridApi)}
            rowData={source}
            columnDefs={servicesSettingColumn}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => (
                <div className={'operation'}>
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
                const item = SETTING_STATUS.find((it) => it.value == data.project_status);
                return <Tag color={item?.key}>{item?.label}</Tag>;
              },
            }}
          />
        </div>
        <IPagination
          page={pages}
          onChange={(page) => getTableList(page - 1)}
          showQuickJumper={(page) => getTableList(page - 1)}
          onShowSizeChange={(size) => getTableList(0, size)}
        />
        <EditSetting
          {...editSetting}
          onCancel={(status) => {
            if (status == true) getTableList();
            setEditSetting({ visible: false, data: null });
          }}
        />
      </PageContainer>
    </Spin>
  );
};
export default WebServicesSetting;
