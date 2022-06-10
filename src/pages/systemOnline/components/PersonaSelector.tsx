import React, { useEffect, useState } from 'react';
import { Modal, Select, Form } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import OnlineServices from '@/services/online';
import selector from '@/pages/kpi/forProject/ProjectMetric/Selector';
export interface OptionType {
  value: string;
  label: string;
  key: string;
  status?: number;
  date?: number;
  mark?: string;
}
interface Iprops extends ModalFuncProps {
  data: OptionType[];
  selector?: 'cc' | 'duty' | 'director';
}

const titleMap = {
  cc: '抄送人',
  duty: '开发值班人',
  director: '总监审批人',
};
const PersonSelector = (props: Iprops) => {
  const [form] = Form.useForm();
  const [list, setList] = useState<OptionType[]>([]);

  const onConfirm = async () => {
    const result: OptionType[] = [];
    const values = await form.validateFields();
    values.personal?.map((v: string) =>
      list.forEach((it) => {
        if (it.value == v) result.push(it);
      }),
    );
    props.onOk?.(result, props.selector);
  };

  const getApplicant = async () => {
    if (!props.selector) return;
    const result = await OnlineServices.applicant();
    setList(
      result?.map((it: any) => ({ key: it.user_id, label: it.user_name, value: it.user_id })),
    );
    form.setFieldsValue({
      personal: props.data?.map((it) => it.value) || [],
    });
  };

  useEffect(() => {
    if (props.visible && selector) {
      getApplicant();
    }
  }, [props.visible, props.data]);

  return (
    <Modal
      title={'人员选择'}
      visible={props.visible}
      maskClosable={false}
      onOk={onConfirm}
      onCancel={props.onCancel}
      centered
    >
      <Form form={form}>
        <Form.Item
          label={titleMap[props.selector || 'duty']}
          name={'personal'}
          rules={[{ required: true, message: `${titleMap[props.selector || 'duty']}不能为空！` }]}
        >
          <Select
            showArrow
            options={list}
            mode={'multiple'}
            style={{ width: '100%' }}
            maxTagCount={5}
            allowClear
            optionFilterProp="label"
            filterOption={(input, option) => (option!.label as unknown as string)?.includes(input)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default PersonSelector;
