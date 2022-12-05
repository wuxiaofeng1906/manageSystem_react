import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Form, Select, Row, Col, Spin, TreeSelect } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { zentaoStoryColumn, zentaoTestColumn } from '@/pages/onlineSystem/config/column';
import IPagination from '@/components/IPagination';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { useGqlClient } from '@/hooks';
import { isEmpty, sumBy } from 'lodash';
import { ZentaoPhase, ZentaoType } from '../config/constant';
import styles from '../config/common.less';
import { initGridTable } from '@/utils/utils';
import { useLocation, useParams } from 'umi';

const opts = { showSearch: true, mode: 'multiple', optionFilterProp: 'key', allowClear: true };

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
  const [originTestData, setOriginTestData] = useState<any[]>([]);
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
  const [testCount, setTestCount] = useState<{
    status: any;
    testTask: any;
    execution: any;
  }>();

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  const getSelectList = async () => {
    const org = await OnlineSystemServices.getOrgList(client);
    setOrgTree(org?.organization || []);
  };

  const formatTree = (org: any[]) => {
    let source: any[] = [];
    let result = org?.map((dept: any) => {
      const count = storyData.filter((it) =>
        isEmpty(it.assignedTo?.dept)
          ? dept.id == it.openedBy?.dept?.id
          : dept.id == it.assignedTo?.dept?.id,
      );
      dept = {
        ...dept,
        count: count?.length || 0,
        value: dept.id,
        title: `${dept.name}(${count?.length ?? 0})`,
        name: dept.name,
      };
      return dept;
    });

    if (!isEmpty(result)) {
      result.forEach((it) => {
        it.children = result.filter((child) => child.parent == it.id);
        if (it.id == 59) source.push(it);
      });
    }

    return test(source);
  };
  function test(source: any[]) {
    if (isEmpty(source)) return;
    source?.forEach((item) => {
      if (!isEmpty(item.children)) {
        const data = flatTree(item.children, []);
        item.count = sumBy(data, 'count');
        item.title = `${item.name}(${item.count})`;
        test(item.children);
      }
    });
    return source;
  }

  function flatTree(data: any[], result: any[]) {
    data.forEach((item: any) => {
      result.push({ title: item.title, value: item.id, count: item.count });
      if (item.children?.length) {
        result = flatTree(item.children, result);
      }
    });
    return result;
  }

  const getTestOrder = async () => {
    let status: Record<string, any> = {};
    let testTask: Record<string, any> = {};
    let execution: Record<string, any> = {}; // 归属执行
    const res = await OnlineSystemServices.getTestOrderList(client, { branch });
    res?.forEach((it: any) => {
      status = {
        ...status,
        [it.status.en]: { count: (status[it.status.en]?.count ?? 0) + 1, name: it.status.zh },
      };
      testTask = {
        ...testTask,
        [it.testtask.id]: {
          count: (testTask[it.testtask.id]?.count ?? 0) + 1,
          name: it.testtask.name,
        },
      };
      execution = {
        ...execution,
        [it.execution.id]: {
          count: (execution[it.execution.id]?.count ?? 0) + 1,
          name: it.execution.name,
        },
      };
    });
    setTestCount({ execution, status, testTask });
    setTestData(res);
    setOriginTestData(res);
  };

  const onPageChange = (page = 1, page_size = 20) => {
    setPages({ ...pages, page, page_size });
  };

  const conditionChange = (type: 'story' | 'test') => {
    const flag = type == 'story';
    let result = flag ? originStoryData : originTestData;
    const values = flag ? storyForm.getFieldsValue() : testForm.getFieldsValue();
    let compareKey: any = {};
    Object.entries(values).forEach(([k, v]) => {
      if (!isEmpty(v)) compareKey = { ...compareKey, [k]: v };
    });
    if (isEmpty(compareKey)) result = flag ? originStoryData : originTestData;
    else {
      Object.entries(compareKey).forEach(([key, v]) => {
        result = fn(result, v, key);
      });
    }
    if (flag) {
      setStoryData(result);
      setPages({ page: 1, page_size: 20, total: result?.length });
    } else setTestData(result);
  };

  const fn = (filterData: any[], formValue: any, key: string) => {
    const Na = formValue?.includes('NA');

    return filterData.filter((it: any) => {
      let originV = it[key];
      if (key == 'ztNo') originV = +originV;
      if (key == 'stage') originV = originV.show.zh;
      if (key == 'status') originV = originV.en;
      if (['execution', 'testtask'].includes(key)) originV = originV.id;
      if (['openedBy', 'assignedTo'].includes(key)) originV = originV.realname;
      if (key == 'orgs') {
        return isEmpty(it.assignedTo?.dept)
          ? formValue.includes(it.openedBy?.dept?.id)
          : formValue.includes(it.assignedTo?.dept?.id);
      }
      return Na ? isEmpty(originV) || formValue.includes(originV) : formValue.includes(originV);
    });
  };

  const getTableList = async (force = false) => {
    try {
      setSpin(true);
      const res = await OnlineSystemServices.getOnlineCalendarList(client, { branch, force });

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
            name: executionItem?.name || '空',
          },
        };
        assignTo = {
          ...assignTo,
          [assignToItem?.realname ? assignToItem.realname : 'NA']: {
            count:
              (assignTo[assignToItem?.realname ? assignToItem?.realname : 'NA']?.count ?? 0) + 1,
            name: assignToItem?.realname || '空',
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

  useImperativeHandle(
    ref,
    () => ({
      onRefresh: () => {
        getTestOrder();
        getTableList(true);
      },
    }),
    [query.tab],
  );

  window.onresize = function () {
    setTableHeight((window.innerHeight - 450) / 2);
  };
  const orgTr = useMemo(() => {
    return formatTree(orgTree);
  }, [storyData, orgTree]);

  useEffect(() => {
    if (branch && query.tab == 'profile') {
      getSelectList();
      getTableList();
      getTestOrder();
    }
  }, [branch, query.tab]);

  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div className={styles.zentaoDetail}>
        <h4>一、需求/任务/bug列表</h4>
        <Form
          form={storyForm}
          size={'small'}
          className={styles.resetForm}
          labelCol={{ span: 5 }}
          onBlur={() => conditionChange('story')}
        >
          <Row justify={'space-between'} gutter={8}>
            <Col span={8}>
              <Form.Item label={'部门/组'} name={'orgs'}>
                <TreeSelect
                  treeDefaultExpandedKeys={[59]}
                  showSearch
                  treeCheckable
                  multiple
                  treeData={orgTr}
                  onDeselect={() => conditionChange('story')}
                  showCheckedStrategy={'SHOW_ALL'}
                  maxTagCount={'responsive'}
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
                  {...opts}
                  onDeselect={() => conditionChange('story')}
                  options={Object.keys(recordCount?.execution ?? {}).map((it, i) => ({
                    label: recordCount?.execution[it]?.name,
                    key: recordCount?.execution[it]?.name + i,
                    value: +it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'类型'} name={'category'}>
                <Select
                  {...opts}
                  onDeselect={() => conditionChange('story')}
                  options={Object.keys(ZentaoType).map((key) => ({ label: key, value: key }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label={'阶段'} name={'stage'}>
                <Select
                  {...opts}
                  options={Object.keys(ZentaoPhase).map((it) => ({ label: it, value: it }))}
                  onDeselect={() => conditionChange('story')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'编号'} name={'ztNo'}>
                <Select
                  {...opts}
                  options={recordCount?.ztNo}
                  onDeselect={() => conditionChange('story')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'指派给'} name={'assignedTo'}>
                <Select
                  {...opts}
                  options={Object.keys(recordCount?.assignTo ?? {}).map((it, i) => ({
                    label: recordCount?.assignTo[it]?.name,
                    key: recordCount?.assignTo[it]?.name + i,
                    value: it,
                  }))}
                  onDeselect={() => conditionChange('story')}
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
        <Form
          form={testForm}
          size={'small'}
          className={styles.resetForm}
          style={{ marginTop: 16 }}
          onBlur={() => conditionChange('test')}
        >
          <Row justify={'space-between'} gutter={8}>
            <Col span={8}>
              <Form.Item label={'归属执行'} name={'execution'}>
                <Select
                  {...opts}
                  onDeselect={() => conditionChange('test')}
                  options={Object.keys(testCount?.execution ?? {}).map((it) => ({
                    label: testCount?.execution[it]?.name,
                    key: testCount?.execution[it]?.name,
                    value: +it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'测试单名称'} name={'testtask'}>
                <Select
                  {...opts}
                  onDeselect={() => conditionChange('test')}
                  options={Object.keys(testCount?.testTask ?? {}).map((it) => ({
                    label: testCount?.testTask[it]?.name,
                    key: testCount?.testTask[it]?.name,
                    value: +it,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={'状态'} name={'status'}>
                <Select
                  {...opts}
                  onDeselect={() => conditionChange('test')}
                  options={Object.keys(testCount?.status ?? {}).map((it) => ({
                    label: testCount?.status[it]?.name,
                    key: testCount?.status[it]?.name,
                    value: it,
                  }))}
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
