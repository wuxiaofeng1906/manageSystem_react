/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-12-28 12:37:41
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
let dateStr: [string, string] | undefined; // 存放时间range信息
const defaultSeclectItems = { deptIds: [], projIds: [], dates: null };
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
  //
  const [selectItems, setSelectItems] = useState(defaultSeclectItems); // 存放多个筛选的值

  //
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const params: GQL_PARAMS = { func: GRAPHQL_QUERY['ORGANIZATION'] };
  const { data } = useRequest(() => queryGQL(gqlClient, organizationGql, params));

  /* 方法区 */
  const _onSelect = async () => {
    // 参数构建
    const gqlParams = {};
    //
    if (selectItems.deptIds.length !== 0)
      Object.assign(gqlParams, { deptIds: selectItems.deptIds });
    //
    if (selectItems.projIds.length !== 0)
      Object.assign(gqlParams, { projIds: selectItems.projIds.map((x) => parseInt(x)) });
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
  useEffect(() => {
    _onSelect();
  }, [selectItems]);

  /* 绘制区 */
  return (
    <div className={mySelector}>
      <Row align="middle">
        <Col span={20}>
          <Form layout="inline">
            <Form.Item label="所属部门/组">
              <TreeSelect
                {...defaultParams}
                multiple
                className={`${selectFilter} ${treeActive}`}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                treeDefaultExpandAll
                onClick={() => deptTreeNodes(data, treeData, setTreeData)}
                onDropdownVisibleChange={() => setTreeActive(treeActive ? '' : treeSelectActive)}
                onChange={(values: string) =>
                  setSelectItems((prev) => Object.assign({ ...prev }, { deptIds: values }))
                }
                onClear={() =>
                  setSelectItems((prev) => Object.assign({ ...prev }, { deptIds: [] }))
                }
                value={selectItems.deptIds}
              />
            </Form.Item>
            <Form.Item label="特性项目">
              <Select
                {...defaultParams}
                mode="multiple"
                className={selectFilter}
                onChange={(values: never[]) =>
                  setSelectItems((prev) => Object.assign({ ...prev }, { projIds: values }))
                }
                onClick={() => projOptsElems(gqlData, projElems, setProjElems)}
                onClear={() =>
                  setSelectItems((prev) => Object.assign({ ...prev }, { projIds: [] }))
                }
                value={selectItems.projIds}
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
                  setSelectItems((prev) => Object.assign({ ...prev }, { dates: dates }));
                }}
                value={selectItems.dates}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                setSelectItems(() => defaultSeclectItems);
                dateStr = undefined;
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
