/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-12-28 10:15:45
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Select, Form, DatePicker, Divider, TreeSelect, Row, Col, Tooltip } from 'antd';
import { selectFilter, treeSelectActive, mySelector } from './index.css';
import { useRequest } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GQL_PARAMS, GRAPHQL_QUERY } from '@/namespaces';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { projectKpiGql, organizationGql, queryGQL } from '@/pages/gqls';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import { deptTreeNodes, projOptsElems } from './extra';

const { RangePicker } = DatePicker;

/*  */
let deptId: string | undefined;
let dateStr: [string, string] | undefined; // 存放时间range信息
/* ************************************************************************************************************** */
export default () => {
  /* 数据区 */
  const defaultParams: any = {
    showArrow: true,
    allowClear: 'allowClear',
    placeholder: '默认选择全部',
  }; // <Select>默认的一些配置
  const [projElems, setProjElems] = useState(null); // 保存项目信息
  const [treeData, setTreeData] = useState([]); // 部门树形结构的数据
  const [treeActive, setTreeActive] = useState(''); // 部门<Select>选中时的样式
  const { gqlData, setGqlData } = useModel('projectMetric'); // 获取“过程质量”查询的结果数据
  const [deptIds, setDeptIds] = useState([]);
  const [projIds, setProjIds] = useState([]);
  const [dates, setDates] = useState(null);
  //
  const [selectItems, setSelectItems] = useState({});

  //
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const params: GQL_PARAMS = { func: GRAPHQL_QUERY['ORGANIZATION'] };
  const { data } = useRequest(() => queryGQL(gqlClient, organizationGql, params));

  /* 方法区 */
  const _onSelect = async () => {
    // 参数构建
    const gqlParams = {};
    //
    if (deptId) Object.assign(gqlParams, { deptId: parseInt(deptId) });
    //
    if (projIds.length !== 0)
      Object.assign(gqlParams, { projIds: projIds.map((x) => parseInt(x)) });
    //
    if (dateStr) Object.assign(gqlParams, { dates: { start: dateStr[0], end: dateStr[1] } });

    //
    const params: GQL_PARAMS = {
      func: GRAPHQL_QUERY['PROJECT_KPI'],
      params: gqlParams,
    };

    // 数据查询
    const rets = (await queryGQL(gqlClient, projectKpiGql, params)) ?? [];
    setGqlData(rets);
  };

  /*  */
  //
  useEffect(() => {
    _onSelect();
  }, [deptIds, projIds, dates]);

  /* 绘制区 */
  return (
    <div className={mySelector}>
      <Row align="middle">
        <Col span={20}>
          <Form layout="inline">
            <Form.Item label="所属部门/组">
              <TreeSelect
                {...defaultParams}
                className={`${selectFilter} ${treeActive}`}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                treeDefaultExpandAll
                onClick={() => deptTreeNodes(data, treeData, setTreeData)}
                onDropdownVisibleChange={() => setTreeActive(treeActive ? '' : treeSelectActive)}
                onSelect={(value: string) => {
                  deptId = value;
                  _onSelect();
                }}
              />
            </Form.Item>
            <Form.Item label="特性项目">
              <Select
                {...defaultParams}
                mode="multiple"
                className={selectFilter}
                onChange={(values: never[]) => setProjIds(values)}
                onClick={() => projOptsElems(gqlData, projElems, setProjElems)}
                onClear={() => setProjIds([])}
                value={projIds}
                children={projElems}
              />
            </Form.Item>
            <Form.Item>
              <Divider type="vertical" />
            </Form.Item>
            <Form.Item>
              <RangePicker
                onChange={(dates: any, dateString) => {
                  dateStr = dates ? dateString : undefined;
                  setDates(dates);
                }}
                value={dates}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                setDeptIds([]);
                setProjIds([]);
                setDates(null);
                dateStr = undefined;
                _onSelect();
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <ColumnHeightOutlined />
        </Col>
      </Row>
    </div>
  );
};
