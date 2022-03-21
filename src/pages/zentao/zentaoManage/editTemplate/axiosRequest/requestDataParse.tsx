import {
  requestTempType, requestAddType, requestAssignedTo, requestPriorityApi,
  requestTaskTypeApi, requestSideApi, requestTaskSourceApi, requestDelTempleListApi,
  requestSaveTempleListApi
} from "./reauestApi";

import {getPrincipal} from "@/publicMethods/verifyAxios";

import {
  convertAddTypeToID, convertUserNameToID, convertTaskTypeToID,
  convertSideToID, convertTaskSourceToID
} from "../../commenMethod/valueExchange";
import {Select} from "antd";

const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

/* region select 框 */
// 获取模板类型
const getTemTypeSelect = async () => {
  const types = await requestTempType();
  if (types.length > 0) {
    const selectValue: any = [];
    types.forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.temp_type} value={`${ele.temp_type}`}> {ele.temp_type_name} </Option>)
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
        <Option key={ele.task_type} value={ele.task_type_name}> {ele.task_type_name} </Option>
      );
    });

    return selectValue;
  }

  return [];
};

// 获取指派人
const getAssignedToSelect = async () => {
  const users = await getPrincipal();

  if ((users.data).length > 0) {
    const selectValue: any = [];
    (users.data).forEach((ele: any) => {
      selectValue.push(
        <Option key={ele.user_id} value={ele.user_name}> {ele.user_name} </Option>
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
        <Option key={ele.task_type} value={ele.task_type_name}> {ele.task_type_name} </Option>
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
        <Option key={ele.belongs} value={ele.belongs_name}> {ele.belongs_name} </Option>
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
        <Option
          key={ele.task_source} value={ele.task_source_name}> {ele.task_source_name} </Option>
      );
    });

    return selectValue;
  }

  return [];
};

/* endregion select 框 */

// 删除选中的模板
const deleteTemplateList = async (subtaskId: string) => {
  const delData = await requestDelTempleListApi(subtaskId);
  return delData;
};

// 解析需要保存的数据
const analysisGridData = async (data: any, tempInfo: any) => {

  const addType = await convertAddTypeToID(); // 增加类型
  const users = await convertUserNameToID(); // 增加类型
  const taskType = await convertTaskTypeToID(); // 增加类型
  const side = await convertSideToID(); // 增加类型
  const taskSource = await convertTaskSourceToID(); // 增加类型
  const saveDt: any = [];

  data.forEach((ele: any) => {

    // subtask_id、task_id、parent 这三个字段如果没有值，则不传字段到后端，其他字段为空的时候都传空字符串
    const detailsData = {
      "add_type": ele.add_type_name === undefined ? "" : addType[ele.add_type_name],
      "task_type": ele.task_type_name === undefined ? "" : taskType[ele.task_type_name],
      "task_name": ele.task_name,
      "module": ele.module,
      "subtask_dev_needs": ele.subtask_dev_needs,
      "assigned_person": ele.assigned_person_name === undefined ? "" : users[ele.assigned_person_name],
      "priority": ele.priority,
      "estimate": ele.estimate,
      "desc": ele.desc,
      "belongs": ele.belongs_name === undefined ? "" : side[ele.belongs_name],
      "tasksource": ele.tasksource_name === undefined ? "" : taskSource[ele.tasksource_name],
      "is_tailoring": ele.is_tailoring === "是" ? "yes" : ele.is_tailoring === "yes" ? "yes" : "no",
      "edit_user": usersInfo.name,
      "temp_name": tempInfo.name,
      "temp_type": tempInfo.type,
    };

    if (tempInfo.id) {
      detailsData["temp_id"] = tempInfo.id;
    }
    if (ele.subtask_id) {
      detailsData["subtask_id"] = ele.subtask_id;
    }
    if (ele.task_id) {
      detailsData["task_id"] = ele.task_id;
    }
    if (ele.parent) {
      detailsData["parent"] = ele.parent;
    }
    saveDt.push(detailsData);
  });


  return saveDt;

};

// 保存模板编辑列表
const saveTempList = async (data: any, tempInfo: any) => {
  if (!data || data.length === 0) {
    return "保存的数据不能为空！"
  }

  const finValue = await analysisGridData(data, tempInfo)
  const saveResult = await requestSaveTempleListApi(finValue);
  return saveResult;
};

export {
  getTemTypeSelect, getAddTypeSelect, getAssignedToSelect, getPrioritySelect,
  getTaskTypeSelect, getSideSelect, getTaskSourceSelect, deleteTemplateList, saveTempList
}
