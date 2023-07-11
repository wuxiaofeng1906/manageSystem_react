import React, {useEffect, useRef, useState} from 'react';
import {Form, Select, DatePicker, Spin, Col, Row} from 'antd';
import {AgGridReact} from 'ag-grid-react';
import {CellClickedEvent, GridApi, GridReadyEvent} from 'ag-grid-community';
import {historyReleaseListColumn} from '@/pages/onlineSystem/releaseProcess/column';
import IPagination from '@/components/IPagination';
import PreReleaseServices from '@/services/preRelease';
import {useLocation} from 'umi';
import {isEmpty} from 'lodash';
import moment from 'moment';
import {history} from '@@/core/history';
import "./index.less";

const HistoryList = ({height}: { height: number }) => {
  const gridRef = useRef<GridApi>();
  const query = useLocation()?.query;

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);

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
    setOrders(order?.flatMap((num: string) => (num ? [{label: num, value: num, key: num}] : [])));
  };

  // 处理失败和成功的数据
  const dealRows = (data: any) => {
    const dealedData: any = [];
    if (data && data.length) {
      data.forEach((it: any, index: number) => {
          //   需要单独处理发布成功的数据，需要判断里面有无发布失败的集群。
          if (it.release_result === "success" && it.failure_cluster.length) {
            const basic = {
              ...it,
              project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
            }
            // 有失败集群
            dealedData.push({
              ...basic,
              sortNo: index + 1,
              rowSpan: 2,
            }, {
              ...basic,
              cluster: it.failure_cluster, // 将失败的集群赋值到cluster中用于展示
              release_result: "failure"
            });
          } else {
            dealedData.push({
              ...it,
              sortNo: index + 1,
              project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
            })
          }
        }
      );
    }
    setRowData(dealedData);
  };

  const getTableList = async (page = 1, page_size = pages.page_size) => {
    try {
      setSpinning(true);
      const values = form.getFieldsValue();
      const res = await PreReleaseServices.historyList({
        pro_ids: values.pro_ids?.join(',') ?? '',
        repair_order: values.repair_order?.join(',') ?? '',
        page: page,
        page_size: page_size,
        start_time: isEmpty(values.time)
          ? ''
          : moment(values.time?.[0]).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
        end_time: isEmpty(values.time)
          ? ''
          : moment(values.time?.[1]).endOf('d').format('YYYY-MM-DD HH:mm:ss'),
      });

      dealRows(res?.data);
      setPages({page: res.page, total: res.total, page_size: res.page_size});
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
      <Form size={'small'} form={form} onFieldsChange={() => getTableList()}>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item name={'pro_ids'} label={'发布项目'}>
              <Select
                options={projects}
                optionFilterProp={'label'}
                style={{width: '100%'}}
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
                style={{width: '100%'}}
                mode={'multiple'}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={'time'} label={'发布日期'}>
              <DatePicker.RangePicker style={{width: '100%'}}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div
        className="ag-theme-alpine"
        style={{height: height - 150, width: '100%', marginTop: 8}}
      >
        <AgGridReact
          columnDefs={historyReleaseListColumn()}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            filter: true,
            // flex: 1,
            suppressMenu: true,
            cellStyle: {'line-height': '28px'},
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridReady}
          suppressRowTransform={true}
          frameworkComponents={{
            link: (p: CellClickedEvent) => {
              let marginStyle = {
                marginTop: 0
              }
              if (p.data?.rowSpan === 2) {
                marginStyle.marginTop = 15;
              }
              return (
                <div
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    ...marginStyle
                  }}
                  onClick={() => {
                    let href = `/onlineSystem/prePublish/${p.data.release_num}/${p.data.branch}/${p.data.release_name}`;
                    if (p.data.release_type == 'backlog_release') {
                      href = `/onlineSystem/releaseOrder/${p.data.release_num}/${p.data.release_name}`;
                    }
                    history.push(href);
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
        onChange={(p) => getTableList(p, pages.page_size)}
        showQuickJumper={(p) => getTableList(p, pages.page_size)}
        onShowSizeChange={(size) => getTableList(1, size)}
      />
    </Spin>
  );
};
export default HistoryList;
