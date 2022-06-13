import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useModel } from 'umi';

import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { COMMON_STATUS, STATUS_MAP } from '../../constants';
import OnlineServices from '@/services/online';
import { PreSql } from '@/namespaces';

interface IEditSql extends ModalFuncProps {
  data?: PreSql;
}

const EditSql = (props: IEditSql) => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [environmentSelector] = useModel('systemOnline', (system) => [system.environmentSelector]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        update_type: props.data ? COMMON_STATUS[props.data.update_type] : null,
        update_api: props.data ? COMMON_STATUS[props.data.update_api] : null,
        cluster_id: props.data?.cluster_id ? props.data.cluster_id?.split(',') : [],
      });
    } else form.resetFields();
  }, [props.visible]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      await OnlineServices.updatePreInterface({
        cluster_id: values.cluster_id?.join(),
        release_cluster_id: values.cluster_id?.join(),
        is_backlog: values.is_backlog,
        concurrent: values?.concurrent,
        user_id: user?.userid,
        api_id: props.data?.api_id,
      });
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
  };
  const isEditCluster = props.data?.update_type == 'upgradeApi';
  return (
    <Modal
      title="编辑升级接口&SQL"
      visible={props.visible}
      okText="保存"
      onCancel={props.onCancel}
      onOk={onConfirm}
      maskClosable={false}
      confirmLoading={loading}
      centered
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Form.Item name="update_type" label="升级类型">
          <Input disabled />
        </Form.Item>
        <Form.Item name="update_api" label="升级接口">
          <Input disabled />
        </Form.Item>
        <Form.Item name="app_server" label="接口服务">
          <Input disabled />
        </Form.Item>
        <Form.Item name="tenant_ids" label="涉及租户">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="cluster_id"
          label="上线环境"
          rules={[{ required: !isEditCluster, message: '请选择上线环境!' }]}
        >
          <Select
            showSearch
            mode={'multiple'}
            options={environmentSelector}
            optionFilterProp="value"
            disabled={isEditCluster}
            filterOption={(input, option) => (option!.value as unknown as string)?.includes(input)}
          />
        </Form.Item>
        <Form.Item label={'并发数'} name={'concurrent'}>
          <InputNumber min={0} precision={0} maxLength={11} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="record_backlog"
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
