import {Select} from "antd";

const {Option} = Select;

// 增加类型
const addTypeRenderer = (currentValue: any, options: any) => {
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 指派人
const assignedToRenderer = (currentValue: any, options: any) => {

  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};


// 优先级
const priorityRenderer = (currentValue: any, options: any) => {

  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 任务类型
const taskTypeRenderer = (currentValue: any, options: any) => {
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 所属端
const sideRenderer = (currentValue: any, options: any) => {
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 任务来源
const taskSourceRenderer = (currentValue: any, options: any) => {
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};
// 是否裁剪
const cutRenderer = (value: any) => {
  let currentValue;
  if (value === "yes") {
    currentValue = "是";
  } else {
    currentValue = "否";
  }
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      <Option key={"yes"} value={"是"}> {"是"} </Option>
      <Option key={"no"} value={"否"}> {"否"} </Option>
    </Select>
  );
};
export {
  addTypeRenderer, assignedToRenderer, priorityRenderer,
  taskTypeRenderer, sideRenderer, taskSourceRenderer, cutRenderer
};
