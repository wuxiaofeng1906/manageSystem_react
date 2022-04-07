import React from "react";
import {Button} from 'antd';
import {PlusOutlined, MinusOutlined, CopyOutlined} from '@ant-design/icons';
import "./style.css";
import {useModel} from "@@/plugin-model/useModel";

const Operate: React.FC<any> = (props: any) => {
  const {setListData, listData} = useModel("iterateList.index");

  // 新增行
  const addRow = () => {
    //   指定位置新增行

  };

  // 删除行
  const delRow = () => {

  };

  // 复制行
  const copyRow = () => {
    //   指定位置复制行。

  };

  return (
    <div>
      <Button type="text" className={"bt_operate"} icon={<PlusOutlined/>} onClick={addRow}></Button>
      <Button type="text" className={"bt_operate"} icon={<MinusOutlined/>} onClick={delRow}></Button>
      <Button type="text" className={"bt_operate"} icon={<CopyOutlined/>} onClick={copyRow}></Button>
    </div>);
};

export {Operate};
