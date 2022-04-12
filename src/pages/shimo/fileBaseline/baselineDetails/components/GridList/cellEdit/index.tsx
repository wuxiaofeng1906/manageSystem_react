import {axiosPut} from "@/publicMethods/axios";

const modifyGridCells = async (data: any) => {
  return await axiosPut("/api/verify/shimo/save_version", data);
};


export {modifyGridCells}
