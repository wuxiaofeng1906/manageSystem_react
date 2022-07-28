import React, { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import { Modal, Select, Input, Form, Table } from 'antd';
import { GridApi } from 'ag-grid-community';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';
import { getDeptMemner } from '@/pages/sprint/sprintListDetails/data';
import { useGqlClient } from '@/hooks/index';
import styles from '../sprintListDetails.less';

const list = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];
const RemoveModal = (
  props: { gridRef: MutableRefObject<GridApi | undefined> } & ModalFuncProps,
) => {
  const selected = props.gridRef.current?.getSelectedRows();
  const client = useGqlClient();
  const [form] = Form.useForm();
  const [testUser, setTestUser] = useState<any[]>([]);
  const [source, setSource] = useState<any[]>([]);

  const getTestUserList = async () => {
    const res = await getDeptMemner(client, '测试');
    setTestUser(res?.map((it: any) => ({ label: it.userName, value: it.id })));
  };

  useEffect(() => {
    if (!props.visible) return;
    const formData =
      selected?.map((it: any) => ({
        ...it,
        testCheck: '1',
        commit: undefined,
        revert: undefined,
        reason: '',
      })) ?? [];
    form.setFieldsValue({ form: formData });
    setSource(formData);
    getTestUserList();
  }, [JSON.stringify(selected)]);

  const onOK = async () => {
    const values = await form.validateFields();
  };
  const onCancel = () => {
    props.onCancel?.();
  };

  const columns: ColumnsType<any> = [
    { title: '序号', render: (v, r, i) => i + 1, width: 60 },
    { title: '编号', dataIndex: 'ztNo' },
    { title: '标题内容', dataIndex: 'title' },
    { title: '相关需求', dataIndex: 'relatedStories' },
    { title: '相关bug', dataIndex: 'relatedBugs' },
    {
      title: '测试',
      dataIndex: 'tester',
      render: (value, record, i) => {
        return (
          <Form.Item
            name={['form', i, 'tester']}
            rules={[{ required: true, message: '请填写测试！' }]}
          >
            <Select options={testUser} showSearch optionFilterProp={'label'} size={'small'} />
          </Form.Item>
        );
      },
    },
    {
      title: '是否要测试验证',
      dataIndex: 'testCheck',
      render: (value, record, i) => {
        return (
          <Form.Item
            name={['form', i, 'testCheck']}
            rules={[{ required: true, message: '请填写测试验证！' }]}
          >
            <Select options={list} size={'small'} />
          </Form.Item>
        );
      },
    },
    {
      title: '是否提交代码',
      dataIndex: 'commit',
      render: (value, record, i) => {
        return (
          <Form.Item
            name={['form', i, 'commit']}
            rules={[{ required: true, message: '必须测试验证！' }]}
          >
            <Select options={list} size={'small'} />
          </Form.Item>
        );
      },
    },
    {
      title: '代码是否Revert',
      dataIndex: 'revert',
      render: (value, record, i) => {
        return (
          <Form.Item
            name={['form', i, 'revert']}
            rules={[{ required: true, message: '必须测试验证！' }]}
          >
            <Select options={list} size={'small'} />
          </Form.Item>
        );
      },
    },
    {
      title: '免Revert原因',
      dataIndex: 'reason',
      render: (value, record, i) => {
        return (
          <Form.Item
            name={['form', i, 'reason']}
            rules={[{ required: true, message: '请填写免revert原因！' }]}
          >
            <Input.TextArea size={'small'} autoSize={{ minRows: 1, maxRows: 3 }} />
          </Form.Item>
        );
      },
    },
  ];

  return (
    <Modal
      title={'移除操作'}
      {...props}
      width={1300}
      onOk={onOK}
      maskClosable={false}
      centered
      onCancel={onCancel}
      destroyOnClose
      bodyStyle={{ maxHeight: 500 }}
    >
      <Form form={form}>
        <Table
          bordered
          className={styles.removeTableWarp}
          columns={columns}
          dataSource={source}
          size={'small'}
          scroll={{ x: 1100, y: 400 }}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
