// 1.进度

const setProcessCellStyle = (params: any) => {
  if (params.column?.colId === "memo") {
    // let wordsAlign = "left";
    // if (params.value) {
    //   wordsAlign = "center"
    // }

    return {
      "line-height": "25px",
      "border-left": "1px solid lightgrey",
      // "text-align": wordsAlign,
      "background-color": 'white'
    }
  }

  // if (params.data?.milestone === "项目计划") {
  //   if (params.column?.colId !== "days" && params.column?.colId !== "ratio") {
  //     return {
  //       "line-height": "25px",
  //       "border-left": "1px solid lightgrey",
  //       "text-align": "center",
  //       "background-color": 'white'
  //     }
  //   }
  //
  // }
  return {
    "line-height": "32px",
    "border-left": "1px solid lightgrey",
    // "text-align": "center",
    "background-color": '#F8F8F8'
  }
};

// 2.需求稳定性
const setStoryStabilityCellStyle = (params: any) => {
  if (params.column?.colId === "updateRate" || params.column?.colId === "title" || params.column?.colId === "stage") {

    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }

  }

  return {
    "line-height": "25px",
    "border-left": "1px solid lightgrey",
    "background-color": 'white'
  }


};

// 3.阶段工作量（单位：人天）
const setStageWorkloadCellStyle = (params: any) => {
  if (params.column?.colId === "planWorkload" || params.column?.colId === "actualWorkload" || params.column?.colId === "title" || params.column?.colId === "stage") {

    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }

  }

  return {
    "line-height": "25px",
    "border-left": "1px solid lightgrey",
    "background-color": 'white'
  }

};

// 4.生产率
const setProductRateCellStyle = (params: any) => {

  if (params.column?.colId === "title" || params.column?.colId === "stage" || params.data?.stage === "生产率(功能点/人天）") {

    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }

  return {
    "line-height": "25px",
    "border-left": "1px solid lightgrey",
    "background-color": 'white'
  }

};

// 5.评审与缺陷
const setReviewDefectCellStyle = (params: any) => {

  if (params.column?.colId === "title" || params.column?.colId === "kind" || params.column?.colId === "foundDN" || params.column?.colId === "weightDN"
    || params.column?.colId === "funcPoint" || params.column?.colId === "defectDensity" || params.column?.colId === "defectRatio") {

    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }

  if (params.column?.colId === "defectHour" && (params.data?.kind === "提测演示" || params.data?.kind === "集成测试"
    || params.data?.kind === "系统测试" || params.data?.kind === "发布测试")) {
    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }

  if (params.data?.kind === "合计") {
    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }

  // 可修改颜色渲染
  return {
    "line-height": "25px",
    "border-left": "1px solid lightgrey",
    "background-color": 'white'
  }

};

// 6.6 过程质量补充数据和7.服务
const setProcessQualityCellStyle = (params: any) => {

  if (params.column?.colId === "title" || params.column?.colId === "module" || params.column?.colId === "baseline" || params.column?.colId === "kind") {

    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }

  if (params.column?.colId === "realValue" && params.data?.module !== "及时交付") {
    // 不可修改
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      "background-color": '#F8F8F8'
    }
  }
  return {
    "line-height": "25px",
    "border-left": "1px solid lightgrey",
    "background-color": 'white'
  }

};

export {
  setProcessCellStyle,
  setStoryStabilityCellStyle,
  setStageWorkloadCellStyle,
  setProductRateCellStyle,
  setReviewDefectCellStyle,
  setProcessQualityCellStyle
}
