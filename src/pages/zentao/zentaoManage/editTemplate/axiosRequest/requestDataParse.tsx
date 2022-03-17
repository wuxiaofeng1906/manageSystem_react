import {
  requestTempType, requestAddType, requestAssignedTo, requestPriorityApi,
  requestTaskTypeApi, requestSideApi, requestTaskSourceApi,
  requestTemplateDetailsApi
} from "./reauestApi";
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

// 获取指派人
const getAssignedToSelect = async () => {
  const types = await requestAssignedTo();

  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.account} value={`${ele.account}&${ele.realname}`}> {ele.realname} </Option>
      );
    });

    return selectValue;
  }

  return [];
};

// 获取优先级
const getPrioritySelect = async () => {
  const types = await requestPriorityApi();

  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele} value={ele}> {ele} </Option>
      );
    });

    return selectValue;
  }

  return [];
};

// 获取任务类型
const getTaskTypeSelect = async () => {
  const types = await requestTaskTypeApi();

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

// 获取所属端
const getSideSelect = async () => {
  const types = await requestSideApi();

  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.belongs} value={`${ele.belongs}&${ele.belongs_name}`}> {ele.belongs_name} </Option>
      );
    });

    return selectValue;
  }

  return [];
};

// 获取任务来源
const getTaskSourceSelect = async () => {
  const types = await requestTaskSourceApi();

  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.task_source}
                value={`${ele.task_source}&${ele.task_source_name}`}> {ele.task_source_name} </Option>
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
export {
  getTemTypeSelect, getAddTypeSelect, getAssignedToSelect, getPrioritySelect,
  getTaskTypeSelect, getSideSelect, getTaskSourceSelect,
  getTemplateDetails
}
