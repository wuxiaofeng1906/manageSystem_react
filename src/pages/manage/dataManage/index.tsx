import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';

export default () => {
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: '小明',
      age: 32,
      address: '四川成都',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: '李华',
      age: 42,
      address: '浙江杭州',
      tags: ['loser'],
    },
    {
      key: '3',
      name: '小丽',
      age: 32,
      address: '陕西西安',
      tags: ['cool', 'teacher'],
    },
  ];

  return (
    <PageContainer>
      <Table columns={columns} dataSource={data}/>
    </PageContainer>
  );
};

