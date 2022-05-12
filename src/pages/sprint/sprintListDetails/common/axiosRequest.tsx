import {axiosGet, axiosGet_TJ,axiosDelete, axiosPost, axiosPut, axiosPatch} from "@/publicMethods/axios";

// 失去焦点后查询
const getZentaoInfo = async (prjId: any, chanDaoType: any, ztno: any) => {
  const params = {
    project: prjId,
    category: chanDaoType,
    ztNo: ztno,
  }
  return await axiosGet_TJ('/api/sprint/project/child', params);
};
// 修改操作流程相关字段
const requestModFlowStage = async (selRows: any, content: any, values: any) => {

  const selIds = [];
  for (let index = 0; index < selRows.length; index += 1) {
    const rows = selRows[index];
    if (rows.category === "1") {
      selIds.push(`BUG_${rows.id}`);
    } else if (rows.category === "2") {
      selIds.push(`TASK_${rows.id}`);
    } else if (rows.category === "3") {
      selIds.push(`STORY_${rows.id}`);
    }
  }
  const params = {
    id: selIds,
    attribute: content,
    value: values,
  };

  return await axiosPatch('/api/sprint/project/child', params);

};


export {requestModFlowStage, getZentaoInfo};
