import React, { useEffect, useState } from 'react';
import { Modal, TreeSelect, Form } from 'antd';
import { useModel, useLocation } from 'umi';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import OnlineServices from '@/services/online';

const OneKeyDeploy = (props: ModalFuncProps) => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [list, setList] = useState<{ title: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [disabled] = useModel('systemOnline', (system) => [system.disabled]);

  const onFinish = async () => {
    if (!idx || disabled) return;
    const values = await form.validateFields();
    setLoading(true);
    try {
      await OnlineServices.deployConfirm({
        user_id: currentUser?.userid,
        release_num: idx,
        app_name: values.app_name?.join(','),
      });
      props.onOk?.();
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idx && props.visible) {
      OnlineServices.deployServer(idx).then((res) => {
        const data = Array.from(new Set(res || []))?.map((v = '') => ({ title: v, value: v }));
        setList(data as any);
      });
    }
  }, [props.visible]);
  return (
    <Modal
      title={'一键部署'}
      okText="点击部署"
      centered
      destroyOnClose
      maskClosable={false}
      visible={props.visible}
      onOk={onFinish}
      onCancel={props.onCancel}
      okButtonProps={{ disabled, loading }}
    >
      <Form form={form} preserve={false}>
        <Form.Item
          label={'部署服务'}
          name={'app_name'}
          rules={[{ required: true, message: '请选择部署服务!' }]}
        >
          <TreeSelect
            disabled={disabled}
            style={{ width: '100%' }}
            allowClear
            treeCheckable
            multiple
            showArrow
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={'一键部署'}
            treeData={[
              {
                title: '全部',
                value: 'all',
                children: list,
                disabled: list.length == 0,
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default OneKeyDeploy;
