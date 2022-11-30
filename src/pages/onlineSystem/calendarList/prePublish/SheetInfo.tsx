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
import { ClusterType, WhetherOrNot } from '@/pages/onlineSystem/config/constant';
import { history, useLocation, useParams } from 'umi';
import { Prompt } from 'react-router-dom';
import { initGridTable } from '@/utils/utils';
import AnnouncementServices from '@/services/announcement';
import PreReleaseServices from '@/services/preRelease';
import { OnlineSystemServices } from '@/services/onlineSystem';
import moment from 'moment';

let agFinished = false; // 处理ag-grid 拿不到最新的state

const SheetInfo = (props: any, ref: any) => {
  const query = useLocation()?.query;
  const { release_num } = useParams() as { release_num: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [globalState] = useModel('onlineSystem', (online) => [online.globalState]);

  const [spinning, setSpinning] = useState(false);
  const [tableHeight, setTableHeight] = useState((window.innerHeight - 460) / 2);
  const [baseForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [upgradeData, setUpgradeData] = useState<{
    upgrade_api: any[];
    release_app: any;
    basic_data: any;
  } | null>();
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [isSave, setIssave] = useState(false);
  const [basicInfo, setBasicInfo] = useState<any>();

  const serverRef = useRef<GridApi>();
  const upgradeRef = useRef<GridApi>();

  useImperativeHandle(
    ref,
    () => ({
      onSave: onSave,
    }),
    [release_num],
  );

  const onSave = async () => {
    const res = await OnlineSystemServices.updateOrderDetail({
      ready_release_num: release_num,
      user_id: user?.userid,
      deployment: [{ deployment_id: '', app: '', deployment_time: '' }],
      basic_data: {
        ready_release_name: 'string',
        plan_release_time: 'string',
        release_way: 'string',
        branch: 'string',
        release_type: 'string',
        project: 'string',
        announcement_num: 'string',
        person_duty_num: 'string',
        release_result: 'string',
      },
      release_app: {
        cluster: 'string',
        apps: 'string',
        release_env: 'string',
        batch: 'string',
        database_version: 'string',
        is_recovery: 'string',
        is_update: 'string',
        clear_redis: 'string',
        clear_cache: 'string',
      },
      upgrade_api: upgradeRef.current,
    });
    getDetail();
  };
  const onDrag = async () => {
    if (true) return infoMessage('已标记发布结果不能修改工单顺序!');
    const sortArr: any = [];
    upgradeRef.current?.forEachNode(function (node) {
      sortArr.push({ ...node.data });
    });
  };

  useEffect(() => {
    if (query.key == 'sheet') {
      getBaseList();
      getDetail();
    }
  }, [query, release_num]);

  const getDetail = async () => {
    const res = await OnlineSystemServices.getOrderDetail({ release_num });
    orderForm.setFieldsValue({
      ...res?.basic_data,
      plan_release_time: res?.basic_data?.plan_release_time
        ? moment(res?.basic_data?.plan_release_time)
        : null,
      release_result:
        res?.basic_data?.release_result == 'unknown' ? undefined : res?.basic_data?.release_result,
    });
    baseForm.setFieldsValue({ ...res?.basic_data });
    setBasicInfo(res?.basic_data);
    setUpgradeData(res);
  };

  const getBaseList = async () => {
    const announce = await AnnouncementServices.preAnnouncement();
    const order = await PreReleaseServices.dutyOrder();
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
    if (isSave) {
      window.addEventListener('beforeunload', listener);
    }
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [isSave]);

  const computedServer = useMemo(() => PublishSeverColumn(basicInfo), [basicInfo]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Prompt
        when={isSave}
        message={'离开当前页后，所有未保存的数据将会丢失，请确认是否仍要离开？'}
      />
      <div>
        <Form
          size={'small'}
          form={orderForm}
          className={styles.bgForm + ' ' + styles.resetForm + ' no-wrap-form'}
        >
          <Row gutter={3}>
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
                  format={'YYYY-MM-DD HH:mm'}
                  allowClear={false}
                  showTime
                  disabled={finished}
                  onChange={(e) => {
                    setIssave(true);
                  }}
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
                        // disabled={!hasPermission?.saveResult || finished}
                        className={styles.selectColor}
                        // onChange={() => onSaveBeforeCheck(true)}
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
          </Row>
        </Form>
        <h4 style={{ margin: '16px 0' }}>一、工单-基础设置</h4>
        <Form size={'small'} form={baseForm} className={styles.resetForm}>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'branch'} label={'预发布分支'}>
                <Select options={[]} style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item name={'project'} label={'预发布项目'}>
                <Select style={{ width: '100%' }} disabled />
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
              <Form.Item name={'cluster'} label={'是否需要跑升级后自动化'}>
                <Select
                  style={{ width: '100%' }}
                  options={Object.keys(WhetherOrNot).map((it) => ({
                    label: WhetherOrNot[it],
                    value: it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'auto_env'} label={'跑升级后自动化环境'}>
                <Select />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={18}>
              <Form.Item name={'ids'} label={'一键部署ID'} required>
                <Select showSearch allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <a target={'_blank'} href={'www.baidu.com'}>
                点击进入自动化平台
              </a>
            </Col>
          </Row>
        </Form>
        <h4 style={{ margin: '16px 0' }}>二、发布服务</h4>
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={computedServer}
            rowData={[upgradeData?.release_app]}
            {...initGridTable({ ref: serverRef, height: 30 })}
            frameworkComponents={{
              select: (p: CellClickedEvent) => {
                return (
                  <Select
                    size={'small'}
                    value={p.value}
                    style={{ width: '100%' }}
                    options={Object.keys(WhetherOrNot)?.map((k) => ({
                      value: k,
                      label: WhetherOrNot[k],
                    }))}
                    onChange={(v) => {}}
                  />
                );
              },
            }}
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
                      setActiveItem(p.data);
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
            setVisible(false);
          }}
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
