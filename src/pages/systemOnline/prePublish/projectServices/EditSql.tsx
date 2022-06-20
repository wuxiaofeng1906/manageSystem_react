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
  const [environmentSelector, disabled] = useModel('systemOnline', (system) => [
    system.environmentSelector,
    system.disabled,
  ]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isSql = props.data?.update_type == 'upgradeSql';

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        concurrent: isSql ? null : props.data?.concurrent ?? 20,
        update_type: props.data?.update_type ? COMMON_STATUS[props.data.update_type] : null,
        update_api: props.data?.update_api ? COMMON_STATUS[props.data.update_api] : null,
        cluster_id: props.data?.cluster_id ? props.data.cluster_id?.split(',') : [],
        release_cluster_id: props.data?.release_cluster_id
          ? props.data.release_cluster_id?.split(',')
          : [],
      });
    }
  }, [props.visible]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      await OnlineServices.updatePreInterface({
        cluster_id: values.cluster_id?.join(),
        release_cluster_id: values.release_cluster_id?.join() ?? '',
        is_backlog: values.is_backlog,
        concurrent: isSql ? undefined : values?.concurrent ?? 20,
        user_id: user?.userid,
        api_id: props.data?.api_id,
      });
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
      centered
      destroyOnClose
      onOk={onConfirm}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading}
      okButtonProps={{ disabled }}
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }} preserve={false}>
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
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.release_cluster_id !== currentValues.release_cluster_id
          }
        >
          {({ getFieldValue }) => (
            <Form.Item
              name="cluster_id"
              label="上线环境"
              rules={[{ required: isSql, message: '请选择上线环境!' }]}
            >
              <Select
                showSearch
                mode={'multiple'}
                options={environmentSelector.map((it) => ({
                  ...it,
                  disabled: (getFieldValue('release_cluster_id') || []).includes(it.value),
                }))}
                optionFilterProp="value"
                placeholder={'上线环境'}
                disabled={!isSql || disabled} // 接口不可编辑
                filterOption={(input, option) =>
                  (option!.value as unknown as string)?.includes(input)
                }
              />
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item label={'并发数'} name={'concurrent'}>
          <InputNumber
            disabled={isSql || disabled} // sql无并发数
            min={0}
            precision={0}
            maxLength={11}
            style={{ width: '100%' }}
            placeholder={'并发数'}
          />
        </Form.Item>
        <Form.Item
          name="record_backlog"
          label="是否记录积压"
          rules={[{ required: isSql, message: '请选择是否记录积压!' }]} // sql 可编辑
        >
          <Select options={STATUS_MAP} disabled={!isSql || disabled} />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.record_backlog !== currentValues.record_backlog ||
            prevValues.cluster_id !== currentValues.cluster_id
          }
        >
          {({ getFieldValue }) => (
            <Form.Item
              name="release_cluster_id"
              label="正式环境"
              rules={[
                {
                  required: isSql && getFieldValue('record_backlog') == 'yes', // sql & 存在积压 必填项
                  message: '请选择正式环境!',
                },
              ]}
            >
              <Select
                showSearch
                mode={'multiple'}
                options={environmentSelector.map((it) => ({
                  ...it,
                  disabled: (getFieldValue('cluster_id') || []).includes(it.value),
                }))}
                optionFilterProp="value"
                placeholder={'正式环境'}
                disabled={!(isSql && getFieldValue('record_backlog') == 'yes') || disabled}
                filterOption={(input, option) =>
                  (option!.value as unknown as string)?.includes(input)
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditSql;
