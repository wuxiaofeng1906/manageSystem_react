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

// 解析数据
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

// 获取上线环境
const getOnlineDev = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/online_environment', {})
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

// 获取发布项
const getPulishItem = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_item', {})
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

// 获取是否涉及接口和数据库升级
const getIsApiAndDatabaseUpgrade = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/api_database_upgrade', {})
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

// 修改发布项
const saveUpgradeItem = async (params: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/upgrade_service", params)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;

      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 删除发布项数据
const delUpgradeItem = async (id: number) => {
  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "app_id": id
  };
  await axios.delete("/api/verify/release/upgrade_service", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

}
/* endregion */

/* region 升级接口 */

// 升级接口
const getUpgradeApi = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/upgrade_api', {})
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

//  接口服务
const getApiService = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/api_service', {})
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

//  接口method
const getApiMethod = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/method', {})
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

// 保存发布接口
const savePulishApi = async (params: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/upgrade_api", params)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;

      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 删除发布接口数据
const delPulishApi = async (id: number) => {
  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "api_id": id
  };
  await axios.delete("/api/verify/release/upgrade_api", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

}
/* endregion */

// 服务确认
const upgradeServiceConfirm = async (datas: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/upgrade_confirm", datas)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;
};

/* region 数据修复 */

// 修复类别
const getRepaireCategory = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/repair_type', {})
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

// 新增数据修复数据
const addDataRepaire = async (datas: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/review_confirm", datas)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 修改数据修复数据
const modifyDataRepaire = async (datas: any) => {

  let errorMessage = "";
  await axios.put("/api/verify/release/review_confirm", datas)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// review 删除数据接口
const delDataReviewApi = async (id: number) => {
  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "review_id": id
  };
  await axios.delete("/api/verify/release/review_confirm", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

}

/* endregion */
export {
  savePrePulishProjects, queryReleaseType, queryReleaseWay, queryReleaseId, queryServiceByID,
  getInitPageData, getOnlineDev, getPulishItem, getIsApiAndDatabaseUpgrade, saveUpgradeItem,
  delUpgradeItem, getUpgradeApi, getApiService, getApiMethod, savePulishApi, delPulishApi,
  upgradeServiceConfirm, getRepaireCategory, addDataRepaire, modifyDataRepaire, delDataReviewApi
};


