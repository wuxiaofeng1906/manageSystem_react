import React from "react";
import {Button} from 'antd';
import {PlusOutlined, MinusOutlined, CopyOutlined} from '@ant-design/icons';
import "./style.css";
import {useModel} from "@@/plugin-model/useModel";
import {copyNewRows, deletedRows} from "./rowsOperate";
import {getIterListData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridData";

const Operate: React.FC<any> = (props: any) => {
  const {setListData, queryInfo} = useModel("iterateList.index");
  const currentRow = props.data;

  // 刷新数据
  const updateGrid = async () => {
    const dts = await getIterListData(queryInfo);
    setListData(dts);
  }

  // 删除行
  const delRow = () => {
    debugger;

    deletedRows(Number(currentRow.shimo_id));
  };

  // 复制行
  const copyRow = async () => {
    const copyResult = await copyNewRows(Number(currentRow.shimo_id));
    if (copyResult.code === 200) {
      // 刷新表格
      updateGrid();
    }
  };

  return (
    <div>
      <Button type="text" className={"bt_operate"} icon={<CopyOutlined/>} onClick={copyRow}></Button>
      <Button type="text" className={"bt_operate"} icon={<MinusOutlined/>} onClick={delRow}></Button>
    </div>);
};

export {Operate};
