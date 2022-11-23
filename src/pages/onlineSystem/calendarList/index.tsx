import React, { useEffect, useRef, useState } from 'react';
import { Form, Select, Spin, Col } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import IPagination from '@/components/IPagination';
import { getHeight } from '@/publicMethods/pageSet';
import { calendarColumn } from '@/pages/onlineSystem/config/column';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import styles from '../config/common.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { PublishStatus } from '@/pages/onlineSystem/config/constant';

const CalendarList = () => {
  const gridRef = useRef<GridApi>();

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [gridHeight, setGridHeight] = useState(getHeight() - 60);
  const [projects, setProjects] = useState<any[]>([]);
  const [branch, setBranch] = useState<any[]>([]);

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 60);
  };
  const getSelectList = async () => {
    const projects = await OnlineSystemServices.getProjects();
    const branchs = await OnlineSystemServices.getBranch();
    setProjects(projects?.map((it: any) => ({ label: it.project_name, value: it.project_id })));
    setBranch(branchs?.map((it: any) => ({ label: it.branch_name, value: it.branch_id })));
  };
  const getTableList = async (page = 1, page_size = 20) => {
    try {
      setSpinning(true);
      const values = form.getFieldsValue();
      const res = await OnlineSystemServices.getOnlineList({
        pro_id: values.pro_ids?.join(',') ?? '',
        branch: values.repair_order?.join(',') ?? '',
        release_status: values.release_status?.join(',') ?? '',
        page: page,
        page_size: page_size,
      });
      setRowData(res?.data ?? []);
      setPages({ page: res?.page ?? 1, total: res?.count ?? 0, page_size: res.page_size });
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    getSelectList();
    getTableList();
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer>
        <div className={styles.calendarList}>
          <Form layout={'inline'} size={'small'} form={form} onFieldsChange={() => getTableList()}>
            <Col span={8}>
              <Form.Item name={'branch'} label={'上线分支'}>
                <Select options={branch} optionFilterProp={'label'} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'pro_ids'} label={'项目名称'}>
                <Select
                  options={projects}
                  optionFilterProp={'label'}
                  mode={'multiple'}
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={'release_status'} label={'状态'}>
                <Select
                  style={{ width: '100%' }}
                  mode={'multiple'}
                  showSearch
                  options={Object.keys(PublishStatus)?.map((k) => ({
                    value: k,
                    label: PublishStatus[k],
                  }))}
                />
              </Form.Item>
            </Col>
          </Form>
          <div
            className="ag-theme-alpine"
            style={{ height: gridHeight, width: '100%', marginTop: 8 }}
          >
            <AgGridReact
              columnDefs={calendarColumn}
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
              frameworkComponents={{
                link: (p: CellClickedEvent) => {
                  return (
                    <div
                      style={{
                        color: '#1890ff',
                        cursor: 'pointer',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onClick={() => {
                        history.push(`/onlineSystem/profile/${p.data.online_branch}`);
                      }}
                    >
                      {p.value}
                    </div>
                  );
                },
              }}
            />
          </div>
          <IPagination
            page={pages}
            onChange={getTableList}
            showQuickJumper={getTableList}
            onShowSizeChange={(size) => getTableList(1, size)}
          />
        </div>
      </PageContainer>
    </Spin>
  );
};
export default CalendarList;
