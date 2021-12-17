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
export {setProcessCellStyle, setStoryStabilityCellStyle, setStageWorkloadCellStyle}
