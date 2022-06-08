import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';
import moment from 'moment';
import OnlineServices from '@/services/online';
import { useModel } from 'umi';
import { PreServices } from '@/namespaces';

interface IEditServices extends ModalFuncProps {
  data?: PreServices;
}

const EditServices = (props: IEditServices) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [environmentSelector] = useModel('systemOnline', (system) => [system.environmentSelector]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        seal_time: props.data?.seal_time ? moment(props.data?.seal_time) : null,
      });
    } else form.resetFields();
  }, [props.visible]);

  const onFinish = async () => {
    const result = await form.validateFields();
    try {
      setLoading(true);
      await OnlineServices.updatePublishServer({
        user_id: user?.userid,
        server_id: props.data?.server_id,
        cluster_id: result.cluster_id,
        is_seal: result.is_seal,
      });
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑发布服务"
      visible={props.visible}
      okText="保存"
      onCancel={props.onCancel}
      onOk={onFinish}
      maskClosable={false}
      confirmLoading={loading}
      centered
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Form.Item
          name="cluster_id"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select
            showSearch
            options={environmentSelector}
            optionFilterProp="value"
            filterOption={(input, option) => (option!.value as unknown as string)?.includes(input)}
          />
        </Form.Item>
        <Form.Item name="app_name" label="应用">
          <Input disabled />
        </Form.Item>
        <Form.Item name="technical_side" label="对应侧">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="is_seal"
          label="是否封板"
          rules={[{ required: true, message: '请选择是否封板!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item name="seal_time" label="封板时间">
          <DatePicker disabled format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditServices;
