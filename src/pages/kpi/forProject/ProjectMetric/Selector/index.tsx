/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-12-10 10:10:27
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Select, Form, DatePicker, Divider, TreeSelect } from 'antd';
import { selectFilter, treeSelectActive } from './index.css';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { GqlClient, useGqlClient } from '@/hooks';
import { EXTRA_FILTER_TYPE, GQL_PARAMS, GRAPHQL_QUERY } from '@/namespaces';
import { useState } from 'react';
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

/**
 * @description - 选中tree节点后，重新设置项目指标数据
 * @author JieTan
 * @date 2021/12/02 13:12:16
 * @param {string} value - 部门ID值
 * @param {Function} setVal - 修改Table数据的函数
 * @param {GqlClient<object>} gqlClient - gql查询实例
 */
const treeOnSelect = async (value: string, setVal: Function, gqlClient: GqlClient<object>) => {
  //
  const params: GQL_PARAMS = {
    func: GRAPHQL_QUERY['PROJECT_KPI'],
    params: { deptId: parseInt(value) },
  };
  //
  const rets = (await queryGQL(gqlClient, projectKpiGql, params)) ?? [];
  setVal(rets);
};

const projOnSelect = (vals: any[], projType: EXTRA_FILTER_TYPE, gridApi: any) => {
  // const pType: EXTRA_FILTER_TYPE = { field: 'project', values: vals };
  Object.assign(projType, { field: 'project', values: vals });
  gridApi.onFilterChanged();
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
  const { gqlData, setGqlData, gridApi, projType } = useModel('projectMetric'); // 获取“过程质量”查询的结果数据
  //
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const params: GQL_PARAMS = { func: GRAPHQL_QUERY['ORGANIZATION'] };
  const { data } = useRequest(() => queryGQL(gqlClient, organizationGql, params));

  /* 绘制区 */
  return (
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
          onSelect={(value: string) => treeOnSelect(value, setGqlData, gqlClient)}
        />
      </Form.Item>
      <Form.Item label="特性项目">
        <Select
          {...defaultParams}
          mode="multiple"
          className={selectFilter}
          onChange={(value: any[]) => projOnSelect(value, projType, gridApi)}
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
  );
};
