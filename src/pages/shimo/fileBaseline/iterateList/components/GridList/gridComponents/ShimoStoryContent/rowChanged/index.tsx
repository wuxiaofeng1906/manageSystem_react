import {axiosGet, axiosDelete, axiosPost, axiosPut} from "@/publicMethods/axios";

const modifyListContent = async (type: string, params: any) => {
  debugger;
  const modifyItem = {
    "shimo_id": params.shimo
  };
  if (type === "story") { // 需求目录
    modifyItem["demand_dir"] = params.dir;
    modifyItem["demand_guid"] = params.id;
  } else { // 概设
    modifyItem["design_dir"] = "";
    modifyItem["design_guid"] = "";
  }

  return await axiosPut("/api/verify/shimo/executions", modifyItem);

};

export {modifyListContent};
