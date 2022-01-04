import {
  savePrePulishProjects,
  queryServiceByID,
  saveUpgradeItem,
  delUpgradeItem
} from "@/pages/onDutyAndRelease/preRelease/supplementFile/axiosApi";

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
const delUpgradeItems = async (type: number, id: number) => {
  let delMessage = "";
  if (type === 1) { // 是发布项删除
    delMessage = await delUpgradeItem(id);

  } else if (type === 2) { // 是升级接口删除

  } else if (type === 3) { // 是数据修复review

  } else if (type === 4) { // 是上线分支删除

  }

  return delMessage;

};
export {savePreProjects, inquireService, upgradePulishItem, delUpgradeItems};
