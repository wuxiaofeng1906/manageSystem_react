import React from 'react';
import FlowArrow from '../components/FlowArrow';
import { Table, Divider } from 'antd';

const Test = () => {
  const columns = [
    {
      title: 'id',
      render: (it: any) => <span>{it.id}</span>,
      onCell: (it: any) => ({
        rowSpan: it.rowSpan,
        colSpan: it.rowSpan ? 1 : 0,
      }),
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Home phone',
      dataIndex: 'tel',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];

  const data = [
    {
      key: '1',
      id: '1',
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1',
      rowSpan: 2,
    },
    {
      key: '2',
      id: '2',
      tel: '0571-22098333',
      phone: 18889894588,
      age: 42,
      address: 'London No. 1',
    },
    {
      key: '3',
      id: '3',
      age: 32,
      tel: '0575-22098909',
      phone: 18900012342,
      address: 'Sidney No. 1',
      rowSpan: 3,
    },
    {
      key: '4',
      id: '4',
      age: 18,
      tel: '0575-22098909',
      phone: 15900010002,
      address: 'London No. 2',
    },
    {
      key: '5',
      id: '5',
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2',
    },
  ];
  return (
    <div>
      <FlowArrow
        data={[
          {
            title: 'child',
            info: '测试流程1',
            start: 1,
            end: 1,
            status: 'allReject',
          },
          {
            title: 'child2',
            info: '测试流程2',
            start: 2,
            end: 2,
            status: 'success',
          },
          {
            title: 'child2',
            info: '测试发布状态',
            start: 3,
            end: 3,
            status: 'partReject',
          },
          {
            title: 'child2',
            info: '测试超长数据测试超长数据测试超长数据测试超长数据测试超长数据测试超长数据测试超长数据',
            start: 4,
            end: 4,
            status: 'no',
          },
          {
            title: 'child2',
            info: '好几个就感觉韩国锦湖就感觉返回',
            start: 5,
            end: 5,
            status: 'partReject',
          },
          {
            title: 'child2',
            info: '无状态',
            start: 6,
            end: 6,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: '无状态',
            start: 7,
            end: 7,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: '无状态',
            start: 8,
            end: 8,
            status: 'noStart',
          },
          {
            title: 'child2',
            info: '无状态',
            start: 9,
            end: 9,
            status: 'noStart',
          },
        ]}
      />
      <Divider />
      <Table columns={columns} dataSource={data} bordered />
    </div>
  );
};
export default Test;
