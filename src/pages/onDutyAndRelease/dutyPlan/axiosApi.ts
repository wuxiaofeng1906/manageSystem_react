import axios from "axios";
import {getCurrentProxy} from "../../../../config/ip";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

console.log(`Bearer ${sys_accessToken}`);
// 解析数据
const parseData = (params: any) => {
  debugger;

  const returnValue: any = [];
  if (params) {
    params.forEach((project: any) => {
      const projectItemArray: any = [];
      const projectItem_Front = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_Backend = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };
      const projectItem_Test = {
        person_num: "",
        user_tech: "",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };

      const projectItem_Flow = {
        person_num: "",
        user_tech: "流程",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };

      const projectItem_SQA = {
        person_num: "",
        user_tech: "SQA",
        user_name: "",
        duty_start_time: "",
        duty_end_time: "",
        duty_order: ""
      };

      project.forEach((ele: any, index: number) => {
        const username = ele.user_name === null ? "" : ele.user_name;

        if (ele.user_tech === "前端") {
          projectItem_Front.person_num = ele.person_num;
          projectItem_Front.user_tech = ele.user_tech;
          projectItem_Front.duty_start_time = ele.duty_start_time;
          projectItem_Front.duty_end_time = ele.duty_end_time;
          projectItem_Front.duty_order = ele.duty_order;
          if (ele.duty_order === "1") {
            projectItem_Front.user_name = projectItem_Front.user_name === "" ? username : `${username}/${projectItem_Front.user_name}`;

          } else {
            projectItem_Front.user_name = projectItem_Front.user_name === "" ? username : `${projectItem_Front.user_name}/${username}`;
          }
        }

        if (ele.user_tech === "后端") {
          projectItem_Backend.person_num = ele.person_num;
          projectItem_Backend.user_tech = ele.user_tech;
          projectItem_Backend.duty_start_time = ele.duty_start_time;
          projectItem_Backend.duty_end_time = ele.duty_end_time;
          projectItem_Backend.duty_order = ele.duty_order;
          if (ele.duty_order === "1") {
            projectItem_Backend.user_name = projectItem_Backend.user_name === "" ? username : `${username}/${projectItem_Backend.user_name}`;

          } else {
            projectItem_Backend.user_name = projectItem_Backend.user_name === "" ? username : `${projectItem_Backend.user_name}/${username}`;
          }
        }

        if (ele.user_tech === "测试") {
          projectItem_Test.person_num = ele.person_num;
          projectItem_Test.user_tech = ele.user_tech;
          projectItem_Test.duty_start_time = ele.duty_start_time;
          projectItem_Test.duty_end_time = ele.duty_end_time;
          projectItem_Test.duty_order = ele.duty_order;
          if (ele.duty_order === "1") {
            projectItem_Test.user_name = projectItem_Test.user_name === "" ? username : `${username}/${projectItem_Test.user_name}`;

          } else {
            projectItem_Test.user_name = projectItem_Test.user_name === "" ? username : `${projectItem_Test.user_name}/${username}`;
          }

        }

        if (ele.user_tech === "流程") {
          projectItem_Flow.person_num = ele.person_num;
          projectItem_Flow.user_tech = ele.user_tech;
          projectItem_Flow.duty_start_time = ele.duty_start_time;
          projectItem_Flow.duty_end_time = ele.duty_end_time;
          projectItem_Flow.duty_order = ele.duty_order;
          if (ele.duty_order === "1") {
            projectItem_Flow.user_name = projectItem_Flow.user_name === "" ? username : `${username}/${projectItem_Flow.user_name}`;

          } else {
            projectItem_Flow.user_name = projectItem_Flow.user_name === "" ? username : `${projectItem_Flow.user_name}/${username}`;
          }

        }

        if (ele.user_tech === "SQA") {
          projectItem_SQA.person_num = ele.person_num;
          projectItem_SQA.user_tech = ele.user_tech;
          projectItem_SQA.duty_start_time = ele.duty_start_time;
          projectItem_SQA.duty_end_time = ele.duty_end_time;
          projectItem_SQA.duty_order = ele.duty_order;
          if (ele.duty_order === "1") {
            projectItem_SQA.user_name = projectItem_SQA.user_name === "" ? username : `${username}/${projectItem_SQA.user_name}`;

          } else {
            projectItem_SQA.user_name = projectItem_SQA.user_name === "" ? username : `${projectItem_SQA.user_name}/${username}`;
          }
        }


        if (index === project.length - 1) {
          projectItemArray.push(projectItem_Front);
          projectItemArray.push(projectItem_Backend);
          projectItemArray.push(projectItem_Test);
          projectItemArray.push(projectItem_Flow);
          projectItemArray.push(projectItem_SQA);
        }

      });
      returnValue.push(projectItemArray);
    });

  }

  return returnValue;
}
// 界面值班计划查询
const queryDutyCardInfo = async (params: any) => {

  const result: any = {
    message: "",
    datas: []
  };
  await axios.get('/api/verify/duty/plan_data', {params: {start_time: params.start, end_time: params.end}})
    .then(function (res) {
      if (res.data.code === 200) {

        result.datas = parseData(res.data.data.data);
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 值班计划详情查询
const getPlanDetails = async (paln_num: string) => {

  const userInfo: any = {
    message: "",
    datas: []
  };

  await axios.get('/api/verify/duty/plan_data_detail', {params: {person_num: paln_num}})
    .then(function (res) {

      if (res.data.code === 200) {
        userInfo.datas = res.data.data;
      } else {
        userInfo.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      userInfo.message = `异常信息:${error.toString()}`;
    });

  return userInfo;

};

// 勾选值班计划发送消息
const sendMessageToApi = async (projectId: string) => {

  let errorMessage = "";
  const hostIp = getCurrentProxy();
  const data = {targetUrl: `${hostIp}api/verify/duty/msg_push?person_num=${projectId}`};
  // await axios.get('/api/verify/duty/msg_push', {params: {person_num: projectId}})
  await axios.post('/api/duty/msg_push', data)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;
};

// 提交修改的数据
const submitModifyData = async (person_data: any, project_data: any) => {
  let errorMessage = "";
  const hostIp = getCurrentProxy();
  const url = `${hostIp}api/verify/duty/plan_data`;
  // await axios.put("/api/verify/duty/plan_data", {"person": person_data, "project": project_data})
  await axios.put("/api/duty/plan_data", {"targetUrl": url, "person": person_data, "project": project_data})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;
};

export {queryDutyCardInfo, getPlanDetails, sendMessageToApi, submitModifyData};


