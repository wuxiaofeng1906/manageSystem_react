import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Select, Row, Col, Spin, TreeSelect } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { zentaoStoryColumn, zentaoTestColumn } from '@/pages/onlineSystem/common/column';
import IPagination from '@/components/IPagination';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { useGqlClient } from '@/hooks/index';
import { isEmpty } from 'lodash';
import { ZentaoPhase, ZentaoStatus, ZentaoType } from '../../common/constant';
import styles from '../../common/common.less';

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
  const [orgTree, setOrgTree] = useState<any[]>([]);

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
    let source: any[] = [];
    const fn = (arr: any[], origin: any[]) => {
      if (!isEmpty(arr)) {
        arr.forEach((it) => {
          const children = origin
            .filter((o: any) => it.value == o.parent)
            ?.map((o) => ({ title: o.name, value: o.id, key: o.id, parent: o.parent }));
          it.children = children;
          fn(children, origin);
        });
      }
    };
    const org = await OnlineSystemServices.getOrgList(client);
    if (!isEmpty(org.organization)) {
      const node = org.organization.find((it: any) => it.id == 59);
      source.push({ title: node.name, value: node.id, key: node.id, parent: node.parent });
      fn(source, org.organization);
    }
    setOrgTree(source);
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
          type: 'bug',
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
          status: 'active',
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
      <div className={styles.zentaoDetail}>
        <h4>一、需求/任务/bug列表</h4>
        <Form form={storyForm} size={'small'} className={styles.resetForm} labelCol={{ span: 4 }}>
          <Row justify={'space-between'} gutter={8}>
            <Col span={8}>
              <Form.Item label={'部门/组'} name={'orgs'}>
                <TreeSelect
                  treeDefaultExpandedKeys={[59]}
                  treeData={orgTree}
                  showSearch
                  treeCheckable
                  multiple
                  showCheckedStrategy={'SHOW_ALL'}
                  style={{ width: '100%' }}
                  filterTreeNode={(inputValue: string, treeNode: any) =>
                    !!treeNode.title.includes(inputValue)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'归属执行'} name={'execution'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'类型'} name={'type'}>
                <Select
                  options={Object.keys(ZentaoType).map((key) => ({
                    label: ZentaoType[key],
                    value: key,
                  }))}
                  mode={'multiple'}
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label={'阶段'} name={'phase'}>
                <Select
                  options={Object.keys(ZentaoPhase).map((it) => ({
                    label: ZentaoPhase[it],
                    value: it,
                  }))}
                  mode={'multiple'}
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'编号'} name={'num'}>
                <Select options={[]} mode={'multiple'} showSearch />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                      const href = `zentao.77hub.com/zentao/${
                        p.data.type == 'bug' ? 'bug' : 'story'
                      }-view-${p.data.ztno}.html`;
                      window.open(href);
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
        <Form form={testForm} size={'small'} className={styles.resetForm}>
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
                <Select
                  options={Object.keys(ZentaoStatus).map((it) => ({
                    label: ZentaoStatus[it],
                    value: it,
                  }))}
                  mode={'multiple'}
                  showSearch
                />
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
                      const href = `zentao.77hub.com/zentao/testtask-cases-2417.html`;
                      window.open(href);
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
