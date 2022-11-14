import React, { useImperativeHandle, useState, forwardRef } from 'react';
import { Table, Switch, Spin } from 'antd';
import { checkInfo } from '@/pages/onlineSystem/common/constant';
const Check = (props: any, ref: any) => {
  const [spin, setSpin] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      onRefreshCheck: () => {
        console.log('refresh');
      },
      onCheck: () => {
        console.log('check');
      },
      onSetting: () => {
        console.log('setting');
      },
      onLock: () => {
        console.log('lock');
      },
    }),
    [],
  );
  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div>
        <Table
          columns={[
            { title: '序号', dataIndex: 'num' },
            { title: '检查类别', dataIndex: 'check_type' },
            { title: '所属端', dataIndex: 'side' },
            { title: '检查状态', dataIndex: 'status' },
            { title: '检查开始时间', dataIndex: 'start_time' },
            { title: '检查结束时间', dataIndex: 'end_time' },
            {
              title: '是否启用',
              dataIndex: 'open',
              render: (p) => <Switch checkedChildren={'开启'} unCheckedChildren={'忽略'} />,
            },
            { title: '启用/忽略人', dataIndex: 'open_pm' },
            { title: '启用/忽略时间', dataIndex: 'open_time' },
            { title: '检查日志', dataIndex: 'log' },
          ]}
          dataSource={checkInfo}
          pagination={false}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(Check);
