import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Form, Select, DatePicker, Button, Input, Col, Space,
  Spin, Divider, Modal, Checkbox, Row,
} from 'antd';
import {InfoCircleOutlined, StopOutlined, PlusOutlined} from '@ant-design/icons';
import {AgGridReact} from 'ag-grid-react';
import {
  historyCompareColumn, historyOrderColumn,
} from '@/pages/onlineSystem/releaseProcess/column';
import {getDevOpsOrderColumn} from '@/pages/onlineSystem/config/column';
import {CellClickedEvent, GridApi, GridReadyEvent, RowNode} from 'ag-grid-community';
import FieldSet from '@/components/FieldSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import AnnouncementServices from '@/services/announcement';
import {OnlineSystemServices} from '@/services/onlineSystem';
import {useModel, useParams, history} from 'umi';
import {isEmpty, omit, isEqual} from 'lodash';
import {infoMessage} from '@/publicMethods/showMessages';
import moment from 'moment';
import {PageContainer} from '@ant-design/pro-layout';
import DragIcon from '@/components/DragIcon';
import cns from 'classnames';
import {valueMap} from '@/utils/utils';
import usePermission from '@/hooks/permission';
import ICluster from '@/components/ICluster';
import {pushType} from "@/pages/onlineSystem/config/constant";

let agFinished = false; // 处理ag-grid 拿不到最新的state
let releateOrderInfo: any = {
  SQL: [],
  INTER: []
}; // 用于保存由推送类型获取的工单信息（ag-grid中的渲染用state无用）
const ReleaseOrder = () => {
  const {id} = useParams() as { id: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);

  const [envList] = useModel('env', (env) => [env.globalEnv]);
  const gridRef = useRef<GridApi>();
  const gridCompareRef = useRef<GridApi>();
  const devOpsOrderRef = useRef<GridApi>();
  const [orderForm] = Form.useForm();
  const [baseForm] = Form.useForm();

  const {prePermission} = usePermission();
  const hasPermission = prePermission();

  const [orderData, setOrderData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<{ opsData: any[]; alpha: any[] }>();
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [devOpsOrderInfo, setDevOpsOrderInfo] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [clusters, setClusters] = useState<any>(); // 所有组合集群
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  // const [tableHeight, setTableHeight] = useState((window.innerHeight - 370) / 2);

  const onGridReady = (params: GridReadyEvent, ref = gridRef) => {
    ref.current = params.api;
    params.api.sizeColumnsToFit();
  };
  useEffect(() => {

    agFinished = false;
    Modal.destroyAll();
    getBaseList();
    PreReleaseServices.clusterGroup().then((res) => {
      const clusterMap = valueMap(res, ['name', 'value']);
      setClusters(clusterMap);
      getOrderDetail(clusterMap);
    });

    // window.onresize = function () {
    //   setTableHeight((window.innerHeight - 370) / 2);
    // };
    return () => {
      window.onresize = null;
    };
  }, []);


  const getBaseList = async () => {
    /* 注意：ag-grid中，列的渲染是没法用usestate中的数据来进行动态渲染的，解决方案：需要定义一个全局变量来动态记录需要改变的数据，渲染中使用这个全局变量 */
    releateOrderInfo.SQL = await PreReleaseServices.getRelatedInfo({order_type: "SQL"});
    releateOrderInfo.INTER = await PreReleaseServices.getRelatedInfo({order_type: "DeployApi"});

    const announce = await AnnouncementServices.preAnnouncement();
    const order = await PreReleaseServices.dutyOrder();
    const devopsInfo = await OnlineSystemServices.getDevOpsOrderInfo({release_num: id});
    setDevOpsOrderInfo((Object.keys(devopsInfo)).length ? [{...devopsInfo}] : []);

    setDutyList(
      order?.map((it: any) => ({
        label: it.duty_name ?? '',
        value: it.person_duty_num,
        key: it.person_duty_num,
      })),
    );
    setAnnouncementList(
      announce.map((it: any) => ({
        label: it.announcement_name,
        value: it.announcement_num,
        key: it.announcement_num,
      })),
    );
  };

  const getOrderDetail = async (clusterMap = clusters) => {
    try {
      setSpinning(true);
      const res = await PreReleaseServices.orderDetail({release_num: id});
      if (isEmpty(res)) {
        initForm();
      } else
        orderForm.setFieldsValue({
          ...res,
          release_result:
            isEmpty(res.release_result) || res.release_result == 'unknown'
              ? null
              : res.release_result,
          plan_release_time: res.plan_release_time ? moment(res.plan_release_time) : null,
        });
      baseForm.setFieldsValue({
        ...res,
        cluster: res.cluster ?? [],
      });
      agFinished = res?.release_result !== 'unknown' && !isEmpty(res?.release_result);
      setFinished(agFinished);
      setOrderData(res.ready_data);
      await formatCompare(res?.ops_repair_order_data ?? [], res?.ready_data ?? []);
      setSpinning(false);
    } catch (e: any) {
      if (e?.code == 4001) initForm();
      else infoMessage(e?.msg ?? e?.statusText);
      setSpinning(false);
    }
  };

  const onLinkTable = async () => {
    setSpinning(true);
    try {
      const values = baseForm.getFieldsValue();
      if (isEmpty(values.cluster)) {
        setOrderData([]);
        setCompareData({opsData: [], alpha: []});
        setSpinning(false);
        return;
      }
      const rd = await PreReleaseServices.orderList(values.cluster?.join(',') ?? '');
      setOrderData(rd);
      const flag = rd.some((it: any) => (it.repair_order_type ?? '').indexOf('停机') > -1);
      orderForm.setFieldsValue({
        release_way: flag ? 'stop_server' : 'keep_server',
      });
      await formatCompare([], rd);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  // 工单信息和表单设置里面的信息做对比
  const formatCompare = async (opsOrigin: any[], rdOriginDt: any[]) => {
    // 手动在表单里面加的数据不进行对比。这里要进行过滤
    let rdOrigin: any = [];
    rdOriginDt.forEach((e: any) => {
      if (e.repair_order_type !== "DeployApi") rdOrigin.push(e);
    })

    let ops = opsOrigin;
    if (isEmpty(ops)) {
      const values = baseForm.getFieldsValue();
      ops = await PreReleaseServices.opsList(values.cluster?.join(',') ?? '');
    }
    if (isEmpty(ops) && isEmpty(rdOrigin)) {
      setCompareData({opsData: [], alpha: []});
      return;
    }
    let mergeArr: any[] = [];
    let rdArr: any[] = [];
    const len = ops?.length > rdOrigin?.length ? ops.length : rdOrigin?.length;

    Array.from({length: len,},
      (it, i) => {
        const rdItem = rdOrigin[i];
        const opsItem = ops[i];
        if (
          !['BlueGreenDeploy', 'TenantStopDeploy'].includes(opsItem?.release_order_type) &&
          !isEmpty(opsItem)
        ) {
          rdArr.push({
            repair_order: '',
            project: '',
            repair_order_type: opsItem?.release_order_type,
          });
        }
        rdArr.push({
          repair_order: rdItem?.repair_order,
          project: rdItem?.project,
          repair_order_type: rdItem?.release_order_type,
        });
      },
    );
    for (let i = 0; i < rdArr?.length; i++) {
      const opsItem = ops[i];
      const otherOrder =
        !['BlueGreenDeploy', 'TenantStopDeploy'].includes(opsItem?.release_order_type) &&
        !isEmpty(opsItem);
      const rdId = rdArr[i]?.repair_order;
      const opsTitle = opsItem?.label
        ?.substring(opsItem?.label?.indexOf('title:') + 7, opsItem?.label?.indexOf('状态:'))
        ?.trim();

      mergeArr.push({
        opsId: String(opsItem?.id ?? ''),
        opsTitle:
          opsItem?.id && opsTitle
            ? `${opsItem.id}: ${opsTitle}`
            : opsItem?.id
            ? opsItem.id
            : opsTitle,
        opsType: opsItem?.release_order_type,
        rd: rdId,
        rdTitle:
          rdId && rdArr[i]?.project
            ? `${rdId}: ${rdArr[i]?.project}`
            : rdId
            ? rdId
            : rdArr[i]?.project ?? '',
        rdType: rdId ? `${rdId}: ${rdArr[i]?.repair_order_type}` : '',
        color: otherOrder
          ? 'white'
          : String(opsItem?.id) == String(rdId)
            ? 'rgba(0, 255, 0, 0.06)'
            : 'rgba(255, 2, 2, 0.06)',
      });
    }

    setCompareData({opsData: ops, alpha: mergeArr});
  };

  const initForm = () => {
    orderForm.setFieldsValue({
      plan_release_time: moment().startOf('d'),
      person_duty_num: '免',
    });
    baseForm.setFieldsValue({
      release_type: 'backlog_release',
      release_name: `${id}灰度推生产`,
    });
  };

  const onSaveBeforeCheck = (isAuto = false) => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const result = order.release_result;
    if (isAuto && (isEmpty(result) || result == 'unknown')) return;

    const checkObj = omit({...order, ...base}, ['release_result']);
    let errMsg = '';
    const errTip = {
      plan_release_time: '请填写发布时间!',
      announcement_num: '请填写关联公告！',
      person_duty_num: '请填写值班名单',
      release_name: '请填写工单名称!',
      cluster: '请填写发布环境!',
      release_way: '请填写发布方式',
    };
    const valid = Object.values(checkObj).some((it) => isEmpty(it));

    if (valid) {
      const errArr = Object.entries(checkObj).find(([k, v]) => isEmpty(v)) as any[];
      errMsg = errTip[errArr?.[0]];
    }
    if (isEmpty(base.release_name?.trim())) {
      errMsg = errTip.release_name;
    }
    if (!['failure', 'cancel'].includes(result) && errMsg) {
      orderForm.setFieldsValue({release_result: null});
      return infoMessage(errMsg);
    }
    // 发布结果为空，直接保存
    if (isEmpty(result) || result == 'unknown') {
      onSave();
    } else {
      // 二次确认标记发布结果
      const tips = {
        cancel: {title: '取消发布提醒', content: '取消发布将删除工单，请确认是否取消发布?'},
        success: {title: '发布成功提醒', content: '请确认是否标记发布成功?'},
        failure: {title: '发布失败提醒', content: '请确认是否标记发布失败?'},
      };
      if (result == 'success') {
        setVisible(true);
      } else {
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
              if (result == 'cancel') {
                await PreReleaseServices.removeRelease(
                  {
                    user_id: user?.userid ?? '',
                    release_num: id ?? '',
                  },
                  false,
                );
              } else await onSave();
            } catch (e) {
              setConfirmDisabled(false);
            }
            history.replace('/onlineSystem/releaseProcess');
          },
          onCancel: () => {
            orderForm.setFieldsValue({release_result: null});
          },
        });
      }
    }
  };

  const onSave = async (jump = false) => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const checkObj = omit({...order, ...base}, ['release_result']);
    const errTip = {
      plan_release_time: '请填写发布时间!',
      announcement_num: '请填写关联公告！',
      person_duty_num: '请填写值班名单',
      release_name: '请填写工单名称!',
      cluster: '请填写发布环境!',
      release_way: '请填写发布方式',
    };
    const valid = Object.values(checkObj).some((it) => isEmpty(it));
    if (valid) {
      const errArr = Object.entries(checkObj).find(([k, v]) => isEmpty(v)) as any[];
      infoMessage(errTip[errArr?.[0]]);
      return;
    }
    if (isEmpty(base.release_name?.trim())) return infoMessage(errTip.release_name);

    await PreReleaseServices.saveOrder({
      release_num: id, // 发布编号
      user_id: user?.userid ?? '',
      release_name: base.release_name?.trim() ?? '',
      person_duty_num: order.person_duty_num,
      announcement_num: order.announcement_num ?? '',
      release_type: 'backlog_release',
      rd_repair_data: orderData ?? [],
      release_way: order.release_way ?? '',
      ops_repair_data: compareData?.opsData ?? [],
      release_result: order.release_result ?? 'unknown',
      cluster: base.cluster?.join(',') ?? '',
      ready_release_num: orderData?.map((it: any) => it.release_num)?.join(',') ?? '', // 积压工单id
      plan_release_time: moment(order.plan_release_time).format('YYYY-MM-DD HH:mm:ss'),
    });
    // 更新详情
    if (!jump) {
      getOrderDetail();
    }
  };

  const onSuccessConfirm = async (data: any) => {
    const announcement_num = orderForm.getFieldValue('announcement_num');
    if (isEmpty(data)) {
      orderForm.setFieldsValue({release_result: null});
      setVisible(false);
    } else {
      let params: any[] = [];
      const ignoreCheck = data.ignoreCheck;
      ['ui', 'applet'].forEach((type) => {
        params.push({
          user_id: user?.userid ?? '',
          ignore_check: ignoreCheck ? 'yes' : 'no',
          check_time: 'after',
          check_result: data.checkResult?.includes(type) ? 'yes' : 'no',
          check_type: type,
          ready_release_num: id ?? '',
        });
      });
      await onSave(true);
      agFinished = true;
      setFinished(true);
      await PreReleaseServices.automation(params);

      // 关联公告并勾选挂起公告
      if (!isEmpty(announcement_num) && announcement_num !== '免' && data.announcement) {
        await PreReleaseServices.saveAnnouncement({
          user_id: user?.userid ?? '',
          announcement_num: orderForm.getFieldValue('announcement_num'),
          announcement_time: 'after',
        });
      }
      setVisible(false);
      history.replace('/onlineSystem/releaseProcess');
    }
  };

  const deleteAddPatchName = (p: any) => {
    const newDt: any = [];
    gridRef.current?.forEachNode((node, index) => {
      if (p.rowIndex !== index) {
        newDt.push(node.data);
      }
    });

    setOrderData(newDt);
    gridRef.current?.setRowData(newDt)
  };

  // 永久删除积压工单
  const onRemove = (p: any) => {
    const cluster = baseForm.getFieldValue('cluster');
    if (agFinished || !hasPermission.delete) {
      return infoMessage(agFinished ? '已标记发布结果不能删除积压工单!' : '您无删除积压工单权限!');
    }

    // 如果是接口工单和sql工单,则之间删除，不请求其他接口
    if (p.data?.repair_order_type === "SQL" || p.data?.repair_order_type === "DeployApi") {
      deleteAddPatchName(p);
    } else {
      Modal.confirm({
        centered: true,
        okText: '确认',
        cancelText: '取消',
        title: '删除积压工单提醒',
        icon: <InfoCircleOutlined style={{color: 'red'}}/>,
        content: `请确认是否要永久删除【${p.data?.repair_order ?? ''}】工单?`,
        onOk: async () => {
          await PreReleaseServices.removeOrder({
            release_num: p.data?.release_num,
            user_id: user?.userid ?? '',
          });
          const rd = await PreReleaseServices.orderList(cluster?.join(',') ?? '');
          const ops = await PreReleaseServices.opsList(cluster?.join(',') ?? '');
          await PreReleaseServices.separateSaveOrder({
            release_num: id,
            ops_repair_data: ops ?? [],
            rd_repair_data: rd ?? [],
          });
          getOrderDetail();
        },
      });
    }

  };

  //忽略本次积压工单
  const onIgnore = (p: any) => {
    if (agFinished) {
      return infoMessage('已标记发布结果不能忽略积压工单!');
    }

    // 如果是接口工单和sql工单,则之间删除，不请求其他接口
    if (p.data?.repair_order_type === "SQL" || p.data?.repair_order_type === "DeployApi") {
      deleteAddPatchName(p);
    } else {
      Modal.confirm({
        centered: true,
        title: '忽略积压工单',
        content: `请确认是否忽略【${p.data.ready_release_name}】积压工单？`,
        okButtonProps: {disabled: confirmDisabled},
        onOk: async () => {
          setConfirmDisabled(true);
          const result =
            gridRef.current
              ?.getRenderedNodes()
              ?.map((it) => it.data)
              ?.filter((obj) => !isEqual(obj, p.data)) || [];
          await formatCompare(compareData?.opsData || [], result);
          setOrderData(result);
          setConfirmDisabled(false);
        },
      });
    }

  };

  const onDrag = async () => {
    if (finished) return infoMessage('已标记发布结果不能修改工单顺序!');
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node) {
      sortArr.push({...node.data});
    });
    setOrderData(sortArr);
    formatCompare(compareData?.opsData ?? [], sortArr);
  };

  // 手动添加一行空行
  const addNewOrderRow = () => {

    // repair_order_type：  // 推送类型
    // repair_order // 关联工单编号
    // ready_release_name // 发布批次名称
    // project // 关联项目列表
    // repair_order_fish_time // 部署结束时间
    // cluster // 已发布集群
    // apps
    // branch
    // cluster
    // create_time
    // create_user
    // plan_release_time
    // project
    // ready_release_name
    // release_env
    // release_env_type
    // release_name
    // release_num
    // release_result
    // release_sealing
    // release_time
    // repair_order
    // repair_order_fish_time
    // repair_order_type

    const newRow = [{
      addID: orderData.length + 1,
      repair_order_type: "",
      ready_release_name: "",
      // repair_order: "",
      // project: "",
      // repair_order_fish_time: "",
      // cluster: ""
    }];
    setOrderData(orderData.concat(newRow));
  };

  // 获取发布批次名称和发布批次名称选择后的保存
  const getReleasePatchName = async (p: any, v2: any, getPatchName: boolean) => {
    // 获取表格所有的数据
    const dt: any = [];
    gridRef.current?.forEachNode((node, index) => {
      const rowDatas = node.data;
      // 如果是同一行，则将原数据对应的值修改为下拉框的值
      if (p.rowIndex === index) {
        rowDatas[p.column.colId] = v2.value;
        // 如果是选择发布批次名称，则需要包含id,lable,repair_order_type
        if (!getPatchName) {
          rowDatas["label"] = v2.label;
          rowDatas["repair_order_type"] = p.data?.repair_order_type;
          rowDatas["id"] = JSON.parse(v2.value)
          // id:SQL工单传整形，接口工单传数组 （SQL工单ID一直只会有一个）
          p.data?.repair_order_type === "SQL" ? rowDatas["id"] = Number(v2.value) : JSON.parse(v2.value);
        }
      }
      dt.push(rowDatas);
    });

    gridRef.current?.setRowData(dt);
    setOrderData(dt);
  };


  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer title={<div/>}>
        <div className={styles.releaseOrder}>
          <div className={styles.header}>
            <div className={styles.title}>工单基本信息</div>
            <Button
              size={'small'}
              onClick={() => onSaveBeforeCheck()}
              disabled={!hasPermission?.save || finished}
            >
              保存
            </Button>
          </div>
          <Form size={'small'} form={orderForm} className={cns(styles.baseInfo, styles.bgForm)}>
            <Row gutter={3}>
              <Col span={4}>
                <Form.Item name={'release_way'} label={'发布方式'}>
                  <Select
                    disabled
                    style={{width: '100%'}}
                    options={[
                      {label: '停服', value: 'stop_server'},
                      {label: '不停服', value: 'keep_server'},
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name={'plan_release_time'} label={'发布时间'}>
                  <DatePicker
                    style={{width: '100%'}}
                    showTime
                    format={'YYYY-MM-DD HH:mm'}
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
                          disabled={!hasPermission?.saveResult || finished}
                          className={styles.selectColor}
                          onChange={() => onSaveBeforeCheck(true)}
                          options={[
                            {label: '发布成功', value: 'success', key: 'success'},
                            {label: '发布失败', value: 'failure', key: 'failure'},
                            {label: '取消发布', value: 'cancel', key: 'cancel'},
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

          <FieldSet data={{title: '工单-基础设置'}}>
            <Form layout={'inline'} size={'small'} form={baseForm} className={styles.baseInfo}>
              <Col span={6}>
                <Form.Item name={'release_type'} label={'工单类型选择'}>
                  <Select
                    options={[{label: '灰度推生产', value: 'backlog_release'}]}
                    style={{width: '100%'}}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'release_name'} label={'工单名称'} required>
                  <Input style={{width: '100%'}} disabled={finished}/>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name={'cluster'} label={'发布环境'} required>
                  <Select
                    showSearch
                    disabled={finished}
                    options={envList?.filter(
                      (it: any) =>
                        !['cn-northwest-0', 'cn-northwest-global'].includes(it.value) &&
                        !it.label?.includes('集群0-8'),
                    )}
                    style={{width: '100%'}}
                    mode={'multiple'}
                    onChange={onLinkTable}
                  />
                </Form.Item>
              </Col>
            </Form>
          </FieldSet>
          <FieldSet data={{title: '工单-表单设置'}}>
            <div
              className="ag-theme-alpine"
              style={{
                height: orderData === undefined ? 100 : (orderData.length) * 28 + 80,
                width: '100%',
                marginTop: 8
              }}
            >
              <AgGridReact
                columnDefs={historyOrderColumn}
                rowData={orderData}
                defaultColDef={{
                  resizable: true,
                  filter: true,
                  flex: 1,
                  suppressMenu: true,
                  cellStyle: {'line-height': '28px'},
                }}
                rowHeight={28}
                headerHeight={30}
                onGridReady={onGridReady}
                onGridSizeChanged={onGridReady}
                rowDragManaged={!finished}
                animateRows={true}
                onRowDragEnd={onDrag}
                frameworkComponents={{
                  pushType: (params: CellClickedEvent) => {
                    // 只有是SQL工单、接口工单或者新增行时
                    if (params.value === "DeployApi" || params.value === "SQL" || params.data?.addID) {
                      return (
                        <Select
                          style={{
                            width: '100%',
                          }}
                          size={'small'}
                          value={params.value}
                          options={Object.keys(pushType)?.map((k) => ({
                            value: k,
                            label: pushType[k],
                          }))}
                          onChange={(v1, v2) => getReleasePatchName(params, v2, true)}
                        />
                      );
                    }
                    return params.value;
                  },
                  ICluster: (p: any) => <ICluster data={p.value}/>,
                  linkOrSelect: (p: CellClickedEvent) => {
                    if (p.data?.repair_order_type === "DeployApi" || p.data?.repair_order_type === "SQL") {
                      const releateOrderInfos = p.data?.repair_order_type === "SQL" ? releateOrderInfo.SQL : releateOrderInfo.INTER;
                      // 根据类型获取名称
                      return (
                        <Select
                          style={{
                            width: '100%',
                          }}
                          size={'small'}
                          value={p.value}
                          options={releateOrderInfos.map((k: any) => ({
                            value: JSON.stringify(k.id),
                            label: k.label,
                          }))}

                          onChange={(v1, v2) => getReleasePatchName(p, v2, false)}
                        />
                      );
                    }
                    // 如果是SQL工单和接口工单，则显示下拉框，否则显示链接
                    return <div
                      style={{
                        color: '#1890ff',
                        cursor: 'pointer',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onClick={() => {
                        if (!p.data.release_num) return;
                        history.push(
                          `/onlineSystem/prePublish/${p.data.release_num}/${p.data.branch}`,
                        );
                      }}
                    >
                      {p.data.ready_release_name}
                    </div>
                  },
                  operations: (p: CellClickedEvent) => (
                    <Fragment>
                      {hasPermission.delete ? (
                        <img
                          title={'永久删除积压工单'}
                          width="20"
                          height="20"
                          src={require('../../../../public/delete_red.png')}
                          style={{marginRight: 10}}
                          onClick={() => onRemove(p)}
                        />
                      ) : (
                        <div/>
                      )}
                      <StopOutlined
                        title={'忽略本次积压工单'}
                        style={{
                          color: '#86a8cf',
                          marginRight: 10,
                          cursor: 'pointer',
                          fontSize: 18,
                          verticalAlign: 'middle',
                        }}
                        onClick={() => onIgnore(p)}
                      />
                      {DragIcon(p)}
                    </Fragment>
                  ),
                }}
              />
            </div>
            {/* 行的添加 */}
            <div>
              <Button type="dashed" block icon={<PlusOutlined/>} onClick={addNewOrderRow}>
                新增一行
              </Button>
            </div>

          </FieldSet>
          <Divider plain style={{margin: '6px 0'}}>
            <strong>工单核对检查（rd平台暂无接口与sql工单）</strong>
          </Divider>
          <div className={styles.orderTag}>
            <h4>工单核对检查背景色说明:</h4>
            <span>工单编号对比一致</span>
            <span>接口工单/SQL工单(值班人员核对确认)</span>
            <span>工单编号对比不一致</span>
          </div>
          <div
            className="ag-theme-alpine"
            style={{
              height: compareData?.alpha === undefined ? 100 : (compareData?.alpha)?.length * 28 + 100,
              width: '100%',
              marginTop: 8
            }}
          >
            <AgGridReact
              columnDefs={historyCompareColumn}
              rowData={compareData?.alpha ?? []}
              defaultColDef={{
                resizable: true,
                filter: true,
                flex: 1,
                suppressMenu: true,
                cellStyle: {'line-height': '28px'},
              }}
              rowHeight={28}
              headerHeight={30}
              onGridReady={(r) => onGridReady(r, gridCompareRef)}
              onGridSizeChanged={(r) => onGridReady(r, gridCompareRef)}
              getRowStyle={(p) => ({background: p.data.color})}
            />
          </div>

          {/* 运维工单信息 */}
          <div style={{display: devOpsOrderInfo.length ? "inline" : "none"}}>
            <h4 style={{marginTop: 20}}> 运维工单信息 </h4>
            <div
              className="ag-theme-alpine"
              style={{height: 100, width: '100%', marginTop: 8}}>
              <AgGridReact
                columnDefs={getDevOpsOrderColumn("gray")}
                rowData={devOpsOrderInfo}
                defaultColDef={{
                  resizable: true,
                  filter: true,
                  flex: 1,
                  suppressMenu: true,
                  cellStyle: {'line-height': '28px'},
                }}
                rowHeight={28}
                headerHeight={30}
                onGridReady={(r) => onGridReady(r, devOpsOrderRef)}
                onGridSizeChanged={(r) => onGridReady(r, devOpsOrderRef)}
              />
            </div>
          </div>

          <ModalSuccessCheck
            visible={visible}
            onOk={(v?: any) => onSuccessConfirm(v)}
            announce={orderForm.getFieldValue('announcement_num')}
          />
        </div>
      </PageContainer>
    </Spin>
  );
};
export default ReleaseOrder;

export const ModalSuccessCheck = ({
                                    visible,
                                    onOk,
                                    announce,
                                  }: {
  visible: boolean;
  announce: string;
  onOk: (v?: any) => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await onOk(values);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      centered
      onOk={onConfirm}
      maskClosable={false}
      onCancel={() => onOk()}
      className={styles.modalSuccessCheck}
      destroyOnClose
      okButtonProps={{disabled: loading}}
    >
      <div>请确认是否标记发布成功？</div>
      <div>如有自动化也执行通过！确认通过，会自动开放所有租户。</div>
      <Form form={form} layout={'inline'}>
        <Form.Item noStyle shouldUpdate={(old, next) => old.checkResult != next.checkResult}>
          {({getFieldValue}) => {
            return (
              <Form.Item
                label="是否忽略发布成功后自动化检查"
                name="ignoreCheck"
                valuePropName="checked"
              >
                <Checkbox
                  value="yes"
                  disabled={!isEmpty(getFieldValue('checkResult'))}
                  onChange={({target}) => form.validateFields(['checkResult'])}
                >
                  忽略检查
                </Checkbox>
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(old, next) => old.ignoreCheck != next.ignoreCheck}>
          {({getFieldValue}) => {
            const afterCheck = getFieldValue('ignoreCheck');
            return (
              <Form.Item
                label="检查结果"
                name="checkResult"
                required={true}
                rules={[{required: afterCheck !== true, message: '请选择检查结果'}]}
              >
                <Checkbox.Group style={{width: '100%'}} disabled={afterCheck == true}>
                  <Checkbox value="ui">UI执行通过</Checkbox>
                  <Checkbox value="applet">小程序执行通过</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item label="是否挂起升级后公告" name="announcement" valuePropName="checked">
          <Checkbox
            value="yes"
            defaultChecked={true}
            disabled={isEmpty(announce) || announce == '免'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
