import {
  getNewPageNum, getCheckProcess, updateReleaseProcess, updateTabsName, deleteReleasedId,
  savePrePulishProjects, queryServiceByID, saveUpgradeItem, delUpgradeItem,
  savePulishApi, delPulishApi, upgradeServiceConfirm, addDataRepaire, modifyDataRepaire,
  delDataReviewApi, dataRepairConfirm, getNewCheckNum, saveOnlineBranch, saveVersonCheck,
  saveEnvironmentCheck, saveOnlineAutoCheck, getDetaisByCHeckNum, delDataOnlineBranchApi,
  excuteVersionCheck, excuteEnvCheck, excuteAutoCheck, delTabsInfo
} from "@/pages/onDutyAndRelease/preRelease/supplementFile/datas/axiosApi";
import {alalysisInitData} from "./dataAnalyze";
import {getDutyPersonPermission, getSystemPersonPermission} from "../../permission/permission";

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);

// 修改tab名
const modifyTanName = async (currentListNo: string, newName: string) => {

  // 验证权限(值班测试和超级管理员)
  const authData = {
    "operate": "修改发布名称",
    "method": "post",
    "path": "/api/verify/release/release_name"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await updateTabsName(currentListNo, newName);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 删除tab
const deleteReleaseItem = async (releaseNum: string) => {
  // 验证权限(值班测试和超级管理员)
  const authData = {
    "operate": "删除发布名称",
    "method": "delete",
    "path": "/api/verify/release/release_detail"
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await delTabsInfo(releaseNum);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 获取新的tab编号
const getNewNum = async () => {
  return await getNewPageNum();
}

// 保存预发布项目
const savePreProjects = async (source: any, releaseNum: string) => {

  let result = {
    datas: [],
    errorMessage: ""
  };
  // 需要判断输入框不为空
  if (!source.projectsName || (source.projectsName).length === 0) {
    result.errorMessage = "项目名称不能为空！";
    return result;
  }

  if (!source.pulishType) {
    result.errorMessage = "发布类型不能为空！";
    return result;
  }

  if (!source.pulishMethod) {
    result.errorMessage = "发布方式不能为空！";
    return result;
  }

  if (!source.pulishTime) {
    result.errorMessage = "发布时间不能为空！";
    return result;
  }

  // 验证权限(值班测试和超级管理员)
  const authData = {
    "operate": "保存预发布项目",
    "method": "post",
    "path": "/api/verify/release/release_project"
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    result = await savePrePulishProjects(source, releaseNum);
    return result;
  }
  if (dutyPermission.errorMessage) {
    result.errorMessage = dutyPermission.errorMessage;
    return result;

  }
  result.errorMessage = systemPermission.errorMessage;
  return result;
};


// 点击查询
const inquireService = async (sorce: any, currentListNo: string) => {

  if (!sorce) {
    return {
      message: "一键部署ID不能为空！",
      datas: []
    }
  }

  if (sorce.length === 0) {
    return {
      message: "一键部署ID不能为空！",
      datas: []
    }
  }

  const paramsData: any = [];
  if (sorce.length > 0) {
    sorce.forEach((ele: any) => {
      const newEle = ele;
      newEle.ready_release_num = currentListNo;
      paramsData.push(newEle);
    });
  }

  // 验证权限
  const authData = {
    "operate": "查询一键部署ID",
    "method": "post",
    "path": "/api/verify/release/env_branch"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    const result = await queryServiceByID(paramsData);
    return result;
  }
  if (dutyPermission.errorMessage) {
    return {
      message: dutyPermission.errorMessage,
      datas: []
    }
  }

  return {
    message: systemPermission.errorMessage,
    datas: []
  }
};

// 获取进度
const getPageCHeckProcess = async (releaseNum: string) => {
  return await getCheckProcess(releaseNum);
};

// 删除一键发布ID
const deleteReleasedID = async (deployment_id: string, ready_release_num: string) => {
  // 验证权限(值班测试和超级管理员)
  const authData = {
    "operate": "删除一键部署ID",
    "method": "delete",
    "path": "/api/verify/release/upgrade_service_deployment"
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return deleteReleasedId(deployment_id, ready_release_num);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;

};
// 保存发布结果
const saveProcessResult = async (releaseNum: string, result: string) => {

  // 验证权限(值班测试和超级管理员)
  const authData = {
    "operate": "修改发布结果",
    "method": "post",
    "path": "/api/verify/release/progress"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    const data = {
      "user_name": usersInfo.name,
      "user_id": usersInfo.userid,
      "ready_release_num": releaseNum,
      "release_result": result
    };
    return await updateReleaseProcess(data);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;

};
// 发布项的修改
const upgradePulishItem = async (formData: any, currentListNo: string) => {

  if (!formData.onlineEnv) {
    return "上线环境不能为空！"
  }
  if (!formData.pulishItem) {
    return "发布项不能为空！"
  }
  if (!formData.application) {
    return "应用不能为空！"
  }
  if (!formData.branchAndEnv) {
    return "分支和环境不能为空！"
  }
  if (!formData.interAndDbUpgrade) {
    return "是否涉及接口和数据库升级不能为空！"
  }

  if (!formData.hotUpdate) {
    return "是否支持热更新不能为空！"
  }

  let onlineEnvStr = "";
  formData.onlineEnv.forEach((ele: any) => {
    onlineEnvStr = onlineEnvStr === "" ? ele : `${onlineEnvStr},${ele}`;
  });

  const datas = {
    "app_id": formData.appId,
    "automation_check": formData.automationTest,
    "deployment_id": formData.deploymentId,
    "ready_release_num": currentListNo,
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "online_environment": onlineEnvStr,
    "release_item": formData.pulishItem,
    "app": formData.application,
    "is_upgrade_api_database": formData.interAndDbUpgrade,
    "hot_update": formData.hotUpdate,
    "branch_environment": formData.branchAndEnv,
    "instructions": formData.description,
    "remarks": formData.remark,
  };

  // 该周前端值班人、后端值班人、测试值班人、流程：杨期成、超级管理员
  const authData = {
    "operate": "修改发布项",
    "method": "post",
    "path": "/api/verify/release/upgrade_service"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    // 需要验证必填项
    return await saveUpgradeItem(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;


};

//
const getDelUpgradeItemsAuthority = async (type: number) => {
  const authData = {
    "operate": "删除",
    "method": "delete",
    "path": ""
  };
  switch (type) {
    case 1:
      authData.path = "/api/verify/release/upgrade_service";
      break;
    case 2:
      authData.path = "/api/verify/release/upgrade_api";
      break;
    case 3:
      authData.path = "/api/verify/release/review_confirm";
      break;
    case 4:
      authData.path = "/api/verify/release/release_branch";
      break;

    default:
      break;
  }


  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return "";
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;

};

// 删除数据
const delUpgradeItems = async (type: number, source: any) => {


  const authFlag = await getDelUpgradeItemsAuthority(type);

  if (authFlag) {
    return authFlag;
  }
  let delMessage = "";
  if (type === 1) { // 是发布项删除
    delMessage = await delUpgradeItem(source.app_id);

  } else if (type === 2) { // 是升级接口删除
    delMessage = await delPulishApi(source.api_id);

  } else if (type === 3) { // 是数据修复review
    delMessage = await delDataReviewApi(source.review_id);

  } else if (type === 4) { // 是上线分支删除
    delMessage = await delDataOnlineBranchApi(source.check_num);
  }

  return delMessage;

};

// 发布接口保存
const addPulishApi = async (formData: any, currentListNo: string, type: string) => {

  if (!formData.onlineEnv) {
    return "上线环境不能为空";
  }

  if (!formData.upInterface) {
    return "升级接口不能为空";
  }
  if (!formData.interService) {
    return "接口服务不能为空";
  }

  if (!formData.renter) {
    return "涉及租户不能为空";
  }

  if (!formData.method) {
    return "接口Method不能为空";
  }

  if (!formData.URL) {
    return "接口URL不能为空";
  }

  if (!formData.hotUpdate) {
    return "是否热更新不能为空";
  }

  let onlineEnvStr = "";
  formData.onlineEnv.forEach((ele: any) => {
    onlineEnvStr = onlineEnvStr === "" ? ele : `${onlineEnvStr},${ele}`;
  });

  const datas = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "online_environment": onlineEnvStr,
    "update_api": formData.upInterface,
    "api_service": formData.interService,
    "api_url": formData.URL,
    "api_method": formData.method,
    "hot_update": formData.hotUpdate,
    "related_tenant": formData.renter,
    "remarks": formData.remark,
    "ready_release_num": currentListNo
  };

  if (type === "修改") {
    datas["api_id"] = formData.apiId;
  }

  // 该周前端值班人、后端值班人、测试值班人、流程：杨期成、超级管理员
  const authData = {
    "operate": `${type}发布接口`,
    "method": "post",
    "path": "/api/verify/release/upgrade_api"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await savePulishApi(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;

};

// 升级服务服务确认
const confirmUpgradeService = async (datas: any) => {

  const authData = {
    "operate": `进行服务确认`,
    "method": "post",
    "path": "/api/verify/release/upgrade_confirm"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {

    return await upgradeServiceConfirm(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;


};

// 数据修复的新增和修改
const dataRepaireReview = async (kind: string, currentListNo: string, datas: any) => {

  if (!datas.repaireContent) {
    return "数据修复内容不能为空！";
  }

  if (!datas.relatedRenter) {
    return "涉及租户不能为空！";
  }

  if (!datas.types) {
    return "类型不能为空！";
  }
  if (!datas.repaireCommiter) {
    return "修复提交人不能为空！";
  }
  if (!datas.branch) {
    return "分支不能为空！";
  }

  if (!datas.EvalResult) {
    return "评审结果不能为空！";
  }

  if (!datas.repeatExecute) {
    return "是否可重复执行不能为空！";
  }

  const data = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "review_result": datas.EvalResult,
    "is_repeat": datas.repeatExecute,
    "repair_data_content": datas.repaireContent,
    "related_tenant": datas.relatedRenter,
    "type": datas.types,
    "commit_user_id": (datas.repaireCommiter).split("&")[0],
    "commit_user_name": (datas.repaireCommiter).split("&")[1],
    "branch": datas.branch,
    "ready_release_num": currentListNo,
  }


  // 开发经理、超级管理员
  const authData = {
    "operate": `${kind}修复内容`,
    "method": "post",
    "path": "/api/verify/release/review_confirm"
  };
  if (kind === "修改") {
    authData.method = "put";

  }
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    if (kind === "新增") {
      return await addDataRepaire(data);
    }

    // 以下是修改
    data["review_id"] = datas.reviewId;
    data["commit_id"] = datas.commitID;

    return await modifyDataRepaire(data);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;


};

// 数据修复服务确认
const confirmDataRepairService = async (datas: any) => {

  const authData = {
    "operate": `进行review服务确认`,
    "method": "post",
    "path": "/api/verify/release/review_confirm_always"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {

    return await dataRepairConfirm(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;

};

// 获取上线分支新增时所需的checkNum
const getCheckNumForOnlineBranch = async () => {

  return await getNewCheckNum();
};

// 上线分支头部验证
const checkOnlineHeadData = async (sourceData: any) => {
  // "branch_name": sourceData.branchName,
  //   "technical_side": sourceData.module,
  if (!sourceData.branchName) {
    return "分支名称不能为空！";
  }

  if (!sourceData.module) {
    return "技术侧不能为空！";
  }

  const authData = {
    "operate": `保存上线分支`,
    "method": "post",
    "path": "/api/verify/release/release_branch"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return ""
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};
// 上线分支版本检查验证
const checkOnlineVersionData = async (sourceData: any) => {

  if (sourceData.verson_check) {  // 如果开启了版本检查，就要判断服务和镜像环境是否填写值
    if (!sourceData.server || (sourceData.server).length === 0) {
      return "版本检查-服务不能为空！";
    }

    if (!sourceData.imageevn) {
      return "版本检查-镜像环境不能为空！";
    }
  }


  if (sourceData.branchcheck) {  // 如果开启了分支对比检查，就要判断被对比的主分支和技术侧以及起始时间是否填写值
    if (!sourceData.branch_mainBranch || (sourceData.branch_mainBranch).length === 0) {
      return "分支检查-被对比的主分支不能为空！";
    }

    if (!sourceData.branch_teachnicalSide || (sourceData.branch_teachnicalSide).length === 0) {
      return "分支检查-技术侧不能为空！";
    }

    if (!sourceData.branch_mainSince) {
      return "版本检查-对比起始时间不能为空！";
    }

  }


  const authData = {
    "operate": `保存上线分支-版本检查设置`,
    "method": "post",
    "path": "/api/verify/release/release_check_version"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return ""
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 上线环境检查验证
const checkOnlineEnvData = async (sourceData: any) => {
//   只有没有勾选忽略检查，后面参数才必填
  if (sourceData.ignoreCheck === undefined || (sourceData.ignoreCheck).length === 0) {

    if (!sourceData.checkEnv) {
      return "环境一致性检查中检察环境不能为空！";
    }
  }

  const authData = {
    "operate": `保存上线分支-环境一致性检查设置`,
    "method": "post",
    "path": "/api/verify/release/check_env"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return ""
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

const checkOnlineAutoData = async (sourceData: any) => {

  //   只有没有勾选忽略检查，后面参数才必填
  if (sourceData.autoBeforeIgnoreCheck === undefined || (sourceData.autoBeforeIgnoreCheck).length === 0) {

    if (sourceData.beforeCheckType === undefined || (sourceData.beforeCheckType).length === 0) {
      return "上线前自动化检查中检查类型不能为空！";
    }

    if (!sourceData.beforeTestEnv) {
      return "上线前自动化检查中测试环境不能为空！";
    }

    if (!sourceData.beforeBrowser) {
      return "上线前自动化检查中浏览器不能为空！";
    }
  }

  if (sourceData.autoAfterIgnoreCheck === undefined || (sourceData.autoAfterIgnoreCheck).length === 0) {

    if (sourceData.afterCheckType === undefined || (sourceData.afterCheckType).length === 0) {
      return "上线后自动化检查中检查类型不能为空！";
    }

    if (!sourceData.afterTestEnv) {
      return "上线后自动化检查中测试环境不能为空！";
    }

    if (!sourceData.afterBrowser) {
      return "上线后自动化检查中浏览器不能为空！";
    }
  }

  const authData = {
    "operate": `保存上线分支-自动化检查`,
    "method": "post",
    "path": "/api/verify/release/automation_check"
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);

  if (dutyPermission.flag || systemPermission.flag) {
    return ""
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};
// 保存上线分支的设置
const saveOnlineBranchData = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {
  //   保存分了4个接口，
  //  1.上线分支头部设置
  //  2.版本检查设置
  //  3.环境一致性检查
  //  4.(上线前后)自动化检查设置

  // 上线分支头部验证分支名称和技术侧
  const checkMsg_onlineHead = await checkOnlineHeadData(sourceData);
  if (checkMsg_onlineHead) { // 如果校验信息不为空，代表校验失败
    return checkMsg_onlineHead;
  }

  // 版本检查设置
  const checkMsg_versonCheck = await checkOnlineVersionData(sourceData);
  if (checkMsg_versonCheck) {
    return checkMsg_versonCheck;
  }


  // 环境一致性检查设置
  const checkMsg_envCheck = await checkOnlineEnvData(sourceData);
  if (checkMsg_envCheck) {
    return checkMsg_envCheck;
  }

  // 自动化检查参数
  const checkMsg_autoCheck = await checkOnlineAutoData(sourceData);
  if (checkMsg_autoCheck) {
    return checkMsg_autoCheck;
  }

  let returnMessage = "";

  const onlineBranch = await saveOnlineBranch(type, currentListNo, newOnlineBranchNum, sourceData);
  if (onlineBranch !== "") {
    returnMessage = `上线分支保存失败：${onlineBranch}`;
  }
  const versonCheck = await saveVersonCheck(type, currentListNo, newOnlineBranchNum, sourceData);
  if (versonCheck !== "") {
    returnMessage = returnMessage === "" ? `版本检查设置保存失败：${versonCheck}` : `${returnMessage}；\n版本检查设置保存失败：${versonCheck}`;
  }

  const enviromentCheck = await saveEnvironmentCheck(type, currentListNo, newOnlineBranchNum, sourceData);
  if (enviromentCheck !== "") {
    returnMessage = returnMessage === "" ? `环境一致性检查保存失败：${enviromentCheck}` : `${returnMessage}；\n环境一致性检查保存失败：${enviromentCheck}`;
  }
  const onlineAutoCheck = await saveOnlineAutoCheck(type, currentListNo, newOnlineBranchNum, sourceData);
  if (onlineAutoCheck !== "") {
    returnMessage = returnMessage === "" ? `自动化检查保存失败：${onlineAutoCheck}` : `${returnMessage}；\n自动化检查保存失败：${onlineAutoCheck}`;
  }

  return returnMessage;
};

// 上线分支修改-表头数据解析
const alayOnlineCheckHead = (source_data: any) => {
  let f_ignore = "2";
  let b_ignore = "2";
  const testUnit = source_data.test_unit;

  // 判断是否忽略前后端检查
  if (testUnit) {
    testUnit.forEach((ele: any) => {
      if (ele.test_case_technical_side === "1") { // 前端
        f_ignore = ele.ignore_check;
      } else if (ele.test_case_technical_side === "2") { // 后端
        b_ignore = ele.ignore_check;
      }

    });
  }
  const checkHeadData = {
    branchCheckId: source_data.branch_check_id,
    checkNum: source_data.check_num,
    branchName: source_data.branch_name,
    module: source_data.technical_side,
    ignoreBackendCheck: f_ignore,
    ignoreFrontCheck: b_ignore,

  };

  return checkHeadData;
};

// 分支和版本检查
const alayVersonCheck = (source_data: any) => {
  if (!source_data.version_check || (source_data.version_check).length === 0) {
    return {};
  }
  const checkData = (source_data.version_check)[0];

  const versonCheckData = {
    versionCheckId: checkData.version_check_id,
    checkNum: checkData.check_num,
    verson_check: checkData.backend_version_check_flag,
    server: checkData.server === null ? undefined : (checkData.server).split(","),
    imageevn: checkData.image_env,
  };

  const branchCheck = {
    versionCheckId: checkData.version_check_id,
    checkNum: checkData.check_num,
    branchcheck: checkData.inclusion_check_flag,
    branch_mainBranch: checkData.main_branch === null ? undefined : (checkData.main_branch).split(","),
    branch_teachnicalSide: checkData.technical_side === null ? undefined : (checkData.technical_side).split(","),
    branch_mainSince: checkData.main_since,
  };


  return {versonCheckData, branchCheck}
};

// 环境一致性检查
const alayEnvironmentCheck = (source_data: any) => {
  if (!source_data.env_check || (source_data.env_check).length === 0) {
    return {};
  }

  const envData = (source_data.env_check)[0];

  return {
    checkNum: envData.check_num,
    checkId: envData.check_id,
    ignoreCheck: envData.ignore_check,
    checkEnv: envData.check_env,
  };
};

// 自动化检查
const autoCheck = (source_data: any) => {
  if (!source_data.automation_check || (source_data.automation_check).length === 0) {
    return {};
  }

  const beforeOnline = {
    automationId: "",
    checkNum: "",
    autoBeforeIgnoreCheck: "",
    beforeCheckType: "",
    beforeTestEnv: "",
    beforeBrowser: "",
  };
  const afterOnliinie = {
    automationId: "",
    checkNum: "",
    autoAfterIgnoreCheck: "",
    afterCheckType: "",
    afterTestEnv: "",
    afterBrowser: "",
  };
  (source_data.automation_check).forEach((ele: any) => {

    let checkType = [];
    if (ele.check_type) {
      checkType = (ele.check_type).split(",");
    }
    if (ele.check_time === "1") { // 上线前
      beforeOnline.automationId = ele.automation_id;
      beforeOnline.checkNum = ele.check_num;
      beforeOnline.autoBeforeIgnoreCheck = ele.ignore_check;
      beforeOnline.beforeCheckType = checkType;
      beforeOnline.beforeTestEnv = ele.test_env;
      beforeOnline.beforeBrowser = ele.browser;
    } else if (ele.check_time === "2") { // 上线后
      afterOnliinie.automationId = ele.automation_id;
      afterOnliinie.checkNum = ele.check_num;
      afterOnliinie.autoAfterIgnoreCheck = ele.ignore_check;
      afterOnliinie.afterCheckType = checkType;
      afterOnliinie.afterTestEnv = ele.test_env;
      afterOnliinie.afterBrowser = ele.browser;

    }

  });

  return {beforeOnline, afterOnliinie};

};

// 获取上线分支修改时的原始数据
const getModifiedData = async (checkNum: string) => {

  const source = await getDetaisByCHeckNum(checkNum);
  const source_data = source.data

  return {
    checkHead: alayOnlineCheckHead(source_data),
    versonCheck: alayVersonCheck(source_data).versonCheckData,
    branchCheck: alayVersonCheck(source_data).branchCheck,
    envCheck: alayEnvironmentCheck(source_data),
    beforeOnlineCheck: autoCheck(source_data).beforeOnline,
    afterOnlineCheck: autoCheck(source_data).afterOnliinie

  }
};

// 执行上线分支的各类检查
const executeOnlineCheck = async (type: string, checkNum: string) => {
  switch (type) {
    case "versionCheck":
      return await excuteVersionCheck(checkNum);
      break;

    case "envCheck":
      return await excuteEnvCheck(checkNum);
      break;

    case "beforeOnlineCheck":
      return await excuteAutoCheck(checkNum, "1");
      break;

    case "afterOnlineCheck":
      return await excuteAutoCheck(checkNum, "2");
      break;

    default:
      return "error";
      break;
  }

};


// 验证是否可以进行表格的新增、修改和删除
const vertifyModifyFlag = async (types: number, currentListNo: string) => {

  let returnFlag = true;

  if (types === 1 || types === 2 || types === 6) { // 6是一键部署ID的查询
    // 验证上线分支是否确认完成
    const datas = (await alalysisInitData("pulishConfirm", currentListNo)).upService_confirm;

    if (datas && datas.length > 0) {
      const confirmData = datas[0];
      if (confirmData.test_confirm_status === "1") {
        returnFlag = false;
      }
    }

  } else if (types === 3) {
    // 需要验证review服务中的测试是否确认
    const datas = (await alalysisInitData("dataReviewConfirm", currentListNo)).reviewData_confirm;
    if (datas && datas.length > 0) {
      const confirmData = datas[0];
      if (confirmData.confirm_status === "1") {
        returnFlag = false;
      }
    }
  }

  return returnFlag;
};
export {
  getNewNum, deleteReleaseItem, getPageCHeckProcess, saveProcessResult, modifyTanName, deleteReleasedID,
  savePreProjects, inquireService, upgradePulishItem, delUpgradeItems, addPulishApi, confirmUpgradeService,
  dataRepaireReview, confirmDataRepairService, getCheckNumForOnlineBranch, saveOnlineBranchData, getModifiedData,
  executeOnlineCheck, vertifyModifyFlag
};
