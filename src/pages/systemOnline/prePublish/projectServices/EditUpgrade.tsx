/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';

export interface UpgradeItem {
  id: number;
  name: string;
  update_dbs: string;
  recovery: string;
  clear: string;
  setting_add: string;
  origin_update: string;
  application: string;
  mark: string;
  leader: string;
  [key: string]: any;
}
interface IEditUprade extends ModalFuncProps {
  data?: UpgradeItem;
}

const EditUpgrade = (props: IEditUprade) => {
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
    props.onOk?.(result);
  };

  return (
    <Modal
      title="编辑项目升级信息"
      visible={props.visible}
      okText="保存"
      onCancel={props.onCancel}
      onOk={onConfirm}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <Form.Item name="name" label="项目名称">
          <Input disabled />
        </Form.Item>
        <Form.Item name="leader" label="项目负责人">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="update_dbs"
          label="是否涉及数据库升级"
          rules={[{ required: true, message: '请选择是否涉及数据库升级!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="recovery"
          label="是否涉及数据Recovery"
          rules={[{ required: true, message: '请选择是否涉及数据Recovery!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="clear"
          label="是否清理缓存"
          rules={[{ required: true, message: '请选择是否清理缓存!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="setting_add"
          label="后端是否涉及配置项增加"
          rules={[{ required: true, message: '请选择后端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="origin_update"
          label="前端是否涉及配置项增加"
          rules={[{ required: true, message: '请选择前端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item name="mark" label="备注">
          <Input.TextArea disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUpgrade;
