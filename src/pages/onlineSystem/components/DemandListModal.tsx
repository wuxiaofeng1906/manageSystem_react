import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFuncProps, Table, Select, Form, Col, Row, Spin } from 'antd';
import { useModel, useParams } from 'umi';
import styles from './DemandListModal.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { ClusterType, StoryStatus, WhetherOrNot } from '@/pages/onlineSystem/config/constant';
import { isEmpty, difference, isEqual } from 'lodash';
import { errorMessage, infoMessage } from '@/publicMethods/showMessages';
import dayjs from 'dayjs';
import DutyListServices from '@/services/dutyList';
import Ellipsis from '@/components/Elipsis';
import PreReleaseServices from '@/services/preRelease';

const DemandListModal = (props: ModalFuncProps & { data?: any }) => {
  const [form] = Form.useForm();
  const query = useParams() as { branch: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [globalState, envs] = useModel('onlineSystem', (online) => [
    online.globalState,
    online.envs,
  ]);
  const [list, setList] = useState<any[]>([]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const [relatedStory, setRelatedStory] = useState<any[]>([]);
  const [branchEnv, setBranchEnv] = useState<any[]>([]);

  useEffect(() => {
    if (!props.visible) {
      form.resetFields();
      setSelected([]);
      return;
    }
    if (!isEmpty(props.data)) {
      form.setFieldsValue({
        release_env_type: props.data.release_env_type,
        cluster: props.data.cluster?.split(','),
        release_env: props.data.release_env,
      });
    }
    getRelatedStory();
    getTableList();
  }, [props.visible, props.data]);

  const getRelatedStory = async () => {
    const res = await OnlineSystemServices.getRelatedStory({
      branch: props.data?.branch || query.branch,
    });
    const branchEnv = await OnlineSystemServices.branchEnv({
      branch: props.data?.branch || query.branch,
    });
    setBranchEnv(branchEnv?.map((it: string) => ({ label: it, value: it })));
    setRelatedStory(res);
  };
  const getTableList = async () => {
    setSpin(true);
    try {
      const res = await OnlineSystemServices.getStoryList({
        branch: props.data?.branch || query.branch,
      });
      setList(
        res?.map((it: any) => ({
          ...it,
          type: it.apps == 'global' ? 'global' : 'tenant',
        })),
      );
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    if (isEmpty(selected)) return infoMessage('请勾选发布项目与需求！');
    let release_num = props.data?.release_num;
    const time = (isEqual(values.cluster, ['cn-northwest-0'])
      ? dayjs().startOf('d').hour(10)
      : isEqual(values.cluster, ['cn-northwest-1'])
      ? dayjs().startOf('d').hour(22)
      : dayjs().startOf('d')
    ).format('YYYY-MM-DD HH:mm:ss');
    setSpin(true);
    if (!release_num) {
      const res = await DutyListServices.getDutyNum();
      release_num = res.ready_release_num;
    }

    const name =
      difference(values.cluster, ['cn-northwest-0', 'cn-northwest-1'])?.length > 0
        ? '正式发布'
        : '灰度发布';
    const data = {
      user_id: user?.userid ?? '',
      cluster: values.cluster?.join() ?? '',
      release_env: values.release_env,
      release_env_type: values.release_env_type,
      branch: props.data?.branch || query.branch,
      pro_data: list
        .filter((it) => selected.includes(it.story))
        ?.map((o) => ({
          pro_id: o.pro_id,
          story_num: o.story,
          is_hot_update: o.is_update,
          apps: o.apps,
        })),
      release_num: release_num ?? '',
      release_name: `${release_num}${name}`,
      plan_release_time: time,
    };
    try {
      await OnlineSystemServices.addRelease(data);
      setSpin(false);
      props.onOk?.(true);
    } catch (e) {
      errorMessage('接口异常');
      setSpin(false);
    }
  };

  const onChange = (v: string) => {
    setSelected([]);
    /*
      1.stage-patch、emergency 默认勾选未关联项，和集群
      2. 班车、特性 默认集群0
      3.global 默认global
    */

    form.setFieldsValue({
      cluster: v == 'global' ? ['global'] : isSprint ? ['cn-northwest-0'] : [],
    });
    setList(list.map((it) => ({ ...it, disabled: it.type !== v })));
  };

  const updateStatus = (data: any, status: string, index: number) => {
    Modal.confirm({
      title: '修改是否可热更提醒',
      content: `请确认是否将『需求编号：${data.story_num}』的是否可热更 状态调整为 ${WhetherOrNot[status]}`,
      onOk: () => {
        list[index].is_update = status;
        setList([...list]);
      },
    });
  };

  const memoColumn = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'applicant',
        width: 70,
      },
      {
        title: '禅道执行名称',
        dataIndex: 'pro_name',
        ellipsis: { showTitle: false },
        render: (v: string) => (
          <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
        ),
      },
      {
        title: '需求编号',
        dataIndex: 'story',
        width: 90,
      },
      {
        title: '需求标题',
        dataIndex: 'title',
        ellipsis: { showTitle: false },
        render: (v: string) => (
          <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
        ),
      },
      {
        title: '需求阶段',
        dataIndex: 'status',
        width: 90,
        render: (v: string) => StoryStatus[v] ?? '',
      },
      {
        title: '应用服务',
        dataIndex: 'apps',
        width: 110,
        ellipsis: { showTitle: false },
        render: (v: string) => (
          <Ellipsis title={v} width={110} placement={'bottomLeft'} color={'#108ee9'} />
        ),
      },
      {
        title: '是否涉及数据update',
        dataIndex: 'db_update',
        render: (v: string) => WhetherOrNot[v] ?? (v || ''),
      },
      {
        title: '是否涉及数据Recovery',
        dataIndex: 'is_recovery',
        render: (v: string) => WhetherOrNot[v] ?? (v || ''),
      },
      {
        title: '是否可热更',
        dataIndex: 'is_update',
        width: 90,
        render: (v: string, row: any, i: number) =>
          v == '-' ? (
            v
          ) : (
            <Select
              disabled={!permission}
              value={v}
              style={{ width: '100%' }}
              options={Object.keys(WhetherOrNot)?.map((k) => ({
                value: k,
                label: WhetherOrNot[k],
              }))}
              onChange={(e) => updateStatus(row, e, i)}
            />
          ),
      },
      { title: '需求创建人', dataIndex: 'opened_by', width: 100 },
      { title: '需求指派人', dataIndex: 'ass_to', width: 100 },
    ];
  }, [list]);

  const permission = useMemo(() => user?.group == 'superGroup', [user]);
  const isSprint = useMemo(
    () => list.some((it) => !['stagepatch', 'emergency'].includes(it.sprinttype)),
    [list],
  );
  const memoEdit = useMemo(() => globalState.locked || globalState.finished, [globalState]);

  return (
    <Modal
      {...props}
      centered
      okText={'确定'}
      maskClosable={false}
      destroyOnClose={true}
      width={1400}
      title={'新增发布批次：选择该批次发布的项目与需求'}
      wrapClassName={styles.DemandListModal}
      onCancel={() => props.onOk?.()}
      onOk={onConfirm}
      okButtonProps={{ disabled: memoEdit || spin }}
    >
      <Spin spinning={spin} tip={'数据加载中...'}>
        <div>
          <Form form={form} size={'small'}>
            <Row justify={'space-between'} gutter={8}>
              <Col span={8}>
                <Form.Item
                  name={'release_env_type'}
                  label={'发布环境类型'}
                  rules={[{ required: true, message: '请选择发布环境' }]}
                >
                  <Select
                    placeholder={'发布环境类型'}
                    disabled={!isEmpty(props.data) || memoEdit}
                    options={Object.keys(ClusterType).map((k) => ({
                      label: ClusterType[k],
                      value: k,
                    }))}
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  noStyle
                  shouldUpdate={(old, next) => old.release_env_type !== next.release_env_type}
                >
                  {({ getFieldValue }) => {
                    const env = getFieldValue('release_env_type');
                    return (
                      <Form.Item
                        name={'cluster'}
                        label={'发布集群'}
                        rules={[{ required: true, message: '请选择发布集群' }]}
                      >
                        <Select
                          mode={'multiple'}
                          options={envs}
                          disabled={memoEdit || env == 'global' || (isSprint && env == 'tenant')}
                          placeholder={'发布集群'}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'release_env'}
                  label={'镜像环境绑定'}
                  rules={[{ required: true, message: '请选择镜像环境绑定' }]}
                >
                  <Select
                    showSearch
                    options={branchEnv}
                    placeholder={'镜像环境绑定'}
                    disabled={memoEdit}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles.onlineTable}>
            <Table
              size={'small'}
              scroll={{ y: 400, x: 'min-content' }}
              pagination={false}
              columns={memoColumn}
              rowKey={(p) => p.story}
              dataSource={list}
              rowSelection={{
                selectedRowKeys: selected,
                onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
                getCheckboxProps: (record) => ({ disabled: memoEdit || record.disabled }),
              }}
            />
          </div>
          <p style={{ marginTop: 8 }}>
            提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉
          </p>
        </div>
      </Spin>
    </Modal>
  );
};
export default DemandListModal;
