import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Select, Row, Col, Spin, TreeSelect } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { zentaoStoryColumn, zentaoTestColumn } from '@/pages/onlineSystem/config/column';
import IPagination from '@/components/IPagination';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { useGqlClient } from '@/hooks/index';
import { isEmpty, pick, isEqual } from 'lodash';
import { ZentaoPhase, ZentaoStatus, ZentaoType } from '../../config/constant';
import styles from '../../config/common.less';
import { initGridTable } from '@/utils/utils';
import { useLocation, useParams } from 'umi';
import { push } from 'echarts/types/src/component/dataZoom/history';

const ZentaoDetail = (props: any, ref: any) => {
  const client = useGqlClient();
  const { branch } = useParams() as { branch: string };
  const query = useLocation()?.query;
  const [storyForm] = Form.useForm();
  const [testForm] = Form.useForm();
  const storyRef = useRef<GridApi>();
  const testRef = useRef<GridApi>();
  const [storyData, setStoryData] = useState<any[]>([]);
  const [originStoryData, setOriginStoryData] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [tableHeight, setTableHeight] = useState((window.innerHeight - 450) / 2);
  const [spin, setSpin] = useState(false);
  const [orgTree, setOrgTree] = useState<any[]>([]);
  const [recordCount, setRecordCount] = useState<{
    category: any;
    stage: any;
    ztNo: any[];
    assignTo: any;
    execution: any;
    org: any;
  }>();

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });
  useImperativeHandle(ref, () => ({
    onRefresh: () => getTableList(true),
  }));

  window.onresize = function () {
    setTableHeight((window.innerHeight - 450) / 2);
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
    if (branch && query.key == 'profile') {
      getSelectList();
      getTableList();
      getTestOrder();
    }
  }, [branch, query.key]);

  const getTestOrder = async () => {
    const res = await OnlineSystemServices.getTestOrderList(client, { branch: 'sprint20221124' });
    setTestData(res);
  };

  const onPageChange = (page = 1, page_size = 20) => {
    setPages({ ...pages, page, page_size });
  };
  const conditionChange = () => {
    let result = originStoryData;
    const values = storyForm.getFieldsValue();
    let compareKey: any = {};
    Object.entries(values).forEach(([k, v]) => {
      if (!isEmpty(v)) compareKey = { ...compareKey, [k]: v };
    });
    if (isEmpty(compareKey)) result = originStoryData;
    else
      Object.entries(compareKey).forEach(([key, v]) => {
        result = fn(result, v, key);
      });
    setStoryData(result);
    setPages({ page: 1, page_size: 20, total: result?.length });
  };

  const fn = (filterData: any[], formValue: any, key: string) => {
    return filterData.filter((it: any) => {
      let originV = it[key];
      if (key == 'ztNo') originV = +originV;
      if (key == 'stage') originV = originV.show.zh;
      if (key == 'execution') originV = originV.id;
      if (['openedBy', 'assignedTo'].includes(key)) originV = originV.account;
      return formValue.includes(originV);
    });
  };

  const getTableList = async (refresh = false) => {
    try {
      setSpin(true);
      const res = await OnlineSystemServices.getOnlineCalendarList(client, {
        branch: 'sprint20221124',
        force: refresh,
      });

      let category: Record<string, number> = {}; // 类型
      let stage: Record<string, number> = {}; // 阶段
      let ztNo: any[] = []; // 编号
      let assignTo: Record<string, any> = {}; // 指派给
      let execution: Record<string, any> = {}; // 归属执行
      let org: Record<string, any> = {}; // 部门

      res?.forEach((it: any) => {
        const assignToItem = it.assignedTo;
        const executionItem = it.execution;
        category = { ...category, [it.category]: (category[it.category] ?? 0) + 1 };
        stage = { ...stage, [it.stage.show.zh]: (stage[it.stage.show.zh] ?? 0) + 1 };
        execution = {
          ...execution,
          [executionItem?.name ? executionItem.id : 'NA']: {
            count: (execution[executionItem?.name ? executionItem.id : 'NA']?.count ?? 0) + 1,
            name: executionItem?.name || 'NA',
          },
        };
        assignTo = {
          ...assignTo,
          [assignToItem?.realname ? assignToItem.account : 'NA']: {
            count:
              (assignTo[assignToItem?.realname ? assignToItem?.account : 'NA']?.count ?? 0) + 1,
            name: assignToItem?.realname || 'NA',
          },
        };
        org = {
          ...org,
          [assignToItem.dept.id]: {
            count: (org[assignToItem.dept.id]?.count ?? 0) + 1,
            parent: assignToItem.dept.parent?.id,
          },
        };
        ztNo.push({ key: it.ztNo, value: it.ztNo, label: it.ztNo });
      });
      setRecordCount({ category, stage, ztNo, assignTo, execution, org });
      setStoryData(res);
      setOriginStoryData(res);
      setPages({ page: 1, page_size: 20, total: res?.length || 0 });
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div className={styles.zentaoDetail}>
        <h4>一、需求/任务/bug列表</h4>
        <Form
          form={storyForm}
          size={'small'}
          className={styles.resetForm}
          labelCol={{ span: 4 }}
          onBlur={conditionChange}
        >
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
                <Select
                  mode={'multiple'}
                  showSearch
                  onDeselect={conditionChange}
                  options={Object.keys(recordCount?.execution ?? {}).map((it, i) => ({
                    label: `${recordCount?.execution[it]?.name}(${
                      recordCount?.execution[it]?.count ?? 0
                    })`,
                    value: +it,
                    key: recordCount?.execution[it]?.name + i,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'类型'} name={'category'}>
                <Select
                  mode={'multiple'}
                  showSearch
                  allowClear
                  onDeselect={conditionChange}
                  options={Object.keys(ZentaoType).map((key) => ({
                    label: `${ZentaoType[key]}(${recordCount?.category[key] ?? 0})`,
                    value: key,
                    key: key,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label={'阶段'} name={'stage'}>
                <Select
                  mode={'multiple'}
                  showSearch
                  options={Object.keys(ZentaoPhase).map((it) => ({
                    label: `${it}(${recordCount?.stage[it] ?? 0})`,
                    value: it,
                    key: it,
                  }))}
                  onDeselect={conditionChange}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'编号'} name={'ztNo'}>
                <Select
                  showSearch
                  mode={'multiple'}
                  allowClear
                  options={recordCount?.ztNo}
                  onDeselect={conditionChange}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'指派给'} name={'assignedTo'}>
                <Select
                  mode={'multiple'}
                  showSearch
                  options={Object.keys(recordCount?.assignTo ?? {}).map((it, i) => ({
                    label: `${recordCount?.assignTo[it]?.name}(${
                      recordCount?.assignTo[it]?.count ?? 0
                    })`,
                    value: it,
                    key: recordCount?.assignTo[it]?.name + i,
                  }))}
                  onDeselect={conditionChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%' }}>
          <AgGridReact
            columnDefs={zentaoStoryColumn}
            rowData={storyData?.slice(
              (pages.page - 1) * pages.page_size,
              pages.page * pages.page_size,
            )}
            {...initGridTable({ ref: storyRef, height: 30 })}
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
                      const category = p.data.category;
                      const href = `http://zentao.77hub.com/zentao/${
                        category == 'Bug' ? 'bug' : category == 'Task' ? 'task' : 'story'
                      }-view-${p.value}.html`;
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
          onChange={(p) => onPageChange(p, pages.page_size)}
          showQuickJumper={(p) => onPageChange(p, pages.page_size)}
          onShowSizeChange={(size) => onPageChange(1, size)}
        />
        <Form form={testForm} size={'small'} className={styles.resetForm} style={{ marginTop: 16 }}>
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
        <div style={{ height: tableHeight > 180 ? tableHeight : 180, width: '100%' }}>
          <AgGridReact
            columnDefs={zentaoTestColumn}
            rowData={testData}
            {...initGridTable({ ref: testRef, height: 30 })}
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
                      const href = `http://zentao.77hub.com/zentao/testtask-cases-${p.value?.id}.html`;
                      window.open(href);
                    }}
                  >
                    {p.value?.name}
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
