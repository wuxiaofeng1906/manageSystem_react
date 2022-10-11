import React, { useEffect, useRef, useState } from 'react';
import { Form, Select, DatePicker, Spin, Col } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { releaseListColumn } from '@/pages/onDutyAndRelease/releaseProcess/column';
import IPagination from '@/components/IPagination';
import { getHeight } from '@/publicMethods/pageSet';
import PreReleaseServices from '@/services/preRelease';
import { useLocation } from 'umi';

const HistoryList = () => {
  const gridRef = useRef<GridApi>();
  const query = useLocation()?.query;

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [gridHeight, setGridHeight] = useState(getHeight() - 140);

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getProject = async () => {
    const project = await PreReleaseServices.project();
    const order = await PreReleaseServices.orderNumbers();
    setProjects(
      project?.map((it: any) => ({
        label: it.project_name,
        value: it.project_id,
        key: it.project_id,
      })),
    );
    setOrders(order?.flatMap((num: string) => (num ? [{ label: num, value: num, key: num }] : [])));
  };

  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 140);
  };

  const getTableList = async (page = 1, page_size = 20) => {
    try {
      setSpinning(true);
      const values = form.getFieldsValue();
      const res = await PreReleaseServices.historyList({
        pro_ids: values.pro_ids?.join(',') ?? '',
        repair_order: values.repair_order?.join(',') ?? '',
        page: page,
        page_size: page_size,
      });
      setRowData(
        res.data?.map((it: any) => ({
          ...it,
          project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
        })) ?? [],
      );
      setPages({ page: res.page, total: res.total, page_size: res.page_size });
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    getProject();
  }, []);
  useEffect(() => {
    if (query.key == 'history') getTableList();
  }, [query.key]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Form layout={'inline'} size={'small'} form={form} onFieldsChange={() => getTableList()}>
        <Col span={8}>
          <Form.Item name={'pro_ids'} label={'发布项目'}>
            <Select
              options={projects}
              optionFilterProp={'label'}
              style={{ width: '100%' }}
              mode={'multiple'}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'repair_order'} label={'工单编号'}>
            <Select
              options={orders ?? []}
              optionFilterProp={'label'}
              style={{ width: '100%' }}
              mode={'multiple'}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name={'time'} label={'发布日期'}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Form>
      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%', marginTop: 8 }}>
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
      <IPagination
        page={pages}
        onChange={getTableList}
        showQuickJumper={getTableList}
        onShowSizeChange={(size) => getTableList(1, size)}
      />
    </Spin>
  );
};
export default HistoryList;
