import {axiosGet, axiosDelete, axiosPost, axiosPut} from "@/publicMethods/axios";


// 复制
const copyNewRows = async (shimoId: number) => {
  const copyResult = await axiosPost("/api/verify/shimo/executions", {old_shimo_id: shimoId});
  return copyResult;
};

// 删除
const deletedRows = async (shimoId: number) => {

  return await axiosDelete("/api/verify/shimo/executions", {data:{old_shimo_id: shimoId}});
};


export {copyNewRows, deletedRows}
