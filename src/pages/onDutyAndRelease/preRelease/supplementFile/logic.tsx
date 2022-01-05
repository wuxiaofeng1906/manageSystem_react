import {
  savePrePulishProjects, queryServiceByID, saveUpgradeItem, delUpgradeItem,
  savePulishApi, delPulishApi, upgradeServiceConfirm, addDataRepaire, modifyDataRepaire,
  delDataReviewApi, dataRepairConfirm, getNewCheckNum, saveOnlineBranch,saveVersonCheck
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
    delMessage = await delDataReviewApi(source.review_id)

  } else if (type === 4) { // 是上线分支删除

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

  return {
    // onlineBranch: await saveOnlineBranch(type, currentListNo, newOnlineBranchNum, sourceData),
    versonCheck:await saveVersonCheck(type, currentListNo, newOnlineBranchNum, sourceData),
  }
};
export {
  savePreProjects, inquireService, upgradePulishItem, delUpgradeItems, addPulishApi, confirmUpgradeService,
  dataRepaireReview, confirmDataRepairService, getCheckNumForOnlineBranch, saveOnlineBranchData
};
