import {axiosPut,axiosDelete} from "@/publicMethods/axios";

const modifyGridCells = async (data: any) => {
  return await axiosPut("/api/verify/shimo/save_version", data);
};

const deteleBaselinieTime = async (saveId: any) => {
  return await axiosDelete("/api/verify/shimo/version_detail", {data:{save_id: saveId}});
};

export {modifyGridCells,deteleBaselinieTime}
