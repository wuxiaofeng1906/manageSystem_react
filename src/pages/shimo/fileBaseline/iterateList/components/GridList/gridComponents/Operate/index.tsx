import React from "react";
import {Button, Popconfirm} from 'antd';
import {MinusOutlined, CopyOutlined} from '@ant-design/icons';
import "./style.css";
import {useModel} from "@@/plugin-model/useModel";
import {copyNewRows, deletedRows} from "./rowsOperate";
import {getIterListData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridData";
import {QuestionCircleOutlined} from '@ant-design/icons';


const Operate: React.FC<any> = (props: any) => {
  const {setListData, queryInfo} = useModel("iterateList.index");
  const currentRow = props.data;

  // 刷新数据
  const updateGrid = async () => {
    const dts = await getIterListData(queryInfo);
    setListData(dts);
  }

  // 删除行
  const delRow = async () => {

    const deleteResult = await deletedRows(Number(currentRow.shimo_id));
    if (deleteResult.code === 200) {
      // 刷新表格
      updateGrid();
    }
  };

  // 复制行
  const copyRow = async () => {
    const copyResult = await copyNewRows(Number(currentRow.shimo_id));
    if (copyResult.code === 200) {
      // 刷新表格
      updateGrid();
    }
  };

  // 只有管理员才能操作按钮
  let showOperate = true;
  if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
    showOperate = false;
  }
  return (
    <div>
      <Button type="text" className={"bt_operate"} icon={<CopyOutlined/>} onClick={copyRow}
              disabled={showOperate}></Button>
      <Popconfirm
        icon={<QuestionCircleOutlined/>}
        title="确定删除这条数据吗？"
        okText="是"
        cancelText="否"
        onConfirm={delRow} disabled={showOperate}>
        <Button type="text" className={"bt_operate"} icon={<MinusOutlined/>} disabled={showOperate}></Button>
      </Popconfirm>

    </div>);
};


export {Operate};
