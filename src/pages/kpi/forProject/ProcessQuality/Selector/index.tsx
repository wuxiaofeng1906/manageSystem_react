/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-11-29 18:32:35
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Select, Form, DatePicker, Divider } from 'antd';
import { selectFilter } from './index.css';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { useGqlClient } from '@/hooks';
import { GRAPHQL_QUERY } from '@/namespaces';
import { GQL_PARAMS, queryGQL } from '../../gql.query';
import organizationGql from './gqls/organization.gql';
import { WxDepartment } from './interface';
import { useState } from 'react';

const { Option } = Select;
const { RangePicker } = DatePicker;

/*  */
const childrenElems = (datas: WxDepartment[], val: any, setVal: Function) => {
  if (datas === undefined || val !== null) return;
  //
  const children: any[] = [];
  datas.map((da, i) =>
    children.push(
      <Option key={i} value={`${da.id}`}>
        {da.name}
      </Option>,
    ),
  );
  //
  setVal(children);
};

/*  */
export default (props: any) => {
  /*  */
  const defaultParams: any = {
    mode: 'multiple',
    defaultValue: 'all',
    className: selectFilter,
    allowClear: 'allowClear',
  };
  const [projElems, setProjElems] = useState(null);

  /*  */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const params: GQL_PARAMS = { func: GRAPHQL_QUERY['ORGANIZATION'] };
  const { data } = useRequest(() => queryGQL(gqlClient, organizationGql, params));

  /*  */
  return (
    <Form layout="inline">
      <Form.Item label="项目名称">
        <Select {...defaultParams} onChange={() => {}}>
          <Option value="all">全部</Option>
        </Select>
      </Form.Item>
      <Form.Item label="所属部门/组">
        <Select
          {...defaultParams}
          onChange={() => {}}
          onClick={() => childrenElems(data?.organization, projElems, setProjElems)}
        >
          <Option value="all">全部</Option>
          {projElems}
        </Select>
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
