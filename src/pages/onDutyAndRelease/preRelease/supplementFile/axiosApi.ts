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

};

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
/* endregion */

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

// 数据修复服务确认
const dataRepairConfirm = async (datas: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/review_confirm_always", datas)
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

/* region 上线分支 */

// 获取技术侧
const getNewCheckNum = async () => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/check_num', {})
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


// 获取技术侧
const getTechSide = async () => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/technical_side', {})
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

// 获取检查类型
const getCheckType = async () => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/check_type', {})
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

// 获取浏览器类型
const getBrowserType = async () => {
  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/browser', {})
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

// 线上分支设置保存
const saveOnlineBranch = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {
  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ready_release_num": currentListNo,
    "branch_name": sourceData.branchName,
    "technical_side": sourceData.module,
    "ignore_check_test_unit_backend": (sourceData.ignoreFrontCheck).length === 1 ? "1" : "2",
    "ignore_check_test_unit_front": (sourceData.ignoreBackendCheck).length === 1 ? "1" : "2",
  };

  if (type === "修改") {
    data["branch_check_id"] = "";
  }

  let errorMessage = "";
  await axios.post("/api/verify/release/release_branch", data)
    .then(function (res) {

      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 线上版本检查
const saveVersonCheck = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {
  // 服务
  const {server} = sourceData;
  let serverStr = "";
  server.forEach((ele: string) => {
    serverStr = serverStr === "" ? ele : `${serverStr},${ele}`;
  });

  // 被对比的主分支
  const main_branch = sourceData.branch_mainBranch;
  let mainBranch = "";
  main_branch.forEach((ele: string) => {
    mainBranch = mainBranch === "" ? ele : `${mainBranch},${ele}`;
  });

  // 技术侧
  const technical_side = sourceData.branch_teachnicalSide;
  let techSide = "";
  technical_side.forEach((ele: string) => {
    techSide = techSide === "" ? ele : `${techSide},${ele}`;
  });

  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "backend_version_check_flag": sourceData.verson_check, // 是否开启版本检查
    "server": serverStr, // 服务
    "image_branch": sourceData.branchName, // 传分支名称
    "image_env": sourceData.imageevn, // 镜像环境
    "inclusion_check_flag": sourceData.branchcheck, // 是否开启分支检查
    "main_branch": mainBranch, // 主分支
    "technical_side": techSide, // 技术侧
    "target_branch": sourceData.branchName, // 传分支名称
    "main_since": dayjs(sourceData.branch_mainSince).format("YYYY-MM-DD"), // 时间
  };

  if (type === "修改") {
    data["version_check_id"] = "";
  }

  let errorMessage = "";
  await axios.post("/api/verify/release/release_check_version", data)
    .then(function (res) {

      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 环境一致性检查
const saveEnvironmentCheck = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {

  let ignore_check = "2";
  if (sourceData.ignoreCheck) {
    ignore_check = (sourceData.ignoreCheck).length === 1 ? "1" : "2";
  }
  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ignore_check": ignore_check,
    "check_env": sourceData.checkEnv
  }
  if (type === "修改") {
    data["check_id"] = "";
  }

  let errorMessage = "";
  await axios.post("/api/verify/release/check_env", data)
    .then(function (res) {

      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// (上线前后)自动化检查
const saveOnlineAutoCheck = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {
  debugger;

  const data = [];

  // 上线前检查
  let before_ignore_check = "2";
  if (sourceData.autoBeforeIgnoreCheck) {
    before_ignore_check = (sourceData.autoBeforeIgnoreCheck).length === 1 ? "1" : "2";
  }

  let before_check_type = "";
  (sourceData.beforeCheckType).forEach((ele: string) => {
    before_check_type = before_check_type === "" ? ele : `${before_check_type},${ele}`;
  });
  data.push({
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_time": "1",    // 1 上线前检查， 2 上线后检查
    "ignore_check": before_ignore_check,
    "check_type": before_check_type,
    "test_env": sourceData.beforeTestEnv,
    "browser": sourceData.beforeBrowser,
    // "automation_id": 0,
  });


  // 上线后检查
  let after_ignore_check = "2";
  if (sourceData.autoAfterIgnoreCheck) {
    after_ignore_check = (sourceData.autoAfterIgnoreCheck).length === 1 ? "1" : "2";
  }
  let after_check_type = "";
  (sourceData.afterCheckType).forEach((ele: string) => {
    after_check_type = after_check_type === "" ? ele : `${after_check_type},${ele}`;
  });

  data.push({
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_time": "2",    // 1 上线前检查， 2 上线后检查
    "ignore_check": after_ignore_check,
    "check_type": after_check_type,
    "test_env": sourceData.afterTestEnv,
    "browser": sourceData.afterBrowser,
    // "automation_id": 0,

  });

  if (type === "修改") {
    data[0]["automation_id"] = "";
    data[1]["automation_id"] = "";
  }

  let errorMessage = "";
  await axios.post("/api/verify/release/automation_check", data)
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

export {
  savePrePulishProjects, queryReleaseType, queryReleaseWay, queryReleaseId, queryServiceByID,
  getInitPageData, getOnlineDev, getPulishItem, getIsApiAndDatabaseUpgrade, saveUpgradeItem,
  delUpgradeItem, getUpgradeApi, getApiService, getApiMethod, savePulishApi, delPulishApi,
  upgradeServiceConfirm, getRepaireCategory, addDataRepaire, modifyDataRepaire, delDataReviewApi,
  dataRepairConfirm, getTechSide, getCheckType, getBrowserType, getNewCheckNum, saveOnlineBranch,
  saveVersonCheck, saveEnvironmentCheck, saveOnlineAutoCheck
};


