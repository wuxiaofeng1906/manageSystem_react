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
  return params.value;
};

/* region 1.进度 */

const getProcessColumns = () => {

  const processColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 120,
      maxWidth: 120,
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
      maxWidth: 175,
      minWidth: 175
    },
    {
      headerName: '计划开始时间',
      field: 'planStart',
      minWidth: 115,
      maxWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际开始时间',
      field: 'actualStart',
      minWidth: 115,
      maxWidth: 115
      // editable: editRenderer

    },
    {
      headerName: '计划完成时间',
      field: 'planEnd',
      minWidth: 115,
      maxWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际完成时间',
      field: 'actualEnd',
      minWidth: 115,
      maxWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '偏差天数',
      field: 'days',
      minWidth: 110,
      maxWidth: 110
    },
    {
      headerName: '偏差率',
      field: 'ratio',
      // type: 'numericColumn',
      minWidth: 90,
      maxWidth: 90,
      valueFormatter: (params: any) => {
        if (params.value === null) {
          return "";
        }
        // if (params.value === 0) {
        //   return 0;
        // }
        return `${Number(params.value).toFixed(2)}%`
      }
    },
    {
      headerName: '偏差原因说明',
      field: 'memo',
      editable: true,
      minWidth: 300,
      maxWidth: 300,
      cellRenderer: manualInput_black
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
      minWidth: 120,
      maxWidth: 120,
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
      maxWidth: 175,
      minWidth: 175
    },
    {
      headerName: '预计工时',
      field: 'planTime',
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red
    },
    {
      headerName: '变更工时',
      field: 'updateTime',
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red

    },
    {
      headerName: '变更率',
      field: 'updateRate',
      minWidth: 115,
      maxWidth: 115,
      // editable: editRenderer
    }
  ];

  return storyStabilityColums;
};

/* endregion  */

/* region 3.阶段工作量（单位：人天） */

const getStageWorkloadColumns = () => {

  const StageWorkloadColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 120,
      maxWidth: 120,
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
      maxWidth: 175,
      minWidth: 175
    },
    {
      headerName: '投入人数',
      field: 'manpower',
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red
    },
    {
      headerName: '预计工时',
      field: 'planHours',
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red

    },
    {
      headerName: '实际工时',
      field: 'actualHours',
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red
    },
    {
      headerName: '计划工作量',
      field: 'planWorkload',
      minWidth: 115,
      maxWidth: 115,
    },
    {
      headerName: '实际工作量',
      field: 'actualWorkload',
      minWidth: 110,
      maxWidth: 110,
    }
  ];

  return StageWorkloadColums;
};

/* endregion  */

/* region 4.生产率 */
// 渲染手工录入
const projectRateManualInput = (params: any) => {

  if (params.data?.stage === "功能点" && (params.value === null || params.value === "")) {
    return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

  }
  return Number(params.value).toFixed(2);
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
      minWidth: 120,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 15px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '4.生产率') {
          return 2;
        }
        return 1;
      }
    },
    {
      headerName: '阶段',
      field: 'stage',
      maxWidth: 175,
      minWidth: 175
    },
    {
      headerName: '计划值',
      field: 'planValue',
      minWidth: 115,
      maxWidth: 115,
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput
    },
    {
      headerName: '实际值',
      field: 'actualValue',
      minWidth: 115,
      maxWidth: 115,
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput

    }
  ];

  return StageWorkloadColums;
};

/* endregion  */

/* region 5.评审和缺陷 */

const noDataRenderer = (params: any) => {

  if (params.data?.kind === "提测演示" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
    return "-";
  }
  return params.value;
};

const defectHourEditRenderer = (params: any) => {
  if (params.data?.kind === "提测演示" || params.data?.kind === "集成测试" || params.data?.kind === "系统测试" || params.data?.kind === "发布测试" || params.data?.kind === "合计") {
    return false;
  }
  return true;
};

const getReviewDefectColumns = () => {

  const reviewDefectColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 120,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 190px">${params.value}</div>`

      },
      cellClassRules: {
        'cell-span': "value !== undefined"
      },
      rowSpan: (params: any) => {

        if (params.data.title === '5.评审和缺陷') {
          return 12;
        }
        return 1;
      }
    },
    {
      headerName: '',
      field: 'kind',
      maxWidth: 175,
      minWidth: 175
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      minWidth: 115,
      maxWidth: 115,
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
        if (!params.value) {
          return `<div style="font-style: italic ;text-align: center">手工录入</div>`;
        }
        return params.value;
      }

    },
    {
      headerName: '发现缺陷数',
      field: 'foundDN',
      minWidth: 115,
      maxWidth: 115,
    },
    {
      headerName: '加权有效缺陷数',
      field: 'weightDN',
      minWidth: 115,
      maxWidth: 115,
    },
    {
      headerName: '功能点',
      field: 'funcPoint',
      minWidth: 115,
      maxWidth: 115,
    },
    {
      headerName: '缺陷密度',
      field: 'defectDensity',
      minWidth: 115,
      maxWidth: 110

    },
    {
      headerName: '评审用时',
      field: 'defectHour',
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: noDataRenderer,
      editable: defectHourEditRenderer,

    },
    {
      headerName: '评审效率',
      field: 'defectRatio',
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: noDataRenderer
    }
  ];

  return reviewDefectColums;
};

/* endregion  */

/* region 6 过程质量补充数据和7.服务 */

const getProcessQualityColumns = () => {

  const processQualityColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 120,
      maxWidth: 120,
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
      maxWidth: 175,
      minWidth: 175,
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
      minWidth: 115,
      maxWidth: 115,
      editable: true,
      cellRenderer: manualInput_red,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: ["是", "否"]},
    },
    {
      headerName: '',
      field: 'kind',
      minWidth: 170,
      maxWidth: 170,
    },
    {
      headerName: '基线值',
      field: 'baseline',
      minWidth: 75,
      maxWidth: 75,
    },
    {
      headerName: '实际值',
      field: 'realValue',
      minWidth: 115,
      maxWidth: 100,
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

export {
  getProcessColumns,
  getStoryStabilityColumns,
  getStageWorkloadColumns,
  getProductRateColumns,
  getReviewDefectColumns,
  getProcessQualityColumns
};
