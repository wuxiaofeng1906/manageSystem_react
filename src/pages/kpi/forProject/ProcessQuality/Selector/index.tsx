/*
 * @Description: 查询、筛选组件
 * @Author: jieTan
 * @Date: 2021-11-22 10:50:27
 * @LastEditTime: 2021-11-22 11:37:45
 * @LastEditors: jieTan
 * @LastModify: 
 */
import { Select, Form, DatePicker, Divider } from "antd"
import { selectFilter } from './index.css';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default (props:any) => {
  /*  */

  /*  */

  /*  */
  return <Form layout='inline'>
  <Form.Item label="项目名称">
      <Select defaultValue="all" className={selectFilter} onChange={() => { }}>
          <Option value="all">全部</Option>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
      </Select>
  </Form.Item>
  <Form.Item label="所属部门/组">
      <Select defaultValue="all" className={selectFilter} onChange={() => { }}>
          <Option value="all">全部</Option>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
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
          onChange={() => { }}
      />
  </Form.Item>
</Form>
}