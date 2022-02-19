/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2022-02-19 03:15:52
 * @LastEditors: jieTan
 * @LastModify:
 */
import {
  Form,
  DatePicker,
  Divider,
  TreeSelect,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Menu,
  Radio,
  Space,
} from 'antd';
import { mySelector } from './index.css';
import { useMount } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GQL_PARAMS, GRAPHQL_QUERY, MOMENT_FORMAT, PK_SEARCH_INTERVAL } from '@/namespaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { projectKpiGql, organizationGql, queryGQL } from '@/pages/gqls';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import { deptTreeNodes, onDateChange, onTreeMultiChange, projOptsElems } from './extra';
import { Moment } from 'moment';
import moment from 'moment';

/* 默认的时间 */
const defaultDateRange: [Moment, any] = [
  moment().subtract(PK_SEARCH_INTERVAL.value, PK_SEARCH_INTERVAL.unit as any),
  null,
]; // date组件默认显示
const defaultDateStr: [string, any] = [defaultDateRange[0].format(MOMENT_FORMAT.date), null];
//
let dateStr: [string, any] | undefined = defaultDateStr; // 存放时间range信息
let doChange = false;
const defaultSeclectItems = { deptIds: [], projIds: [], dates: defaultDateRange, doQuery: false };
/* ************************************************************************************************************** */
export default () => {
  /* 数据区 */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const [projElems, setProjElems] = useState(null); // 保存项目信息
  const [treeData, setTreeData] = useState([]); // 部门树形结构的数据
  const { setGqlData, setLoading, gridApi, gridHeight, pkGqlParmas, setPkGqlParmas } =
    useModel('projectMetric'); // 获取“过程质量”查询的结果数据
  const [selectItems, setSelectItems] = useState(defaultSeclectItems); // 存放多个筛选的值
  const [ratioVal, setRatioVal] = useState(gridHeight.row);
  //
  const defaultParams: any = {
    showArrow: true,
    allowClear: 'allowClear',
    placeholder: '默认选择全部',
    multiple: 'multiple',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeCheckable: true,
    maxTagCount: 'responsive',
    showCheckedStrategy: 'SHOW_ALL',
    filterTreeNode: (inputValue: string, treeNode: { title: string }) =>
      treeNode?.title.includes(inputValue) ? true : false,
  }; // <Select>默认的一些配置
  const menu = (
    <Menu>
      <Radio.Group
        onChange={(e) => {
          setRatioVal(e.target.value);
          gridHeight.row = e.target.value;
          (gridApi as any)?.resetRowHeights();
        }}
        value={ratioVal}
      >
        <Menu.Item children={<Radio value={36}>宽松</Radio>} />
        <Menu.Item children={<Radio value={32}>适中</Radio>} />
        <Menu.Item children={<Radio value={28}>紧凑</Radio>} />
      </Radio.Group>
    </Menu>
  );
  // xs={24} sm={24} md={22} lg={22} xl={22}
  const selectFlexs = { xs: 24, sm: 24, md: 22 };
  const extraFlexs = { xs: selectFlexs.xs, sm: selectFlexs.sm, md: 24 - selectFlexs.md };
  //
  const itemFlexs = { xs: 24, sm: 24, md: 7 };

  /* 方法区 */
  const _onSelect = async () => {
    // 参数构建
    const gqlParams = pkGqlParmas ?? {};
    //
    if (selectItems.deptIds.length !== 0)
      Object.assign(gqlParams, { deptIds: selectItems.deptIds });
    else if (gqlParams['deptIds'] !== undefined) delete gqlParams['deptIds']; // 参数不存在时，移除key
    //
    if (selectItems.projIds.length !== 0)
      Object.assign(gqlParams, { projIds: selectItems.projIds.map((x) => parseInt(x)) });
    else if (gqlParams['projIds'] !== undefined) delete gqlParams['projIds'];
    //
    if (dateStr) {
      const whereOpts = {};
      if (dateStr[0]) whereOpts['start'] = dateStr[0];
      if (dateStr[1]) whereOpts['end'] = dateStr[1];
      //
      Object.assign(gqlParams, { dates: whereOpts });
    } else if (gqlParams['dates'] !== undefined) delete gqlParams['dates'];

    //
    setPkGqlParmas(gqlParams as any);
    const params: GQL_PARAMS = {
      func: GRAPHQL_QUERY['PROJECT_KPI'],
      params: gqlParams,
    };

    // 数据查询
    const rets = (await queryGQL(gqlClient, projectKpiGql, params)) ?? [];
    setGqlData(rets);
  };

  /*  */
  useEffect(() => {
    if (selectItems.doQuery && doChange) {
      setLoading(true);
      setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: false }));
      _onSelect();
      doChange = false;
    }
  }, [selectItems]); // 查询参数更跟时触发
  // 界面挂载后
  useMount(async () => {
    // 查询部门组织架构
    const rets = await queryGQL(gqlClient, organizationGql, {
      func: GRAPHQL_QUERY['ORGANIZATION'],
    });
    rets ? deptTreeNodes(rets, treeData, setTreeData) : null;
    // 查询所有的项目列表
    const projs = await queryGQL(gqlClient, projectKpiGql, {
      func: GRAPHQL_QUERY['PROJECT_KPI'],
      params: { kpis: [] },
    });
    projs ? projOptsElems(projs, setProjElems, selectItems.projIds) : null;
  });

  /* 绘制区 */
  return (
    <div className={mySelector}>
      <Row align="middle">
        <Col {...selectFlexs}>
          <Form layout="inline">
            <Col {...itemFlexs}>
              <Form.Item label="部门/组" key="depts">
                <TreeSelect
                  {...defaultParams}
                  treeData={treeData}
                  onDropdownVisibleChange={(open: boolean) => {
                    !open && doChange
                      ? setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }))
                      : null;
                  }}
                  onChange={(values: string) =>
                    (doChange = onTreeMultiChange(values, setSelectItems, 'deptIds'))
                  }
                  onClear={() => {
                    setSelectItems((prev) =>
                      Object.assign({ ...prev }, { deptIds: [], doQuery: true }),
                    );
                  }}
                  value={selectItems.deptIds}
                />
              </Form.Item>
            </Col>
            <Col {...itemFlexs}>
              <Form.Item label="特性项目" key="projects">
                <TreeSelect
                  dropdownClassName="myDropdown"
                  {...defaultParams}
                  treeData={projElems}
                  onDropdownVisibleChange={(open: boolean) => {
                    !open && doChange
                      ? setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }))
                      : null;
                  }}
                  onChange={(values: string) =>
                    (doChange = onTreeMultiChange(values, setSelectItems, 'projIds'))
                  }
                  onClear={() => {
                    setSelectItems((prev) =>
                      Object.assign({ ...prev }, { projIds: [], doQuery: true }),
                    );
                  }}
                  value={selectItems.projIds}
                />
              </Form.Item>
            </Col>
            <Col {...itemFlexs} md={8}>
              <Form.Item label="时间范围" key="dates">
                <Space direction="horizontal">
                  <DatePicker
                    placeholder="开始日期"
                    onChange={(date: any, dateString: string) => {
                      doChange = true;
                      onDateChange(dateStr as any, 0, date, dateString, setSelectItems);
                    }}
                    disabledDate={(current) => {
                      if (!selectItems.dates[1]) return false;
                      return current && current >= selectItems.dates[1];
                    }}
                    value={selectItems.dates[0]}
                  />
                  <DatePicker
                    placeholder="结束日期"
                    onChange={(date: any, dateString: string) => {
                      doChange = true;
                      onDateChange(dateStr as any, 1, date, dateString, setSelectItems);
                    }}
                    disabledDate={(current) => {
                      if (!selectItems.dates[0]) return false;
                      return current && current < selectItems.dates[0];
                    }}
                    value={selectItems.dates[1]}
                  />
                </Space>
              </Form.Item>
            </Col>
          </Form>
        </Col>
        <Col xs={24} sm={0} md={0}>
          <br />
        </Col>
        <Col {...extraFlexs} style={{ textAlign: 'right' }}>
          <Divider type="vertical" />
          <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <ColumnHeightOutlined />
          </Dropdown>
          <Divider type="vertical" />
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                doChange = true;
                setProjElems(null);
                setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }));
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};
