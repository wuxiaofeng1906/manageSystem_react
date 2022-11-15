import React, {
  forwardRef,
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
  useEffect,
} from 'react';
import styles from '@/pages/onlineSystem/releaseProcess/index.less';
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
import cns from 'classnames';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { infoMessage } from '@/publicMethods/showMessages';
import { useModel } from '@@/plugin-model/useModel';
import { PublishSeverColumn, PublishUpgradeColumn } from '@/pages/onlineSystem/common/column';

let agFinished = false; // 处理ag-grid 拿不到最新的state

const SheetInfo = (props: any, ref: any) => {
  const [spinning, setSpinning] = useState(false);
  const [baseForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [finished, setFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [upgradeData, setUpgradeData] = useState<any[]>([]);
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const gridRef = useRef<GridApi>();
  const gridCompareRef = useRef<GridApi>();

  useImperativeHandle(ref, () => ({
    onSave: () => {
      console.log('save');
    },
  }));

  const onGridReady = (params: GridReadyEvent, ref = gridRef) => {
    ref.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onDrag = async () => {
    if (true) return infoMessage('已标记发布结果不能修改工单顺序!');
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node) {
      sortArr.push({ ...node.data });
    });
  };
  useEffect(() => {
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
  const hasPermission = useMemo(() => {
    return { save: true };
  }, [user]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.releaseOrder}>
        <Form
          layout={'inline'}
          size={'small'}
          form={orderForm}
          className={cns(styles.baseInfo, styles.bgForm)}
        >
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
                options={[{ key: '免', value: '免', label: '免' }].concat([])}
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
                options={[{ key: '免', value: '免', label: '免' }].concat([])}
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
        <h4>一、工单-基础设置</h4>
        <Form size={'small'} form={baseForm} className={styles.baseInfo}>
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
              <Form.Item name={'cluster'} label={'发布环境工单类型选择'} required>
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
              <Form.Item name={'cluster'} label={'工单名称'} required>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'cluster'} label={'是否需要升级后自动化'}>
                <Select showSearch options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={'cluster'} label={'升级后自动化结果'}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name={'ids'} label={'一键部署ID'} required>
                <Select />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <h4>二、发布服务</h4>
        <div className="ag-theme-alpine" style={{ height: 180, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={PublishSeverColumn}
            rowData={[]}
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
          />
        </div>
        <h4>三、升级接口</h4>
        <div className="ag-theme-alpine" style={{ height: 180, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={PublishUpgradeColumn}
            rowData={upgradeData}
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
