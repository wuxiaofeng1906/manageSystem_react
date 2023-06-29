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
  const dealRows = (res: any) => {
    const testData = [
      {
        "sortNo": 1,
        "story": "",
        "release_num": "202306280003",
        "release_name": "202306280003灰度发布",
        "project": [
          {
            "pro_name": "emergency20230625",
            "pro_id": "2709"
          }
        ],
        "branch": "emergency20230625",
        "repair_order": null,
        "release_type": "ready_release",
        "release_way": "keep_server",
        "release_env": "宁夏灰度集群0",
        "cluster": [
          "cn-northwest-0"
        ],
        "plan_release_time": "2023-06-28 10:00:00",
        "release_index": 473,
        "person_duty_num": null,
        "announcement_num": null,
        "apps": "h5,web,authapp",
        "project_manager": "李小雷",
        "release_result": "success",
        "baseline_cluster": "",
        "is_delete": false,
        rowSpan: 2
      },
      {
        "story": "",
        "release_num": "202306280003",
        "release_name": "202306280003灰度发布",
        "project": [
          {
            "pro_name": "emergency20230625",
            "pro_id": "2709"
          }
        ],
        "branch": "emergency20230625",
        "repair_order": null,
        "release_type": "ready_release",
        "release_way": "keep_server",
        "release_env": "宁夏灰度集群1",
        "cluster": [
          "cn-northwest-0"
        ],
        "plan_release_time": "2023-06-28 10:00:00",
        "release_index": 473,
        "person_duty_num": null,
        "announcement_num": null,
        "apps": "h5,web,authapp",
        "project_manager": "李小雷",
        "release_result": "failure",
        "baseline_cluster": "",
        "is_delete": false
      }, {
        "sortNo": 2,
        "story": "",
        "release_num": "202306280003",
        "release_name": "202306280003灰度发布",
        "project": [
          {
            "pro_name": "emergency20230625",
            "pro_id": "2709"
          }
        ],
        "branch": "emergency20230625",
        "repair_order": null,
        "release_type": "ready_release",
        "release_way": "keep_server",
        "release_env": "宁夏灰度集群1",
        "cluster": [
          "cn-northwest-0"
        ],
        "plan_release_time": "2023-06-28 10:00:00",
        "release_index": 473,
        "person_duty_num": null,
        "announcement_num": null,
        "apps": "h5,web,authapp",
        "project_manager": "李小雷",
        "release_result": "unknown",
        "baseline_cluster": "",
        "is_delete": true
      }, {
        "sortNo": 3,
        "story": "",
        "release_num": "202306280003",
        "release_name": "202306280003灰度发布",
        "project": [
          {
            "pro_name": "emergency20230625",
            "pro_id": "2709"
          }
        ],
        "branch": "emergency20230625",
        "repair_order": null,
        "release_type": "ready_release",
        "release_way": "keep_server",
        "release_env": "宁夏灰度集群1",
        "cluster": [
          "cn-northwest-0"
        ],
        "plan_release_time": "2023-06-28 10:00:00",
        "release_index": 473,
        "person_duty_num": null,
        "announcement_num": null,
        "apps": "h5,web,authapp",
        "project_manager": "李小雷",
        "release_result": "unknown",
        "baseline_cluster": "",
        "is_delete": true
      }
    ];


    setRowData(
      testData.map((it: any) => ({
        ...it,
        project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
      })) ?? [],
    );

    // setRowData(
    //   res.data.map((it: any) => ({
    //     ...it,
    //     project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
    //   })) ?? [],
    // );
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

      dealRows(res);
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
                    let href = `/onlineSystem/prePublish/${p.data.release_num}/${p.data.branch}/${p.data.is_delete}/${p.data.release_name}`;
                    if (p.data.release_type == 'backlog_release') {
                      href = `/onlineSystem/releaseOrder/${p.data.release_num}/${p.data.is_delete}/${p.data.release_name}`;
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
