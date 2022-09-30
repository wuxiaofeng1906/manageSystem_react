import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Select, DatePicker, Button, Input, Col, Spin, Divider, Collapse, Modal } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  historyCompareColumn,
  historyOrderColumn,
} from '@/pages/onDutyAndRelease/releaseProcess/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import FieldSet from '@/components/FieldSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import AnnouncementServices from '@/services/announcement';
import { useModel, useParams } from 'umi';
import { isEmpty, omit } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import moment from 'moment';

const ReleaseOrder = () => {
  const { id } = useParams() as { id: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const gridRef = useRef<GridApi>();
  const gridCompareRef = useRef<GridApi>();
  const [orderForm] = Form.useForm();
  const [baseForm] = Form.useForm();
  const [orderData, setOrderData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [envList, setEnvList] = useState<any[]>([]);

  const [spinning, setSpinning] = useState(false);

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
      envs?.map((it: any) => ({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
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
      setOrderData(res.ready_data ?? []);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  const onLinkTable = async () => {
    const values = baseForm.getFieldsValue();
    const res = await PreReleaseServices.orderList(values.cluster?.join(',') ?? '');
    const ops = await PreReleaseServices.opsList(values.cluster?.join(',') ?? '');
    const flag = res.some((it: any) => it.repair_order_type.indexOf('停机') > -1);
    orderForm.setFieldsValue({
      release_way: flag ? 'stop_server' : 'keep_server',
    });
    let result: any[] = [];
    ops.forEach((it: any, i: number) => {
      const otherOrder = !['BlueGreenDeploy', 'TenantStopDeploy'].includes(it.release_order_type);
      result.push({
        opsId: String(it.id ?? ''),
        opsTitle: it.label,
        opsType: it.release_order_type,
        rd: otherOrder ? '' : res[i] ? res[i]?.repair_order : '',
        rdTitle: otherOrder ? '' : res[i] ? `${res[i]?.repair_order}:${res[i]?.project}` : '',
        rdType: otherOrder
          ? ''
          : res[i]
          ? `${res[i]?.repair_order}:${res[i]?.repair_order_type}`
          : '',
      });
    });
    console.log(result);

    setOrderData(res);
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

  const onSave = async () => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const result = !isEmpty(base.release_result);
    const checkObj = omit({ ...order, ...base }, ['release_result']);
    // 标记发布结果： 1：停服时，必须关联发布公告
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

    if (result && ['success', 'failure'].includes(base.release_result)) {
      if (base.announcement_num == '免' && base.release_way == 'stop_server')
        return infoMessage(errTip.announcement_num);
    }
    await PreReleaseServices.saveOrder({
      user_id: user?.userid ?? '',
      release_name: base.release_name?.trim() ?? '',
      person_duty_num: order.person_duty_num,
      announcement_num: order.announcement_num ?? '',
      plan_release_time: moment(order.plan_release_time).format('YYYY-MM-DD HH:mm:ss'),
      release_type: 'backlog_release',
      release_way: order.release_way ?? '',
      release_result: order.release_result,
      cluster: base.cluster?.join(',') ?? '',
      release_num: id, // 发布编号
      ready_release_num: orderData.map((it) => it.ready_release_num)?.join(',') ?? '', // 积压工单id
    });
    // 更新详情
  };

  const onRemove = (data: any) => {
    Modal.confirm({
      centered: true,
      title: '删除积压工单提醒：',
      content: '请确认是否要永久删除该积压工单！',
      onOk: async () => {
        await PreReleaseServices.removeOrder({ ready_release_num: data.ready_release_num });
        getOrderDetail();
      },
    });
  };
  const hasPermission = useMemo(() => user?.group == 'superGroup', []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.releaseOrder}>
        <Collapse defaultActiveKey={'1'} className={styles.collapse}>
          <Collapse.Panel key={'1'} header={'工单'}>
            <div className={styles.save}>
              <Button size={'small'} onClick={onSave}>
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
                  <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'announcement_num'} label={'关联公告'} required>
                  <Select
                    showSearch
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
                    optionFilterProp={'label'}
                    options={[{ key: '免', value: '免', label: '免' }].concat(dutyList)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name={'release_result'}>
                  <Select
                    options={[
                      { label: '发布成功', value: 'success', key: 'success' },
                      { label: '发布失败', value: 'failure', key: 'failure' },
                      { label: '取消发布', value: 'cancel', key: 'cancel' },
                      { label: ' ', value: 'unknown', key: 'unknown' },
                    ]}
                    style={{ width: '100%' }}
                    placeholder={'标记发布结果'}
                  />
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
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name={'cluster'} label={'发布环境'} required>
                <Select
                  showSearch
                  options={envList}
                  style={{ width: '100%' }}
                  mode={'multiple'}
                  onBlur={onLinkTable}
                  onDeselect={onLinkTable}
                />
              </Form.Item>
            </Col>
          </Form>
        </FieldSet>
        <FieldSet data={{ title: '工单-表单设置' }}>
          <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 8 }}>
            <AgGridReact
              columnDefs={historyOrderColumn.flatMap((it) => [
                { ...it, hide: it.headerName == '操作' && !hasPermission },
              ])}
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
              frameworkComponents={{
                deleteOrder: (p) => (
                  <Button
                    size={'small'}
                    type={'text'}
                    onClick={() => onRemove(p.data)}
                    style={{ color: '#fb5858', padding: 0, fontWeight: 500 }}
                  >
                    永久删除积压工单
                  </Button>
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
            rowData={compareData}
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
                p.data.status == 'success'
                  ? 'rgba(0, 255, 0, 0.06)'
                  : p.data.status == 'error'
                  ? 'rgba(255, 2, 2, 0.06)'
                  : 'initial',
            })}
          />
        </div>
      </div>
    </Spin>
  );
};
export default ReleaseOrder;
