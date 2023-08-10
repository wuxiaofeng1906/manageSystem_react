import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalFuncProps,
  Table,
  Select,
  Form,
  Col,
  Row,
  Spin,
  Button,
  Input,
  Checkbox,
} from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import { isEmpty, difference, isEqual, intersection, uniq } from 'lodash';
import styles from './DemandListModal.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import {
  ClusterType,
  StoryStatus,
  WhetherOrNot,
  onLog,
} from '@/pages/onlineSystem/config/constant';
import { errorMessage, infoMessage, sucMessage } from '@/publicMethods/showMessages';
import DutyListServices from '@/services/dutyList';
import Ellipsis from '@/components/Elipsis';
import usePermission from '@/hooks/permission';
import { setTabsLocalStorage } from '@/pages/onlineSystem/commonFunction';
import { preEnv } from '@/pages/onlineSystem/announcement/constant';
import {
  modifyCheckboxOnTableSelectedChange,
  onFormCheckboxChange,
  onTableCheckboxChange,
} from '../prePublish/improves/processDetailImprove';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

let totalBranchEnv: any = [];
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
  const [branchEnv, setBranchEnv] = useState<any[]>([]); // 镜像环境
  const [appServers, setAppServers] = useState<Record<'tenant' | 'global', string[]>>();
  const [branchs, setBranchs] = useState<any[]>();
  const [releaseCluster, setReleaseCluster] = useState(globalEnv); // 发布集群
  const { prePermission } = usePermission();
  const hasPermission = prePermission();
  //
  const [selectedProjApps, setSelectedProjApps] = useState<string[]>(); // 当前env类型所有可以被选择到的服务列表
  const [checkedList, setCheckedList] = useState<string[]>(); // 当前选中的服务列表

  useEffect(() => {
    if (!props.visible) {
      form.resetFields();
      baseForm.resetFields();
      setComputed(null);
      setSelected([]);
      //
      setSelectedProjApps(undefined);
      setCheckedList(undefined);
      return;
    }
    OnlineSystemServices.getBranch().then((res) => {
      setBranchs(res?.map((it: any) => ({ label: it.branch_name, value: it.branch_name })));
    });
    if (!isEmpty(props.data)) {
      const branch = props.data?.branch;
      form.setFieldsValue({
        release_env_type: props.data.release_env_type,
        cluster: props.data.cluster?.split(','),
        release_env: props.data.release_env,
      });
      if (branch) {
        const result = { branch, type: '1' };
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

  useEffect(() => {
    showInitBranchEnv(props.data?.release_env_type, computed?.branch);
  }, [computed?.branch, props.data]);

  useEffect(() => {
    if (appServers && list.length && memoEdit.update && !selectedProjApps) {
      //
      const uniqueCheckList: Set<string> = new Set(props.data.server?.map((item) => item.apps)); // init checkList
      const envAppServices: string[] = appServers?.[props.data.release_env_type] ?? []; // init selectedProjApps
      const uniqueListAppServices: string[] = [];
      for (const item of list) uniqueListAppServices.push(...item.apps.split(','));
      //
      modifyCheckboxOnTableSelectedChange(
        form,
        envAppServices,
        Array.from(new Set(uniqueListAppServices)),
        {
          setCheckedList,
          setSelectedProjApps,
        },
        Array.from(uniqueCheckList),
      );
    }
  }, [list, appServers]);

  const getTenantGlobalApps = async () => {
    const res = await OnlineSystemServices.getTenantGlobalApps();
    setAppServers(res);
  };

  const getRelatedStory = async () => {
    const res = await OnlineSystemServices.getRelatedStory({
      branch: computed?.branch,
    });

    setRelatedStory(res);
  };

  const getTableList = async () => {
    setSpin(true);
    try {
      const res = await OnlineSystemServices.getStoryList({
        branch: computed?.branch,
        onlyappr: true,
      });

      setList(res);
      // 新增 -默认勾选特性项目和sprint分支项目
      if (!props.data?.release_num) {
        setSelected(
          res?.flatMap(
            (it: any) => (['stagepatch', 'emergency'].includes(it.sprinttype) ? [] : [it]), // sprint
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
      const vs = v.split(',');
      allCluster = [...allCluster, ...vs];
    });

    const name =
      difference(allCluster, ['cn-northwest-0', 'cn-northwest-1'])?.length > 0
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
      // 这里不能加入灰度推生产的缓存，只有在点击保存后才有本张单据的缓存。
      // setTabsLocalStorage({
      //   "release_num": release_num,
      //   "release_name": release_num + "灰度推生产",
      //   "newAdd": true
      // });
      props.onOk?.({ ...baseData, release_num });
      return;
    }

    let time = (
      isEqual(values.cluster, ['cn-northwest-0'])
        ? dayjs().startOf('d').hour(10)
        : isEqual(values.cluster, ['cn-northwest-1'])
        ? dayjs().startOf('d').hour(22)
        : dayjs().startOf('d')
    ).format('YYYY-MM-DD HH:mm:ss');
    let name = `${release_num}${getReleaseName(values.cluster)}`;
    // 如果是修改的情况，则发布时间为获取的数据中的时间，创建的时候才为初始时间
    if (!isEmpty(props.data)) {
      time = props.data?.plan_release_time;
      name = props.data?.release_name;
    }

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
        hot_update_note: o.hot_update_note,
        is_data_update: o.db_update,
        data_update_note: o.data_update_note,
        apps: checkedList?.join(',') ?? '',
      })),
      release_num: release_num ?? '',
      release_name: name,
      plan_release_time: time,
    };

    try {
      await OnlineSystemServices.addRelease(data);
      setSpin(false);
      setTabsLocalStorage({
        release_num: release_num,
        release_name: name,
        newAdd: true,
      });

      props.onOk?.({ ...baseData, release_num });
    } catch (e) {
      errorMessage('接口异常');
      setSpin(false);
    }
  };

  const getReleseCluster = (v: string) => {
    const filtered: any = [];
    [...globalEnv].forEach((cluster: any) => {
      if (v === 'tenant') {
        if (cluster.key !== 'cn-northwest-global') {
          filtered.push(cluster);
        }
      } else {
        filtered.push(cluster);
      }
    });

    setReleaseCluster(filtered);
  };

  /**
   * 初始化的时候加载镜像环境
   * @param v  镜像环境
   * @param onlineBranch 上线分支
   */
  const showInitBranchEnv = async (v: string, onlineBranch: string) => {
    let branchEnv: any = [];
    // 20230721新需求 17469：
    // 如果是超级管理员，则不用依据上线分支获取镜像环境（取所有的镜像环境）
    if (user?.group === 'superGroup') {
      branchEnv = await preEnv(false);
    } else {
      const branch = await OnlineSystemServices.branchEnv({ branch: onlineBranch });
      branchEnv = branch?.map((it: string) => ({ label: it, value: it }));
      if (v === 'tenant') {
        // 不展示global的数据
        branchEnv = branchEnv.filter((it: any) => !it.label.includes('-global'));
      } else if (v === 'global') {
        // 只展示global的数据
        branchEnv = branchEnv.filter((it: any) => it.label.includes('-global'));
      }
    }

    totalBranchEnv = JSON.parse(JSON.stringify(branchEnv));
    setBranchEnv(branchEnv);
  };

  /**
   * 根据发布环境类型匹配不同的选项
   * @param v 发布环境类型
   */
  const getBranchEnv = async (v: string) => {
    if (user?.group === 'superGroup') {
      return;
    }

    const _branchEnv = JSON.parse(JSON.stringify(totalBranchEnv));
    if (v === 'tenant') {
      // 不展示global的数据
      setBranchEnv(_branchEnv.filter((it: any) => !it.label.includes('-global')));
    } else if (v === 'global') {
      // 只展示global的数据
      setBranchEnv(_branchEnv.filter((it: any) => it.label.includes('-global')));
    }
  };

  const onChange = async (v: string) => {
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
        .filter((it) => !['stagepatch', 'emergency', 'performpatch'].includes(it.sprinttype)) // sprint
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
      release_env: '',
      cluster:
        v == 'global' ? ['cn-northwest-global'] : memoColumn().isSprint ? ['cn-northwest-0'] : [],
      // : uniq(selectedData?.flatMap((it) => (it.cluster ? [it.cluster] : []))),
    });

    // 当“发布环境类型”选择“租户集群发布”时，发布集群列表要过滤掉global集群---需求：15086
    getReleseCluster(v);
    // 当“发布环境类型”选择“租户集群发布”时，镜像环境列表要过滤掉global集群，当选择global时，要过滤掉租户集群的id。-- 需求17469
    await getBranchEnv(v);
    setSelected(
      selectedData?.filter(
        (o) => intersection(o.apps?.split(','), appServers?.[values?.release_env_type])?.length > 0,
      ),
    );

    if (isEmpty(appServers?.[v])) return;
    const selectedApps: string[] = [];
    setList(
      list?.map((it: any) => {
        const apps: string[] = it.apps?.split(',');
        selectedApps.push(...apps);
        return {
          ...it,
          disabled: intersection(apps, appServers?.[v])?.length == 0,
        };
      }),
    );

    // checkbox关联修改
    modifyCheckboxOnTableSelectedChange(form, appServers?.[v] ?? [], selectedApps, {
      setCheckedList,
      setSelectedProjApps,
    });
  };

  const updateStatus = (column: string, data: any, status: string, index: number) => {
    const columnTitle = column === 'db_update' ? '是否涉及数据update' : '是否可热更';
    let inputValue = column === 'db_update' ? data.data_update_note : data.hot_update_note;
    let confirm = Modal.confirm({
      centered: true,
      title: `修改${columnTitle}提醒`,
      width: 500,
      content: (
        <div>
          <div>
            请确认是否将『执行名称：{data.pro_name ?? ''} 需求编号：{data.story ?? ''}』的
            {columnTitle} 状态调整为 {WhetherOrNot[status] ?? '-'}
          </div>
          <div>
            {/*<label>修改说明</label>*/}
            <Input
              addonBefore={
                <div>
                  <span>修改说明</span>
                  <span style={{ color: 'red', marginLeft: 5 }}>*</span>
                </div>
              }
              defaultValue={inputValue}
              onChange={(e: any) => {
                inputValue = e.target.value;
              }}
            />
          </div>
        </div>
      ),

      onOk: async (e) => {
        // 如果需要点击ok后，不满足条件不关闭的话，就必须写这个参数

        if (isEmpty(inputValue)) {
          errorMessage('修改说明不能为空!', 2);
          return;
        }

        const _list = list[index];
        // 先更新后端，后端更新成功再更新这个界面上的值
        const updateResult = await OnlineSystemServices.updateListColumn({
          // "release_num": "202305250008", 可以不传
          execu_no: _list.pro_id,
          story_no: _list.story,
          user_id: user?.userid ?? '',
          datas: [
            {
              label_en: column === 'db_update' ? 'is_data_update' : 'is_hot_update',
              old_value: column === 'db_update' ? _list.db_update : _list.is_update,
              new_value: status,
              note: inputValue,
            },
          ],
        });
        if (updateResult.code === 200) {
          sucMessage(
            `${column === 'db_update' ? '是否涉及数据update' : '是否可热更'}状态修改成功！`,
          );
          // 更新是否值（是否数据update，是否热更）
          _list[column] = status;
          // 更新说明值
          const descColumn = column === 'db_update' ? 'data_update_note' : 'hot_update_note';
          _list[descColumn] = inputValue;

          // 重新设置数据源
          setList([...list]);

          // 还要更新selected中的数据
          const _selected: any = [];
          // 根据story ID 判断是否存在同一个
          [...selected].forEach((e: any) => {
            if (e.story === _list.story) {
              _selected.push(_list);
            } else {
              _selected.push(e);
            }
          });
          setSelected(_selected);
          confirm.destroy();
        }
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

  const memoEdit = useMemo(() => {
    if (props.data) {
      console.log('此处获取checklist数据！', appServers, selected);
    }
    return {
      global: globalState.locked || globalState.finished,
      update: !isEmpty(props.data?.release_num), // 新增、修改
    };
  }, [globalState, props.data]);

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
    const isSprint = list?.every(
      (it) => !['emergency', 'stagepatch', 'performpatch'].includes(it.sprinttype),
    );
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
              ellipsis: { showTitle: false },
              width: 500,
              fixed: 'left',
              render: (v: string) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '应用服务',
              dataIndex: 'apps',
              width: 400,
              ellipsis: { showTitle: false },
              render: (v: string) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
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
              ellipsis: { showTitle: false },
              width: 200,
              fixed: 'left',
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
              width: 150,
              ellipsis: { showTitle: false },
              render: (v: string) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '需求阶段',
              dataIndex: 'status',
              width: 90,
              ellipsis: { showTitle: false },
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
              // width: 150,
              // render: (v: string) => WhetherOrNot[v] ?? (v || ''),
              render: (v: string, row: any, i: number) =>
                v == '-' ? (
                  v
                ) : (
                  <Select
                    disabled={
                      user?.group !== 'superGroup' ||
                      (memoEdit.update ? memoEdit.global : memoEdit.update) ||
                      !hasPermission.dbUpdate
                    }
                    value={v}
                    style={{ width: '100%' }}
                    options={Object.keys(WhetherOrNot)?.map((k) => ({
                      value: k,
                      label: WhetherOrNot[k],
                    }))}
                    onChange={(e) => updateStatus('db_update', row, e, i)}
                  />
                ),
            },
            // {
            //   title: '是否涉及数据Recovery',
            //   dataIndex: 'is_recovery',
            //   render: (v: string) => WhetherOrNot[v] ?? (v || ''),
            // },
            {
              title: '是否可热更',
              dataIndex: 'is_update',
              width: 90,
              render: (v: string, row: any, i: number) =>
                v == '-' ? (
                  v
                ) : (
                  <Select
                    disabled={
                      user?.group !== 'superGroup' ||
                      (memoEdit.update ? memoEdit.global : memoEdit.update) ||
                      !hasPermission.hotUpdate
                    }
                    value={v}
                    style={{ width: '100%' }}
                    options={Object.keys(WhetherOrNot)?.map((k) => ({
                      value: k,
                      label: WhetherOrNot[k],
                    }))}
                    onChange={(e) => updateStatus('is_update', row, e, i)}
                  />
                ),
            },
            { title: '需求创建人', dataIndex: 'opened_by', width: 100 },
            { title: '需求指派人', dataIndex: 'ass_to', width: 100 },
            {
              title: '数据update修改说明',
              dataIndex: 'data_update_note',
              width: 150,
              ellipsis: { showTitle: false },
              render: (v: string) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '是否可热更修改说明',
              dataIndex: 'hot_update_note',
              width: 150,
              ellipsis: { showTitle: false },
              render: (v: string) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
          ],
    };
  };

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
      onCancel={() => {
        totalBranchEnv = [];
        props.onOk?.();
      }}
      footer={[
        <Button onClick={showLog} hidden={!memoEdit.update}>
          查看日志
        </Button>,
        <Button
          onClick={() => {
            totalBranchEnv = [];
            props.onOk?.();
          }}
        >
          取消
        </Button>,
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
                  rules={[{ required: true, message: '请选择发布类型！' }]}
                >
                  <Select
                    disabled={memoEdit.update}
                    options={[
                      { label: '非积压发布', value: '1' },
                      { label: '灰度推线上', value: '2' },
                    ]}
                  />
                </Form.Item>
              </Col>
              {computed?.type == '1' && (
                <Col span={12}>
                  <Form.Item
                    label={'上线分支'}
                    name={'branch'}
                    rules={[{ required: true, message: '请选择发布类型！' }]}
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
                      rules={[{ required: true, message: '请选择发布环境' }]}
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
                              options={releaseCluster}
                              placeholder={'发布集群'}
                              disabled={
                                (memoEdit.update ? memoEdit.global : memoEdit.update) ||
                                env == 'global' ||
                                (memoColumn()?.isSprint && env == 'tenant')
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
                      rules={[{ required: true, message: '请选择镜像环境绑定' }]}
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
                {selectedProjApps !== undefined ? (
                  <Row justify={'space-between'} gutter={8}>
                    <Col span={24}>
                      <Form.Item
                        name={'app_services'}
                        label={'应用服务'}
                        rules={[{ required: true }]}
                        initialValue={selectedProjApps}
                      >
                        <Checkbox.Group
                          options={selectedProjApps}
                          onChange={(checkedValues: CheckboxValueType[]) =>
                            onFormCheckboxChange({
                              form,
                              list,
                              selected,
                              setSelected,
                              checkedList,
                              checkedValues,
                              setCheckedList,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  ''
                )}
              </Form>
              <div className={styles.onlineTable}>
                <Table
                  size={'small'}
                  scroll={{ y: 400, x: 500 }}
                  pagination={false}
                  columns={memoColumn().column}
                  rowKey={(p) => `${p.story}&${p.pro_id}`}
                  dataSource={list}
                  rowSelection={{
                    selectedRowKeys: selected?.map((p) => `${p.story}&${p.pro_id}`),
                    onChange: (_, selectedRows) =>
                      onTableCheckboxChange({
                        form,
                        selected,
                        appServers,
                        checkedList,
                        setSelected,
                        selectedRows,
                        setCheckedList,
                      }),
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
              <p style={{ marginTop: 8 }}>
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
