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
import { WhetherOrNot } from '@/pages/onlineSystem/config/constant';
import { history, useLocation } from 'umi';
import { Prompt } from 'react-router-dom';
import { initGridTable } from '@/utils/utils';
import AnnouncementServices from '@/services/announcement';
import PreReleaseServices from '@/services/preRelease';

let agFinished = false; // 处理ag-grid 拿不到最新的state

const SheetInfo = (props: any, ref: any) => {
  const query = useLocation()?.query;
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [globalState] = useModel('onlineSystem', (online) => [online.globalState]);

  const [spinning, setSpinning] = useState(false);
  const [tableHeight, setTableHeight] = useState((window.innerHeight - 460) / 2);
  const [baseForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [upgradeData, setUpgradeData] = useState<any[]>([]);
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [isSave, setIssave] = useState(false);

  const serverRef = useRef<GridApi>();
  const upgradeRef = useRef<GridApi>();

  useImperativeHandle(
    ref,
    () => ({
      onSave: () => {
        console.log('save');
      },
    }),
    [],
  );

  const onDrag = async () => {
    if (true) return infoMessage('已标记发布结果不能修改工单顺序!');
    const sortArr: any = [];
    upgradeRef.current?.forEachNode(function (node) {
      sortArr.push({ ...node.data });
    });
  };

  useEffect(() => {
    getBaseList();
    getDetail();
  }, []);

  const getDetail = async () => {
    setUpgradeData([
      {
        release_num: '111111',
        server: 'basebi',
        method: 'post',
        url: '/basebi/',
        tendent: '全量租户',
        count: 20,
      },
    ]);
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
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [isSave]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Prompt
        when={isSave}
        message={'离开当前页后，所有未保存的数据将会丢失，请确认是否仍要离开？'}
      />
      <div>
        <Form layout={'inline'} size={'small'} form={orderForm} className={styles.bgForm}>
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
        </Form>
        <h4 style={{ margin: '16px 0' }}>一、工单-基础设置</h4>
        <Form size={'small'} form={baseForm} className={styles.resetForm}>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'release_type'} label={'预发布分支'}>
                <Select options={[]} style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item name={'release_name'} label={'预发布项目'}>
                <Select style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name={'order'} label={'工单类型选择'} required>
                <Select
                  showSearch
                  disabled
                  options={[]}
                  style={{ width: '100%' }}
                  mode={'multiple'}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'name'} label={'工单名称'} required>
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
              <Form.Item name={'result'} label={'升级后自动化结果'}>
                <Input />
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
            columnDefs={PublishSeverColumn}
            rowData={[]}
            {...initGridTable({ ref: serverRef, height: 30 })}
          />
        </div>
        <h4 style={{ margin: '16px 0' }}>三、升级接口</h4>
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%' }}>
          <AgGridReact
            rowDragManaged={!finished}
            animateRows={true}
            onRowDragEnd={onDrag}
            columnDefs={PublishUpgradeColumn}
            rowData={upgradeData}
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
    props.onOk?.(true);
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
        <Form.Item label={'接口服务'} name={'server'}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={'接口Method'} name={'method'}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={'并发数'}
          name={'count'}
          rules={[{ message: '请填写并发数', required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={99999999} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
