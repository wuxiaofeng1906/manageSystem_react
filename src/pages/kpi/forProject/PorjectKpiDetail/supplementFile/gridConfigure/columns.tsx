const TYPE_LENGTH = 120;
const STAGE_LENGTH = 130;

// 渲染手工录入

const manualInput_black = (params: any) => {

  if (!params.value) {
    return "";
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
      cellRenderer: (params: any) => {
        //   >0 显示绿色，< 0 显示红色，0是黑色
        const values = params.value;
        if (values === 0) {
          return 0;
        }
        if (!values) {
          return "";
        }
        if (Number(values) > 0) {
          return `<span style="color: red">+${values}</span>`;
        }
        return `<span style="color: green">${values}</span>`;
      }
    },
    {
      headerName: '偏差率',
      field: 'ratio',
      cellRenderer: (params: any) => {
        let values = params.value;
        if (values === 0 || values === "0") {
          return 0;
        }
        if (!values) {
          return "";
        }

        values = Number(params.value).toFixed(2);
        if (Number(values) > 0) {
          return `<span style="color: red">+${values}%</span>`;
        }
        return `<span style="color: green">${values}%</span>`;

      }
    },
    {
      headerName: '偏差原因说明',
      field: 'description',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: manualInput_black,
      tooltipField: "description",
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
          return "";
        }
        const values = Number(params.value);
        if (values.toFixed(0) === "-999999") {
          return `<span style="color: orange">0</span>`;
        }
        if (values < 0) {
          return `<span style="color: orange"> ${Math.abs(Number(values.toFixed(2)))}</span>`;
        }
        return values.toFixed(2);
      }
    },
    {
      headerName: '变更工时',
      field: 'stableHours',
      editable: true,
      cellRenderer: (params: any) => {
        if (!params.value) {
          return "";
        }
        const values = Number(params.value);
        if (values.toFixed(0) === "-999999") {
          return `<span style="color: orange">0</span>`;
        }
        if (values < 0) {
          return `<span style="color: orange"> ${Math.abs(values)}</span>`;
        }
        return values;
      }
    },
    {
      headerName: '变更率',
      field: 'ratio',
      valueFormatter: (params: any) => {
        if (!params.value) {
          return "";
        }
        return `${Number(params.value).toFixed(4)}`
      }
    }, {
      headerName: '说明',
      field: 'description',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: manualInput_black,
      tooltipField: "description",
      tooltipComponent: "customTooltip",
    }
  ];

  return storyStabilityColums;
};

/* endregion  */

/* region 3.阶段工作量（单位：人天） */
// 渲染手工录入

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
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
        }
        if (params.value === -999999) {
          return 0;
        }
        return Math.abs(params.value);
      }
    },
    {
      headerName: '预计工时',
      field: 'planHours',
      editable: true,
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === "" || params.value === undefined) {
          return "";
        }

        const values = Number(params.value);
        if (values.toFixed(0) === "-999999") {
          return `<span style="color: orange">0</span>`;
        }
        if (values < 0) {
          return `<span style="color: orange"> ${Math.abs(values)}</span>`;
        }
        return values;
      }
    },
    {
      headerName: '实际工时',
      field: 'actualHours',
      editable: true,
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === "" || params.value === undefined) {
          return "";
        }
        const values = Number(params.value);
        if (values.toFixed(0) === "-999999") {
          return `<span style="color: orange">0</span>`;
        }
        if (values < 0) {
          return `<span style="color: orange"> ${Math.abs(values)}</span>`;
        }
        return values;

      }
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
    }, {
      headerName: '说明',
      field: 'description',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: manualInput_black,
      tooltipField: "description",
      tooltipComponent: "customTooltip",
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

  if (params.value) {
    return `<div style="margin-top: 10px">${Number(params.value).toFixed(2)}</div>`;
  }
  return "";
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
    // {
    //   headerName: '实际值',
    //   field: 'actualValue',
    //   editable: projectRateEditRenderer,
    //   cellRenderer: projectRateManualInput
    //
    // },
    {
      headerName: '说明',
      field: 'description',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: (params: any) => {
        if (params.value) {
          if (params.data?.stage === "生产率(功能点/人天）") {
            return `<div style="margin-top: 10px; text-align: left">${params.value}</div>`;
          }
          return `<div style="text-align: left">${params.value}</div>`;
        }

        return "";

      },
      tooltipField: "description",
      tooltipComponent: "customTooltip",
    }
  ];

  return StageWorkloadColums;
};

/* endregion  */

/* region 5.评审和缺陷 */


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

        if (params.data.title === '5.评审缺陷问题') {
          return 16;
        }
        return 1;
      }
    },
    {
      headerName: '',
      field: 'kind',
      maxWidth: STAGE_LENGTH,
      minWidth: STAGE_LENGTH,
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {
        if (params.data.kind === '用例评审' || params.data.kind === 'CodeReview') {
          return 2;
        }
        return 1;
      },
      cellRenderer: (params: any) => {
        if (params.value === "用例评审" || params.value === "CodeReview") {

          return `<div style="margin-top: 18px">${params.value}</div>`
        }
        return params.value;
      }
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      editable: (params: any) => {
        if (params.data?.kind === "合计" || params.data?.cut === "是否裁剪") {
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
        if (params.value === null || params.value === undefined || params.value === "" || params.value === false || params.value === "否") {
          return "否";  // 默认值
        }

        if (params.value === true || params.value === "是") {
          return "是";
        }
        if (params.value === "是否裁剪") {
          return `<span style="font-weight: bold">${params.value}</span>`;
        }
        return params.value;
      }

    },
    {
      headerName: '发现缺陷数',
      field: 'foundDN',
      // valueFormatter: (params: any) => {
      //   if (!params.value) {
      //     return "";
      //   }
      //   return params.value;
      // },
      cellRenderer: (params: any) => {
        if (params.value === "发现问题数" || params.value === "发现缺陷数") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        if (!params.value) {
          return "";
        }
        return params.value;
      }
    },
    {
      headerName: '加权有效缺陷数',
      field: 'weightDN',
      // valueFormatter: (params: any) => {
      //
      //   // 只要发现缺陷数为0或者空，这个值也需要为空
      //   if (!params.data?.foundDN) {
      //     return "";
      //   }
      //   return params.value;
      // },
      cellRenderer: (params: any) => {
        if (params.value === "加权有效问题数" || params.value === "加权有效缺陷数") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        // 只要发现缺陷数为0或者空，这个值也需要为空
        if (!params.data?.foundDN) {
          return "";
        }
        return params.value;

      },
      minWidth: 140,
      maxWidth: 140
    },
    {
      headerName: '功能点',
      field: 'funcPoint',
      editable: (params: any) => {

        if (params.data?.kind === "codereview") {
          return true;
        }
        return false;
      },
      // valueFormatter: (params: any) => {
      //
      //   // 只要发现缺陷数为0或者空，这个值也需要为空
      //   if (!params.data?.foundDN) {
      //     return "";
      //   }
      //   return params.value;
      // }
      cellRenderer: (params: any) => {
        if (params.value === "功能点" || params.value === "代码量") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        // 只要发现缺陷数为0或者空，这个值也需要为空
        if (!params.data?.foundDN) {
          return "";
        }

        if (params.data?.kind === "codereview") {
          return params.value;
        }
        return Number(params.value).toFixed(2);
      }
    },
    {
      headerName: '缺陷密度',
      field: 'defectDensity',
      minWidth: 150,
      maxWidth: 150,
      // valueFormatter: (params: any) => {
      //   // 只要发现缺陷数为0或者空，这个值也需要为空
      //   if (!params.data?.foundDN) {
      //     return "";
      //   }
      //   if (params.value) {
      //     return Number(params.value).toFixed(2);
      //   }
      //   return params.value;
      // },
      cellRenderer: (params: any) => {
        if (params.value === "加权有效问题密度" || params.value === "加权有效缺陷密度") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        // 只要发现缺陷数为0或者空，这个值也需要为空
        if (!params.data?.foundDN) {
          return "";
        }
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

        if (params.value === "评审用时") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        if (params.data?.kind === "提测演示" || params.data?.kind === "开发自测/联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
          return "-";
        }
        // 如果是否裁剪为是，则不能编辑，则不显示手工录入
        if (params.data?.cut === true) {
          return "";
        }
        // 只要发现缺陷数为0或者空，这个值也需要为空
        if (!params.data?.foundDN) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
        }

        if (params.value === null || params.value === "" || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
        }

        const values = Number(params.value);
        if (values.toFixed(0) === "-999999") {
          return `<span style="color: orange">0</span>`;
        }
        if (values < 0) {
          return `<span style="color: orange"> ${Math.abs(values)}</span>`;
        }
        return values;

      },
      editable: (params: any) => {
        if (params.data?.kind === "提测演示" || params.data?.kind === "开发自测/联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
          return false;
        }
        // 如果是否裁剪值为是，则评审用时不可修改。
        if (params.data?.cut === "是否裁剪" || params.data?.cut === true) {
          return false;
        }
        return true;
      },
    },
    {
      headerName: '评审效率',
      field: 'reviewRatio',
      cellRenderer: (params: any) => {
        if (params.value === "评审效率") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        if (params.data?.kind === "提测演示" || params.data?.kind === "开发自测/联调" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
          return "-";
        }

        if (params.value) {
          return Number(params.value).toFixed(2);
        }
        return "";
      }
    }, {
      headerName: '说明',
      field: 'description',
      editable: true,
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: (params: any) => {
        if (params.value === "说明") {
          return `<span style="font-weight: bold">${params.value}</span>`
        }
        if (!params.value) {
          return "";

        }
        return `<div style="text-align: left">${params.value}</div>`;
      },
      tooltipField: "description",
      tooltipComponent: "customTooltip",
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
          return `<div style="font-weight: bold;margin-top: 140px">6.过程质量补<br/>充数据</div>`

        }
        return `<div style="font-weight: bold;">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '6 过程质量补充数据') {
          return 9.6;
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
        if (params.value === '质量') {
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
        if (params.data?.module === "质量") {
          return 2.6;
        }
        return 1;
      }
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      editable: (params: any) => {
        if (params.data?.cut === "度量值" || params.data?.cut === "一次提测通过率") {
          return false;
        }
        return true;
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
      cellRenderer: (params: any) => {

        if (params.value === null || params.value === undefined || params.value === "" || params.value === "否") {
          return "否";
        }

        if (params.value === true || params.value === "是") {
          return "是";
        }
        if (params.value === "度量值") {
          return `<div style="font-weight: bold">度量值</div>`;
        }

        if (params.value === "一次提测通过率") {
          return `<div>
                    <div>一次提测</div>
                    <div style="margin-top: -5px">通过率</div>
                </div>`;
        }

        return params.value;
      }
    },
    {
      headerName: '度量值',
      field: 'kind',
      minWidth: 170,
      maxWidth: 170,
      editable: (params: any) => {
        if (params.data?.cut === "一次提测通过率") {
          return true;
        }
        return false;
      },
      cellRenderer: (params: any) => {
        if (params.data?.cut === "度量值") {
          return `<div style="font-weight: bold">${params.value}</div>`;
        }
        if (params.data?.cut === "一次提测通过率") {
          if (params.value === null || params.value === "" || params.value === undefined) {
            return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;

          }
          return `<div style="margin-top: 10px">${params.value}</div>`;
        }
        return params.value;
      }
    },
    {
      headerName: '基线值',
      field: 'baseline',
      minWidth: 95,
      maxWidth: 95,
      editable: (params: any) => {
        if (params.data?.cut === "一次提测通过率") {
          return true;
        }
        return false;
      },
      cellRenderer: (params: any) => {
        if (params.data?.cut === "度量值") {
          return `<div style="font-weight: bold">${params.value}</div>`;
        }
        if (params.data?.cut === "一次提测通过率") {
          if (params.value === null || params.value === "" || params.value === undefined) {
            return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;
          }
          return `<div style="margin-top: 10px">${params.value}</div>`;
        }
        return params.value;
      }
    },
    {
      headerName: '实际值',
      field: 'realValue',
      minWidth: 130,
      maxWidth: 130,
      cellRenderer: (params: any) => {
        if (params.data?.cut === true) {
          return "";
        }

        if (params.data?.kind === "Bug解决时长" || params.data?.kind === "Bug回归时长") {
          // 需要除以3600 转为小时
          if (params.value) {
            return (Number(params.value) / 3600).toFixed(2);
          }
          return params.value;
        }

        if (params.value === "一次提测通过率") {
          return `<div style=" font-weight: bold"> 一次提测通过率</div>`;
        }

        if (params.value) {
          if (params.data?.cut === "一次提测通过率") {
            return `<div style="margin-top: 10px">${(Number(params.value) * 100).toFixed(2)}%</div>`;
          }
          return Number(params.value).toFixed(2);
        }
        return params.value;
      },
    }, {
      headerName: '说明',
      field: 'description',
      editable: (params: any) => {
        if (params.data?.description === "说明") {
          return false;
        }
        return true;
      },
      minWidth: 260,
      maxWidth: 260,
      cellRenderer: (params: any) => {
        if (params.value === "说明") {
          return `<div style="font-weight: bold"> 说明</div>`;
        }

        if (params.value) {
          if (params.data?.cut === "一次提测通过率") {
            return `<div style="text-align: left;margin-top: 10px">${params.value}</div>`;
          }
          return `<div style="text-align: left">${params.value}</div>`;
        }
        return "";
      },
      tooltipField: "description",
      tooltipComponent: "customTooltip",
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

            return `<div style="margin-top: 12px">${(Number(params.value) * 100).toFixed(2)}%</div>`;
          }
          return "";
        }
      }, {
        headerName: '说明',
        field: 'description',
        editable: true,
        minWidth: 260,
        maxWidth: 260,
        cellRenderer: (params: any) => {
          if (!params.value) {
            return "";
          }
          return `<div style="margin-top: 12px;text-align: left">${params.value}</div>`;

        },
        tooltipField: "description",
        tooltipComponent: "customTooltip",
      }
    ];

    return processQualityColums;
  }
;

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
