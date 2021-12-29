/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-12-29 09:43:25
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Form, DatePicker, Divider, TreeSelect, Row, Col, Tooltip } from 'antd';
import { selectFilter, mySelector } from './index.css';
import { useMount } from 'ahooks';
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
let doChange = false;
const defaultSeclectItems = { deptIds: [], projIds: [], dates: null, doQuery: false };
/* ************************************************************************************************************** */
export default () => {
  /* 数据区 */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const [projElems, setProjElems] = useState(null); // 保存项目信息
  const [treeData, setTreeData] = useState([]); // 部门树形结构的数据
  const { gqlData, setGqlData } = useModel('projectMetric'); // 获取“过程质量”查询的结果数据
  const [selectItems, setSelectItems] = useState(defaultSeclectItems); // 存放多个筛选的值
  //
  const defaultParams: any = {
    className: selectFilter,
    showArrow: true,
    allowClear: 'allowClear',
    placeholder: '默认选择全部',
    multiple: 'multiple',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeDefaultExpandAll: 'treeDefaultExpandAll',
    treeCheckable: true,
    maxTagCount: 'responsive',
    onDropdownVisibleChange: (open: boolean) => {
      //
      !open && doChange
        ? setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: true }))
        : null;
    },
    filterTreeNode: (inputValue: string, treeNode: { title: string }) =>
      treeNode?.title.includes(inputValue) ? true : false,
  }; // <Select>默认的一些配置

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
    if (selectItems.doQuery && doChange) {
      setSelectItems((prev) => Object.assign({ ...prev }, { doQuery: false }));
      _onSelect();
      doChange = false;
    }
  }, [selectItems]);
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
        <Col span={20}>
          <Form layout="inline">
            <Form.Item label="所属部门/组" key="depts">
              <TreeSelect
                {...defaultParams}
                treeData={treeData}
                onChange={(values: string) => {
                  doChange = true;
                  setSelectItems((prev) =>
                    Object.assign(
                      { ...prev },
                      {
                        deptIds: values,
                        doQuery: prev.deptIds.length > values.length ? true : false, // 添加时不查询，移除时查询
                      },
                    ),
                  );
                }}
                onClear={() => {
                  setSelectItems((prev) =>
                    Object.assign({ ...prev }, { deptIds: [], doQuery: true }),
                  );
                }}
                value={selectItems.deptIds}
              />
            </Form.Item>
            <Form.Item label="特性项目" key="projects">
              <TreeSelect
                {...defaultParams}
                treeData={projElems}
                onChange={(values: string) => {
                  doChange = true;
                  setSelectItems((prev) =>
                    Object.assign(
                      { ...prev },
                      {
                        projIds: values,
                        doQuery: prev.projIds.length > values.length ? true : false, // 添加时不查询，移除时查询
                      },
                    ),
                  );
                }}
                onClear={() => {
                  setSelectItems((prev) =>
                    Object.assign({ ...prev }, { projIds: [], doQuery: true }),
                  );
                }}
                value={selectItems.projIds}
              />
            </Form.Item>
            <Form.Item key="vertical1">
              <Divider type="vertical" />
            </Form.Item>
            <Form.Item key="dates">
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
          </Form>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Tooltip title="刷新" color="cyan">
            <ReloadOutlined
              onClick={() => {
                doChange = true;
                setProjElems(null);
                setSelectItems(Object.assign(defaultSeclectItems, { doQuery: true }));
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
