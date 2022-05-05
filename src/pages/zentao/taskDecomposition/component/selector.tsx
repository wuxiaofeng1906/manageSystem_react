import {axiosGet} from "@/publicMethods/axios";
import {Select} from "antd";

const {Option} = Select;
// 所属执行下拉框
const zentaoExcutionSelect = async () => {
  const execution = await axiosGet("/api/verify/sprint/execution");

  if (!execution || execution.length === 0) {
    return []
  }
  const selectOption: any = [];
  execution.forEach((ele: any) => {
    selectOption.push(
      <Option key={ele.execution_id} value={ele.execution_id}>{ele.execution_name}</Option>
    );
  });
  return selectOption;
};

// 禅道需求下拉框
const zentaoStorySelect = async (params: any) => {

  const zt_story = await axiosGet("/api/verify/sprint/demand", params);

  if (!zt_story || zt_story.length === 0) {
    return [];
  }
  const childType: any = [];

  zt_story.forEach((storys: any) => {
    childType.push({
      title: `${storys.id}:${storys.name}`,
      value: storys.id,
      key: storys.id,
    })
  });

  const typeData: any = [
    {
      title: `全选 (${childType.length}个)`,
      value: '全选',
      key: '全选',
      children: childType
    }];

  return typeData;
};

// 指派给和由谁创建下拉框(指派给需要新增一个“空”选项)
const zentaoDevCenterSelect = async () => {
  const devPerson = await axiosGet("/api/verify/sprint/devperson");

  if (!devPerson || devPerson.length === 0) {
    return []
  }
  const createOption: any = [];
  const assignedOption: any = [<Option key={"empty"} value={"empty"}>空</Option>];
  devPerson.forEach((ele: any) => {
    createOption.push(
      <Option key={ele.user_id} value={ele.user_id}>{ele.user_name}</Option>
    );
    assignedOption.push(<Option key={ele.user_id} value={ele.user_id}>{ele.user_name}</Option>);
  });
  return {createOption, assignedOption};
};

export {zentaoExcutionSelect, zentaoStorySelect, zentaoDevCenterSelect};
