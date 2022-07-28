import React, { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import { Modal, Select, Input, Form, Table } from 'antd';
import { GridApi } from 'ag-grid-community';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';

const list = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];
const RemoveModal = (
  props: { gridRef: MutableRefObject<GridApi | undefined> } & ModalFuncProps,
) => {
  const [form] = Form.useForm();
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    if (!props.visible) return;
    const selected = props.gridRef.current?.getSelectedRows();
    setSource(
      selected?.map((it: any) => ({
        ...it,
        testCheck: '1',
        commit: undefined,
        revert: undefined,
        reason: 'cecece',
      })) ?? [],
    );
    form.setFieldsValue({ form: source });
  }, [props.gridRef.current?.getSelectedRows()]);

  const columns: ColumnsType<any> = [
    { title: '序号' },
    { title: '编号', dataIndex: 'ztNo' },
    { title: '标题内容', dataIndex: 'title', width: '10%' },
    { title: '相关需求', dataIndex: 'relatedStories' },
    { title: '相关bug', dataIndex: 'relatedBugs' },
    {
      title: '测试',
      dataIndex: 'tester',
      render: (value, record, i) => {
        return (
          <Form.Item name={['form', i, 'tester']}>
            <Select options={[]} showSearch />
          </Form.Item>
        );
      },
    },
    {
      title: '是否要测试验证',
      dataIndex: 'testCheck',
      render: (value, record, i) => {
        return (
          <Form.Item name={['form', i, 'testCheck']}>
            <Select options={list} />
          </Form.Item>
        );
      },
    },
    {
      title: '是否提交代码',
      dataIndex: 'commit',
      render: (value, record, i) => {
        return (
          <Form.Item name={['form', i, 'commit']}>
            <Select options={list} />
          </Form.Item>
        );
      },
    },
    {
      title: '代码是否Revert',
      dataIndex: 'revert',
      render: (value, record, i) => {
        return (
          <Form.Item name={['form', i, 'revert']}>
            <Select options={list} />
          </Form.Item>
        );
      },
    },
    {
      title: '免Revert原因',
      dataIndex: 'reason',
      render: (value, record, i) => {
        return (
          <Form.Item name={['form', i, 'reason']}>
            <Input.TextArea />
          </Form.Item>
        );
      },
    },
  ];
  return (
    <Modal title={'移除操作'} {...props} width={1200} wrapClassName={'removeModalWraper'}>
      <Form form={form}>
        <div style={{ height: 500, width: '100%' }} className="ag-theme-alpine">
          <Table
            columns={columns}
            dataSource={source}
            size={'small'}
            scroll={{ x: 'auto' }}
            pagination={false}
          />
        </div>
      </Form>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
