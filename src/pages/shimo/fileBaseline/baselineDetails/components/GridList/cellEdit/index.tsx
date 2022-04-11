import {axiosPut} from "@/publicMethods/axios";

const modifyGridCells = async () => {
  const data = {
    "version_id": 0,
    "remark": "string",
    "zt_num": "string",
    "is_save_version": "string",
    "guid": "string"
  };
  return await axiosPut("/api/verify/shimo/save_version", data);
};


export {modifyGridCells}
