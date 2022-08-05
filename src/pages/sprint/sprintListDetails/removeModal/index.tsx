import React, { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import { Modal, Select, Input, Form, Table, Space, Button } from 'antd';
import { GridApi } from 'ag-grid-community';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';
import { getDeptMemner } from '@/pages/sprint/sprintListDetails/data';
import { useGqlClient } from '@/hooks/index';
import styles from '../sprintListDetails.less';
import { isEmpty } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { stageType } from '@/pages/sprint/sprintListDetails/common';
import { warnMessage } from '@/publicMethods/showMessages';

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
        reason: '',
        commit: undefined,
        revert: undefined,
        relatedStories: it.relatedStories ?? 0,
        tester: isEmpty(it.tester)
          ? []
          : it.tester?.map((it: any) => ({ label: it.id, value: it.name })),
        testCheck: isEmpty(it.testCheck) ? Math.abs(Number(it.testCheck)).toString() : undefined,
      })) ?? [];
    form.setFieldsValue({ formList: formData });
    setSource(formData);
    getTestUserList();
  }, [JSON.stringify(selected)]);

  const onOK = async () => {
    const values = await form.validateFields();
    console.log(values);
    onClear(values);
  };

  const onClear = async (data: { formList: any[] }) => {
    /*
        3 :story: 规则【未开始、开发中、开发完】
        1 、-3 : bug/b_story: 规则【未开始、开发中】
     */
    const list:
      | { stage: number; id: number; category: string; flag: boolean; ztNo: number }[]
      | undefined = selected?.map((it) => ({
      stage: it.stage,
      id: it.id,
      category: it.category,
      ztNo: it.ztNo,
      flag: ['1', '-3'].includes(it.category)
        ? [1, 2].includes(it.stage)
          ? true
          : false
        : ['3'].includes(it.category)
        ? [1, 2, 3].includes(it.stage)
          ? true
          : false
        : false,
    }));
    if (isEmpty(selected)) return warnMessage('请先选择需要移除的需求！');

    // 不满足规则的
    const dissatisfy = list?.filter((it) => !it.flag);
    if (!isEmpty(dissatisfy)) {
      Modal.confirm({
        width: 540,
        centered: true,
        title: '移除需求提醒',
        closable: true,
        okButtonProps: { style: { display: 'none' } },
        cancelButtonProps: { style: { display: 'none' } },
        icon: <ExclamationCircleOutlined />,
        onCancel: () => {
          console.log(list);
        },
        content: (
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            <p style={{ marginBottom: 5 }}>您需要移除的需求如下,请确认是否仍要移除？</p>
            {dissatisfy?.map((it) => (
              <div style={{ display: 'flex', textIndent: '1em', marginBottom: 5 }} key={it.id}>
                <div style={{ minWidth: 100 }}>{it.id}</div>
                <div style={{ minWidth: 100 }}>阶段为：{stageType[it.stage]}</div>
                <Space style={{ marginLeft: 10 }}>
                  <Button
                    size={'small'}
                    onClick={() => {
                      console.log('移除', it);
                    }}
                  >
                    移除
                  </Button>
                  <Button
                    size={'small'}
                    type={'primary'}
                    onClick={() => {
                      if (!it.ztNo) return;
                      window.open(`http://zentao.77hub.com/zentao/execution-task-${it.ztNo}.html`);
                    }}
                  >
                    去禅道
                  </Button>
                </Space>
              </div>
            ))}
            {/*<p style={{ marginTop: 5 }}>请确认是否仍要移除？</p>*/}
          </div>
        ),
      });
      return;
    }
    console.log(selected);
  };

  const onCancel = () => {
    props.onCancel?.();
  };

  const columns: ColumnsType<any> = [
    { title: '序号', render: (v, r, i) => i + 1, width: 60 },
    { title: '编号', dataIndex: 'ztNo', width: 90 },
    { title: '标题内容', dataIndex: 'title' },
    { title: '相关需求', dataIndex: 'relatedStories', width: 90 },
    { title: '相关bug', dataIndex: 'relatedBugs', width: 90 },
    {
      title: '测试',
      dataIndex: 'tester',
      render: (value, record, i) => {
        const formList = form.getFieldsValue()?.formList;

        return (
          <Form.Item
            name={['formList', i, 'tester']}
            rules={[
              {
                required:
                  formList[i].testCheck == '1' &&
                  (isEmpty(formList[i].tester) || formList[i].tester?.[0] == 'NA'),
                message: '请填写测试人员！',
              },
            ]}
            shouldUpdate={true}
          >
            <Select
              options={[
                [{ label: 'NA', value: 'NA', key: 'NA', disabled: !isEmpty(formList[i].tester) }],
                ...testUser,
              ]}
              showSearch
              optionFilterProp={'label'}
              size={'small'}
              mode={'multiple'}
            />
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
            name={['formList', i, 'testCheck']}
            rules={[{ required: true, message: '请填写是否要测试验证！' }]}
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
          <Form.Item noStyle shouldUpdate>
            {({ setFieldsValue }) => {
              const formList = form.getFieldsValue()?.formList;
              return (
                <Form.Item
                  name={['formList', i, 'commit']}
                  rules={[{ required: true, message: '请填写是否提交代码！' }]}
                >
                  <Select
                    options={list}
                    size={'small'}
                    onChange={(v) => {
                      const status = v == '0';
                      formList[i].revert = status ? '-1' : undefined;
                      formList[i].commit = v;
                      setFieldsValue({ formList: formList });
                    }}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: '代码是否Revert',
      dataIndex: 'revert',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {() => {
              const values = form.getFieldsValue()?.formList?.[i];
              return (
                <Form.Item
                  name={['formList', i, 'revert']}
                  rules={[{ required: true, message: '请填写代码是否Revert！' }]}
                >
                  <Select
                    size={'small'}
                    options={list.concat([{ label: '免', value: '-1' }])}
                    disabled={values?.commit == '0'}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: '免Revert原因',
      dataIndex: 'reason',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {() => {
              const values = form.getFieldsValue()?.formList?.[i];

              return (
                <Form.Item
                  name={['formList', i, 'reason']}
                  rules={[
                    {
                      required: values?.revert == '-1' && values?.commit == '1',
                      message: '请填写免revert原因！',
                    },
                  ]}
                >
                  <Input.TextArea size={'small'} autoSize={{ minRows: 1, maxRows: 3 }} />
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
  ];

  return (
    <Modal
      title={'移除操作'}
      okText={'确定'}
      cancelText={'取消'}
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
          scroll={{ y: 400 }}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
