/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';
import OnlineServices from '@/services/online';
import { PreUpgradeItem } from '@/namespaces';

interface IEditUprade extends ModalFuncProps {
  data?: PreUpgradeItem;
}

const EditUpgrade = (props: IEditUprade) => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(props.data);
    } else form.resetFields();
  }, [props.visible]);

  const onConfirm = async () => {
    const result = await form.validateFields();
    try {
      setLoading(true);
      await OnlineServices.updatePreProject({
        ...props.data,
        ...result,
        user_id: user?.userid,
        mark: result.mark || '',
      });
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
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
      centered
    >
      <Form form={form} wrapperCol={{ span: 14 }} labelCol={{ span: 9 }}>
        <Form.Item name="project_name" label="项目名称">
          <Input disabled />
        </Form.Item>
        <Form.Item name="manager" label="项目负责人">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="is_database_upgrade"
          label="是否涉及数据库升级"
          rules={[{ required: true, message: '请选择是否涉及数据库升级!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="is_recovery_database"
          label="是否涉及数据Recovery"
          rules={[{ required: true, message: '请选择是否涉及数据Recovery!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="is_clear_redis"
          label="是否清理缓存"
          rules={[{ required: true, message: '请选择是否清理缓存!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="is_clear_app_cache"
          label="是否清理应用缓存"
          rules={[{ required: true, message: '请选择是否清理应用缓存!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="is_add_front_config"
          label="后端是否涉及配置项增加"
          rules={[{ required: true, message: '请选择后端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item
          name="is_front_data_update"
          label="前端是否涉及元数据更新"
          rules={[{ required: true, message: '请选择前端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} />
        </Form.Item>
        <Form.Item name="mark" label="备注">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUpgrade;
