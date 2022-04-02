import React from "react";
import {Button} from 'antd';
import {PlusOutlined, MinusOutlined, CopyOutlined} from '@ant-design/icons';
import "./style.css";

const Operate: React.FC<any> = (props: any) => {

  const addRow = () => {

  };

  const delRow = () => {

  };

  const copyRow = () => {

  };

  return (
    <div>
      <Button type="text" className={"bt_operate"} icon={<PlusOutlined/>} onClick={addRow}></Button>
      <Button type="text" className={"bt_operate"} icon={<MinusOutlined/>} onClick={delRow}></Button>
      <Button type="text" className={"bt_operate"} icon={<CopyOutlined/>} onClick={copyRow}></Button>
    </div>);
};

export {Operate};
