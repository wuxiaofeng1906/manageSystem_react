import React, { useEffect, useRef, useState } from 'react';
import { Form, Select, DatePicker, Spin, Col } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { releaseListColumn } from '@/pages/onDutyAndRelease/preRelease/releaseProcess/column';
import IPagination from '@/components/IPagination';
import { getHeight } from '@/publicMethods/pageSet';
import PreReleaseServices from '@/services/preRelease';

const HistoryList = () => {
  const gridRef = useRef<GridApi>();
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
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
    const res = await PreReleaseServices.project();
    setProjects(
      res?.map((it: any) => ({ label: it.project_name, value: it.project_id, key: it.project_id })),
    );
  };

  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 140);
  };

  const getTableList = async (page = 1, page_size = 20) => {
    const values = form.getFieldsValue();
    try {
      setSpinning(true);
      await setRowData([
        {
          id: '202209190031',
          name: '2022091898发布',
          project: 'sprint效果文化',
          number: '2344',
          services: 'apps,h5',
          pm: '张三，李四',
          branch: 'release20220822',
          type: '灰度推线上',
          method: '停服',
          env: '集群1',
        },
        {
          id: '202209190031',
          name: '2022091-global发布',
          project: '效果文化',
          number: '2342',
          services: 'apps',
          pm: '李四',
          branch: 'release20220822',
          type: '灰度推线上',
          method: '停服',
          env: '集群2345',
        },
      ]);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    getProject();
    getTableList();
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <Form layout={'inline'} size={'small'} form={form} onFieldsChange={() => getTableList()}>
        <Col span={8}>
          <Form.Item name={'project'} label={'发布项目'}>
            <Select options={projects} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'num'} label={'工单编号'}>
            <Select options={[]} style={{ width: '100%' }} />
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
