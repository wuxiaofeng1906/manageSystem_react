import {requestTempType, requestAddType, requestTemplateDetailsApi} from "./reauestApi";
import {Select} from "antd";

const {Option} = Select;

// 获取模板类型
const getTemTypeSelect = async () => {
  const types = await requestTempType();
  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.temp_type} value={`${ele.temp_type}&${ele.temp_type_name}`}> {ele.temp_type_name} </Option>)
    });
    return selectValue;
  }

  return [];
};

// 获取增加类型
const getAddTypeSelect = async () => {
  const types = await requestAddType();

  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.task_type} value={`${ele.task_type}&${ele.task_type_name}`}> {ele.task_type_name} </Option>
      );
    });

    return selectValue;
  }

  return [];
};
// 获取详情列表
const getTemplateDetails = async (tempId: string) => {
  const tempList = await requestTemplateDetailsApi(tempId);
  return tempList;

};

// // 删除选中的模板
// const deleteTemplate = async (tempId: string) => {
//   const delData = await requestDelTempleApi(tempId);
//   return delData;
// };
export {getTemTypeSelect, getAddTypeSelect, getTemplateDetails}
