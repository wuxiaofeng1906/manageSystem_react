/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2022-01-24 09:55:23
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
} from 'antd';
import { mySelector } from './index.css';
import { useMount } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GQL_PARAMS, GRAPHQL_QUERY, PK_SEARCH_INTERVAL } from '@/namespaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { projectKpiGql, organizationGql, queryGQL } from '@/pages/gqls';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import { deptTreeNodes, onTreeMultiChange, projOptsElems } from './extra';
import { Moment } from 'moment';
import moment from 'moment';

const { RangePicker } = DatePicker;

/*  */
let dateStr: [string, string] | undefined; // 存放时间range信息
let doChange = false;
const defaultDateRange: [Moment, any] = [
  moment().subtract(PK_SEARCH_INTERVAL.value, PK_SEARCH_INTERVAL.unit as any),
  null,
]; // date组件默认显示
const defaultSeclectItems = { deptIds: [], projIds: [], dates: defaultDateRange, doQuery: false };
/* ************************************************************************************************************** */
export default () => {
  /* 数据区 */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const [projElems, setProjElems] = useState(null); // 保存项目信息
  const [treeData, setTreeData] = useState([]); // 部门树形结构的数据
  const { gqlData, setGqlData, setLoading, gridApi, gridHeight, pkGqlParmas, setPkGqlParmas } =
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
    const gqlParams = pkGqlParmas;
    //
    if (selectItems.deptIds.length !== 0)
      Object.assign(gqlParams, { deptIds: selectItems.deptIds });
    else if (gqlParams['deptIds'] !== undefined) delete gqlParams['deptIds']; // 参数不存在时，移除key
    //
    if (selectItems.projIds.length !== 0)
      Object.assign(gqlParams, { projIds: selectItems.projIds.map((x) => parseInt(x)) });
    else if (gqlParams['projIds'] !== undefined) delete gqlParams['projIds'];
    //
    if (dateStr) Object.assign(gqlParams, { dates: { start: dateStr[0], end: dateStr[1] } });
    else if (gqlParams['dates'] !== undefined) delete gqlParams['dates'];

    //
    setPkGqlParmas(gqlParams);
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
  //
  useEffect(() => {
    gqlData !== undefined ? projOptsElems(gqlData, setProjElems, selectItems.projIds) : null;
  }, [gqlData]);
  // 界面挂载后，立马查询部门组织架构
  useMount(async () => {
    const rets = await queryGQL(gqlClient, organizationGql, {
      func: GRAPHQL_QUERY['ORGANIZATION'],
    });
    rets ? deptTreeNodes(rets, treeData, setTreeData) : null;
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
                <RangePicker
                  onChange={(dates: any, dateString) => {
                    dateStr = dates ? dateString : undefined;
                    doChange = true;
                    setSelectItems((prev) =>
                      Object.assign({ ...prev }, { dates: dates, doQuery: true }),
                    );
                  }}
                  value={selectItems.dates}
                />
              </Form.Item>
            </Col>
          </Form>
        </Col>
        <Col xs={24} sm={0} md={0}>
          <br />
        </Col>
        <Col {...extraFlexs} style={{ textAlign: 'right' }}>
          <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <ColumnHeightOutlined />
          </Dropdown>
          <Divider type="vertical" />
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                doChange = true;
                setProjElems(null);
                setSelectItems(Object.assign({ ...defaultSeclectItems }, { doQuery: true }));
                dateStr = undefined;
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};
