import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
// import { COMMON_STATUS, STATUS_MAP } from '../../constants';
// import moment from 'moment';
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
  const [environmentSelector] = useModel('systemOnline', (system) => [system.environmentSelector]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        ...props.data,
        // technical_side: props.data?.technical_side ? COMMON_STATUS[props.data.technical_side] : '',
        // seal_time: props.data?.seal_time ? moment(props.data?.seal_time) : null,
        cluster_id: props.data?.cluster_id ? props.data?.cluster_id?.split(',') : [],
      });
    } else form.resetFields();
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
        // is_seal: result.is_seal,
      });
      props.onCancel?.(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑发布环境"
      visible={props.visible}
      okText="保存"
      onCancel={props.onCancel}
      onOk={onFinish}
      maskClosable={false}
      confirmLoading={loading}
      centered
    >
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Form.Item name="app_name" label="应用">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="cluster_id"
          label="上线环境"
          rules={[{ required: true, message: '请选择上线环境!' }]}
        >
          <Select
            showSearch
            mode={'multiple'}
            options={environmentSelector}
            optionFilterProp="value"
            filterOption={(input, option) => (option!.value as unknown as string)?.includes(input)}
          />
        </Form.Item>
        {/*<Form.Item name="technical_side" label="对应侧">*/}
        {/*  <Input disabled />*/}
        {/*</Form.Item>*/}
        {/*<Form.Item*/}
        {/*  name="is_seal"*/}
        {/*  label="测试是否封版"*/}
        {/*  rules={[{ required: true, message: '请选择是否封版!' }]}*/}
        {/*>*/}
        {/*  <Select options={STATUS_MAP} />*/}
        {/*</Form.Item>*/}
        {/*<Form.Item name="seal_time" label="测试确认封版时间">*/}
        {/*  <DatePicker disabled format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} />*/}
        {/*</Form.Item>*/}
      </Form>
    </Modal>
  );
};
export default EditServices;
