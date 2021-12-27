import axios from "axios";
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);

const getInitPageData = async () => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_detail', {})
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
}

/* region 预发布项目 */
// 发布类型
const queryReleaseType = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_type', {})
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 发布方式
const queryReleaseWay = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_way', {})
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 保存预发布项目
const savePrePulishProjects = async (params: any) => {
  console.log(params, usersInfo);
  const prjIdArray = params.projectsName;
  let projectId = "";

  prjIdArray.forEach((project: string) => {
    projectId = projectId === "" ? project : `${projectId},${project}`;
  });

  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "project_id_set": projectId,
    "release_type": params.pulishType,
    "release_way": params.pulishMethod,
    "plan_release_time": dayjs(params.pulishTime).format("YYYY-MM-DD HH:mm:ss"),
    "ready_release_num": "string"
  };
  // const hostIp = getCurrentProxy();
  // const url = `${hostIp}api/verify/duty/plan_data`;
  let errorMessage = "";
  await axios.put("/api/verify/release/release_project", data)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;
};

/* endregion */

/* region 升级服务 */

// 一键部署Id
const queryReleaseId = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/deployment_id', {})
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};
// 根据一键部署ID查询
const queryServiceByID = async (params: string) => {

  const result: any = {
    message: "",
    data: []
  };

  // const hostIp = getCurrentProxy();
  // const data = {targetUrl: `${hostIp}api/verify/duty/msg_push?person_num=${projectId}`};
  // await axios.get('/api/verify/duty/msg_push', {params: {person_num: projectId}})
  await axios.post('/api/verify/release/env_branch', params)
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;

      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

/* endregion */
//
// // 值班计划详情查询
// const getPlanDetails = async (paln_num: string) => {
//
//   const userInfo: any = {
//     message: "",
//     datas: []
//   };
//
//
//   // await axios.get('/api/verify/duty/plan_data_detail', {params: {person_num: paln_num}})
//   //   .then(function (res) {
//   //
//   //     if (res.data.code === 200) {
//   //       userInfo.datas = res.data.data;
//   //     } else {
//   //       userInfo.message = `错误：${res.data.msg}`;
//   //     }
//   //
//   //   }).catch(function (error) {
//   //     userInfo.message = `异常信息:${error.toString()}`;
//   //   });
//
//   return userInfo;
//
// };
//
// // 勾选值班计划发送消息

//
// // 提交修改的数据
// const submitModifyData = async (person_data: any, project_data: any) => {
//   let errorMessage = "";
//   // const hostIp = getCurrentProxy();
//   // const url = `${hostIp}api/verify/duty/plan_data`;
//   // // await axios.put("/api/verify/duty/plan_data", {"person": person_data, "project": project_data})
//   // await axios.put("/api/duty/plan_data", {"targetUrl": url, "person": person_data, "project": project_data})
//   //   .then(function (res) {
//   //     if (res.data.code !== 200) {
//   //       errorMessage = `错误：${res.data.msg}`;
//   //     }
//   //   }).catch(function (error) {
//   //     errorMessage = `异常信息:${error.toString()}`;
//   //   });
//
//   return errorMessage;
// };


export {
  savePrePulishProjects, queryReleaseType, queryReleaseWay, queryReleaseId, queryServiceByID,
  getInitPageData
};


