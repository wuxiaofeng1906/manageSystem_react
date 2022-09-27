import React, { useEffect, useRef, useState } from 'react';
import { Form, Select, DatePicker, Button, Input, Col, Spin, Divider, Collapse } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  historyCompareColumn,
  historyOrderColumn,
} from '@/pages/onDutyAndRelease/preRelease/releaseProcess/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import FieldSet from '@/components/FieldSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import AnnouncementServices from '@/services/announcement';

const ReleaseOrder = () => {
  const gridRef = useRef<GridApi>();
  const gridCompareRef = useRef<GridApi>();
  const [form] = Form.useForm();
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

  const getDutyList = async () => {
    const res = await PreReleaseServices.dutyOrder();
    setDutyList(
      res?.map((it: any) => ({
        label: it.duty_name ?? '',
        value: it.person_duty_num,
        key: it.person_duty_num,
      })),
    );
  };
  const getEnvList = async () => {
    const res = await PreReleaseServices.environment();
    setEnvList(
      res?.map((it: any) => ({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
      })),
    );
  };
  const getAnnouncementList = async () => {
    const res = await AnnouncementServices.preAnnouncement();
    setAnnouncementList(
      res.map((it: any) => ({
        label: it.announcement_name,
        value: it.announcement_num,
        key: it.announcement_num,
      })),
    );
  };

  const getTableList = async () => {
    try {
      setSpinning(true);
      setOrderData([
        { type: '停机发布', number: '4178', list: '库存管理，存货管理，采购管理', env: '集群1' },
      ]);
      setCompareData([
        {
          id: 1,
          rd: '4178:库存管理，存货管理，采购管理',
          ops: '4178:库存管理，存货管理，采购管理',
          status: 'success',
        },
        {
          id: 2,
          rd: '',
          ops: '4179:库存管理，存货管理，采购管理',
          status: '',
        },
        {
          id: 3,
          rd: '4134:库存管理，存货管理，采购管理',
          ops: '4134:库存管理，存货管理，采购管理',
          status: 'success',
        },
        {
          id: 4,
          rd: '4130:库存管理，存货管理',
          ops: '4134:库存管理，存货管理，采购管理',
          status: 'error',
        },
      ]);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };
  useEffect(() => {
    getDutyList();
    getEnvList();
    getAnnouncementList();
    getTableList();
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.releaseOrder}>
        <Collapse defaultActiveKey={'1'} className={styles.collapse}>
          <Collapse.Panel key={'1'} header={'工单'}>
            <div className={styles.save}>
              <Button size={'small'}>保存</Button>
            </div>
            <Form
              layout={'inline'}
              size={'small'}
              form={form}
              onFieldsChange={() => getTableList()}
              className={styles.baseInfo}
            >
              <Col span={4}>
                <Form.Item name={'method'} label={'发布方式'}>
                  <Select options={[]} style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name={'time'} label={'发布时间'}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'announce'} label={'关联公告'} required>
                  <Select
                    showSearch
                    options={[{ key: '免', value: '免', label: '免' }].concat(announcementList)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name={'order'} label={'值班名单'}>
                  <Select
                    showSearch
                    options={[{ key: '免', value: '免', label: '免' }].concat(dutyList)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name={'result'}>
                  <Select
                    options={[
                      { label: '发布成功', value: 'success', key: 'success' },
                      { label: '发布失败', value: 'failure', key: 'failure' },
                      { label: '取消发布', value: 'cancel', key: 'cancel' },
                      { label: '', value: 'unknown', key: 'unknown' },
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
          <Form
            layout={'inline'}
            size={'small'}
            form={baseForm}
            onFieldsChange={() => getTableList()}
            className={styles.baseInfo}
          >
            <Col span={6}>
              <Form.Item name={'project'} label={'工单类型选择'}>
                <Select options={[]} style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'num'} label={'工单名称'}>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name={'env'} label={'发布环境'} required>
                <Select showSearch options={envList} style={{ width: '100%' }} />
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
              frameworkComponents={{
                deleteOrder: (p) => (
                  <Button
                    size={'small'}
                    type={'text'}
                    onClick={() => {
                      console.log(p);
                    }}
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
