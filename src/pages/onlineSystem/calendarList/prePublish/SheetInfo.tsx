import React, { forwardRef, useRef, useState, useMemo, useImperativeHandle } from 'react';
import styles from '@/pages/onlineSystem/releaseProcess/index.less';
import { Button, Col, DatePicker, Form, Input, Select, Spin, Row } from 'antd';
import cns from 'classnames';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { history } from '@@/core/history';
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
  const hasPermission = useMemo(() => {
    return { save: true };
  }, [user]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.releaseOrder}>
        <div className={styles.header}>
          <div className={styles.title}>工单基本信息</div>
          <Button size={'small'} onClick={() => {}} disabled={!hasPermission?.save || finished}>
            保存
          </Button>
        </div>
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
        <h3>一、工单-基础设置</h3>
        <Form size={'small'} form={baseForm} className={styles.baseInfo}>
          <Row>
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
          <Row>
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
              <Form.Item name={'cluster'} label={'工单名称'}>
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
              <Form.Item name={'ids'} label={'一键部署ID'} required={true}>
                <Select />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <h3>二、发布服务</h3>
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
        <h3>三、升级接口</h3>
        <div className="ag-theme-alpine" style={{ height: 180, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={PublishUpgradeColumn}
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
            onGridReady={onGridReady}
            onGridSizeChanged={onGridReady}
            rowDragManaged={!finished}
            animateRows={true}
            onRowDragEnd={onDrag}
            frameworkComponents={{
              operation: (p: CellClickedEvent) => (
                <div>
                  <div
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
                        `/onDutyAndRelease/preRelease?releasedNum=${p.data.release_num}&history=true`,
                      );
                    }}
                  >
                    {p.data.ready_release_name}
                  </div>
                  {DragIcon(p)}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
export default forwardRef(SheetInfo);
