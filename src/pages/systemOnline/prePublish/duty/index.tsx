import React from 'react';
import { Button, Checkbox, Space } from 'antd';

const Duty = () => {
  return (
    <div>
      <Space size={20}>
        <Button type={'primary'}>一键同步禅道人员</Button>
        <Checkbox>远程值班</Checkbox>
        <Button type={'primary'}>一键推送</Button>
      </Space>
    </div>
  );
};
export default Duty;
