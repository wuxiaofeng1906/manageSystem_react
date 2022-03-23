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
import {message, Select} from "antd";

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
      "module": ele.module === undefined ? "" : ele.module,
      "subtask_dev_needs": ele.subtask_dev_needs === undefined ? "" : ele.subtask_dev_needs,
      "assigned_person": ele.assigned_person_name === undefined ? "" : users[ele.assigned_person_name] === undefined ? "" : users[ele.assigned_person_name],
      "priority": ele.priority,
      "estimate": ele.estimate,
      "desc": ele.desc === undefined ? "" : ele.desc,
      "belongs": ele.belongs_name === undefined ? "" : side[ele.belongs_name],
      "tasksource": ele.tasksource_name === undefined ? "" : taskSource[ele.tasksource_name],
      "is_tailoring": ele.is_tailoring === "是" ? "yes" : ele.is_tailoring === "yes" ? "yes" : "no",
      "edit_user": usersInfo.name,
      "temp_name": tempInfo.name,
      "temp_type": (tempInfo.type).split("&")[0],
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

// 验证保存的数据
const vertifySaveData = (gridData: any, tempInfos: any) => {

  if (!tempInfos.tempName) {
    return "模板名称不能为空!";
  }

  if (!tempInfos.tempType) {
    return "模板类型不能为空!";
  }

  let vertifyMsg = "";
  // 表格中 增加类型、任务名称、优先级、任务类型、最初预计、所属端、任务来源
  if (gridData && gridData.length > 0) {
    for (let index = 0; index < gridData.length; index += 1) {
      const dts = gridData[index];
      if (!dts.add_type_name) {
        vertifyMsg = `表格中第【${index + 1}】行的【增加类型】不能为空!`;
        break;
      }
      if (!dts.task_name) {
        vertifyMsg = `表格中第【${index + 1}】行的【任务名称】不能为空!`;
        break;
      }
      if (!dts.priority) {
        vertifyMsg = `表格中第【${index + 1}】行的【优先级】不能为空!`;
        break;
      }
      if (!dts.task_type_name) {
        vertifyMsg = `表格中第【${index + 1}】行的【任务类型】不能为空!`;
        break;
      }
      if (!dts.estimate) {
        vertifyMsg = `表格中第【${index + 1}】行的【最初预计】不能为空!`;
        break;
      }
      if (dts.estimate) {
        if (Number(dts.estimate).toString() === "NaN") {
          vertifyMsg = `表格中第【${index + 1}】行的【最初预计】必须为数字！`;
          break;
        }
      }
      if (!dts.belongs_name) {
        vertifyMsg = `表格中第【${index + 1}】行的【所属端】不能为空!`;
        break;
      }
      if (!dts.tasksource_name) {
        vertifyMsg = `表格中第【${index + 1}】行的【任务来源】不能为空!`;
        break;
      }
      // if (!dts.is_tailoring) {
      //   vertifyMsg = `表格中第【${index + 1}】行的【是否裁剪】不能为空!`;
      //   break;
      // }
    }
  }

  return vertifyMsg;
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

// 验证任务名称
const vertifyTaskName = (type: string, values: string) => {

  //   主任务（类型为新增）需要用【】包含起来。
  if (type === "新增") { // 主任务
    if (values.startsWith("【") && values.endsWith("】")) {
      return "";
    }
    return "主任务输入格式错误，正确格式为：【主任务名称】";
  }

//  子任务，需要用 > 【前端】【后端】【测试】【sqa】 开头
  if (!values.startsWith(">")) {
    return "子任务输入格式错误，正确格式为：>【所属端】 任务名称";
  }

  if (values.includes("【前端】") || values.includes("【后端】") || values.includes("【测试】") || values.includes("【sqa】")) {
    return ""
  }

  return "子任务输入格式错误，正确格式为：>【所属端】 任务名称";
};

// 增加类型
const vertifyAddType=(type: string, values: string)=>{
  //   主任务（类型为新增）需要用【】包含起来。
  if (type === "新增") { // 主任务
    if (values.startsWith("【") && values.endsWith("】")) {
      return "";
    }
    return "增加类型和任务名称格式不匹配";
  }

//  子任务，需要用 > 【前端】【后端】【测试】【sqa】 开头
  if (!values.startsWith(">")) {
    return "增加类型和任务名称格式不匹配";
  }

  if (values.includes("【前端】") || values.includes("【后端】") || values.includes("【测试】") || values.includes("【sqa】")) {
    return ""
  }

  return "增加类型和任务名称格式不匹配";

}
export {
  getTemTypeSelect, getAddTypeSelect, getAssignedToSelect, getPrioritySelect,
  getTaskTypeSelect, getSideSelect, getTaskSourceSelect, deleteTemplateList, vertifySaveData, saveTempList,
  vertifyTaskName,vertifyAddType
}
