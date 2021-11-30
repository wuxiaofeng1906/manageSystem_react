import axios from "axios";
import {getCurrentProxy} from "../../../../config/ip";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

// 解析数据
const parseData = (params: any) => {

  const returnValue: any = [];
  if (params) {
    params.forEach((project: any) => {
      const projectItemArray: any = [];
      let username = "";
      project.forEach((ele: any) => {

        const projectItem = {
          person_id: ele.person_id,
          person_num: ele.person_num,
          user_tech: ele.user_tech,
          user_id: ele.user_id,
          user_name: "",
          duty_start_time: ele.duty_start_time,
          duty_end_time: ele.duty_end_time,
          duty_order: ele.duty_order
        };

        if (ele.duty_order === "1") {
          username = ele.user_name === null ? "" : ele.user_name;
        } else {

          if (ele.user_name === null || ele.user_name === "") {
            projectItem.user_name = username;
          } else {
            projectItem.user_name = `${username}/${ele.user_name}`;
          }
          username = "";
          projectItemArray.push(projectItem);
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
  // await axios.get('/api/verify/duty/plan_data', {params: {start_time: params.start, end_time: params.end}})
  //   .then(function (res) {
  //     if (res.data.code === 200) {
  //       result.datas = parseData(res.data.data.data);
  //     } else {
  //       result.message = `错误：${res.data.msg}`;
  //     }
  //   }).catch(function (error) {
  //     result.message = `异常信息:${error.toString()}`;
  //   });

  return result;
};

// 值班计划详情查询
const getPlanDetails = async (paln_num: string) => {

  const userInfo: any = {
    message: "",
    datas: []
  };


  // await axios.get('/api/verify/duty/plan_data_detail', {params: {person_num: paln_num}})
  //   .then(function (res) {
  //
  //     if (res.data.code === 200) {
  //       userInfo.datas = res.data.data;
  //     } else {
  //       userInfo.message = `错误：${res.data.msg}`;
  //     }
  //
  //   }).catch(function (error) {
  //     userInfo.message = `异常信息:${error.toString()}`;
  //   });

  return userInfo;

};

// 勾选值班计划发送消息
const sendMessageToApi = async (projectId: string) => {

  let errorMessage = "";
  // const hostIp = getCurrentProxy();
  // const data = {targetUrl: `${hostIp}api/verify/duty/msg_push?person_num=${projectId}`};
  // // await axios.get('/api/verify/duty/msg_push', {params: {person_num: projectId}})
  // await axios.post('/api/duty/msg_push', data)
  //   .then(function (res) {
  //     if (res.data.code !== 200) {
  //       errorMessage = `错误：${res.data.msg}`;
  //     }
  //   }).catch(function (error) {
  //     errorMessage = `异常信息:${error.toString()}`;
  //   });

  return errorMessage;
};

// 提交修改的数据
const submitModifyData = async (person_data: any, project_data: any) => {
  let errorMessage = "";
  // const hostIp = getCurrentProxy();
  // const url = `${hostIp}api/verify/duty/plan_data`;
  // // await axios.put("/api/verify/duty/plan_data", {"person": person_data, "project": project_data})
  // await axios.put("/api/duty/plan_data", {"targetUrl": url, "person": person_data, "project": project_data})
  //   .then(function (res) {
  //     if (res.data.code !== 200) {
  //       errorMessage = `错误：${res.data.msg}`;
  //     }
  //   }).catch(function (error) {
  //     errorMessage = `异常信息:${error.toString()}`;
  //   });

  return errorMessage;
};

export {queryDutyCardInfo, getPlanDetails, sendMessageToApi, submitModifyData};


