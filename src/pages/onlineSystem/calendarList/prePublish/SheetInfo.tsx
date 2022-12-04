import React, {
  forwardRef,
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  useEffect,
} from 'react';
import styles from '../../config/common.less';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Row,
  Space,
  Modal,
  InputNumber,
  ModalFuncProps,
} from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { infoMessage } from '@/publicMethods/showMessages';
import { useModel } from '@@/plugin-model/useModel';
import { PublishSeverColumn, PublishUpgradeColumn } from '@/pages/onlineSystem/config/column';
import { ClusterType, PublishWay, WhetherOrNot } from '@/pages/onlineSystem/config/constant';
import { history, useLocation, useParams } from 'umi';
import { Prompt } from 'react-router-dom';
import { initGridTable } from '@/utils/utils';
import AnnouncementServices from '@/services/announcement';
import PreReleaseServices from '@/services/preRelease';
import { OnlineSystemServices } from '@/services/onlineSystem';
import moment from 'moment';
import { isEmpty, omit, isString } from 'lodash';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { ModalSuccessCheck } from '@/pages/onlineSystem/releaseProcess/ReleaseOrder';

let agFinished = false; // 处理ag-grid 拿不到最新的state
// let agSql: any[] = [];

const SheetInfo = (props: any, ref: any) => {
  const query = useLocation()?.query;
  const { release_num } = useParams() as { release_num: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [globalState, envs, sqlList, setGlobalState] = useModel('onlineSystem', (online) => [
    online.globalState,
    online.envs,
    online.sqlList,
    online.setGlobalState,
  ]);

  const [spinning, setSpinning] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [tableHeight, setTableHeight] = useState((window.innerHeight - 460) / 2);
  const [baseForm] = Form.useForm(); // 工单基础摄制组
  const [orderForm] = Form.useForm();
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [upgradeData, setUpgradeData] = useState<{
    upgrade_api: any[];
    release_app: any;
    basic_data: any;
  } | null>();
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [leaveShow, setLeaveShow] = useState(false);

  const serverRef = useRef<GridApi>();
  const upgradeRef = useRef<GridApi>();

  useImperativeHandle(
    ref,
    () => {
      if (!release_num) return;
      return { onSave };
    },
    [release_num, upgradeData, deployments],
  );

  const onSave = async (flag = false) => {
    const upgrade_api = upgradeRef.current
      ?.getRenderedNodes()
      .map((it) => it.data)
      ?.map((it) => ({ ...it, concurrent: it.concurrent ?? 20, api_header: it.api_header ?? '' }));
    const release_app = serverRef.current?.getRenderedNodes().map((it) => it.data) ?? [];
    const baseValues = baseForm.getFieldsValue();
    const orderValues = orderForm.getFieldsValue();

    await OnlineSystemServices.updateOrderDetail({
      ready_release_num: release_num,
      user_id: user?.userid,
      upgrade_api,
      deployment: deployments.flatMap((it) =>
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
        auto_env: baseValues?.auto_env?.join(','),
      },
      release_app: {
        ...release_app?.[0],
        cluster: isString(release_app?.[0]?.cluster)
          ? release_app?.[0]?.cluster
          : release_app?.[0]?.cluster?.join(','),
        database_version: release_app?.[0]?.database_version ?? '',
      },
    });
    setLeaveShow(false);
    if (!flag) {
      await getDetail();
    }
  };

  const onDrag = async () => {
    if (agFinished) return infoMessage('已标记发布结果不能修改工单顺序!');
    if (!leaveShow) setLeaveShow(true);
  };

  useEffect(() => {
    if (query.key == 'sheet' && release_num) {
      getBaseList();
      getDetail();
    }
  }, [query, release_num]);

  const getDetail = async () => {
    setSpinning(true);
    try {
      let res = await OnlineSystemServices.getOrderDetail({ release_num });
      const basicInfo = res?.basic_data;
      orderForm.setFieldsValue({
        ...basicInfo,
        plan_release_time: basicInfo?.plan_release_time
          ? moment(basicInfo?.plan_release_time)
          : null,
        release_result:
          basicInfo?.release_result == 'unknown' ? undefined : basicInfo?.release_result,
        announcement_num: basicInfo?.announcement_num || undefined,
        person_duty_num: basicInfo?.person_duty_num || undefined,
      });
      baseForm.setFieldsValue({
        ...res?.basic_data,
        release_type: basicInfo?.release_type
          ? `${PublishWay[basicInfo?.release_type?.release_way]}:${
              ClusterType[basicInfo?.release_type?.release_type]
            }`
          : '',
        deployment: res?.deployment?.map((it: any) => String(it.deployment_id)),
        auto_env: basicInfo?.auto_env ? basicInfo?.auto_env?.split(',') : [],
        need_auto: basicInfo?.need_auto || undefined,
      });
      agFinished = !isEmpty(basicInfo?.release_result) && basicInfo?.release_result !== 'unknown';
      setFinished(agFinished);
      setUpgradeData(res);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  const getBaseList = async () => {
    const announce = await AnnouncementServices.preAnnouncement();
    const order = await PreReleaseServices.dutyOrder();
    const res = await OnlineSystemServices.deployments({ release_num });
    setDeployments(
      res?.map((it: any) => ({
        label: `${it.deployment_id}(${it.app} ${it.check_end_time})`,
        value: String(it.deployment_id),
        deployment_id: it.deployment_id,
        app: it.app,
        deployment_time: it.check_end_time,
      })),
    );
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

  const onSaveBeforeCheck = (isAuto = false) => {
    const order = orderForm.getFieldsValue();
    const base = baseForm.getFieldsValue();
    const result = order.release_result;
    if (isAuto && (isEmpty(result) || result == 'unknown')) return;

    const checkObj = omit({ ...order, ...base }, ['release_result']);
    const errTip = {
      plan_release_time: '请填写发布时间!',
      announcement_num: '请填写关联公告！',
      person_duty_num: '请填写值班名单',
      ready_release_name: '请填写工单名称!',
      deployment: '请填写一键部署ID',
      release_way: '请填写发布方式',
      auto_env: '请填写是否升级后自动化环境',
    };
    const valid = Object.values(checkObj).some((it) => isEmpty(it));

    if (valid) {
      const errArr = Object.entries(checkObj).find(([k, v]) => isEmpty(v)) as any[];
      infoMessage(errTip[errArr?.[0]]);
      orderForm.setFieldsValue({ release_result: null });
      return;
    }
    if (isEmpty(base.ready_release_name?.trim())) {
      orderForm.setFieldsValue({ release_result: null });
      return infoMessage(errTip.ready_release_name);
    }
    // 发布结果为空，直接保存
    if (isEmpty(result) || result == 'unknown') {
      onSave();
    } else {
      // 二次确认标记发布结果
      const tips = {
        cancel: { title: '取消发布提醒', content: '取消发布将删除工单，请确认是否取消发布?' },
        success: { title: '发布成功提醒', content: '请确认是否标记发布成功?' },
        failure: { title: '发布失败提醒', content: '请确认是否标记发布失败?' },
      };
      if (result == 'success') {
        setSuccessModal(true);
      } else {
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          centered: true,
          title: tips[result].title,
          content: tips[result].content,
          icon: <InfoCircleOutlined style={{ color: result == 'cancel' ? 'red' : '#1585ff' }} />,
          okButtonProps: { disabled: confirmDisabled },
          onOk: async () => {
            setConfirmDisabled(true);
            try {
              if (result == 'cancel') {
                await PreReleaseServices.removeRelease(
                  {
                    user_id: user?.userid ?? '',
                    release_num,
                  },
                  false,
                );
              } else await onSave();
            } catch (e) {
              setConfirmDisabled(false);
            }
            history.replace(`/onlineSystem/prePublish/${release_num}`);
          },
          onCancel: () => {
            orderForm.setFieldsValue({ release_result: null });
          },
        });
      }
    }
  };

  const onSuccessConfirm = async (data: any) => {
    setSuccessModal(false);
    if (isEmpty(data)) {
      orderForm.setFieldsValue({ release_result: null });
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
          ready_release_num: release_num ?? '',
        });
      });
      await onSave(true);
      agFinished = true;
      setFinished(true);
      await PreReleaseServices.automation(params);
      // 关联公告并勾选挂起公告
      if (!hasAnnouncement && data.announcement) {
        await PreReleaseServices.saveAnnouncement({
          user_id: user?.userid ?? '',
          announcement_num: orderForm.getFieldValue('announcement_num'),
          announcement_time: 'after',
        });
      }
      history.replace(`/onlineSystem/prePublish/${release_num}`);
    }
  };

  // 是否关联了公告
  const hasAnnouncement = useMemo(() => {
    const announce = baseForm.getFieldValue('announcement_num');
    return isEmpty(announce) || announce == '免';
  }, [orderForm?.getFieldValue('announcement_num')]);

  const hasPermission = useMemo(() => {
    return { save: true };
  }, [user]);

  window.onresize = function () {
    setTableHeight((window.innerHeight - 460) / 2);
  };

  useEffect(() => {
    const listener = (ev) => {
      ev.preventDefault();
      ev.returnValue = '离开提示';
    };
    if (leaveShow && query.key == 'sheet') {
      window.addEventListener('beforeunload', listener);
    }
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [leaveShow, query]);

  const computedServer = useMemo(() => PublishSeverColumn(upgradeData?.basic_data), [
    upgradeData?.basic_data,
  ]);

  useEffect(() => {
    setGlobalState({
      locked: finished ? true : globalState?.locked,
      finished,
      step: finished ? 2 : globalState.step,
    });
  }, [finished]);

  const renderSelect = (p: CellClickedEvent) => {
    const field = p.column.colId;
    return (
      <Select
        size={'small'}
        value={p.value ? (field == 'cluster' ? p.value?.split(',') : p.value) : undefined}
        style={{ width: '100%' }}
        disabled={agFinished}
        mode={field == 'cluster' ? 'multiple' : undefined}
        options={
          field == 'sql_order'
            ? sqlList
            : field == 'cluster'
            ? envs
            : Object.keys(WhetherOrNot)?.map((k) => ({
                value: k,
                label: WhetherOrNot[k],
              }))
        }
        onChange={(v) => {
          const rowNode = serverRef.current?.getRowNode(String(p.rowIndex));
          rowNode?.setData({ ...p.data, [field]: v });
          if (!leaveShow) setLeaveShow(true);
        }}
      />
    );
  };

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Prompt
        when={leaveShow && query.key == 'sheet'}
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
                  style={{ width: '100%' }}
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
                  style={{ width: '100%' }}
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
                        allowClear
                        disabled={finished}
                        className={styles.selectColor}
                        onChange={() => onSaveBeforeCheck(true)}
                        options={[
                          { label: '发布成功', value: 'success', key: 'success' },
                          { label: '发布失败', value: 'failure', key: 'failure' },
                          { label: '取消发布', value: 'cancel', key: 'cancel' },
                          { label: '', value: 'unknown', key: 'unknown' },
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
          </Row>
        </Form>
        <h4 style={{ margin: '16px 0' }}>一、工单-基础设置</h4>
        <Form
          size={'small'}
          form={baseForm}
          className={styles.resetForm}
          onFieldsChange={() => {
            if (!leaveShow) setLeaveShow(true);
          }}
        >
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'branch'} label={'预发布分支'}>
                <Input style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item name={'project'} label={'预发布项目'}>
                <Input style={{ width: '100%' }} disabled />
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
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'ready_release_name'} label={'工单名称'} required>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'need_auto'} label={'是否需要跑升级后自动化'}>
                <Select
                  disabled={finished}
                  style={{ width: '100%' }}
                  options={Object.keys(WhetherOrNot).map((it) => ({
                    label: WhetherOrNot[it],
                    value: it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'auto_env'} label={'跑升级后自动化环境'} required>
                <Select disabled={finished} options={envs} mode={'multiple'} />
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
        <h4 style={{ margin: '16px 0' }}>二、发布服务</h4>
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={computedServer}
            rowData={isEmpty(upgradeData?.release_app) ? [] : [upgradeData?.release_app]}
            {...initGridTable({ ref: serverRef, height: 30 })}
            frameworkComponents={{ select: renderSelect }}
          />
        </div>
        <h4 style={{ margin: '16px 0' }}>三、升级接口</h4>
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%' }}>
          <AgGridReact
            rowDragManaged={!finished}
            animateRows={true}
            onRowDragEnd={onDrag}
            columnDefs={PublishUpgradeColumn}
            rowData={upgradeData?.upgrade_api ?? []}
            {...initGridTable({ ref: upgradeRef, height: 30 })}
            frameworkComponents={{
              operation: (p: CellClickedEvent) => (
                <Space size={8}>
                  <img
                    src={require('../../../../../public/edit.png')}
                    style={{
                      width: 18,
                      height: 18,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setVisible(true);
                      setActiveItem({ ...p.data, rowIndex: String(p.rowIndex) });
                    }}
                  />
                  {DragIcon(p)}
                  <img
                    src={require('../../../../../public/logs.png')}
                    style={{
                      width: 18,
                      height: 18,
                      cursor: 'pointer',
                    }}
                    onClick={() => {}}
                  />
                </Space>
              ),
            }}
          />
        </div>
        <EditModal
          visible={visible}
          data={activeItem}
          onOk={(v) => {
            if (v) {
              const rowNode = upgradeRef.current?.getRowNode(activeItem.rowIndex);
              rowNode?.setData({ ...activeItem, concurrent: v.concurrent });
              if (!leaveShow) setLeaveShow(true);
            }
            setVisible(false);
          }}
        />
        <ModalSuccessCheck
          visible={successModal}
          onOk={(v?: any) => onSuccessConfirm(v)}
          disabled={hasAnnouncement}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(SheetInfo);

const EditModal = (props: ModalFuncProps & { data: any }) => {
  const [form] = Form.useForm();

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
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item label={'接口服务'} name={'api_server'}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={'接口URL'} name={'api_url'}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={'并发数'}
          name={'concurrent'}
          rules={[{ message: '请填写并发数', required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={99999999} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
