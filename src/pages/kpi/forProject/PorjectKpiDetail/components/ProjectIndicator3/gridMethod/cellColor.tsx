import {cellBorderStyle} from "@/publicMethods/agGrid/cellRenderer";
import {cellStyle} from "@/pages/kpi/forProject/PorjectKpiDetail/components/constant";


// 不可修改的渲染
const grayCellStyle = {
  ...cellBorderStyle,
  ...cellStyle,
  "background-color": '#F8F8F8'
};

// 可修改的渲染
const whiteCellStyle = {
  ...cellBorderStyle,
  ...cellStyle,
  "background-color": 'white'
};


// 里程碑进度
export const setProcessCellStyle = (params: any) => {

  if (params.column?.colId === "description") {
    return whiteCellStyle;
  }
  // 项目计划可以编辑
  if (params.data?.milestone === "项目计划") {
    if (params.column?.colId === "milestone" || params.column?.colId === "ratio" || params.column?.colId === "days") {
      return grayCellStyle;
    }
    return whiteCellStyle;
  }
  return grayCellStyle;
};


// 需求稳定性
export const setStoryStabilityCellStyle = (params: any) => {
  // 暂时设置只有说明可以修改
  if (params.column?.colId === "description") {
    return whiteCellStyle;
  }
  return grayCellStyle;

  // if (params.column?.colId === "ratio" || params.column?.colId === "title" || params.column?.colId === "stage") {
  //   return grayCellStyle;
  // }
  // return whiteCellStyle;
};
