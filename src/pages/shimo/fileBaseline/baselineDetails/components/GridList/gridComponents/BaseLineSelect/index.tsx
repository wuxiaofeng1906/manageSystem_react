import React from "react";
import {Select} from "antd";
import {modifyGridCells} from "../../cellEdit";
import {sucMessage} from "@/publicMethods/showMessages";
import "../style.less";

const {Option} = Select;
const BaseLineSelect: React.FC<any> = (props: any) => {
  // 是否基线选择
  const gridSelectChanged = async (oraData: any, currentValue: any) => {

    const data = {
      "version_id": oraData.data?.version_id,
      "is_save_version": currentValue,
      "remark": oraData.data?.remark,
      "zt_num": oraData.data?.zt_num
    };
    const result = await modifyGridCells(data);

    if (result.code === 200) {
      sucMessage("保存成功！");
    }
  };

  // 只有管理员才能操作按钮
  let showOperate = true;
  if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
    showOperate = false;
  }

  return (
    <div className={"treeSelectStyle"}>
      <Select
        size={'small'} defaultValue={props.value}
        bordered={false} style={{width: '120%'}}
        onChange={(currentValue: any) => {
          gridSelectChanged(props, currentValue);
        }}
        disabled={showOperate}
      >
        <Option key="free" value="free">免</Option>
        <Option key="yes" value="yes" disabled={true}>是</Option>
        <Option key="no" value="no" disabled={true}>否</Option>
      </Select>
    </div>

  );
};


export {BaseLineSelect};
