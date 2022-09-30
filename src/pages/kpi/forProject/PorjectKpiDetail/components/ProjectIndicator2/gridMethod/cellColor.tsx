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

// 阶段工作量渲染颜色
export const setStageWorkloadCellStyle = (params: any) => {
  // 暂时设置揉入人力和说明可以修改

  if (params.column?.colId === "description" || params.column?.colId === "manpower") {

    return whiteCellStyle;
  }
  return grayCellStyle;

};

// 生产率
export const setProductRateCellStyle = (params: any) => {

  if (params.column?.colId === "title" || params.column?.colId === "stage") {
    return grayCellStyle;
  }


  if (params.data?.stage === "生产率(功能点/人天）" && (params.column?.colId === "planValue" || params.column?.colId === "actualValue")) {
    return grayCellStyle;
  }
  return whiteCellStyle;
};

// 5.评审与缺陷
export const setReviewDefectCellStyle = (params: any) => {

  if (params.column?.colId === "title" || params.column?.colId === "kind" || params.column?.colId === "foundDN" || params.column?.colId === "weightDN"
    || params.column?.colId === "defectDensity" || params.column?.colId === "reviewRatio") {

    // 不可修改
    return grayCellStyle;
  }

  // 当是否裁剪为是，评审用时这个字段不能修改。置灰
  if (params.column?.colId === "reviewHour" && params.data?.cut === true) {
    return grayCellStyle;
  }

  if (params.column?.colId === "funcPoint") {
    if (params.data?.kind === "codereview") {
      return whiteCellStyle;
    }
    return grayCellStyle;
  }

  if (params.column?.colId === "description") {
    if (params.data?.description === "说明") {
      return {
        ...grayCellStyle,
        "text-align": "left",
        "font-weight": "bold"
      };
    }
    return {
      ...whiteCellStyle,
      "text-align": "left"
    };
  }

  if (params.data?.cut === "是否裁剪") {
    return grayCellStyle;
  }


  if (params.column?.colId === "reviewHour" && (params.data?.kind === "提测演示" || params.data?.kind === "开发自测/联调" || params.data?.kind === "集成测试"
    || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "用例评审" || params.data?.kind === "CodeReview")) {
    // 不可修改
    return grayCellStyle;
  }

  if (params.data?.kind === "合计") {
    // 不可修改
    return grayCellStyle;
  }

  // 可修改颜色渲染
  return whiteCellStyle;

};

// 6.过程质量补充数据和7.服务
export const setProcessQualityCellStyle = (params: any) => {

  if (params.data?.module === "质量") {
    return grayCellStyle;
  }
  if (params.data?.cut === "一次提测通过率") {
    if (params.column?.colId === "cut" || params.column?.colId === "realValue") {
      return grayCellStyle;
    }
    return whiteCellStyle;
  }
  if (params.column?.colId === "title" || params.column?.colId === "module" || params.column?.colId === "baseline" || params.column?.colId === "kind") {

    // 不可修改
    return grayCellStyle;
  }

  if (params.column?.colId === "realValue" && params.data?.module !== "及时交付") {
    // 不可修改
    return grayCellStyle;
  }
  return whiteCellStyle;

};

// 7.服务
export const setServiceCellStyle = (params: any) => {
  if (params.column?.colId === "title" || params.column?.colId === "module" || params.column?.colId === "item" || params.column?.colId === "ratio") {

    // 不可修改
    return grayCellStyle;
  }

  return whiteCellStyle;

};
