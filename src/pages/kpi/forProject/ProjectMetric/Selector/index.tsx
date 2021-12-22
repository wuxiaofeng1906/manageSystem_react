/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-12-22 10:31:14
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Select, Form, DatePicker, Divider, TreeSelect } from 'antd';
import { selectFilter, treeSelectActive, mySelector } from './index.css';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GQL_PARAMS, GRAPHQL_QUERY } from '@/namespaces';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { toTree } from './utils/tree';
import { projectKpiGql, organizationGql, queryGQL } from '@/pages/gqls';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * @description - 构建<Select>的<Option>元素
 * @author JieTan
 * @date 2021/11/30 11:11:15
 * @param {any[]} datas - 待解析的源数据
 * @param {string} valueKey - <Option>的value值
 * @param {string} textkey - <Option>的text值
 * @param {*} [target] - 从datas的target元素中取之
 * @returns {*}  {any[]} - 返回构建的<Option>数组元素
 */
const childrenElems = (datas: any[], valueKey: string, textkey: string, target?: any): any[] => {
  //
  const children: any[] = [];
  datas.map((da, i) => {
    const item = target ? da[target] : da;
    children.push(
      <Option key={i} value={`${item[valueKey]}`}>
        {item[textkey]}
      </Option>,
    );
  });
  //
  return children;
};

/**
 * @description - 获取所有项目信息
 * @author JieTan
 * @date 2021/11/30 11:11:14
 * @param {any[]} datas - 待解析的源数据
 * @param {*} val - 存储proj数据的state值
 * @param {Function} setVal - 修改相应state值的函数
 * @returns {*} {void}
 */
const projOptsElems = (datas: any[], val: any, setVal: Function): void => {
  if (datas === undefined || val !== null) return;
  setVal(childrenElems(datas, 'id', 'name', 'project'));
};

/**
 * @description -
 * @author JieTan
 * @date 2021/12/01 17:12:33
 * @param {*} data
 * @param {any[]} val
 * @param {Function} setVal
 * @returns {*}  {void}
 */
const deptTreeNodes = (data: any, val: any[], setVal: Function): void => {
  if (val.length !== 0) return;
  const ret = toTree(data?.organization, 'id', 'parent', [
    ['name', 'title'],
    ['id', 'value'],
  ])
    ?.shift()
    ?.children?.shift();
  setVal(ret ? [ret as never] : []);
};

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
  const [projIds, setProjIds] = useState([]);
  //
  let deptId: string;
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
    if (projIds.length !== 0)
      Object.assign(gqlParams, { projIds: projIds.map((x) => parseInt(x)) });
    //
    const params: GQL_PARAMS = {
      func: GRAPHQL_QUERY['PROJECT_KPI'],
      params: gqlParams,
    };

    // 数据查询
    const rets = (await queryGQL(gqlClient, projectKpiGql, params)) ?? [];
    setGqlData(rets);
  };

  /* 绘制区 */
  return (
    <div className={mySelector}>
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
            onBlur={() => _onSelect()}
            onClick={() => projOptsElems(gqlData, projElems, setProjElems)}
            children={projElems}
          />
        </Form.Item>
        <Form.Item>
          <Divider type="vertical" />
        </Form.Item>
        <Form.Item>
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            onChange={() => {}}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
