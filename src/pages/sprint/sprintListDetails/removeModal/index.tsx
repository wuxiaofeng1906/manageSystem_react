import type { MutableRefObject } from 'react';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Select,
  Input,
  Form,
  Table,
  Space,
  Button,
  Spin,
  Popconfirm,
  Tooltip,
  message,
} from 'antd';
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
import { infoMessage } from '@/publicMethods/showMessages';

const list = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];
const pickData = ['rdId', 'ztNo', 'category', 'codeRevert'];
const pickTag = pickData.concat(['testers', 'testVerify', 'hasCode', 'notRevertMemo']);
const categoryType = {
  '1': 'Bug',
  '2': 'Task',
  '3': 'Story',
  '-3': 'B_Story',
};
export const DissatisfyModal = (
  props: ModalFuncProps & {
    dissatisfy: any[];
    setDissatisfy: Function;
    nextSprint: any[];
    onRefresh: Function;
    onRefreshForm?: Function;
    isTester?: Boolean;
  },
) => {
  const query = useLocation()?.query;
  const [loading, setLoading] = useState(false);
  // 移除
  const onConfirm = async (item: any) => {
    setLoading(true);
    try {
      const isTagData =
        [1, 2].includes(item.codeRevert) && item.testVerify == 1 && item.hasCode == 1;

      if (isTagData && props.isTester != true) {
        await SprintDetailServices.removeTag({
          datas: [pick(item, pickTag)],
          project: Number(query?.projectid ?? 0),
        });
      } else {
        await SprintDetailServices.remove({
          source: Number(query.projectid),
          target: Number(props.nextSprint?.[1]?.id),
          datas: [
            {
              ...pick(item, pickData),
              rdId: item.id || item.rdId,
              category: String(Math.abs(Number(item.category))),
            },
          ],
        });
        message.success(`${categoryType[item.category] ?? ''}${item.ztNo},移除成功！`);
      }
      const update = props.dissatisfy.filter((o) => o.ztNo != item.ztNo);
      props.onRefreshForm?.(update);
      props.setDissatisfy(update);
      if (isEmpty(props.dissatisfy)) props.onRefresh();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={!isEmpty(props.dissatisfy)}
      onCancel={() => props.setDissatisfy([])}
      footer={false}
      centered
      title={'移除需求提醒'}
    >
      <Spin tip="加载中..." spinning={loading}>
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          <p style={{ marginBottom: 5 }}>您需要移除的需求如下,请确认是否仍要移除？</p>
          {props.dissatisfy?.map((it) => (
            <div style={{ display: 'flex', textIndent: '1em', marginBottom: 5 }} key={it.id}>
              <div style={{ minWidth: 100 }}>{it.ztNo}</div>
              <div style={{ minWidth: 200 }}>阶段为：{stageType[it.stage]}</div>
              <Space style={{ marginLeft: 10 }}>
                {it.relatedTasks || it.relatedBugs ? (
                  <Popconfirm
                    placement="top"
                    title={
                      <div style={{ maxWidth: 500 }}>
                        <p>{`需求${it.ztNo} ${it.title}`}</p>
                        <p>{`在${query.project}关联 ${it.relatedTasks ?? 0}个任务和${
                          it.relatedBugs ?? 0
                        }个bug,将同步移到${props.nextSprint?.[1]?.name ?? ''}`}</p>
                      </div>
                    }
                    okText="确认"
                    cancelText="去禅道"
                    onConfirm={() => onConfirm(it)}
                    onCancel={() => {
                      if (!query.ztId) return infoMessage('禅道执行id异常！');
                      window.open(
                        `http://zentao.77hub.com/zentao/execution-story-${query.ztId}.html`,
                      );
                    }}
                  >
                    <Button size={'small'} type={'primary'}>
                      确认
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button size={'small'} type={'primary'} onClick={() => onConfirm(it)}>
                    确认
                  </Button>
                )}
                <Button
                  size={'small'}
                  onClick={() => {
                    const nextData = props.dissatisfy.filter((o) => o.ztNo !== it.ztNo) ?? [];
                    props.onRefreshForm?.(nextData);
                    props.setDissatisfy(nextData);
                  }}
                >
                  取消
                </Button>
              </Space>
            </div>
          ))}
        </div>
      </Spin>
    </Modal>
  );
};

const RemoveModal = (
  props: {
    gridRef: MutableRefObject<GridApi | undefined>;
    nextSprint: any[];
    onRefresh: Function;
  } & ModalFuncProps,
) => {
  const query = useLocation()?.query;
  const selected = props.gridRef.current?.getSelectedRows();
  const client = useGqlClient();
  const [form] = Form.useForm();
  const [testUser, setTestUser] = useState<any[]>([]);
  const [source, setSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dissatisfy, setDissatisfy] = useState<any[]>([]);

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
        codeRevert: it.pushCode == 0 ? 2 : it.codeRevert ?? undefined,
        relatedStories: it.relatedStories ?? 0,
        relatedTasks: it.relatedTasks ?? 0,
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
        category: String(Math.abs(Number(it.category))),
        ztNo: it.ztNo,
        title: it.title,
        relatedStories: it.relatedStories,
        relatedTasks: it.relatedTasks,
        relatedBugs: it.relatedBugs,
        flag: ['1', '-3'].includes(it.category)
          ? [1, 2].includes(it.stage)
            ? true
            : false
          : ['3'].includes(it.category)
          ? [1, 2, 3].includes(it.stage)
            ? true
            : false
          : false,
      })) ?? [];

    let queryData: any[] = [];
    formatSelected?.forEach((it) => {
      data.formList?.forEach((form) => {
        if (form.ztNo == it.ztNo) queryData.push({ ...it, ...form });
      });
    });
    if (!isEmpty(queryData)) {
      // 有相关bug、task 或不满足条件的(阶段) 或者 需要测试验证,已提交代码 (已revert|免revert)
      const relatedData = queryData.filter(
        (it) =>
          it.relatedTasks ||
          it.relatedBugs ||
          !it.flag ||
          ([1, 2].includes(it.codeRevert) && it.testVerify == 1 && it.hasCode == 1),
      );
      // 可直接移除
      const notRelatedData = queryData.filter(
        (it) =>
          Number(it.relatedTasks) == 0 &&
          Number(it.relatedBugs) == 0 &&
          it.flag &&
          !([1, 2].includes(it.codeRevert) && it.testVerify == 1 && it.hasCode == 1),
      );
      if (!isEmpty(notRelatedData)) {
        await SprintDetailServices.remove({
          datas: notRelatedData.map((it) => ({
            rdId: it.id,
            ztNo: it.ztNo,
            category: String(Math.abs(Number(it.category))),
            codeRevert: it.codeRevert,
          })),
          source: Number(query.projectid),
          target: Number(props.nextSprint?.[1]?.id),
        });
        message.success({
          content: (
            <div style={{ maxWidth: 300 }}>
              {(
                notRelatedData?.map((it) => `${categoryType[it.category] ?? ''}${it.ztNo}`) ?? []
              ).join()}
              ，移除成功！
            </div>
          ),
        });
        setSource(relatedData);
      }
      if (!isEmpty(relatedData)) {
        setDissatisfy(relatedData);
      }
      if (isEmpty(relatedData)) props.onCancel?.();
    }
  };

  const onOK = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    onClear(values);
  };

  const onCancel = () => {
    props.onCancel?.();
  };

  const memoColumns = useMemo(() => {
    if (!props.visible) return [];
    const columns: ColumnsType<any> = [
      { title: '序号', render: (v, r, i) => i + 1, width: 60 },
      {
        title: '类型',
        dataIndex: 'category',
        render: (v, r, i) => categoryType[v] ?? '',
        width: 80,
      },
      {
        title: '编号',
        dataIndex: 'ztNo',
        width: 90,
        render: (value, record, i) => <Form.Item name={['formList', i, 'ztNo']}>{value}</Form.Item>,
      },
      {
        title: '标题内容',
        dataIndex: 'title',
        render: (v) => (
          <Tooltip title={v} placement="topLeft">
            {v}
          </Tooltip>
        ),
      },
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
                      onChange={(v) => {
                        formList[i].testVerify = v;
                        formList[i].testers =
                          v == 1
                            ? formList[i].testers?.filter((it: string) => it !== 'NA') ?? []
                            : formList[i].testers;
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
                      onChange={(v) => {
                        const status = v == 0;
                        formList[i].codeRevert = status ? 2 : undefined; // 提交代码为否： 代码revert 自动为免且不可编辑
                        formList[i].hasCode = v;
                        formList[i].notRevertMemo =
                          status && isEmpty(formList[i].notRevertMemo?.trim())
                            ? ' '
                            : formList[i].notRevertMemo?.trim();
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
              {({ setFieldsValue }) => {
                const formList = form.getFieldsValue()?.formList;
                return (
                  <Form.Item
                    name={['formList', i, 'codeRevert']}
                    rules={[
                      {
                        validator: (r, v, cb) => {
                          if (formList[i]?.hasCode == 1 && v == 0) return cb('必须revert代码！');
                          else if (v == undefined) return cb('请选择是否revert代码！');
                          return cb();
                        },
                      },
                    ]}
                  >
                    <Select
                      disabled={formList?.[i]?.hasCode == '0'}
                      options={list.concat([{ label: '免', value: 2 }]).map((it) => ({
                        ...it,
                        disabled: formList?.[i]?.hasCode == 1 && it.value == 0, // 提交代码，revert 否：不可选
                      }))}
                      onChange={(v) => {
                        const memo = formList[i].notRevertMemo?.trim();
                        formList[i].notRevertMemo =
                          v == 1 && isEmpty(memo) ? ' ' : memo ?? undefined;
                        formList[i].codeRevert = v;
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
        title: '免Revert原因',
        dataIndex: 'notRevertMemo',
        render: (value, _, i) => {
          return (
            <Form.Item noStyle shouldUpdate>
              {({ getFieldsValue }) => {
                const values = getFieldsValue()?.formList?.[i];
                return (
                  <Form.Item
                    name={['formList', i, 'notRevertMemo']}
                    rules={[
                      {
                        validator: (r, v, cb) => {
                          // 人工修改为免且代码提交为是： 原因必填
                          if (isEmpty(v?.trim()) && values?.codeRevert == 2 && values?.hasCode == 1)
                            return cb('请填写免revert原因！');
                          return cb();
                        },
                      },
                    ]}
                  >
                    <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
                  </Form.Item>
                );
              }}
            </Form.Item>
          );
        },
      },
    ];
    return columns;
  }, [props.visible, JSON.stringify(testUser)]);

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
        <Form form={form} size={'small'}>
          <Table
            bordered={false}
            className={styles.removeTableWarp}
            columns={memoColumns}
            dataSource={source}
            size={'small'}
            scroll={{ y: 400 }}
            pagination={false}
          />
        </Form>
        <DissatisfyModal
          dissatisfy={dissatisfy}
          setDissatisfy={setDissatisfy}
          nextSprint={props.nextSprint}
          onRefresh={props.onRefresh}
          onRefreshForm={(v: any[]) => {
            setSource(v);
            if (isEmpty(v)) props.onCancel?.();
          }}
        />
      </Spin>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
