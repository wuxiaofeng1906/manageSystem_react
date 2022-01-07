import {
  savePrePulishProjects, queryServiceByID, saveUpgradeItem, delUpgradeItem,
  savePulishApi, delPulishApi, upgradeServiceConfirm, addDataRepaire, modifyDataRepaire,
  delDataReviewApi, dataRepairConfirm, getNewCheckNum, saveOnlineBranch, saveVersonCheck,
  saveEnvironmentCheck, saveOnlineAutoCheck, getDetaisByCHeckNum, delDataOnlineBranchApi,
  excuteVersionCheck, excuteEnvCheck, excuteAutoCheck
} from "@/pages/onDutyAndRelease/preRelease/supplementFile/axiosApi";

const userLogins: any = localStorage.getItem("userLogins");
const usersInfo = JSON.parse(userLogins);

// 保存预发布项目
const savePreProjects = async (source: any, listNo: string) => {

  let result = {
    datas: [],
    errorMessage: ""
  };
  // 需要判断输入框不为空
  if (!source.projectsName || (source.projectsName).length === 0) {
    result.errorMessage = "项目名称不能为空！"
    return result;
  }

  if (!source.pulishType) {
    result.errorMessage = "发布类型不能为空！"
    return result;
  }

  if (!source.pulishMethod) {
    result.errorMessage = "发布方式不能为空！"
    return result;
  }

  if (!source.pulishTime) {
    result.errorMessage = "发布时间不能为空！"
    return result;
  }

  result = await savePrePulishProjects(source, listNo);
  return result;
};

// 点击查询
const inquireService = async (sorce: any) => {


  if (sorce.length === 0) {
    return {
      message: "一键部署ID不能为空！",
      datas: []
    }
  }

  const result = await queryServiceByID(sorce);
  return result;

};

// 发布项的修改
const upgradePulishItem = async (datas: any) => {
  // 需要验证必填项
  return await saveUpgradeItem(datas);
};

// 删除数据
const delUpgradeItems = async (type: number, source: any) => {

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
const addPulishApi = async (datas: any) => {

  return await savePulishApi(datas);

};

// 升级服务服务确认
const confirmUpgradeService = async (datas: any) => {

  return await upgradeServiceConfirm(datas);

};

// 数据修复的新增和修改
const dataRepaireReview = async (kind: string, currentListNo: string, datas: any) => {

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

  if (kind === "新增") {
    return await addDataRepaire(data);
  }

  // 以下是修改
  data["review_id"] = datas.reviewId;
  return await modifyDataRepaire(data);


};

// 数据修复服务确认
const confirmDataRepairService = async (datas: any) => {

  return await dataRepairConfirm(datas);

};

// 获取上线分支新增时所需的checkNum
const getCheckNumForOnlineBranch = async () => {

  return await getNewCheckNum();
};

// 保存上线分支的设置
const saveOnlineBranchData = async (type: string, currentListNo: string, newOnlineBranchNum: string, sourceData: any) => {
  //   保存分了4个接口，
  //  1.上线分支设置
  //  2.版本检查设置
  //  3.环境一致性检查
  //  4.(上线前后)自动化检查设置

  debugger;
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
    server: (checkData.server).split(","),
    imageevn: checkData.image_env,
  };

  const branchCheck = {
    versionCheckId: checkData.version_check_id,
    checkNum: checkData.check_num,
    branchcheck: checkData.inclusion_check_flag,
    branch_mainBranch: (checkData.main_branch).split(","),
    branch_teachnicalSide: (checkData.technical_side).split(","),
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
export {
  savePreProjects, inquireService, upgradePulishItem, delUpgradeItems, addPulishApi, confirmUpgradeService,
  dataRepaireReview, confirmDataRepairService, getCheckNumForOnlineBranch, saveOnlineBranchData, getModifiedData,
  executeOnlineCheck
};
