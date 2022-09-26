import React, { useEffect, useRef, useState } from 'react';
import { Form, Row, Select, DatePicker, Button, Input, Col, Spin, Divider } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { releaseListColumn } from '@/pages/onDutyAndRelease/preRelease/releaseProcess/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { getHeight } from '@/publicMethods/pageSet';
import FieldSet from '@/components/FieldSet';
const ReleaseOrder = () => {
  const gridRef = useRef<GridApi>();
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getTableList = async (page = 1, page_size = 20) => {
    const values = form.getFieldsValue();
    try {
      setSpinning(true);
      await setRowData([]);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };
  useEffect(() => {
    getTableList();
  }, []);

  return (
    <div>
      <Spin spinning={spinning} tip="数据加载中...">
        <Form layout={'inline'} size={'small'} form={form} onFieldsChange={() => getTableList()}>
          <Col span={4}>
            <Form.Item name={'project'} label={'发布方式'}>
              <Select options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name={'num'} label={'发布时间'}>
              <Select options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'time'} label={'关联公告'} required>
              <Select options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'time'} label={'值班名单'}>
              <Select options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name={'result'}>
              <Select options={[]} style={{ width: '100%' }} placeholder={'标记发布结果'} />
            </Form.Item>
          </Col>
        </Form>
        <FieldSet data={{ title: '工单-基础设置' }}>
          <Form layout={'inline'} size={'small'} form={form} onFieldsChange={() => getTableList()}>
            <Col span={6}>
              <Form.Item name={'project'} label={'工单类型选择'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'num'} label={'工单名称'}>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name={'time'} label={'发布环境'} required>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Form>
        </FieldSet>
        <FieldSet data={{ title: '工单-表单设置' }}>
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginTop: 8 }}>
            <AgGridReact
              columnDefs={releaseListColumn('history')}
              rowData={rowData}
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
            />
          </div>
        </FieldSet>
        <Divider plain>工单核对检查（rd平台暂无接口与sql工单）</Divider>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginTop: 8 }}>
          <AgGridReact
            columnDefs={releaseListColumn('history')}
            rowData={rowData}
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
          />
        </div>
      </Spin>
    </div>
  );
};
export default ReleaseOrder;
