import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Select, Row, Col, Spin } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from '@/pages/onlineSystem/releaseProcess/index.less';
import { history } from '@@/core/history';
import { zentaoStoryColumn, zentaoTestColumn } from '@/pages/onlineSystem/common/column';
import IPagination from '@/components/IPagination';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { useGqlClient } from '@/hooks/index';
import { isEmpty, groupBy } from 'lodash';

const ZentaoDetail = (props: any, ref: any) => {
  const client = useGqlClient();
  const [storyForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const storyRef = useRef<GridApi>();
  const testRef = useRef<GridApi>();
  const [storyData, setStoryData] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [tableHeight, setTableHeight] = useState((window.innerHeight - 400) / 2);
  const [spin, setSpin] = useState(false);
  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });
  useImperativeHandle(ref, () => ({
    onRefresh: getTableList,
  }));

  const onGridReady = (params: GridReadyEvent) => {
    storyRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onTestGridReady = (params: GridReadyEvent) => {
    testRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setTableHeight((window.innerHeight - 400) / 2);
  };
  const getSelectList = async () => {
    const org = await OnlineSystemServices.getOrgList(client);
    let source: any[] = [];
    if (!isEmpty(org.organization)) {
      console.log(groupBy(org.organization, 'parent'));
    }
  };
  useEffect(() => {
    getSelectList();
    getTableList();
  }, []);

  const getTableList = async (page = 1, page_size = 20) => {
    try {
      setSpin(true);
      const values = storyForm.getFieldsValue();
      // const res = await PreReleaseServices.historyList({
      //   pro_ids: values.pro_ids?.join(',') ?? '',
      //   branch: values.repair_order?.join(',') ?? '',
      //   page: page,
      //   page_size: page_size,
      // });
      setStoryData([
        {
          name: '1',
          num: '6172',
          phase: '1',
          execution: '笑果文化',
          title: '【开发】合同列表',
          server: 'web,app',
          level: 'p2-2级',
          module: '薪资',
          creator: '罗林',
          assignedPm: '任航',
        },
      ]);
      setTestData([
        {
          execution: '笑果文化',
          name: '笑果文化第一轮测试',
          version: '笑果文化第一轮测试',
          status: '进行中',
          pm: '邓九州',
          total: 23,
          passNum: 13,
          blockNum: 9,
          failNum: 3,
          notExecutedNum: 2,
          bug: 1,
          p1: 1,
          p2: 1,
          p3: 3,
          p4: 1,
        },
      ]);
      // setPages({ page: res.page, total: res.total, page_size: res.page_size });
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div>
        <h4>一、需求/任务/bug列表</h4>
        <Form form={storyForm} size={'small'}>
          <Row justify={'space-between'} gutter={8}>
            <Col span={4}>
              <Form.Item label={'部门/组'} name={'orgs'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'归属执行'} name={'execution'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'类型'} name={'type'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'阶段'} name={'phase'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'编号'} name={'num'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={'指派给'} name={'assignedTo'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="ag-theme-alpine" style={{ height: tableHeight, width: '100%' }}>
          <AgGridReact
            columnDefs={zentaoStoryColumn}
            rowData={storyData}
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
                    className={styles.links}
                    onClick={() => {
                      let href = `/onDutyAndRelease/preRelease?releasedNum=${p.data.release_num}`;
                      if (p.data.release_type == 'backlog_release') {
                        href = `/onDutyAndRelease/releaseOrder/${p.data.release_num}`;
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
          onChange={getTableList}
          showQuickJumper={getTableList}
          onShowSizeChange={(size) => getTableList(1, size)}
        />
        <Form form={testForm} size={'small'}>
          <Row justify={'space-between'} gutter={8}>
            <Col span={8}>
              <Form.Item label={'归属执行'} name={'execution'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'测试单名称'} name={'name'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'状态'} name={'phase'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="ag-theme-alpine" style={{ height: tableHeight, width: '100%' }}>
          <AgGridReact
            columnDefs={zentaoTestColumn}
            rowData={testData}
            defaultColDef={{
              resizable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
              cellStyle: { 'line-height': '28px' },
            }}
            rowHeight={28}
            headerHeight={30}
            onGridReady={onTestGridReady}
            frameworkComponents={{
              testSheet: (p: CellClickedEvent) => {
                return (
                  <div
                    style={{
                      color: '#1890ff',
                      cursor: 'pointer',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    className={styles.links}
                    onClick={() => {
                      let href = `/onDutyAndRelease/preRelease?releasedNum=${p.data.release_num}`;
                      if (p.data.release_type == 'backlog_release') {
                        href = `/onDutyAndRelease/releaseOrder/${p.data.release_num}`;
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
      </div>
    </Spin>
  );
};
export default forwardRef(ZentaoDetail);
