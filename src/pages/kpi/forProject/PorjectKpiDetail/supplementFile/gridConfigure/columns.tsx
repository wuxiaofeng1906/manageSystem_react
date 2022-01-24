const TYPE_LENGTH = 120;
const STAGE_LENGTH = 115;

// 渲染手工录入
const manualInput_red = (params: any) => {

  if (params.value === null || params.value === "" || params.value === undefined) {
    return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

  }
  return params.value;
};


const manualInput_black = (params: any) => {

  if (!params.value) {
    return `<div style="font-style: italic ;text-align: center">手工录入</div>`;

  }
  return `<div style="text-align: left">${params.value}</div>`;
};

/* region 1.进度 */

const getProcessColumns = () => {

  const processColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 70px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '1.进度') {
          return 6;
        }
        return 1;
      }
    },
    {
      headerName: '里程碑',
      field: 'milestone',
      minWidth: STAGE_LENGTH,
      maxWidth: STAGE_LENGTH
    },
    {
      headerName: '计划开始时间',
      field: 'planStart',
    },
    {
      headerName: '实际开始时间',
      field: 'actualStart',
    },
    {
      headerName: '计划完成时间',
      field: 'planEnd',
    },
    {
      headerName: '实际完成时间',
      field: 'actualEnd',
    },
    {
      headerName: '偏差天数',
      field: 'days',

    },
    {
      headerName: '偏差率',
      field: 'ratio',
      valueFormatter: (params: any) => {
        if (params.value === null) {
          return "";
        }
        return `${Number(params.value).toFixed(2)}%`
      }
    },
    {
      headerName: '偏差原因说明',
      field: 'memo',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: manualInput_black,
      tooltipField: "memo",
      tooltipComponent: "customTooltip",

    }
  ];

  return processColums;
};

/* endregion  */

/* region 2.需求稳定性 */

const getStoryStabilityColumns = () => {

  const storyStabilityColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 50px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '2.需求稳定性') {
          return 4;
        }
        return 1;
      }
    },
    {
      headerName: '阶段',
      field: 'stage',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH
    },
    {
      headerName: '预计工时',
      field: 'planHours',
      editable: true,
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

        }
        return Number(params.value).toFixed(2);

      }
    },
    {
      headerName: '变更工时',
      field: 'stableHours',
      editable: true,
      cellRenderer: manualInput_red

    },
    {
      headerName: '变更率',
      field: 'ratio',
      valueFormatter: (params: any) => {
        if (params.value === null) {
          return "";
        }
        if (params.value === 0) {
          return 0;
        }
        return `${Number(params.value).toFixed(4)}`
      }
    }
  ];

  return storyStabilityColums;
};

/* endregion  */

/* region 3.阶段工作量（单位：人天） */
// 渲染手工录入
const manualInput = (params: any) => {

  if (params.value === null || params.value === "" || params.value === undefined) {
    return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

  }

  // 判断合计中，是否有对人工进行修改
  // if (params.data?.stage === "合计") {
  //
  //   if ((params.column?.colId === "manpower" && params.data?.manpowerFlag === "true") ||
  //     (params.column?.colId === "planHours" && params.data?.planHoursFlag === "true") ||
  //     (params.column?.colId === "actualHours" && params.data?.actualHoursFlag === "true")) {
  //     return `<div style="font-weight: bold;font-style: italic ;text-align: center">${params.value}</div>`;
  //
  //   }
  // }
  return params.value;
};


const getStageWorkloadColumns = () => {

  const StageWorkloadColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: () => {
        return `<div style="font-weight: bold;margin-top: 65px">
                    <div>3.阶段工作量<br/>（单位：人天）</div>
              </div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '3.阶段工作量（单位：人天）') {
          return 6;
        }
        return 1;
      }
    },
    {
      headerName: '阶段',
      field: 'stage',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH
    },
    {
      headerName: '投入人力',
      field: 'manpower',
      editable: true,
      cellRenderer: manualInput
    },
    {
      headerName: '预计工时',
      field: 'planHours',
      editable: true,
      cellRenderer: manualInput

    },
    {
      headerName: '实际工时',
      field: 'actualHours',
      editable: true,
      cellRenderer: manualInput
    },
    {
      headerName: '计划工作量',
      field: 'planWorkload',
      valueFormatter: (params: any) => {
        if (params.value) {
          return Number(params.value).toFixed(2);
        }
        return params.value;
      }

    },
    {
      headerName: '实际工作量',
      field: 'actualWorkload',
      valueFormatter: (params: any) => {
        if (params.value) {
          return Number(params.value).toFixed(2);
        }
        return params.value;
      }
    }
  ];

  return StageWorkloadColums;
};

/* endregion  */

/* region 4.生产率 */
// 渲染手工录入
const projectRateManualInput = (params: any) => {

  if (params.data?.stage === "功能点") {
    if (params.value === null || params.value === "") {
      return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

    }
    return Number(params.value).toFixed(2);

  }
  return `<div style="margin-top: 10px">${Number(params.value).toFixed(2)}</div>`;
};

const projectRateEditRenderer = (param: any) => {
  if (param.data?.stage === "功能点") {
    return true;
  }
  return false;
};

const getProductRateColumns = () => {

  const StageWorkloadColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 25px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '4.生产率') {
          return 1.9;
        }
        return 1;
      }
    },
    {
      headerName: '阶段',
      field: 'stage',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH,
      cellRenderer: (params: any) => {
        if (params.value === "生产率(功能点/人天）") {
          return `<div>
                    <div>生产率</div>
                    <div style="margin-top: -5px"> (功能点/人天）</div>
                </div>`;
        }
        return params.value;
      }
    },
    {
      headerName: '计划值',
      field: 'planValue',
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput
    },
    {
      headerName: '实际值',
      field: 'actualValue',
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput

    }
  ];

  return StageWorkloadColums;
};

/* endregion  */

/* region 5.评审和缺陷 */

const defectHourEditRenderer = (params: any) => {
  if (params.data?.kind === "提测演示" || params.data?.kind === "开发联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
    return false;
  }
  return true;
};

const getReviewDefectColumns = () => {

  const reviewDefectColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 190px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '5.评审和缺陷') {
          return 15;
        }
        return 1;
      }
    },
    {
      headerName: '',
      field: 'kind',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      editable: (params: any) => {
        if (params.data?.kind === "合计") {
          return false;
        }
        return true;
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: (params: any) => {

        if (params.data?.kind === "合计") {
          return "-";
        }
        if (params.value === null || params.value === undefined || params.value === "") {
          return `<div style="font-style: italic ;text-align: center">手工录入</div>`;
        }

        if (params.value === true || params.value === "是") {
          return "是";
        }
        return "否";
      }

    },
    {
      headerName: '发现缺陷数',
      field: 'foundDN',
    },
    {
      headerName: '加权有效缺陷数',
      field: 'weightDN',
    },
    {
      headerName: '功能点',
      field: 'funcPoint',
    },
    {
      headerName: '缺陷密度',
      field: 'defectDensity',
      valueFormatter: (params: any) => {
        if (params.value) {
          return Number(params.value).toFixed(2);
        }
        return params.value;
      }
    },
    {
      headerName: '评审用时',
      field: 'reviewHour',
      cellRenderer: (params: any) => {
        if (params.data?.kind === "提测演示" || params.data?.kind === "开发联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
          return "-";
        }

        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

        }

        return params.value;
      },
      editable: defectHourEditRenderer,

    },
    {
      headerName: '评审效率',
      field: 'reviewRatio',
      cellRenderer: (params: any) => {
        if (params.data?.kind === "提测演示" || params.data?.kind === "开发联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
          return "-";
        }
        return Number(params.value).toFixed(2);
      }
    }
  ];

  return reviewDefectColums;
};

/* endregion  */

/* region 6 过程质量补充数据 */

const getProcessQualityColumns = () => {

  const processQualityColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        if (params.value === '6 过程质量补充数据') {
          return `<div style="font-weight: bold;margin-top: 90px">6.过程质量补<br/>充数据</div>`

        }
        return `<div style="font-weight: bold;">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '6 过程质量补充数据') {
          return 7;
        }
        return 1;
      }
    },
    {
      headerName: '',
      field: 'module',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH,
      cellRenderer: (params: any) => {
        if (params.value === '开发') {
          return `<div style="margin-top: 50px">${params.value}</div>`

        }
        if (params.value === '测试') {
          return `<div style="margin-top: 35px">${params.value}</div>`

        }
        return `<div>${params.value}</div>`

      },
      cellClassRules: {
        'cell-span2': "value !== undefined"
      },
      rowSpan: (params: any) => {
        if (params.data?.module === "开发") {
          return 4;
        }
        if (params.data?.module === "测试") {
          return 3;
        }
        return 1;
      }
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: (params: any) => {

        if (params.data?.kind === "合计") {
          return "-";
        }
        if (params.value === null || params.value === undefined || params.value === "") {
          return `<div style="font-style: italic ;text-align: center">手工录入</div>`;
        }

        if (params.value === true || params.value === "是") {
          return "是";
        }
        return "否";
      }
    },
    {
      headerName: '度量值',
      field: 'kind',
      minWidth: 170,
      maxWidth: 170,
    },
    {
      headerName: '基线值',
      field: 'baseline',
      minWidth: 95,
      maxWidth: 95,
    },
    {
      headerName: '实际值',
      field: 'realValue',
      minWidth: 130,
      maxWidth: 130,
      cellRenderer: (params: any) => {
        if (params.data?.module === "及时交付" && (params.value === null || params.value === "" || params.value === undefined)) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
        }
        return params.value;
      },
      editable: (params: any) => {
        if (params.data?.module === "及时交付") {
          return true;
        }
        return false;

      },
    }
  ];

  return processQualityColums;
};

/* endregion  */

/* region 7.服务 */

const getServiceColumns = () => {

  const processQualityColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: TYPE_LENGTH,
      maxWidth: TYPE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 12px">${params.value}</div>`
      },
    },
    {
      headerName: '',
      field: 'module',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH,
      cellRenderer: (params: any) => {
        return `<div style="margin-top: 12px">${params.value} </div>`;
      }
    },
    {
      headerName: '度量值',
      field: 'item',
      cellRenderer: (params: any) => {
        if (params.value === "一次发布成功率") {
          return `<div>
                    <div>一次发布</div>
                    <div style="margin-top: -5px">成功率</div>
                </div>`;
        }

        return params.value;
      },
    },
    {
      headerName: '成功发布数',
      field: 'succN',
      minWidth: 170,
      maxWidth: 170,
      editable: true,
      cellRenderer: (params: any) => {

        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;

        }
        return `<div style="margin-top: 12px">${params.value} </div>`;
      }
    },
    {
      headerName: '发布次数',
      field: 'totalN',
      minWidth: 95,
      maxWidth: 95,
      editable: true,
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;

        }
        return `<div style="margin-top: 12px">${params.value} </div>`;
      }
    },
    {
      headerName: '一次成功发布率',
      field: 'ratio',
      minWidth: 130,
      maxWidth: 130,
      cellRenderer: (params: any) => {

        if (params.value) {
          const values = (params.value).toFixed(2);
          return `<div style="margin-top: 12px">${Number(values) * 100}%</div>`;
        }
        return params.value;
      }
    }
  ];

  return processQualityColums;
};

/* endregion  */

export {
  getProcessColumns,
  getStoryStabilityColumns,
  getStageWorkloadColumns,
  getProductRateColumns,
  getReviewDefectColumns,
  getProcessQualityColumns,
  getServiceColumns
};
