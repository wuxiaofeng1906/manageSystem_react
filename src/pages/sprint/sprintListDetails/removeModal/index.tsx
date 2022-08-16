import type { MutableRefObject } from 'react';
import React, { forwardRef, useEffect, useState } from 'react';
import { Modal, Select, Input, Form, Table, Space, Button, Spin, Popconfirm } from 'antd';
import type { GridApi } from 'ag-grid-community';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import type { ColumnsType } from 'antd/lib/table';
import { getDeptMemner } from '@/pages/sprint/sprintListDetails/data';
import { useGqlClient } from '@/hooks/index';
import { isEmpty, pick } from 'lodash';
import { useLocation } from 'umi';
import { stageType } from '@/pages/sprint/sprintListDetails/common';
import styles from '../sprintListDetails.less';
import SprintDetailServices from '@/services/sprintDetail';

const list = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];
const pickData = ['rdId', 'ztNo', 'category', 'codeRevert'];
const pickTag = pickData.concat(['testers', 'testVerify', 'hasCode', 'notRevertMemo']);

export const DissatisfyModal = (
  props: ModalFuncProps & {
    dissatisfy: any[];
    removeFn: Function;
    setDissatisfy: Function;
  },
) => {
  const query = useLocation()?.query;

  const getNextSprint = async () => {
    const res = await SprintDetailServices.getNextSprint(query.projectid);
    setNextSprint(res);
  };

  const [nextSprint, setNextSprint] = useState<any[]>([]);
  // 移除
  const onConfirm = async (item: any) => {
    await props.removeFn({
      datas: [pick(item, pickTag)],
      project: query.projectid,
    });
    props.setDissatisfy(props.dissatisfy.filter((o) => o.ztNo != item.ztNo));
  };
  useEffect(() => {
    if (props.visible) {
      getNextSprint();
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={false}
      centered
      title={'移除需求提醒'}
    >
      <div style={{ maxHeight: 500, overflowY: 'auto' }}>
        <p style={{ marginBottom: 5 }}>您需要移除的需求如下,请确认是否仍要移除？</p>
        {props.dissatisfy?.map((it) => (
          <div style={{ display: 'flex', textIndent: '1em', marginBottom: 5 }} key={it.id}>
            <div style={{ minWidth: 100 }}>{it.ztNo}</div>
            <div style={{ minWidth: 200 }}>阶段为：{stageType[it.stage]}</div>
            <Space style={{ marginLeft: 10 }}>
              {it.relatedStories || it.relatedBugs ? (
                <Popconfirm
                  placement="top"
                  title={`需求${it.ztNo} ${it.title}在${query.project}关联${
                    it.relatedStories ?? 0
                  }个任务和${it.relatedBugs ?? 0}个bug,将同步移到${nextSprint?.[1]?.name ?? ''}？`}
                  okText="确认"
                  cancelText="去禅道"
                  onConfirm={() => onConfirm(it)}
                  onCancel={() => {
                    if (!it.ztNo) return;
                    window.open(`http://zentao.77hub.com/zentao/execution-task-${it.ztNo}.html`);
                  }}
                >
                  <Button size={'small'}>确认</Button>
                </Popconfirm>
              ) : (
                <Button size={'small'} onClick={() => onConfirm(it)}>
                  确认
                </Button>
              )}
              <Button size={'small'} type={'primary'} onClick={props.onCancel}>
                取消
              </Button>
            </Space>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const RemoveModal = (
  props: { gridRef: MutableRefObject<GridApi | undefined> } & ModalFuncProps,
) => {
  const query = useLocation()?.query;
  const selected = props.gridRef.current?.getSelectedRows();
  const client = useGqlClient();
  const [form] = Form.useForm();
  const [testUser, setTestUser] = useState<any[]>([]);
  const [source, setSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getTestUserList = async () => {
    try {
      const res = await getDeptMemner(client, 'TEST');
      setTestUser(res?.map((it: any) => ({ label: it.userName, value: it.id })));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!props.visible) return;
    const formData =
      selected?.map((it: any) => ({
        ...it,
        rdId: it.id,
        notRevertMemo: it.notrevertMemo ?? '',
        hasCode: it.pushCode ?? undefined,
        codeRevert: it.codeRevert ?? undefined,
        relatedStories: it.relatedStories ?? 0,
        testers: isEmpty(it.tester) ? [] : it.tester?.map((it: any) => it.id),
        testVerify: !isEmpty(it.testCheck) ? Math.abs(Number(it.testCheck)) : undefined,
      })) ?? [];
    form.setFieldsValue({ formList: formData });
    setSource(formData);
    getTestUserList();
  }, [JSON.stringify(selected), props.visible]);

  const onClear = async (data: { formList: any[] }) => {
    setConfirmLoading(false);
    const formatSelected =
      selected?.map((it) => ({
        stage: it.stage,
        rdId: it.id,
        category: it.category,
        ztNo: it.ztNo,
        title: it.title,
        relatedStories: it.relatedStories,
        relatedBugs: it.relatedBugs,
      })) ?? [];

    let queryData: any[] = [];
    formatSelected.forEach((it) => {
      data.formList.forEach((form) => {
        if (form.ztNo == it.ztNo)
          queryData.push({ ...it, ...form, category: Math.abs(it.category) });
      });
    });

    // 直接移除
    const pass = queryData
      ?.filter((it) => !([1, 2].includes(it.codeRevert) && it.testVerify == 1))
      ?.map((o) => pick(o, pickData));

    // 标识开发已revert数据 【revert:是，测试验证：是 或者 revert：免，测试验证：是】
    const tagData = queryData
      ?.filter((it) => [1, 2].includes(it.codeRevert) && it.testVerify == 1)
      ?.map((o) => pick(o, pickTag));

    if (!isEmpty(pass)) {
      await SprintDetailServices.remove({ datas: pass, project: query?.projectid ?? '' });
    }
    if (!isEmpty(tagData)) {
      await SprintDetailServices.removeTag({ datas: tagData, project: query?.projectid ?? '' });
    }
    props.onCancel?.();
  };

  const onOK = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    onClear(values);
  };

  const onCancel = () => {
    props.onCancel?.();
  };

  const columns: ColumnsType<any> = [
    { title: '序号', render: (v, r, i) => i + 1, width: 60 },
    {
      title: '编号',
      dataIndex: 'ztNo',
      width: 90,
      render: (value, record, i) => <Form.Item name={['formList', i, 'ztNo']}>{value}</Form.Item>,
    },
    { title: '标题内容', dataIndex: 'title' },
    { title: '相关需求', dataIndex: 'relatedStories', width: 90 },
    { title: '相关bug', dataIndex: 'relatedBugs', width: 90 },
    {
      title: '测试',
      dataIndex: 'testers',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {() => {
              const values = form.getFieldsValue()?.formList?.[i];
              const testCheckFlag = values?.testVerify == 1;
              return (
                <Form.Item
                  name={['formList', i, 'testers']}
                  rules={[
                    {
                      validator: (r, v, cb) => {
                        // 需要测试验证：测试人员必填
                        if (testCheckFlag && (isEmpty(v) || v?.includes('NA')))
                          return cb('请填写测试人员!');
                        cb();
                      },
                    },
                  ]}
                >
                  <Select
                    options={[
                      ...[{ label: 'NA', value: 'NA', disabled: testCheckFlag }],
                      ...testUser.map((it) => ({ ...it, disabled: !testCheckFlag })),
                    ]}
                    showSearch
                    optionFilterProp={'label'}
                    size={'small'}
                    mode={'multiple'}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        );
      },
    },
    {
      title: '是否要测试验证',
      dataIndex: 'testVerify',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {({ setFieldsValue }) => {
              const formList = form.getFieldsValue()?.formList;

              return (
                <Form.Item
                  name={['formList', i, 'testVerify']}
                  rules={[{ required: true, message: '请填写是否要测试验证！' }]}
                >
                  <Select
                    options={list}
                    size={'small'}
                    onChange={(v) => {
                      formList[i].testVerify = v;
                      formList[i].testers =
                        v == 1
                          ? formList[i].testers?.filter((it: string) => it !== 'NA') ?? []
                          : [];
                      setFieldsValue({ formList });
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
      title: '是否提交代码',
      dataIndex: 'hasCode',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {({ setFieldsValue }) => {
              const formList = form.getFieldsValue()?.formList;
              return (
                <Form.Item
                  name={['formList', i, 'hasCode']}
                  rules={[{ required: true, message: '请填写是否提交代码！' }]}
                >
                  <Select
                    options={list}
                    size={'small'}
                    onChange={(v) => {
                      const status = v == 0;
                      formList[i].codeRevert = status ? 2 : undefined; // 提交代码为否： 代码revert 自动为免且不可编辑
                      formList[i].hasCode = v;
                      setFieldsValue({ formList });
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
      dataIndex: 'codeRevert',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {() => {
              const values = form.getFieldsValue()?.formList?.[i];
              return (
                <Form.Item
                  name={['formList', i, 'codeRevert']}
                  rules={[
                    {
                      validator: (r, v, cb) => {
                        if (values?.hasCode == 1 && v == 0) return cb('必须revert代码！');
                        else if (v == undefined) return cb('请选择是否revert代码！');
                        return cb();
                      },
                    },
                  ]}
                >
                  <Select
                    size={'small'}
                    disabled={values?.hasCode == '0'}
                    options={list.concat([{ label: '免', value: 2 }]).map((it) => ({
                      ...it,
                      disabled: values?.hasCode == 1 && it.value == 0, // 提交代码，revert 否：不可选
                    }))}
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
      dataIndex: 'notRevertMemo',
      render: (value, record, i) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {() => {
              const values = form.getFieldsValue()?.formList?.[i];

              return (
                <Form.Item
                  name={['formList', i, 'notRevertMemo']}
                  rules={[
                    {
                      required: values?.codeRevert == 2 && values?.hasCode == 1, // 人工修改为免且代码提交为是： 原因必填
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
      confirmLoading={confirmLoading}
    >
      <Spin tip="加载中..." spinning={loading}>
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
      </Spin>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
