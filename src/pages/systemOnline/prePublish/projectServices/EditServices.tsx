import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';
import moment from 'moment';

export interface Iservices {
  id: number;
  online_env: string;
  application: string;
  side: string;
  version: string;
  date: string;
  [key: string]: any;
}
interface IEditServices extends ModalFuncProps {
  data?: Iservices;
}

const EditServices = (props: IEditServices) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        date: props.data?.date ? moment(props.data?.date) : null,
      });
    } else form.resetFields();
  }, [props.visible]);

  const onFinish = async () => {
    setLoading(true);
    const result = await form.validateFields().finally(() => setLoading(false));
    props.onOk?.(result);
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
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <Form.Item
          name="online_env"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item name="application" label="应用">
          <Input disabled />
        </Form.Item>
        <Form.Item name="side" label="对应侧">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="version"
          label="是否封板"
          rules={[{ required: true, message: '请选择是否封板!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item name="date" label="封板时间">
          <DatePicker disabled format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditServices;
