import React, {useState, useEffect, useMemo} from 'react';
import {Modal, ModalFuncProps, Table, Select, Form, Col, Row, Spin, Button} from 'antd';
import dayjs from 'dayjs';
import {useModel} from 'umi';
import {isEmpty, difference, isEqual, intersection, uniq} from 'lodash';
import styles from './DemandListModal.less';
import {OnlineSystemServices} from '@/services/onlineSystem';
import {
  ClusterType,
  StoryStatus,
  WhetherOrNot,
  onLog,
} from '@/pages/onlineSystem/config/constant';
import {errorMessage, infoMessage} from '@/publicMethods/showMessages';
import DutyListServices from '@/services/dutyList';
import Ellipsis from '@/components/Elipsis';

const DemandListModal = (props: ModalFuncProps & { data?: any }) => {
  const [form] = Form.useForm();
  const [baseForm] = Form.useForm();
  const [computed, setComputed] = useState<any>();
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [globalEnv] = useModel('env', (env) => [env.globalEnv]);
  const [globalState, getLogInfo] = useModel('onlineSystem', (online) => [
    online.globalState,
    online.getLogInfo,
  ]);
  const [list, setList] = useState<any[]>([]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const [relatedStory, setRelatedStory] = useState<any>();
  const [branchEnv, setBranchEnv] = useState<any[]>([]);
  const [appServers, setAppServers] = useState<Record<'tenant' | 'global', string[]>>();
  const [branchs, setBranchs] = useState<any[]>();
  const [releaseCluster, setReleaseCluster] = useState(globalEnv);
  useEffect(() => {
    if (!props.visible) {
      form.resetFields();
      baseForm.resetFields();
      setComputed(null);
      setSelected([]);
      return;
    }
    OnlineSystemServices.getBranch().then((res) => {
      setBranchs(res?.map((it: any) => ({label: it.branch_name, value: it.branch_name})));
    });
    if (!isEmpty(props.data)) {
      const branch = props.data?.branch;
      form.setFieldsValue({
        release_env_type: props.data.release_env_type,
        cluster: props.data.cluster?.split(','),
        release_env: props.data.release_env,
      });
      if (branch) {
        const result = {branch, type: '1'};
        baseForm.setFieldsValue(result);
        setComputed(result);
      }

      // 根据发布环境类型展示发布集群
      getReleseCluster(props.data.release_env_type);
    }
    getTenantGlobalApps();
  }, [props.visible, props.data]);

  useEffect(() => {
    if (computed?.branch) {
      getRelatedStory();
      getTableList();
    }
  }, [computed?.branch]);


  const getTenantGlobalApps = async () => {
    const res = await OnlineSystemServices.getTenantGlobalApps();
    setAppServers(res);
  };

  const getRelatedStory = async () => {
    const res = await OnlineSystemServices.getRelatedStory({
      branch: computed?.branch,
    });
    const branchEnv = await OnlineSystemServices.branchEnv({
      branch: computed?.branch,
    });
    setBranchEnv(branchEnv?.map((it: string) => ({label: it, value: it})));
    setRelatedStory(res);
  };

  const getTableList = async () => {
    setSpin(true);
    try {
      const res = await OnlineSystemServices.getStoryList({branch: computed?.branch});
      setList(res);
      // 新增 -默认勾选特性项目和sprint分支项目
      if (!props.data?.release_num) {
        setSelected(
          res?.flatMap((it: any) =>
            ['stagepatch', 'emergency'].includes(it.sprinttype) ? [] : [it], // sprint
          ),
        );
      } else {
        // 勾选上次选中项
        let checkedArr: any[] = [];
        res?.forEach((it: any) => {
          const result = props.data?.server.find(
            (source: any) => it.story == source.story_num && it.pro_id == source.project_id,
          );

          if (!isEmpty(result)) checkedArr.push(it);
        });
        setSelected(checkedArr);
      }

      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  // 获取发布名称
  const getReleaseName = (clusterArray: any) => {
    // 如果选择的集群只为：灰度集群0；灰度集群1；灰度集群0、1三种情况默认加“灰度发布”；否则默认加“正式发布”
    let allCluster: any = [];
    clusterArray.map((v: any) => {
      const vs = v.split(",");
      allCluster = [...allCluster, ...vs];
    });

    const name = difference(allCluster, ['cn-northwest-0', 'cn-northwest-1'])?.length > 0
      ? '正式发布'
      : '灰度发布';

    return name;
  };
  const onConfirm = async () => {
    const baseData = await baseForm.validateFields();
    const isPreRelease = baseData.type == '1';
    let release_num = props.data?.release_num;
    let values;
    if (isPreRelease) {
      values = await form.validateFields();
      if (isEmpty(selected)) return infoMessage('请勾选发布项目与需求！');
    }
    setSpin(true);
    if (!release_num) {
      const res = await DutyListServices.getDutyNum();
      release_num = res.ready_release_num;
    }
    // 灰度发布
    if (!isPreRelease) {
      setSpin(false);
      props.onOk?.({...baseData, release_num});
      return;
    }
    // 非积压发布
    const time = (isEqual(values.cluster, ['cn-northwest-0'])
        ? dayjs().startOf('d').hour(10)
        : isEqual(values.cluster, ['cn-northwest-1'])
          ? dayjs().startOf('d').hour(22)
          : dayjs().startOf('d')
    ).format('YYYY-MM-DD HH:mm:ss');

    const data = {
      user_id: user?.userid ?? '',
      cluster: uniq(values.cluster || [])?.join() ?? '',
      release_env: values.release_env ?? '',
      // release_env: 'nx-temp-test', // 测试环境测试时可以使用一个固定值
      release_env_type: values.release_env_type,
      branch: computed.branch,
      pro_data: selected.map((o) => ({
        pro_id: o.pro_id,
        story_num: o.story,
        is_hot_update: o.is_update,
        apps: o.apps,
      })),
      release_num: release_num ?? '',
      release_name: `${release_num}${getReleaseName(values.cluster)}`,
      plan_release_time: time,
    };

    try {
      await OnlineSystemServices.addRelease(data);
      setSpin(false);
      props.onOk?.({...baseData, release_num});
    } catch (e) {
      errorMessage('接口异常');
      setSpin(false);
    }
  };

  const getReleseCluster = (v: string) => {
    const filtered: any = [];
    [...globalEnv].forEach((cluster: any) => {
      if (v === "tenant") {
        if (cluster.key !== "cn-northwest-global") {
          filtered.push(cluster);
        }
      } else {
        filtered.push(cluster);
      }
    });

    setReleaseCluster(filtered);
  };
  const onChange = (v: string) => {
    const values = form.getFieldsValue();
    /*
      1.stage-patch、emergency 默认勾选未关联项，和集群 取 story
      2. 班车、特性 默认集群0
      3.global 默认global
      4. 特性项目 默认勾选未关联的需求项目
    */
    let selectedData: any[] = [];
    if (!memoColumn().isSprint && v !== 'global') {
      selectedData = isEmpty(relatedStory?.story)
        ? list
        : list.filter((it) => relatedStory?.story?.includes(String(it.story)));
    } else {
      // 默认勾选 特性项目
      list
        .filter((it) => !['stagepatch', 'emergency'].includes(it.sprinttype)) // sprint
        .forEach((o) => {
          const nothing = isEmpty(
            selectedData?.find(
              (checked: any) => checked.story == o.story && checked.pro_id == o.pro_id,
            ),
          );
          nothing && selectedData.push(o);
        });
    }

    form.setFieldsValue({
      cluster:
        v == 'global'
          ? ['cn-northwest-global']
          : memoColumn().isSprint
          ? ['cn-northwest-0'] : []
      // : uniq(selectedData?.flatMap((it) => (it.cluster ? [it.cluster] : []))),
    });

    // 当“发布环境类型”选择“租户集群发布”时，发布集群列表要过滤掉global集群---需求：15086
    getReleseCluster(v);

    setSelected(
      selectedData?.filter(
        (o) => intersection(o.apps?.split(','), appServers?.[values?.release_env_type])?.length > 0,
      ),
    );

    if (isEmpty(appServers?.[v])) return;
    setList(
      list?.map((it: any) => ({
        ...it,
        disabled: intersection(it.apps?.split(','), appServers?.[v])?.length == 0,
      })),
    );
  };

  const updateStatus = (data: any, status: string, index: number) => {
    Modal.confirm({
      centered: true,
      title: '修改是否可热更提醒',
      content: `请确认是否将『执行名称：${data.pro_name ?? ''} 需求编号：${
        data.story ?? ''
      }』的是否可热更 状态调整为 ${WhetherOrNot[status]}`,
      onOk: () => {
        list[index].is_update = status;
        setList([...list]);
      },
    });
  };

  const computedFn = () => {
    const values = baseForm.getFieldsValue();
    setComputed(values);
  };
  const showLog = async () => {
    const log = await getLogInfo({
      release_num: props.data?.release_num,
      options_model: 'online_system_manage_release',
    });
    onLog({
      title: '项目与需求日志',
      log: isEmpty(log) ? '' : '参数',
      noData: '暂无项目与需求日志！',
      content: (
        <>
          {log?.map((it: any) => (
            <div>
              {it.create_time}
              {it.operation_content}
            </div>
          ))}
        </>
      ),
    });
  };


  const memoEdit = useMemo(
    () => ({
      global: globalState.locked || globalState.finished,
      update: !isEmpty(props.data?.release_num), // 新增、修改
    }),
    [globalState, props.data],
  );

  // const memoColumn = useMemo(() => {
  //   const isSprint = list?.every((it) => !['emergency', 'stagepatch'].includes(it.sprinttype));
  //   const disableValue = user?.group !== 'superGroup' && (memoEdit.update ? memoEdit.global : memoEdit.update);
  //   console.log("user?.group !== 'superGroup' && (memoEdit.update ? memoEdit.global : memoEdit.update", disableValue);
  //
  //   return {
  //     isSprint,
  //     column: isSprint
  //       ? [
  //         {
  //           title: '序号',
  //           width: 70,
  //           render: (_: any, r: any, i: number) => i + 1,
  //           fixed: 'left',
  //         },
  //         {
  //           title: '禅道执行名称',
  //           dataIndex: 'pro_name',
  //           ellipsis: {showTitle: false},
  //           width: 500,
  //           fixed: 'left',
  //           render: (v: string) => (
  //             <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
  //           ),
  //         },
  //         {
  //           title: '应用服务',
  //           dataIndex: 'apps',
  //           width: 400,
  //           ellipsis: {showTitle: false},
  //           render: (v: string) => (
  //             <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
  //           ),
  //         },
  //       ]
  //       : [
  //         {
  //           title: '序号',
  //           width: 70,
  //           render: (_: any, r: any, i: number) => i + 1,
  //           fixed: 'left',
  //         },
  //         {
  //           title: '禅道执行名称',
  //           dataIndex: 'pro_name',
  //           ellipsis: {showTitle: false},
  //           width: 200,
  //           fixed: 'left',
  //           render: (v: string) => (
  //             <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
  //           ),
  //         },
  //         {
  //           title: '需求编号',
  //           dataIndex: 'story',
  //           width: 90,
  //         },
  //         {
  //           title: '需求标题',
  //           dataIndex: 'title',
  //           width: 150,
  //           ellipsis: {showTitle: false},
  //           render: (v: string) => (
  //             <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
  //           ),
  //         },
  //         {
  //           title: '需求阶段',
  //           dataIndex: 'status',
  //           width: 90,
  //           ellipsis: {showTitle: false},
  //           render: (v: string) => StoryStatus[v] ?? '',
  //         },
  //         {
  //           title: '应用服务',
  //           dataIndex: 'apps',
  //           width: 110,
  //           ellipsis: {showTitle: false},
  //           render: (v: string) => (
  //             <Ellipsis title={v} width={110} placement={'bottomLeft'} color={'#108ee9'}/>
  //           ),
  //         },
  //         {
  //           title: '是否涉及数据update',
  //           dataIndex: 'db_update',
  //           // width: 150,
  //           render: (v: string) => WhetherOrNot[v] ?? (v || ''),
  //         },
  //         {
  //           title: '是否涉及数据Recovery',
  //           dataIndex: 'is_recovery',
  //           render: (v: string) => WhetherOrNot[v] ?? (v || ''),
  //         },
  //         {
  //           title: '是否可热更',
  //           dataIndex: 'is_update',
  //           width: 90,
  //           render: (v: string, row: any, i: number) =>
  //             v == '-' ? (
  //               v
  //             ) : (
  //               <Select
  //                 disabled={user?.group !== 'superGroup' || (memoEdit.update ? memoEdit.global : memoEdit.update)}
  //                 value={v}
  //                 style={{width: '100%'}}
  //                 options={Object.keys(WhetherOrNot)?.map((k) => ({
  //                   value: k,
  //                   label: WhetherOrNot[k],
  //                 }))}
  //                 onChange={(e) => updateStatus(row, e, i)}
  //               />
  //             ),
  //         },
  //         {title: '需求创建人', dataIndex: 'opened_by', width: 100},
  //         {title: '需求指派人', dataIndex: 'ass_to', width: 100},
  //       ],
  //   };
  // }, [JSON.stringify(list), user?.group]);


  const memoColumn: any = () => {
    const isSprint = list?.every((it) => !['emergency', 'stagepatch'].includes(it.sprinttype));

    return {
      isSprint,
      column: isSprint
        ? [
          {
            title: '序号',
            width: 70,
            render: (_: any, r: any, i: number) => i + 1,
            fixed: 'left',
          },
          {
            title: '禅道执行名称',
            dataIndex: 'pro_name',
            ellipsis: {showTitle: false},
            width: 500,
            fixed: 'left',
            render: (v: string) => (
              <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
            ),
          },
          {
            title: '应用服务',
            dataIndex: 'apps',
            width: 400,
            ellipsis: {showTitle: false},
            render: (v: string) => (
              <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
            ),
          },
        ]
        : [
          {
            title: '序号',
            width: 70,
            render: (_: any, r: any, i: number) => i + 1,
            fixed: 'left',
          },
          {
            title: '禅道执行名称',
            dataIndex: 'pro_name',
            ellipsis: {showTitle: false},
            width: 200,
            fixed: 'left',
            render: (v: string) => (
              <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
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
            width: 150,
            ellipsis: {showTitle: false},
            render: (v: string) => (
              <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'}/>
            ),
          },
          {
            title: '需求阶段',
            dataIndex: 'status',
            width: 90,
            ellipsis: {showTitle: false},
            render: (v: string) => StoryStatus[v] ?? '',
          },
          {
            title: '应用服务',
            dataIndex: 'apps',
            width: 110,
            ellipsis: {showTitle: false},
            render: (v: string) => (
              <Ellipsis title={v} width={110} placement={'bottomLeft'} color={'#108ee9'}/>
            ),
          },
          {
            title: '是否涉及数据update',
            dataIndex: 'db_update',
            // width: 150,
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
                  disabled={user?.group !== 'superGroup' || (memoEdit.update ? memoEdit.global : memoEdit.update)}
                  value={v}
                  style={{width: '100%'}}
                  options={Object.keys(WhetherOrNot)?.map((k) => ({
                    value: k,
                    label: WhetherOrNot[k],
                  }))}
                  onChange={(e) => updateStatus(row, e, i)}
                />
              ),
          },
          {title: '需求创建人', dataIndex: 'opened_by', width: 100},
          {title: '需求指派人', dataIndex: 'ass_to', width: 100},
        ],
    };
  }


  return (
    <Modal
      {...props}
      centered
      okText={'确定'}
      maskClosable={false}
      destroyOnClose={true}
      width={1200}
      title={`${memoEdit.update ? '修改' : '新增'}发布批次：选择该批次发布的项目与需求`}
      wrapClassName={styles.DemandListModal}
      onCancel={() => props.onOk?.()}
      footer={[
        <Button onClick={showLog} hidden={!memoEdit.update}>
          查看日志
        </Button>,
        <Button onClick={() => props.onOk?.()}>取消</Button>,
        <Button
          type={'primary'}
          disabled={(memoEdit.update ? memoEdit.global : memoEdit.update) || spin}
          onClick={onConfirm}
        >
          确定
        </Button>,
      ]}
    >
      <Spin spinning={spin} tip={'数据加载中...'}>
        <div>
          <Form form={baseForm} onFieldsChange={computedFn} size={'small'}>
            <Row gutter={4}>
              <Col span={12}>
                <Form.Item
                  label={'类型选择'}
                  name={'type'}
                  rules={[{required: true, message: '请选择发布类型！'}]}
                >
                  <Select
                    disabled={memoEdit.update}
                    options={[
                      {label: '非积压发布', value: '1'},
                      {label: '灰度推线上', value: '2'},
                    ]}
                  />
                </Form.Item>
              </Col>
              {computed?.type == '1' && (
                <Col span={12}>
                  <Form.Item
                    label={'上线分支'}
                    name={'branch'}
                    rules={[{required: true, message: '请选择发布类型！'}]}
                  >
                    <Select
                      options={branchs}
                      disabled={memoEdit.update}
                      placeholder={'上线分支'}
                      showSearch
                      allowClear
                      onChange={() => form.resetFields()}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
          {computed?.branch && (
            <>
              <Form form={form} size={'small'}>
                <Row justify={'space-between'} gutter={8}>
                  <Col span={8}>
                    <Form.Item
                      name={'release_env_type'}
                      label={'发布环境类型'}
                      rules={[{required: true, message: '请选择发布环境'}]}
                    >
                      <Select
                        placeholder={'发布环境类型'}
                        disabled={memoEdit.update}
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
                      {({getFieldValue}) => {
                        const env = getFieldValue('release_env_type');
                        return (
                          <Form.Item
                            name={'cluster'}
                            label={'发布集群'}
                            rules={[{required: true, message: '请选择发布集群'}]}
                          >
                            <Select
                              mode={'multiple'}
                              options={releaseCluster}
                              placeholder={'发布集群'}
                              disabled={
                                (memoEdit.update ? memoEdit.global : memoEdit.update) || env == 'global' || (memoColumn()?.isSprint && env == 'tenant')
                              }
                              //{
                              // global 、班车，特性项目 不可编辑
                              // env == 'global' || (memoColumn?.isSprint && env == 'tenant')
                              //}
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
                      rules={[{required: true, message: '请选择镜像环境绑定'}]}
                    >
                      <Select
                        // defaultValue={"nx-temp-test"} // 测试环境测试时使用
                        showSearch
                        options={branchEnv}
                        placeholder={'镜像环境绑定'}
                        disabled={memoEdit.update ? memoEdit.global : memoEdit.update}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div className={styles.onlineTable}>
                <Table
                  size={'small'}
                  scroll={{y: 400, x: 500}}
                  pagination={false}
                  columns={memoColumn().column}
                  rowKey={(p) => `${p.story}&${p.pro_id}`}
                  dataSource={list}
                  rowSelection={{
                    selectedRowKeys: selected?.map((p) => `${p.story}&${p.pro_id}`),
                    onChange: (_, selectedRows) => setSelected(selectedRows),
                    getCheckboxProps: (record) => ({
                      disabled:
                        (memoEdit.update ? globalState.finished : false) ||
                        record.disabled ||
                        (!isEmpty(props.data?.release_env_type) &&
                          intersection(
                            record.apps?.split(','),
                            appServers?.[props.data?.release_env_type],
                          )?.length == 0),
                    }),
                  }}
                />
              </div>
              <p style={{marginTop: 8}}>
                提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉
              </p>
            </>
          )}
        </div>
      </Spin>
    </Modal>
  );
};
export default DemandListModal;
