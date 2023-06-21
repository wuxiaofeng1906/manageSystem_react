import styles from '../config/common.less';
import React, {
  forwardRef, useRef, useState,
  useMemo, useImperativeHandle, useEffect,
} from 'react';
import {
  Col, DatePicker, Form, Input, Select, Spin,
  Row, Space, Modal, InputNumber, ModalFuncProps, Cascader,
} from 'antd';
import {AgGridReact} from 'ag-grid-react';
import {CellClickedEvent, GridApi} from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import {errorMessage} from '@/publicMethods/showMessages';
import {useModel} from '@@/plugin-model/useModel';
import {getDevOpsOrderColumn, PublishSeverColumn, PublishUpgradeColumn} from '@/pages/onlineSystem/config/column';
import {
  AutoCheckType, ClusterType, onLog, OrderExecutionBy,
  PublishWay, WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';
import {history, useLocation, useParams} from 'umi';
import {Prompt} from 'react-router-dom';
import {initGridTable} from '@/utils/utils';
import AnnouncementServices from '@/services/announcement';
import PreReleaseServices from '@/services/preRelease';
import {OnlineSystemServices} from '@/services/onlineSystem';
import moment from 'moment';
import {isEmpty, omit, isString, pick, isEqual} from 'lodash';
import {InfoCircleOutlined} from '@ant-design/icons';
import {ModalSuccessCheck} from '@/pages/onlineSystem/releaseProcess/ReleaseOrder';
import usePermission from '@/hooks/permission';
import ICluster from '@/components/ICluster';
import {setTabsLocalStorage, vertifyClusterStatus} from "@/pages/onlineSystem/commonFunction";

let agFinished = false; // 处理ag-grid
let agSql: any[] = [];
let agBatch: any[] = [];
let databaseVersion: any[] = [];

const SheetInfo = (props: any, ref: any) => {
  const {tab, subTab} = useLocation()?.query as { tab: string; subTab: string };
  const {release_num} = useParams() as { release_num: string };
  const {onlineSystemPermission} = usePermission();
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [envs] = useModel('env', (env) => [env.globalEnv]);
  const [globalState, sqlList, draft, setGlobalState, getLogInfo, setDraft] =
    useModel('onlineSystem', (online) => [online.globalState, online.sqlList,
      online.draft, online.setGlobalState, online.getLogInfo, online.setDraft, online.getReleaseInfo, online.basic, online.api]);
  const {devOpsOrderInfo, getDevOpsOrderInfo} = useModel('onlineSystem');


  const [spinning, setSpinning] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  // const [tableHeight, setTableHeight] = useState((window.innerHeight - 460) / 2);
  const [baseForm] = Form.useForm(); // 工单基础
  const [orderForm] = Form.useForm();
  const [sqlForm] = Form.useForm();
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [upgradeData, setUpgradeData] = useState<{
    upgrade_api: any[];
    release_app: any;
    basic_data: any;
    status: 'draft' | 'save';
  } | null>();
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [leaveShow, setLeaveShow] = useState(false);

  const serverRef = useRef<GridApi>();
  const upgradeRef = useRef<GridApi>();
  // 运维工单信息
  const devOpsRef = useRef<GridApi>();

  useImperativeHandle(ref, () => ({onSave: onSaveBeforeCheck}), [
    release_num,
    upgradeData,
    deployments,
  ]);

  const onSave = async (flag = false) => {
    if (isEmpty(upgradeData)) return errorMessage('工单基础信息获取异常，请刷新重试');
    // const upgrade_api = upgradeRef.current?.getRenderedNodes()?.map((it) => it.data)?.map((it) => ({
    //       ...it,
    //       concurrent: it.concurrent ?? 20,
    //       api_header: it.api_header ?? '',
    //     })) || [];
    const upgrade_api: any = [];
    upgradeRef.current?.forEachNode((it: any) => {
      upgrade_api.push({
        ...it.data,
        concurrent: it.data.concurrent ?? 20,
        api_header: it.data.api_header ?? '',
      })
    });
    const release_app = serverRef.current?.getRenderedNodes()?.map((it) => it.data) || [];
    const baseValues = baseForm.getFieldsValue();
    const orderValues = orderForm.getFieldsValue();
    const sqlValues = sqlForm.getFieldsValue();
    await OnlineSystemServices.updateOrderDetail({
      ready_release_num: release_num,
      user_id: user?.userid,
      upgrade_api,
      deployment: deployments?.flatMap((it) =>
        baseValues.deployment.includes(String(it.value))
          ? [
            {
              deployment_id: it.deployment_id,
              app: it.app,
              deployment_time: it.deployment_time,
            },
          ]
          : [],
      ),
      basic_data: {
        ready_release_name: baseValues?.ready_release_name,
        plan_release_time: orderValues?.plan_release_time
          ? moment(orderValues.plan_release_time).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        release_way: orderValues?.release_way ?? '',
        branch: upgradeData?.basic_data?.branch,
        release_type: upgradeData?.basic_data?.release_type,
        project: upgradeData?.basic_data?.project,
        announcement_num: orderValues?.announcement_num ?? '',
        person_duty_num: orderValues?.person_duty_num ?? '',
        release_result: orderValues?.release_result ?? 'unknown',
        need_auto: baseValues?.need_auto ?? '',
        auto_env: baseValues?.auto_env?.join(',') ?? '',
      },
      release_app: {
        ...release_app?.[0],
        cluster: isString(release_app?.[0]?.cluster)
          ? release_app?.[0]?.cluster
          : release_app?.[0]?.cluster?.join(','),
        database_version: release_app?.[0]?.database_version ?? '',
        batch: release_app?.[0]?.batch ?? '',
        sql_order:
          release_app?.[0]?.sql_order?.map(([sql_order, sql_action_time]: string[]) => ({
            sql_order,
            sql_action_time,
          })) ?? [],
      },
    });
    setLeaveShow(false);
    if (!flag) {
      await getDetail();
    }
  };

  const onDrag = async () => {
    if (agFinished) return errorMessage('已标记发布结果不能修改工单顺序!');
    if (!leaveShow) setLeaveShow(true);
  };


  useEffect(() => {
    if (subTab == 'sheet' && tab == 'process' && release_num) {
      getBaseList();
      getDetail();
      getDevOpsOrderInfo({release_num}); // 获取运维工单信息
    }
  }, [subTab, tab, release_num, globalState.finished]);

  useEffect(() => {
    if (!isEmpty(sqlList)) {
      agSql = sqlList;
    }
  }, [sqlList]);

  const getDetail = async () => {
    setSpinning(true);
    try {
      // 因为结果前提需要依靠这里面的数据，所以需要写在这里（获取所有的数据库版本和batch版本）
      const database = await OnlineSystemServices.databaseVersion();
      databaseVersion = database?.map((it: string) => ({label: it, value: it}));
      const batch = await OnlineSystemServices.getBatchVersion({release_num});
      agBatch = batch?.map((it: string) => ({label: it, value: it})) ?? [];

      // 工单信息的初始化数据(获取界面数据，被删除也要展示)
      let param: any = {release_num, include_deleted: true};
      // if (globalState.finished) {
      //   param = {release_num, include_deleted: true}
      // }
      let res = await OnlineSystemServices.getOrderDetail(param);
      const basicInfo = res?.basic_data;
      orderForm.setFieldsValue({
        ...basicInfo,
        plan_release_time: basicInfo?.plan_release_time
          ? moment(basicInfo?.plan_release_time)
          : null,
        release_result:
          basicInfo?.release_result == 'unknown'
            ? undefined
            : basicInfo?.release_result?.trim() || undefined,
        announcement_num: basicInfo?.announcement_num || undefined,
        person_duty_num: basicInfo?.person_duty_num ?? '免',
      });
      baseForm.setFieldsValue({
        ...res?.basic_data,
        release_type: basicInfo?.release_type
          ? `${PublishWay[basicInfo?.release_type?.release_way]}:${
            ClusterType[basicInfo?.release_type?.release_type]
          }`
          : '',
        deployment: res?.deployment?.map((it: any) => String(it.deployment_id)),
        auto_env:
          basicInfo?.need_auto == 'no'
            ? []
            : basicInfo?.auto_env
            ? basicInfo?.auto_env?.split(',')
            : [],
        need_auto: basicInfo?.need_auto || undefined,
      });

      agFinished = basicInfo.is_delete ? true : !isEmpty(basicInfo?.release_result?.trim()) && basicInfo?.release_result !== 'unknown';

      setDraft(res?.status !== 'save');
      setGlobalState({
        step: finished ? 2 : globalState.step,
        locked: finished ? true : globalState?.locked,
        finished: agFinished,
      });
      setLeaveShow(false);
      setFinished(agFinished);
      //--------------- res中，batch版本和数据库版本需要用来默认为获取的数据中的第一个
      const service = res.release_app;
      // 如果获取的batch数组有数据，并且表格返回的batch没有数据，则默认为数组的第一个值。
      if (batch && batch.length > 0 && (isEmpty(service.batch) || service.batch === "-")) {
        service.batch = batch[0];
      }
      // 如果获取的batch数组有数据，并且表格返回的batch没有数据，则默认为数组的第一个值。
      if (database && database.length > 0 && (isEmpty(service.database_version) || service.database_version === "-")) {
        service.database_version = database[0];
      }
      setUpgradeData({...res, release_app: service});
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  const getBaseList = async () => {
    const order = await PreReleaseServices.dutyOrder();
    setDutyList(
      order?.map((it: any) => ({
        label: it.duty_name ?? '',
        value: it.person_duty_num,
        key: it.person_duty_num,
      })),
    );
    const announce = await AnnouncementServices.preAnnouncement();
    setAnnouncementList(
      announce.map((it: any) => ({
        label: it.announcement_name,
        value: it.announcement_num,
        key: it.announcement_num,
      })),
    );
    const deployIds = await OnlineSystemServices.deployments({release_num});
    setDeployments(
      deployIds?.map((it: any) => ({
        label: `${it.deployment_id}(${it.app ?? ''} ${it.check_start_time ?? ''})`,
        value: String(it.deployment_id),
        deployment_id: it.deployment_id,
        app: it.app,
        deployment_time: it.check_start_time ?? '',
      })),
    );
  };

  const onSaveBeforeCheck = async (isAuto = false) => {

    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const result = order.release_result;
    if (isAuto && (isEmpty(result) || result == 'unknown')) return;
    const serverInfo = serverRef.current?.getRenderedNodes()?.map((it) => it.data) || [];
    const ignore = ['release_result'];
    if (base.need_auto == 'no') ignore.push('auto_env');

    let valid = false;
    const checkResult = !['failure', 'draft'].includes(order.release_result);
    const checkObj = omit({...order, ...base}, ignore);
    let showErrTip = '';
    const errTip = {
      plan_release_time: '请填写发布时间!',
      announcement_num: '请填写关联公告！',
      person_duty_num: '请填写值班名单',
      ready_release_name: '请填写工单名称!',
      deployment: '请填写一键部署ID',
      release_way: '请填写发布方式',
      need_auto: '请填写是否需要跑升级后自动化',
      auto_env: '请填写是否升级后自动化环境',
      cluster: '请填写发布环境',
      clear_redis: '请填写是否清理redis缓存',
      batch: '请填写batch版本',
      // database_version: '请填写数据库版本',
      is_recovery: '请填写是否涉及数据Recovery',
      is_update: '请填写是否数据update',
      clear_cache: '请填写是否清理应用缓存',

    };

    // 发布成功、unknown-> 数据完整性校验
    if (checkResult) {
      // 基础信息
      valid = Object.values(checkObj).some((it) => isEmpty(it));
      if (valid) {
        const errArr = Object.entries(checkObj).find(([k, v]) => isEmpty(v)) as any[];
        showErrTip = errTip[errArr?.[0]];
      } else if (isEmpty(base.ready_release_name?.trim())) {
        showErrTip = errTip.ready_release_name;
      }
      // 服务信息
      else if (!isEmpty(serverInfo)) {
        const checkItem = ['cluster', 'clear_redis', 'clear_cache'];  // 暂时不需要 sql_order，database_version 判定
        // 如果一键部署ID中有batch服务，那么列表中的batch服务就不能为空。这里就需要来判断
        const deployment = baseForm.getFieldValue("deployment");
        [...deployments].map((it: any) => {
          if (deployment.includes((it.deployment_id).toString()) && (it.app).includes("batch")) {
            checkItem.push("batch");
          }
        });
        const enties = Object.entries(pick(serverInfo?.[0], checkItem));
        const err: any = enties.find(([k, v]) => {
          // batch 没数据的时候是-
          return isEmpty(v) || v === "-";
        });

        if (!isEmpty(err)) {
          showErrTip = errTip[err?.[0]];
        }
      }
    }
    if (showErrTip) {
      orderForm.setFieldsValue({release_result: null});
      return errorMessage(showErrTip);
    }

    // 发布结果为空，直接保存
    if (isEmpty(result?.trim()) || result == 'unknown') {
      onSave();
    } else {
      // 还要验证运维那边的状态,任务编号：115841
      // 当为“停机”发布时，调用运维环境判定API，如果对应环境有非成功的状态，就提示请联系运维确认xxxx环境是否可用，在进行发布结果标记
      if (order.release_way === "stop_server" && serverInfo && serverInfo.length) {
        // 如果是停服的话需要验证集群状态才标记发布结果
        const continueFlag = await vertifyClusterStatus(serverInfo[0].cluster);
        if (!continueFlag) {
          return;
        }
      }

      // 二次确认标记发布结果
      const tips = {
        draft: {
          title: '置为草稿提醒',
          content: '置为草稿将还原到初始生成工单信息,请确认是否置为草稿?',
        },
        success: {title: '发布成功提醒', content: '请确认是否标记发布成功?'},
        failure: {title: '发布失败提醒', content: '请确认是否标记发布失败?'},
      };
      if (result == 'success') {
        setSuccessModal(true);
      } else {
        setLeaveShow(false);
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          centered: true,
          title: tips[result].title,
          content: tips[result].content,
          icon: <InfoCircleOutlined style={{color: result == 'cancel' ? 'red' : '#1585ff'}}/>,
          okButtonProps: {disabled: confirmDisabled},
          onOk: async () => {
            setConfirmDisabled(true);
            try {
              if (result == 'draft') {
                await OnlineSystemServices.removeOrder({release_num, user_id: user?.userid});
                await getDetail();
              } else {
                await onSave(true);// 发布失败
                //   清除Tab缓存（置为草稿不需要清缓存）
                setTabsLocalStorage({release_num}, "delete");
              }
              setConfirmDisabled(false);

            } catch (e) {
              setConfirmDisabled(false);
            }
            result !== 'draft' && history.replace(`/onlineSystem/releaseProcess`);
          },
          onCancel: () => {
            orderForm.setFieldsValue({release_result: null});
          },
        });
      }
    }
  };

  // 确认发布成功
  const onSuccessConfirm = async (data: any) => {

    const announce = baseForm.getFieldValue('announcement_num');
    if (isEmpty(data)) {
      orderForm.setFieldsValue({release_result: null});
      setSuccessModal(false);
    } else {
      let params: any[] = [];
      const ignoreCheck = data.ignoreCheck;
      Object.keys(AutoCheckType).forEach((type) => {
        params.push({
          user_id: user?.userid ?? '',
          ignore_check: ignoreCheck ? 'yes' : 'no',
          check_time: 'after',
          check_result: data.checkResult?.includes(type) ? 'yes' : 'no',
          check_type: type,
          ready_release_num: release_num ?? '',
        });
      });
      await onSave(true);
      agFinished = true;
      setFinished(true);
      await PreReleaseServices.automation(params);
      // 获取集群
      const release_app = serverRef.current?.getRenderedNodes()?.map((it) => it.data) || [];
      const clusters = (release_app?.[0]?.cluster).split(",");

      // 关联公告并勾选挂起公告
      if (!isEmpty(announce) && announce !== '免' && data.announcement) {
        await PreReleaseServices.saveAnnouncement({
          user_id: user?.userid ?? '',
          announcement_num: orderForm.getFieldValue('announcement_num'),
          // announcement_time: 'after',
          cluster_ids: clusters,
        });
      }

      // 发布类型为停机发布 并且 包含租户集群才调用开放租户接口  （cn-northwest-global）
      if (orderForm.getFieldValue("release_way") === "stop_server" && !isEqual(clusters, ["cn-northwest-global"])) {
        await PreReleaseServices.releasetenants({env_name_list: clusters});
      }

      // 清除tab缓存
      setSuccessModal(false);
      //   清除Tab缓存
      setTabsLocalStorage({release_num}, "delete");
      history.replace('/onlineSystem/releaseProcess');
    }
  };
  const showLog = async () => {
    const res = await getLogInfo({release_num, options_model: 'online_system_manage_rd_repair'});
    onLog({
      title: '工单接口日志',
      log: isEmpty(res) ? '' : '工单',
      noData: '暂无工单接口日志',
      content: (
        <div>
          {res?.map((it: any, index: number) => (
            <div key={index}>
              {it.create_time}
              {it.operation_content}
            </div>
          ))}
        </div>
      ),
    });
  };

  const hasPermission = useMemo(onlineSystemPermission, [user?.group]);

  useEffect(() => {
    const listener = (ev: any) => {
      ev.preventDefault();
      ev.returnValue = '离开提示';
    };
    if (leaveShow && subTab == 'sheet' && tab == 'process') {
      window.addEventListener('beforeunload', listener);
    }
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [leaveShow, tab, subTab]);

  useEffect(() => {
    if (tab == 'profile') {
      window.onresize = null;
      return;
    }
    // window.onresize = function () {
    //   setTableHeight((window.innerHeight - 460) / 2);
    // };
    return () => {
      window.onresize = null;
    };
  }, [subTab, tab]);

  const computedServer = useMemo(() => PublishSeverColumn(upgradeData?.basic_data), [
    upgradeData?.basic_data,
  ]);

  const renderSelect = (p: CellClickedEvent) => {
    const field = p.column.colId as string;
    if (field == 'sql_order') {
      return (
        <Cascader
          multiple={true}
          size={'small'}
          style={{width: '100%'}}
          disabled={agFinished}
          expandTrigger="hover"
          allowClear={false}
          value={isEmpty(p.value) ? [] : p.value}
          displayRender={(labels: string[], selectedOptions: any[]) =>
            labels?.map((label, i) => (
              <span key={selectedOptions[i]?.value}>
                {i === labels.length - 1 ? `(${label})` : label}
              </span>
            ))
          }
          options={(agSql || sqlList)?.map((it) => ({
            ...it,
            children: Object.entries(OrderExecutionBy)?.map(([k, v]) => ({
              label: v,
              value: k,
              // key: v,  key会影响选择数据
            })),
          }))}
          onChange={(v) => {
            updateFieldValue(p, v);
            if (!leaveShow) setLeaveShow(true);
          }}
        />
      );
    }
    // 获取展示的value
    // let cellValue = p.value;
    // if (isEmpty(p.value) || p.value === "-") {
    //   if (field === 'database_version' && databaseVersion && databaseVersion.length) {
    //     cellValue = databaseVersion[0];
    //   } else if (field === 'batch' && agBatch && agBatch.length) {
    //     cellValue = agBatch[0];
    //   } else {
    //     cellValue = "-";
    //   }
    // }

    return (
      <div className={styles.antSelectStyle}>
        <Select
          size={'small'}
          value={isEmpty(p.value) ? undefined : p.value}
          // value={ // 如果原始值为空的话，则展示最新的第一条数据，不为空的话展示后端传输的数据
          //   (isEmpty(p.value) || p.value === "-")
          //     ? field === 'database_version'
          //     ? databaseVersion[0] : field === 'batch'
          //       ? agBatch[0] : undefined : p.value}
          style={{width: '100%'}}
          disabled={agFinished}
          // allowClear={['batch', 'database_version'].includes(field)}
          dropdownMatchSelectWidth={false}
          options={
            field === 'database_version'
              ? databaseVersion
              : field === 'batch'
              ? agBatch
              : Object.keys(WhetherOrNot)?.map((k) => ({
                value: k,
                label: WhetherOrNot[k],
              }))
          }
          onChange={(v) => {
            updateFieldValue(p, v);
            if (!leaveShow) setLeaveShow(true);
          }}
        />
      </div>

    );
  };

  const updateFieldValue = (p: CellClickedEvent, v?: string) => {
    const rowNode = serverRef.current?.getRowNode(String(p.rowIndex));
    rowNode?.setData({...p.data, [p.column.colId]: v});
  };

  useEffect(() => {
    if (globalState?.finished) {
      agFinished = true;
      setFinished(true);
    }
  }, [globalState?.finished]);

  // 对比 集群 、 应用 、 升级接口 是否相同
  const checkData = async () => {
    // 历史记录不再检查
    if (globalState?.finished) {
      return;
    }

    const currentPage = JSON.parse(JSON.stringify({...upgradeData}));
    let module = "";
    // -------------------------------------------------------basicData 中可以对比集群和应用
    const basicData = await OnlineSystemServices.getBasicInfo({release_num});
    if (basicData) {
      //   对比集群
      if (basicData.cluster !== currentPage.release_app?.cluster) {
        module = "上线集群";
      }
      //   对比应用服务
      if (basicData.apps !== currentPage.release_app?.apps) {
        module = module ? `${module}、应用服务` : "应用服务";
      }

    }

    // -----------------------------------------------------api 中对比升级接口

    const apiData = await OnlineSystemServices.getUpgradeInfo({release_num});
    const _newApi: any[] = []; // 过程详情中的api
    const _newCurrentApi: any[] = []; // 工单信息中的api

    // 将两个接口字段缩减为一样的。
    if (apiData && apiData.length) {
      apiData.forEach((e: any) => {
        delete e._id;
        delete e.ready_release_num;
        delete e.author;
        _newApi.push(e);
      });
    }

    if ((currentPage?.upgrade_api) && (currentPage?.upgrade_api).length) {
      (currentPage?.upgrade_api).forEach((e: any) => {
        delete e.concurrent;
        _newCurrentApi.push(e);
      });

    }

    // 有差异的API数据
    let differenceApi: any[] = [];
    if (_newApi.length !== _newCurrentApi.length) {
      module = module ? `${module}、升级接口` : "升级接口";

      if (_newCurrentApi.length > _newApi.length) {
        differenceApi = _newCurrentApi.filter(v => {
          return _newApi.every(e => e.api_url != v.api_url);
        });
      } else {
        differenceApi = _newApi.filter(v => {
          return _newCurrentApi.every(e => e.api_url != v.api_url);
        });
      }
      console.log("不同的API", differenceApi);
    }


    if (module) {
      Modal.error({
        title: '工单信息一致性校验',
        centered: true,
        width: 550,
        content: <div style={{textIndent: "2em"}}>项目与服务详情中的
          <label style={{color: "red"}}>【{module}】</label>与当前工单中
          <label style={{color: "red"}}>【{module}】</label>的内容不一致,请联系对应的SQA值班负责人！
          {/*{JSON.stringify(differenceApi)}*/}
        </div>,
      });
    }
  };

  // 工单生成之后校验数据
  useEffect(() => {
    if (upgradeData) {
      checkData();
    }

  }, [upgradeData]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Prompt
        when={leaveShow && subTab == 'sheet'}
        message={'离开当前页后，所有未保存的数据将会丢失，请确认是否仍要离开？'}
      />
      <div>
        <Form
          size={'small'}
          form={orderForm}
          className={styles.bgForm + ' ' + styles.resetForm + ' no-wrap-form'}
          onFieldsChange={() => {
            if (!leaveShow) setLeaveShow(true);
          }}
        >
          <Row gutter={3}>
            <Col span={4}>
              <Form.Item name={'release_way'} label={'发布方式'}>
                <Select
                  disabled
                  style={{width: '100%'}}
                  options={Object.keys(PublishWay)?.map((it) => ({
                    label: PublishWay[it],
                    value: it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name={'plan_release_time'} label={'发布时间'}>
                <DatePicker
                  style={{width: '100%'}}
                  format={'YYYY-MM-DD HH:mm'}
                  allowClear={false}
                  showTime
                  disabled={finished}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'announcement_num'} label={'关联公告'} required>
                <Select
                  showSearch
                  disabled={finished}
                  optionFilterProp={'label'}
                  options={[{key: '免', value: '免', label: '免'}].concat(announcementList)}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'person_duty_num'} label={'值班名单'}>
                <Select
                  showSearch
                  disabled={finished}
                  optionFilterProp={'label'}
                  options={[{key: '免', value: '免', label: '免'}].concat(dutyList)}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                noStyle
                shouldUpdate={(old, current) => old.release_result != current.release_result}
              >
                {({getFieldValue}) => {
                  const result = getFieldValue('release_result');
                  const color = {success: '#2BF541', failure: 'red'};
                  return (
                    <Form.Item name={'release_result'}>
                      <Select
                        allowClear
                        disabled={!hasPermission.orderPublish || draft || finished}
                        className={styles.selectColor}
                        onChange={() => onSaveBeforeCheck(true)}
                        options={[
                          {label: '发布成功', value: 'success', key: 'success'},
                          {label: '发布失败', value: 'failure', key: 'failure'},
                          {label: '置为草稿', value: 'draft', key: 'draft'},
                          {label: ' ', value: 'unknown', key: 'unknown'},
                        ]}
                        style={{
                          width: '100%',
                          fontWeight: 'bold',
                          color: color[result] ?? 'initial',
                        }}
                        placeholder={
                          <span style={{color: '#00bb8f', fontWeight: 'initial'}}>
                            标记发布结果
                          </span>
                        }
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <h4 style={{margin: '16px 0'}}>一、工单-基础设置</h4>
        <Form
          size={'small'}
          form={baseForm}
          className={styles.resetForm + ' no-wrap-form'}
          onFieldsChange={() => {
            if (!leaveShow) setLeaveShow(true);
          }}
        >
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'branch'} label={'预发布分支'}>
                <Input style={{width: '100%'}} disabled/>
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item name={'project'} label={'预发布项目'}>
                <Input style={{width: '100%'}} disabled/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'release_type'} label={'工单类型选择'} required>
                <Select
                  showSearch
                  disabled
                  options={Object.keys(ClusterType).map((k) => ({
                    label: ClusterType[k],
                    value: k,
                  }))}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'ready_release_name'} label={'工单名称'} required>
                <Input style={{width: '100%'}} disabled={finished}/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'need_auto'} label={'是否需要跑升级后自动化'}>
                <Select
                  disabled={finished}
                  style={{width: '100%'}}
                  options={Object.keys(WhetherOrNot).map((it) => ({
                    label: WhetherOrNot[it],
                    value: it,
                  }))}
                  onChange={(v) => {
                    if (v == 'no') {
                      baseForm.setFieldsValue({auto_env: undefined});
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item noStyle shouldUpdate={(pre, next) => pre.need_auto != next.need_auto}>
                {({getFieldValue}) => {
                  const needAuto = getFieldValue('need_auto') == 'yes';
                  return (
                    <Form.Item name={'auto_env'} label={'跑升级后自动化环境'} required={needAuto}>
                      <Select disabled={finished || !needAuto} options={envs} mode={'multiple'}/>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item name={'deployment'} label={'一键部署ID'} required>
              <Select
                mode={'multiple'}
                showSearch
                allowClear
                disabled={finished}
                options={deployments}
              />
            </Form.Item>
          </Col>
        </Form>
        <h4 style={{margin: '16px 0'}}>二、发布服务</h4>
        <div style={{
          height: 200,
          width: '100%', marginTop: 8
        }}>
          <AgGridReact
            columnDefs={computedServer}
            rowData={ // 发布服务 表格数据只有1行，可以定死表格高度
              isEmpty(upgradeData?.release_app) ? [] : [
                {
                  ...upgradeData?.release_app,
                  sql_order: isEmpty(upgradeData?.release_app?.sql_order)
                    ? []
                    : upgradeData?.release_app?.sql_order?.map((it: any) => [
                      it.sql_order,
                      it.sql_action_time,
                    ]),
                },
              ]
            }
            {...initGridTable({ref: serverRef, height: 30, otherDefault: {wrapText: true, autoHeight: true}})}
            frameworkComponents={{
              select: renderSelect,
              ICluster: (p: any) => <ICluster data={p.value}/>,
            }}
          />
        </div>
        {upgradeData?.basic_data?.release_type?.release_way !== 'keep_server' && (
          <>
            <h4 style={{margin: '16px 0'}}>
              三、升级接口
              <img
                title={'日志'}
                src={require('../../../../public/logs.png')}
                style={{
                  width: 18,
                  height: 18,
                  cursor: 'pointer',
                }}
                onClick={showLog}
              />
            </h4>
            <div style={{
              height: 300,
              width: '100%'
            }}>
              <AgGridReact
                rowDragManaged={!finished}
                animateRows={true}
                onRowDragEnd={onDrag}
                columnDefs={PublishUpgradeColumn}
                rowData={upgradeData?.upgrade_api ?? []}
                // 超出范围换行显示
                {...initGridTable({ref: upgradeRef, height: 30, otherDefault: {wrapText: true, autoHeight: true}})}
                frameworkComponents={{
                  operation: (p: CellClickedEvent) => (
                    <Space size={8}>
                      <img
                        title={'编辑'}
                        src={require('../../../../public/edit.png')}
                        style={{
                          width: 18,
                          height: 18,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setVisible(true);
                          setActiveItem({...p.data, rowIndex: String(p.rowIndex)});
                        }}
                      />
                      {DragIcon(p)}
                    </Space>
                  ),
                }}
              />
            </div>
          </>
        )}

        <div style={{display: devOpsOrderInfo.length > 0 ? "inline" : "none"}}>
          <div style={{marginTop: 20,}}>
            <h4>四、运维工单信息</h4>
          </div>
          <div
            style={{
              width: '100%',
              maxHeight: 100,
              minHeight: 50,
              height: devOpsOrderInfo?.length * 40 + 30,
            }}
          >
            <AgGridReact
              columnDefs={getDevOpsOrderColumn()}
              rowData={devOpsOrderInfo}
              {...initGridTable({
                ref: devOpsRef,
                height: 30,
              })}
            />
          </div>
        </div>

        <EditModal
          visible={visible}
          data={activeItem}
          onOk={(v) => {
            if (v) {
              const rowNode = upgradeRef.current?.getRowNode(activeItem.rowIndex);
              rowNode?.setData({...activeItem, concurrent: v.concurrent});
              if (!leaveShow) setLeaveShow(true);
            }
            setVisible(false);
          }}
        />
        <ModalSuccessCheck
          visible={successModal}
          onOk={(v?: any) => onSuccessConfirm(v)}
          announce={orderForm.getFieldValue('announcement_num')}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(SheetInfo);

const EditModal = (props: ModalFuncProps & { data: any }) => {
  const [form] = Form.useForm();
  const [globalState] = useModel('onlineSystem', (online) => [online.globalState]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    props.onOk?.(values);
  };

  useEffect(() => {
    if (!props.visible) {
      form.resetFields();
      return;
    }
    form.setFieldsValue(props.data);
  }, [props.visible]);

  return (
    <Modal
      title={'编辑-升级接口'}
      centered
      {...props}
      onCancel={() => props.onOk?.()}
      onOk={onConfirm}
      maskClosable={false}
      destroyOnClose
      okButtonProps={{disabled: globalState.finished}}
    >
      <Form form={form} labelCol={{span: 6}}>
        <Form.Item label={'接口服务'} name={'api_server'}>
          <Input disabled/>
        </Form.Item>
        <Form.Item label={'接口URL'} name={'api_url'}>
          <Input disabled/>
        </Form.Item>
        <Form.Item
          label={'并发数'}
          name={'concurrent'}
          rules={[{message: '请填写并发数', required: true}]}
        >
          <InputNumber
            style={{width: '100%'}}
            min={0}
            max={999999}
            disabled={globalState.finished}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
