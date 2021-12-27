import {savePrePulishProjects, queryServiceByID} from "@/pages/onDutyAndRelease/preRelease/supplementFile/axiosApi";

// 保存预发布项目
const savePreProjects = async (source: any) => {

  // 需要判断输入框不为空
  if (!source.projectsName) {
    return "项目名称不能为空！";
  }

  if (!source.pulishType) {
    return "发布类型不能为空！";
  }

  if (!source.pulishMethod) {
    return "发布方式不能为空！";
  }

  if (!source.pulishTime) {
    return "发布时间不能为空！";
  }

  const resultMessage = await savePrePulishProjects(source);
  return resultMessage;
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
export {savePreProjects, inquireService};
