import {requestExcutionApi, requestGenerateTaskApi} from "../../commenMethod/reauestApi"
import {Select} from "antd";
import {getPrincipal} from "@/publicMethods/verifyAxios";
import React from "react";
import dayjs from "dayjs";
import {convertUserNameToID} from "../../commenMethod/valueExchange";
import {getPrjManegerApi} from "./reauestApi";
import {getTemplateDetails} from "@/pages/zentao/zentaoTemplate/editTemplate/gridMethod/girdData";

const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersLoginInfo = JSON.parse(userLogins);

// 人员选择框
const getAllUsersSelect = async () => {
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

// 获取执行
const loadExcutionSelect = async () => {
  const excution = await requestExcutionApi();
  const excutionData: any = [];
  if (excution && excution.length > 0) {
    excution.forEach((ele: any) => {
      excutionData.push(
        <Option key={ele.execution_id} value={`${ele.execution_id}&${ele.execution_name}`}>{ele.execution_name}</Option>
      );
    });

  }
  return excutionData;
}

// 根据执行获取项目负责人
const loadProjectManager = async (excuteID: number) => {
  return getPrjManegerApi(excuteID);

};

// 获取模板的详情
const getTempDetails = async (tempId: string) => {

  const tempList = await getTemplateDetails(tempId);
  const returnValue: any = [];
  if (tempList && tempList.length > 0) {

    tempList.forEach((ele: any) => {
      const newDts = ele;
      newDts["plan_start"] = dayjs().format("YYYY-MM-DD");
      newDts["plan_end"] = dayjs().format("YYYY-MM-DD");
      returnValue.push(newDts);
    });
  }

  return returnValue;
};

// 任务生成
const generateTask = async (tempInfo: any, fromData: any, gridData: any) => {

  // 所属执行不能为空
  if (!fromData.belongExcution) {
    return {
      sucess: false,
      message: "所属执行不能为空!",
    }
  }

  if (!gridData || gridData.length === 0) {
    return {
      sucess: false,
      message: "列表中任务不能为空!",
    }
  }

  const usersInfo = await convertUserNameToID();

  const headData = {
    "temp_id": tempInfo.id,
    "start_time": dayjs(fromData.planStart).format("YYYY-MM-DD"),
    "end_time": dayjs(fromData.planEnd).format("YYYY-MM-DD"),
    "execution_id": (fromData.belongExcution).split("&")[0],
    "project_manager": usersInfo[fromData.projectManager],
  };
  const gridDataArray: any = [];
  gridData.forEach((ele: any) => {

    // 是否裁剪，是的时候不传（因为不做执行）
    if (ele.is_tailoring !== "yes") {
      gridDataArray.push({
        "add_type": ele.add_type,
        "task_type": ele.task_type,
        "task_name": ele.task_name,
        "module": ele.module,
        "subtask_dev_needs": ele.subtask_dev_needs,
        "assigned_person": usersInfo[ele.assigned_person_name] === undefined ? "" : usersInfo[ele.assigned_person_name],
        "priority": ele.priority,
        "estimate": ele.estimate,
        "desc": ele.desc,
        "belongs": ele.belongs,
        "tasksource": ele.tasksource,
        "edit_user": usersLoginInfo.userid,
        "temp_type": tempInfo.type,
        "is_tailoring": "no",
        "start_time": ele.plan_start,
        "end_time": ele.plan_end,
        "task_id": ele.task_id,
        "parent": ele.parent,
      })
    }

  });

  if (gridDataArray.length === 0) {
    return {
      sucess: false,
      message: "列表中任务不能为空或者列表中的数据都被裁剪!",
    }
  }
  return await requestGenerateTaskApi({
    "person": headData,
    "task_data": gridDataArray
  });
};

export {
  loadExcutionSelect, generateTask, getAllUsersSelect, loadProjectManager, getTempDetails
}
