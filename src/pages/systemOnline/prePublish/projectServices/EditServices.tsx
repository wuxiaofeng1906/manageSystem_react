import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import OnlineServices from '@/services/online';
import { useModel, useLocation } from 'umi';
import { PreServices } from '@/namespaces';

interface IEditServices extends ModalFuncProps {
  data?: PreServices;
}

const EditServices = (props: IEditServices) => {
  const {
    query: { idx },
  } = useLocation() as any;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [environmentSelector, disabled] = useModel('systemOnline', (system) => [
    system.environmentSelector,
    system.disabled,
  ]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        cluster_id: props.data?.cluster_id ? props.data?.cluster_id?.split(',') : [],
      });
    }
  }, [props.visible]);

  const onFinish = async () => {
    const result = await form.validateFields();
    try {
      setLoading(true);
      await OnlineServices.updatePublishServer({
        release_num: idx,
        user_id: user?.userid,
        server_id: props.data?.server_id,
        cluster_id: result.cluster_id?.join(),
      });
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      title="编辑发布环境"
      okText="保存"
      destroyOnClose
      maskClosable={false}
      visible={props.visible}
      onOk={onFinish}
      onCancel={props.onCancel}
      confirmLoading={loading}
      okButtonProps={{ disabled }}
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }} preserve={false}>
        <Form.Item name="app_name" label="应用">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="cluster_id"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select
            disabled={disabled}
            showSearch
            mode={'multiple'}
            options={environmentSelector.map((it) => ({
              ...it,
              disabled: it.value == 'cn-northwest-global' || it.label == 'global',
            }))}
            optionFilterProp="value"
            filterOption={(input, option) => (option!.value as unknown as string)?.includes(input)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditServices;
