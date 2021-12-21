import {savePrePulishProjects} from "@/pages/onDutyAndRelease/preRelease/axiosApi";

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

  const result = {
    message: "",
    datas: []
  };

  if (!sorce.testEnv) {
    return {
      message: "测试环境不能为空！",
      datas: []
    }
  }

  if (!sorce.deployID) {
    return {
      message: "一键部署ID不能为空！",
      datas: []
    }
  }
  return result;

};
export {savePreProjects, inquireService};
