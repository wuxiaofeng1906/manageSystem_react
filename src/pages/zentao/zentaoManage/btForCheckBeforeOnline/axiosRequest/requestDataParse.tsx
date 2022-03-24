import {requestExcutionApi, requestGenerateTaskApi} from "../../commenMethod/reauestApi"
import {message, Select} from "antd";
import {getAllUsers} from "@/publicMethods/verifyAxios";
import React from "react";
import {queryDutyCardInfo} from "@/pages/onDutyAndRelease/dutyPlan/axiosApi";
import dayjs from "dayjs";
import {getTemplateDetails} from "@/pages/zentao/zentaoManage/editTemplate/gridMethod/girdData";
import {convertUserNameToID} from "../../commenMethod/valueExchange";

const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersLoginInfo = JSON.parse(userLogins);

// 人员选择框
const loadUserSelect = async (teach: string) => {

  const teachData: any = [];
  const userInfo = await getAllUsers(teach);

  if (userInfo.message !== "") {
    message.error({
      content: userInfo.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (userInfo.data) {
    const {data} = userInfo;
    data.forEach((user: any) => {
      teachData.push(
        <Option key={user.user_id} value={`${user.user_name}`}>{user.user_name}</Option>);
    });
  }
  return teachData;
};

// 获取执行的数据
const loadExcutionSelect = async () => {
  const excution = await requestExcutionApi();
  const excutionData: any = [];
  if (excution && excution.length > 0) {
    excution.forEach((ele: any) => {
      excutionData.push(
        <Option key={ele.execution_id} sprintType={ele.sprint_type}
                value={`${ele.execution_id}&${ele.execution_name}`}>{ele.execution_name}</Option>
      );
    });

  }
  return excutionData;
}

// 获取当周值班人员
const getDutyPerson = async () => {

  const currentWeek = {
    start: dayjs().startOf('week').add(1, 'day').format("YYYY/MM/DD"),
    end: dayjs().endOf('week').add(1, 'day').format("YYYY/MM/DD"),
  }
  const dutyInfo = await queryDutyCardInfo(currentWeek);

  const dutyPerson = {
    front: "",
    backend: "",
    test: "",
    sqa: ""
  }
  if (dutyInfo && (dutyInfo.datas).length === 1) {
    const dutyInfos = (dutyInfo.datas)[0];
    if (dutyInfos && dutyInfos.length > 0) {
      dutyInfos.forEach((info: any) => {
        if (info.user_tech === "前端") {
          dutyPerson.front = ((info.user_name).split("/")[0]).toString();
        } else if (info.user_tech === "后端") {
          dutyPerson.backend = ((info.user_name).split("/")[0]).toString();
        } else if (info.user_tech === "测试") {
          dutyPerson.test = ((info.user_name).split("/")[0]).toString();
        } else if (info.user_tech === "SQA") {
          dutyPerson.sqa = ((info.user_name).split("/")[0]).toString();
        }
      });
    }
  }

  return dutyPerson;
};

// 分配父任务的指派人
const getParentTaskPerson = (newDts: any) => {

  return newDts.assigned_person_name;
}

// 分配子任务的指派人
const getChildTaskPerson = (newDts: any, assignedTo: any) => {
  if ((newDts.task_name).toString().startsWith(">【前端】")) {
    if (assignedTo.front) { // 有值班人员才取值，没有的话还是使用原始值。
      return assignedTo.front;
    }
  } else if ((newDts.task_name).toString().startsWith(">【后端】")) {
    if (assignedTo.backend) {
      return assignedTo.backend;
    }
  } else if ((newDts.task_name).toString().startsWith(">【测试】")) {
    if (assignedTo.test) {
      return assignedTo.test;
    }
  } else if ((newDts.task_name).toString().startsWith(">【sqa】")) {
    if (assignedTo.sqa) {
      return assignedTo.sqa;
    }
  }
  return newDts.assigned_person_name;
}
// 获取模板的详情
const getTempDetails = async (tempId: string, assignedTo: any) => {

  const tempList = await getTemplateDetails(tempId);
  const returnValue: any = [];
  if (tempList && tempList.length > 0) {
    tempList.forEach((ele: any) => {
      const newDts = ele;
      newDts["plan_start"] = dayjs().format("YYYY-MM-DD");
      newDts["plan_end"] = dayjs().format("YYYY-MM-DD");

      // 判断是不是主任务
      let assigned_to = "";
      if (newDts.add_type_name === "新增") {
        // 是主任务就要获取相关项目负责人
        assigned_to = getParentTaskPerson(newDts);
      } else {
        // 如果是子任务，则判断任务名称中是哪个端的，是哪个端的就去取哪个端的值班人员。如果所取那个端的人员为空，则显示模板编辑时候的默认值。
        assigned_to = getChildTaskPerson(newDts, assignedTo);
      }
      newDts["assigned_person_name"] = assigned_to;
      returnValue.push(newDts);
    });
  }

  return returnValue;
};


// 任务生成
const generateTask = async (tempInfo: any, fromData: any, gridData: any) => {
  // 所属执行不能为空
  if (!fromData.belongExcution) {
    return "所属执行不能为空！"
  }

  if (!gridData || gridData.length === 0) {
    return "列表中任务不能为空！"
  }

  const usersInfo = await convertUserNameToID();

  const headData = {
    "temp_id": tempInfo.id,
    "start_time": dayjs(fromData.planStart).format("YYYY-MM-DD"),
    "end_time": dayjs(fromData.planEnd).format("YYYY-MM-DD"),
    "execution_id": (fromData.belongExcution).split("&")[0],
    "sqa": usersInfo[fromData.assingedToSQA],
    "test": usersInfo[fromData.assingedToTester],
    "front": usersInfo[fromData.assingedToFront],
    "backend": usersInfo[fromData.assingedToBackend]
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
        "assigned_person": usersInfo[ele.assigned_person_name],
        "priority": ele.priority,
        "estimate": ele.estimate,
        "desc": ele.desc,
        "belongs": ele.belongs,
        "tasksource": ele.tasksource,
        "edit_user": usersLoginInfo.name,
        "temp_type": tempInfo.type,
        "is_tailoring": "yes",
        "start_time": ele.plan_start,
        "end_time": ele.plan_end,
        "task_id": ele.task_id,
        "parent": ele.parent,
      })
    }

  });

  if (gridDataArray.length === 0) {
    return "列表中任务不能为空或者列表中的数据都被裁剪！"
  }
  return await requestGenerateTaskApi({
    "person": headData,
    "task_data": gridDataArray
  });
};

export {
  loadUserSelect, loadExcutionSelect, getDutyPerson, getTempDetails, generateTask
}
