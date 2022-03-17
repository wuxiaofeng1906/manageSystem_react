import {Select} from "antd";

// 增加类型
const addTypeRenderer = (data: any, options: any) => {
  const currentValue = `${data.add_type}&${data.add_type_name}`;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 指派人
const assignedToRenderer = (data: any, options: any) => {

  const currentValue = `${data.assigned_person}&${data.assigned_person_name}`;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};


// 优先级
const priorityRenderer = (data: any, options: any) => {

  const currentValue = data.priority;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 任务类型
const taskTypeRenderer = (data: any, options: any) => {
  const currentValue = `${data.task_type}&${data.task_type_name}`;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 所属端
const sideRenderer = (data: any, options: any) => {
  const currentValue = `${data.belongs}&${data.belongs_name}`;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};

// 任务来源
const taskSourceRenderer = (data: any, options: any) => {
  const currentValue = `${data.tasksource}&${data.tasksource_name}`;
  return (
    <Select
      size={'small'} defaultValue={currentValue}
      bordered={false} style={{width: '100%'}}>
      {options}
    </Select>
  );

};
export {
  addTypeRenderer, assignedToRenderer, priorityRenderer,
  taskTypeRenderer, sideRenderer, taskSourceRenderer
};
