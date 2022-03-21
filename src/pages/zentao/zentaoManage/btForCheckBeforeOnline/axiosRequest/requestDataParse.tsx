import {requestExcutionApi} from "../../commenMethod/reauestApi"
import {message, Select} from "antd";
import {getAllUsers} from "@/publicMethods/verifyAxios";
import React from "react";
import {queryDutyCardInfo} from "@/pages/onDutyAndRelease/dutyPlan/axiosApi";
import dayjs from "dayjs";

const {Option} = Select;
const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

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
        <Option key={ele.execution_id} value={`${ele.execution_id}&${ele.execution_name}`}>{ele.execution_name}</Option>
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
export {
  loadUserSelect, loadExcutionSelect, getDutyPerson
}
