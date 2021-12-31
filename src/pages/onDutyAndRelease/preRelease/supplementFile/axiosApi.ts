import axios from "axios";
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

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
const savePrePulishProjects = async (params: any, listNo: string) => {
  const prjIdArray = params.projectsName;
  let projectId = "";
  prjIdArray.forEach((project: string) => {
    projectId = projectId === "" ? project : `${projectId},${project}`;
  });

  const data = {
    "pro_id": params.proid === "" ? "" : Number(params.proid),
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "project_id_set": projectId,
    "release_type": params.pulishType,
    "release_way": params.pulishMethod,
    "plan_release_time": dayjs(params.pulishTime).format("YYYY-MM-DD HH:mm:ss"),
    "ready_release_num": listNo
  };
  // const hostIp = getCurrentProxy();
  // const url = `${hostIp}api/verify/duty/plan_data`;
  const result: any = {
    datas: {},
    errorMessage: ""
  };
  await axios.post("/api/verify/release/release_project", data)
    .then(function (res) {

      if (res.data.code === 200) {
        const timeData = res.data.data;
        if (timeData) {
          result.datas = {
            editor: usersInfo.name,
            editTime: timeData.edit_time
          };
        }

      } else {
        result.errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.errorMessage = `异常信息:${error.toString()}`;
    });

  return result;
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

const getGridDataSource = (oldData: any) => {

  if (!oldData) {
    return [];
  }

  const resultArray: any = [];
  oldData.forEach((ele: any) => {

    const filedObject = {
      id: ele.id,
      automation_test: ele.automation_test,
      branch_environment: `${ele.branch}_${ele.env}`,
      app: "",

    };

    (ele.service).forEach((service: any) => {  // 有几个应用就要生成几条数据
      filedObject.app = service;
      resultArray.push(filedObject);
    });


  });

  return resultArray;
};

// 一键部署ID之升级接口数据获取
const queryServiceByID = async (params: string) => {

  const result: any = {
    message: "",
    data: []
  };

  await axios.post('/api/verify/release/env_branch', params)
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = getGridDataSource(res.data.data);

      } else {
        result.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;

};

/* endregion */


export {
  savePrePulishProjects, queryReleaseType, queryReleaseWay, queryReleaseId, queryServiceByID,
  getInitPageData
};


