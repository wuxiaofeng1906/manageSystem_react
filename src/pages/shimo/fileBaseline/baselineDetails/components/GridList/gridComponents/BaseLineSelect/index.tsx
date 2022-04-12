import React from "react";
import {Select} from "antd";

const {Option} = Select;
const BaseLineSelect: React.FC<any> = (props: any) => {
  // 是否基线选择
  const gridSelectChanged = (props: any, currentValue: any) => {

  };

  return (
    <Select
      size={'small'} defaultValue={props.value}
      bordered={false} style={{width: '120%'}}
      onChange={(currentValue: any) => {
        gridSelectChanged(props, currentValue);
      }}
    >
      <Option key="yes" value="yes" disabled={true}>是</Option>
      <Option key="no" value="no">否</Option>
      <Option key="free" value="free">免</Option>

    </Select>
  );
};



export {BaseLineSelect};
