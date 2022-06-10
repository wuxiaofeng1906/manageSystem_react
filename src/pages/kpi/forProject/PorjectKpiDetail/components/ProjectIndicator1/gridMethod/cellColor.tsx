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

// 项目质量渲染颜色
export const setProjectQualityCellStyle = (params: any) => {
  if (params.column?.colId === "description") {
    return {...whiteCellStyle, "text-align": "lect"};
  }
  if (params.column?.colId === "code_count" && params.data?.tech !== "项目") {
    return whiteCellStyle;
  }
  return grayCellStyle;
};


