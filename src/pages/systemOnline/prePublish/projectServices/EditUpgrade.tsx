/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { STATUS_MAP } from '../../constants';
import OnlineServices from '@/services/online';
import { PreUpgradeItem } from '@/namespaces';
import { pick } from '@/utils/utils';

interface IEditUprade extends ModalFuncProps {
  data?: PreUpgradeItem;
}

const EditUpgrade = (props: IEditUprade) => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [disabled, release_project] = useModel('systemOnline', (system) => [
    system.disabled,
    system.proInfo?.release_project,
  ]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shouldConfirm, setShouldConfirm] = useState(false);

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue(props.data);
    }
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

  const checkValue = (value: any, values: any) => {
    if (value.is_database_upgrade || value.is_recovery_database) {
      const flag = Object.values(
        pick(values, ['is_database_upgrade', 'is_recovery_database']),
      ).some((it) => it == 'yes');
      setShouldConfirm(release_project?.release_method == 'keep_server' && flag);
    } else shouldConfirm && setShouldConfirm(false);
  };

  return (
    <Modal
      centered
      okText="保存"
      title="编辑项目升级信息"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onConfirm}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose
      okButtonProps={{ disabled: disabled || shouldConfirm }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 14 }}
        labelCol={{ span: 9 }}
        onValuesChange={checkValue}
        preserve={false}
      >
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
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="is_recovery_database"
          label="是否涉及数据Recovery"
          rules={[{ required: true, message: '请选择是否涉及数据Recovery!' }]}
        >
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="is_clear_redis"
          label="是否清理缓存"
          rules={[{ required: true, message: '请选择是否清理缓存!' }]}
        >
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="is_clear_app_cache"
          label="是否清理应用缓存"
          rules={[{ required: true, message: '请选择是否清理应用缓存!' }]}
        >
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="is_add_front_config"
          label="后端是否涉及配置项增加"
          rules={[{ required: true, message: '请选择后端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="is_front_data_update"
          label="前端是否涉及元数据更新"
          rules={[{ required: true, message: '请选择前端是否涉及配置项增加!' }]}
        >
          <Select options={STATUS_MAP} disabled={disabled} />
        </Form.Item>
        <Form.Item name="mark" label="备注">
          <Input.TextArea disabled={disabled} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditUpgrade;
