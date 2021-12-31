import {savePrePulishProjects, queryServiceByID} from "@/pages/onDutyAndRelease/preRelease/supplementFile/axiosApi";

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

};
export {savePreProjects, inquireService, upgradePulishItem};
