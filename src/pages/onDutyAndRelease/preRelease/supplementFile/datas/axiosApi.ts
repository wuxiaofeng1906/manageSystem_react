import axios from "axios";
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);


/* region 发布tab相关 */
// 获取预发布编号
const getNewPageNum = async () => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_num', {})
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

// 根据id获取数据
const getInitPageData = async (queryReleaseNum: string) => {

  const result: any = {
    message: "",
    data: []
  };

  await axios.get('/api/verify/release/release_detail', {params: {"ready_release_num": queryReleaseNum}})
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

// 删除预发布tab
const delTabsInfo = async (releaseNum: string) => {

  let errorMessage = "";

  const datas = {

    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ready_release_num": releaseNum
  };
  await axios.delete("/api/verify/release/release_detail", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 修改tab的名字
const updateTabsName = async (currentListNo: string, newName: string) => {

  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ready_release_num": currentListNo,
    "ready_release_name": newName
  };
  let errorMessage = "";
  await axios.post("/api/verify/release/release_name", data)
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

/* region 检查进度 */

const getCheckProcess = async (releaseNum: string) => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/progress', {params: {ready_release_num: releaseNum}})
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

const updateReleaseProcess = async (data: any) => {

  let errorMessage = "";
  await axios.post("/api/verify/release/progress", data)
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

/* region 预发布项目 */
// 删除接口
const deleteReleasedId = async (ready_release_num: string, deployment_id: string) => {

  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "deployment_id": deployment_id,
    "ready_release_num": ready_release_num
  };

  await axios.delete("/api/verify/release/upgrade_service_deployment", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

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
    const proID = project.split('&')[1];
    projectId = projectId === "" ? proID : `${projectId},${proID}`;
  });

  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "project_id_set": projectId,
    "release_type": params.pulishType,
    "release_way": params.pulishMethod,
    "plan_release_time": dayjs(params.pulishTime).format("YYYY-MM-DD HH:mm:ss"),
    "ready_release_num": listNo
  };

  if (params.proid) {
    data["pro_id"] = Number(params.proid);
  }

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

    (ele.service).forEach((service: any) => {  // 有几个应用就要生成几条数据

      resultArray.push({
        id: ele.id,
        deployment_id: ele.id,
        automation_check: ele.automation_check,
        branch_environment: `${ele.branch}_${ele.env}`,
        app: service,

      });
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

  let frontCheck = "2";
  if (sourceData.ignoreFrontCheck) {
    if (Array.isArray(sourceData.ignoreFrontCheck)) {
      frontCheck = (sourceData.ignoreFrontCheck).length === 1 ? "1" : "2";
    } else {
      frontCheck = sourceData.ignoreFrontCheck; // 这个表示没被修改过，直接带过来的数据
    }
  }

  let backendCheck = "2";
  if (sourceData.ignoreBackendCheck) {
    if (Array.isArray(sourceData.ignoreBackendCheck)) {
      backendCheck = (sourceData.ignoreBackendCheck).length === 1 ? "1" : "2";
    } else {
      backendCheck = sourceData.ignoreBackendCheck;
    }
  }
  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ready_release_num": currentListNo,
    "branch_name": sourceData.branchName,
    "technical_side": sourceData.module,
    "ignore_check_test_unit_front": frontCheck,
    "ignore_check_test_unit_backend": backendCheck,
  };

  if (type === "修改") {
    data["branch_check_id"] = sourceData.branchCheckId;
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

  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "backend_version_check_flag": false, // 是否开启版本检查
    "inclusion_check_flag": false, // 是否开启分支检查
  };

  // 判断是否开启版本检查，如果没开启，则不传相关字段
  if (sourceData?.verson_check) { // true 已开启
    // 服务
    const {server} = sourceData;
    let serverStr = "";
    server.forEach((ele: string) => {
      serverStr = serverStr === "" ? ele : `${serverStr},${ele}`;
    });
    data.backend_version_check_flag = true;
    data["server"] = serverStr;
    data["image_branch"] = sourceData.branchName;// 传分支名称
    data["image_env"] = sourceData.imageevn; // 镜像环境
  }


  if (sourceData?.branchcheck) {
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
    data.inclusion_check_flag = true;
    data["main_branch"] = mainBranch; // 主分支
    data["technical_side"] = techSide; // 技术侧
    data["target_branch"] = sourceData.branchName; // 传分支名称
    data["main_since"] = dayjs(sourceData.branch_mainSince).format("YYYY-MM-DD"); // 时间

  }

  if (type === "修改") {
    data["version_check_id"] = sourceData.versionCheckId;
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
    if (Array.isArray(sourceData.ignoreCheck)) {
      ignore_check = (sourceData.ignoreCheck).length === 1 ? "1" : "2";

    } else {
      ignore_check = sourceData.ignoreCheck;
    }
  }

  const data = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ignore_check": ignore_check,
  }

  if (ignore_check === "2") { // 如果没有忽略检查
    data["check_env"] = sourceData.checkEnv;
  }

  if (type === "修改") {
    data["check_id"] = sourceData.envCheckId;
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

  const data = [];

  // 上线前检查: 打勾是1，没打勾是2
  let before_ignore_check = "2";
  if (sourceData.autoBeforeIgnoreCheck) {
    if (Array.isArray(sourceData.autoBeforeIgnoreCheck)) {
      before_ignore_check = (sourceData.autoBeforeIgnoreCheck).length === 1 ? "1" : "2";
    } else {
      before_ignore_check = sourceData.autoBeforeIgnoreCheck;
    }
  }

  const beforeData = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_time": "1",    // 1 上线前检查， 2 上线后检查
    "ignore_check": before_ignore_check,
  };

  if (before_ignore_check === "2") {
    let before_check_type = "";
    (sourceData.beforeCheckType).forEach((ele: string) => {
      before_check_type = before_check_type === "" ? ele : `${before_check_type},${ele}`;
    });
    beforeData["check_type"] = before_check_type;
    beforeData["test_env"] = sourceData.beforeTestEnv;
    beforeData["browser"] = sourceData.beforeBrowser;
  }
  if (type === "修改") {
    beforeData["automation_id"] = sourceData.beforeAutomationId;
  }

  data.push(beforeData);


  // 上线后检查
  let after_ignore_check = "2";
  if (sourceData.autoAfterIgnoreCheck) {
    if (Array.isArray(sourceData.autoAfterIgnoreCheck)) {
      after_ignore_check = (sourceData.autoAfterIgnoreCheck).length === 1 ? "1" : "2";
    } else {
      after_ignore_check = sourceData.autoAfterIgnoreCheck;
    }
  }

  const afterData = {
    "check_num": newOnlineBranchNum,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_time": "2",    // 1 上线前检查， 2 上线后检查
    "ignore_check": after_ignore_check,
  };

  if (after_ignore_check === "2") {
    let after_check_type = "";
    (sourceData.afterCheckType).forEach((ele: string) => {
      after_check_type = after_check_type === "" ? ele : `${after_check_type},${ele}`;
    });
    afterData["check_type"] = after_check_type;
    afterData["test_env"] = sourceData.afterTestEnv;
    afterData["browser"] = sourceData.afterBrowser;
  }

  if (type === "修改") {
    afterData["automation_id"] = sourceData.afterAutomationId;
  }
  data.push(afterData);


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

// 修改时获取原有数据
const getDetaisByCHeckNum = async (checkNum: string) => {

  const result: any = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/release_branch', {params: {"check_num": checkNum}})
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

// 删除上线分支
const delDataOnlineBranchApi = async (id: number) => {

  let errorMessage = "";

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_num": id
  };
  await axios.delete("/api/verify/release/release_branch", {data: datas})
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 执行版本检查
const excuteVersionCheck = async (checkNum: string) => {

  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_num": checkNum
  };
  let errorMessage = "";
  await axios.post("/api/verify/release/version_check", data)
    .then(function (res) {

      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 执行环境检查
const excuteEnvCheck = async (checkNum: string) => {
  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_num": checkNum
  };
  let errorMessage = "";
  await axios.post("/api/verify/release/env_check", data)
    .then(function (res) {

      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;

};

// 执行自动化检查
const excuteAutoCheck = async (checkNum: string, checkTime: string) => {
  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "check_num": checkNum,
    "check_time": checkTime
  };
  let errorMessage = "";
  await axios.post("/api/verify/release/automation_check_perform", data)
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
  getNewPageNum, delTabsInfo, getCheckProcess, updateReleaseProcess, updateTabsName, deleteReleasedId,
  savePrePulishProjects, queryReleaseType, queryReleaseWay, queryReleaseId, queryServiceByID,
  getInitPageData, getOnlineDev, getPulishItem, getIsApiAndDatabaseUpgrade, saveUpgradeItem,
  delUpgradeItem, getUpgradeApi, getApiService, getApiMethod, savePulishApi, delPulishApi,
  upgradeServiceConfirm, getRepaireCategory, addDataRepaire, modifyDataRepaire, delDataReviewApi,
  dataRepairConfirm, getTechSide, getCheckType, getBrowserType, getNewCheckNum, saveOnlineBranch,
  saveVersonCheck, saveEnvironmentCheck, saveOnlineAutoCheck, getDetaisByCHeckNum, delDataOnlineBranchApi,
  excuteVersionCheck, excuteEnvCheck, excuteAutoCheck
};


