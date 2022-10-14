import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Form, Select, DatePicker, Button, Input, Col, Spin, Divider, Collapse, Modal } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  historyCompareColumn,
  historyOrderColumn,
} from '@/pages/onDutyAndRelease/releaseProcess/column';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import FieldSet from '@/components/FieldSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import AnnouncementServices from '@/services/announcement';
import { useModel, useParams, history } from 'umi';
import { isEmpty, omit } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import DragIcon from '@/components/DragIcon';

const ReleaseOrder = () => {
  let agFinished = false; // 处理ag-grid 拿不到最新的state
  const { id } = useParams() as { id: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const gridRef = useRef<GridApi>();
  const gridCompareRef = useRef<GridApi>();
  const [orderForm] = Form.useForm();
  const [baseForm] = Form.useForm();

  const [orderData, setOrderData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<{ opsData: any[]; alpha: any[] }>();
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [envList, setEnvList] = useState<any[]>([]);

  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);

  const onGridReady = (params: GridReadyEvent, ref = gridRef) => {
    ref.current = params.api;
    params.api.sizeColumnsToFit();
  };
  useEffect(() => {
    getBaseList();
    getOrderDetail();
  }, []);

  const getBaseList = async () => {
    const announce = await AnnouncementServices.preAnnouncement();
    const envs = await PreReleaseServices.environment();
    const order = await PreReleaseServices.dutyOrder();
    setDutyList(
      order?.map((it: any) => ({
        label: it.duty_name ?? '',
        value: it.person_duty_num,
        key: it.person_duty_num,
      })),
    );
    setEnvList(
      envs?.flatMap((it: any) =>
        ['集群0', 'global', '集群0-8'].includes(it.online_environment_name)
          ? []
          : [
              {
                label: it.online_environment_name ?? '',
                value: it.online_environment_id,
                key: it.online_environment_id,
              },
            ],
      ),
    );
    setAnnouncementList(
      announce.map((it: any) => ({
        label: it.announcement_name,
        value: it.announcement_num,
        key: it.announcement_num,
      })),
    );
  };

  const getOrderDetail = async () => {
    try {
      setSpinning(true);
      const res = await PreReleaseServices.orderDetail({ release_num: id });
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
        cluster: res.cluster?.map((it: any) => it.name) ?? [],
      });
      agFinished = res?.release_result !== 'unknown' && !isEmpty(res?.release_result);
      setFinished(agFinished);
      setOrderData(res.ready_data);
      await formatCompare(res?.ops_repair_order_data ?? [], res?.ready_data ?? []);
      setSpinning(false);
    } catch (e: any) {
      if (e?.code == 4001) initForm();
      else infoMessage(e.msg);
      setSpinning(false);
    }
  };

  const onLinkTable = async () => {
    setSpinning(true);
    try {
      const values = baseForm.getFieldsValue();
      if (isEmpty(values.cluster)) {
        setOrderData([]);
        setCompareData({ opsData: [], alpha: [] });
        setSpinning(false);
        return;
      }
      const rd = await PreReleaseServices.orderList(values.cluster?.join(',') ?? '');
      setOrderData(
        rd?.map((it: any) => ({ ...it, cluster: it.cluster?.replaceAll('cn-northwest-', '集群') })),
      );
      const flag = rd.some((it: any) => it.repair_order_type.indexOf('停机') > -1);
      orderForm.setFieldsValue({
        release_way: flag ? 'stop_server' : 'keep_server',
      });
      await formatCompare([], rd);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  const formatCompare = async (opsOrigin: any[], rdOrigin: any[]) => {
    let ops = opsOrigin;
    if (isEmpty(ops)) {
      const values = baseForm.getFieldsValue();
      ops = await PreReleaseServices.opsList(values.cluster?.join(',') ?? '');
    }
    if (isEmpty(ops) && isEmpty(rdOrigin)) {
      setCompareData({ opsData: [], alpha: [] });
      return;
    }
    let mergeArr: any[] = [];
    let rdArr: any[] = [];
    ops.forEach((it: any, i: number) => {
      rdArr.push(
        !['BlueGreenDeploy', 'TenantStopDeploy'].includes(it.release_order_type) ||
          isEmpty(rdOrigin[i])
          ? { repair_order: '', project: '', repair_order_type: it.release_order_type }
          : rdOrigin[i],
      );
    });
    // 临时的假数据
    if (ops.length > 100) {
      ops = ops?.slice(0, 5);
    }
    ops.forEach((it: any, i: number) => {
      const otherOrder = !['BlueGreenDeploy', 'TenantStopDeploy'].includes(it.release_order_type);
      const rdId = rdArr[i]?.repair_order;
      const opsTitle = it.label
        ?.substring(it.label.indexOf('title:') + 7, it.label.indexOf('状态:'))
        ?.trim();

      mergeArr.push({
        opsId: String(it.id ?? ''),
        opsTitle: it.id ? `${it.id}:${opsTitle}` : opsTitle,
        opsType: it.release_order_type,
        rd: rdId,
        rdTitle: rdId ? `${rdId}:${rdArr[i]?.project}` : rdArr[i]?.project ?? '',
        rdType: rdId ? `${rdId}:${rdArr[i]?.repair_order_type}` : '',
        status: otherOrder ? '' : String(it.id) == String(rdId),
      });
    });
    setCompareData({ opsData: ops, alpha: mergeArr });
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
  const onSaveBeforeCheck = () => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const result = order.release_result;
    const checkObj = omit({ ...order, ...base }, ['release_result']);
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
      orderForm.setFieldsValue({ release_result: null });
      return;
    }
    if (isEmpty(base.release_name?.trim())) {
      orderForm.setFieldsValue({ release_result: null });
      return infoMessage(errTip.release_name);
    }
    // 发布结果为空，直接保存
    if (isEmpty(result)) {
      onSave();
    } else {
      // 二次确认标记发布结果
      const tips = {
        cancel: { title: '取消发布提醒', content: '取消发布将删除工单，请确认是否取消发布?' },
        success: { title: '发布成功提醒', content: '请确认是否标记发布成功?' },
        failure: { title: '发布失败提醒', content: '请确认是否标记发布失败?' },
      };
      Modal.confirm({
        centered: true,
        title: tips[result].title,
        content: tips[result].content,
        icon: <div />,
        onOk: async () => {
          if (result == 'cancel') {
            await PreReleaseServices.removeRelease(
              {
                user_id: user?.userid ?? '',
                release_num: id ?? '',
              },
              false,
            );
          } else await onSave();
          history.replace('/onDutyAndRelease/releaseProcess?key=pre');
        },
        onCancel: () => {
          orderForm.setFieldsValue({ release_result: null });
        },
      });
      return;
    }
  };

  const onSave = async () => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const checkObj = omit({ ...order, ...base }, ['release_result']);
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
    getOrderDetail();
  };

  const onRemove = (data: any) => {
    const cluster = baseForm.getFieldValue('cluster');
    if (agFinished || !hasPermission) {
      return infoMessage(agFinished ? '已标记发布结果不能删除积压工单!' : '您无删除积压工单权限!');
    }

    Modal.confirm({
      centered: true,
      title: '删除积压工单提醒',
      content: `请确认是否要永久删除【${data.repair_order ?? ''}】工单?`,
      onOk: async () => {
        await PreReleaseServices.removeOrder({
          release_num: data.release_num,
          user_id: user?.userid ?? '',
        });
        const rd = await PreReleaseServices.orderList(cluster?.join(',') ?? '');
        let ops = await PreReleaseServices.opsList(cluster?.join(',') ?? '');
        // 临时的假数据
        if (ops.length > 100) {
          ops = ops?.slice(0, 5);
        }
        await PreReleaseServices.separateSaveOrder({
          release_num: id,
          ops_repair_data: ops ?? [],
          rd_repair_data: rd ?? [],
        });
        getOrderDetail();
      },
    });
  };

  const onDrag = async () => {
    if (finished) return infoMessage('已标记发布结果不能修改工单顺序!');
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node) {
      sortArr.push({ ...node.data });
    });
    setOrderData(sortArr);
    formatCompare(compareData?.opsData ?? [], sortArr);
  };

  const hasPermission = useMemo(() => user?.group == 'superGroup', []);
  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer title={<div />}>
        <div className={styles.releaseOrder}>
          <Collapse defaultActiveKey={'1'} className={styles.collapse}>
            <Collapse.Panel key={'1'} header={'工单'}>
              <div className={styles.save}>
                <Button size={'small'} onClick={onSaveBeforeCheck} disabled={finished}>
                  保存
                </Button>
              </div>
              <Form layout={'inline'} size={'small'} form={orderForm} className={styles.baseInfo}>
                <Col span={4}>
                  <Form.Item name={'release_way'} label={'发布方式'}>
                    <Select
                      disabled
                      style={{ width: '100%' }}
                      options={[
                        { label: '停服', value: 'stop_server' },
                        { label: '不停服', value: 'keep_server' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name={'plan_release_time'} label={'发布时间'}>
                    <DatePicker
                      style={{ width: '100%' }}
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
                      options={[{ key: '免', value: '免', label: '免' }].concat(announcementList)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name={'person_duty_num'} label={'值班名单'}>
                    <Select
                      showSearch
                      disabled={finished}
                      optionFilterProp={'label'}
                      options={[{ key: '免', value: '免', label: '免' }].concat(dutyList)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(old, current) => old.release_result != current.release_result}
                  >
                    {({ getFieldValue }) => {
                      const result = getFieldValue('release_result');
                      const color = { success: '#2BF541', failure: 'red' };
                      return (
                        <Form.Item name={'release_result'}>
                          <Select
                            allowClear={true}
                            disabled={finished}
                            className={styles.selectColor}
                            onChange={onSaveBeforeCheck}
                            options={[
                              { label: '发布成功', value: 'success', key: 'success' },
                              { label: '发布失败', value: 'failure', key: 'failure' },
                              { label: '取消发布', value: 'cancel', key: 'cancel' },
                              { label: ' ', value: 'unknown', key: 'unknown' },
                            ]}
                            style={{
                              width: '100%',
                              fontWeight: 'bold',
                              color: color[result] ?? 'initial',
                            }}
                            placeholder={
                              <span style={{ color: '#00bb8f', fontWeight: 'initial' }}>
                                标记发布结果
                              </span>
                            }
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Form>
            </Collapse.Panel>
          </Collapse>

          <FieldSet data={{ title: '工单-基础设置' }}>
            <Form layout={'inline'} size={'small'} form={baseForm} className={styles.baseInfo}>
              <Col span={6}>
                <Form.Item name={'release_type'} label={'工单类型选择'}>
                  <Select
                    options={[{ label: '灰度推生产', value: 'backlog_release' }]}
                    style={{ width: '100%' }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'release_name'} label={'工单名称'} required>
                  <Input style={{ width: '100%' }} disabled={finished} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name={'cluster'} label={'发布环境'} required>
                  <Select
                    showSearch
                    disabled={finished}
                    options={envList}
                    style={{ width: '100%' }}
                    mode={'multiple'}
                    onChange={onLinkTable}
                  />
                </Form.Item>
              </Col>
            </Form>
          </FieldSet>
          <FieldSet data={{ title: '工单-表单设置' }}>
            <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 8 }}>
              <AgGridReact
                columnDefs={historyOrderColumn}
                rowData={orderData}
                defaultColDef={{
                  resizable: true,
                  filter: true,
                  flex: 1,
                  suppressMenu: true,
                  cellStyle: { 'line-height': '28px' },
                }}
                rowHeight={28}
                headerHeight={30}
                onGridReady={onGridReady}
                onGridSizeChanged={onGridReady}
                rowDragManaged={!finished}
                animateRows={true}
                onRowDragEnd={onDrag}
                frameworkComponents={{
                  deleteOrder: (p: CellClickedEvent) => (
                    <Fragment>
                      {hasPermission ? (
                        <img
                          title={'永久删除积压工单'}
                          width="20"
                          height="20"
                          src={require('../../../../public/delete_red.png')}
                          style={{ marginRight: 10 }}
                          onClick={() => onRemove(p.data)}
                        />
                      ) : (
                        <div />
                      )}
                      {DragIcon(p)}
                    </Fragment>
                  ),
                }}
              />
            </div>
          </FieldSet>
          <Divider plain>
            <strong>工单核对检查（rd平台暂无接口与sql工单）</strong>
          </Divider>
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 8 }}>
            <AgGridReact
              columnDefs={historyCompareColumn}
              rowData={compareData?.alpha ?? []}
              defaultColDef={{
                resizable: true,
                filter: true,
                flex: 1,
                suppressMenu: true,
                cellStyle: { 'line-height': '28px' },
              }}
              rowHeight={28}
              headerHeight={30}
              onGridReady={(r) => onGridReady(r, gridCompareRef)}
              onGridSizeChanged={(r) => onGridReady(r, gridCompareRef)}
              getRowStyle={(p) => ({
                background:
                  p.data.status == true
                    ? 'rgba(0, 255, 0, 0.06)'
                    : p.data.status == false
                    ? 'rgba(255, 2, 2, 0.06)'
                    : 'initial',
              })}
            />
          </div>
        </div>
      </PageContainer>
    </Spin>
  );
};
export default ReleaseOrder;
