//  1.进度指标
const getProcessHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "milestone":
      marginLeftValue = "20px";
      break;
    case "planStart":
    case "actualStart":
    case "planEnd":
    case "actualEnd":
      marginLeftValue = "10px";
      break;
    case "days":
      marginLeftValue = "20px";
      break;
    case "ratio":
      marginLeftValue = "20px";
      break;
    case "memo":
      marginLeftValue = "75px";
      break;

    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

// 2.需求稳定性
const getStoryStabilityHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "stage":
    case "planTime":
    case "updateTime":
    case "updateRate":
      marginLeftValue = "20px";
      break;
    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

// 3.阶段工作量（单位：人天）
const getStageWorkloadHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "stage":
    case "manpower":
    case "planHours":
    case "actualHours":
      marginLeftValue = "20px";
      break;
    case "planWorkload":
    case "actualWorkload":
      marginLeftValue = "10px";
      break;
    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

// 4.生产率
const getProductRateHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "stage":
    case "planValue":
    case "actualValue":
      marginLeftValue = "20px";
      break;
    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

// 5.评审和缺陷
const getReviewDefectHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "cut":
    case "defectDensity":
    case "defectHour":
    case "defectRatio":
      marginLeftValue = "20px";
      break;
    case "foundDN":
      marginLeftValue = "15px";
      break;
    case "weightDN":
      break;

    case "funcPoint":
      marginLeftValue = "25px";
      break;
    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

//  6 过程质量补充数据和7.服务
const getProcessQualityHeaderStyle = (params: any) => {

  let marginLeftValue = "0px";

  switch (params.column?.colId) {
    case "cut":
    case "realValue":
      marginLeftValue = "20px";
      break;
    case "baseline":
      marginLeftValue = "10px";
      break;
    default:
      break;
  }

  const returnDiv = `<div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:${marginLeftValue}">
                        <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
                          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>`;
  return {template: returnDiv}

};

export {
  getProcessHeaderStyle,
  getStoryStabilityHeaderStyle,
  getStageWorkloadHeaderStyle,
  getProductRateHeaderStyle,
  getReviewDefectHeaderStyle,
  getProcessQualityHeaderStyle
};
