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
      <Option key="否" value="否">否</Option>
      <Option key="免" value="免">免</Option>

    </Select>
  );
};


export {BaseLineSelect};
