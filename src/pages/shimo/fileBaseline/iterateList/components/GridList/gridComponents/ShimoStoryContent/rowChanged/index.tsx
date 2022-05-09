import {axiosPut} from "@/publicMethods/axios";

// 修改石墨目录
const modifyListContent = async (type: string, params: any) => {
  const modifyItem = {
    "shimo_id": params.shimo
  };
  if (type === "demand_directory") { // 需求目录
    modifyItem["demand_dir"] = params.dir === "请选择" ? " " : params.dir;
    modifyItem["demand_guid"] = params.id;
  } else { // 概设
    modifyItem["design_dir"] = params.dir === "请选择" ? " " : params.dir;
    modifyItem["design_guid"] = params.id;
  }

  return await axiosPut("/api/verify/shimo/executions", modifyItem);
};

export {modifyListContent};
