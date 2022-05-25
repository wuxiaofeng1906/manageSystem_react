import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';

export interface Isql {
  id: number;
  online_env: string;
  upgrade_type: string;
  services: string;
  users: string;
  record: string;
  [key: string]: any;
}
interface IEditSql extends ModalFuncProps {
  data?: Isql;
}

const EditSql = (props: IEditSql) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(props.data);
    } else form.resetFields();
  }, [props.visible]);

  const onConfirm = async () => {
    setLoading(true);
    const result = await form.validateFields().finally(() => setLoading(false));
    console.log(result);
    props.onOk?.(result);
  };

  return (
    <Modal
      title="编辑升级接口&SQL"
      visible={props.visible}
      okText="保存"
      onCancel={props.onCancel}
      onOk={onConfirm}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <Form.Item name="upgrade_type" label="升级类型">
          <Input disabled />
        </Form.Item>
        <Form.Item name="upgrade_sql" label="升级接口">
          <Input disabled />
        </Form.Item>
        <Form.Item name="services" label="接口服务">
          <Input disabled />
        </Form.Item>
        <Form.Item name="users" label="涉及租户">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="online_env"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item
          name="record"
          label="是否记录积压"
          rules={[{ required: true, message: '请选择是否记录积压!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditSql;
