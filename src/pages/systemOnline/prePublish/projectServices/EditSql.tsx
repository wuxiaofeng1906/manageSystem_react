import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';
import OnlineServices from '@/services/online';
import { PreSql } from '@/namespaces';

interface IEditSql extends ModalFuncProps {
  data?: PreSql;
}

const EditSql = (props: IEditSql) => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(props.data);
    } else form.resetFields();
  }, [props.visible]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      const res = await OnlineServices.updatePreInterface({
        cluster_id: values.cluster_id,
        is_backlog: values.is_backlog,
        user_id: user?.userid,
        api_id: props.data?.api_id,
      });
      console.log(res);
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
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
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Form.Item name="update_type" label="升级类型">
          <Input disabled />
        </Form.Item>
        <Form.Item name="update_api" label="升级接口">
          <Input disabled />
        </Form.Item>
        <Form.Item name="api_server" label="接口服务">
          <Input disabled />
        </Form.Item>
        <Form.Item name="tenant" label="涉及租户">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="cluster_id"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item
          name="is_backlog"
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
