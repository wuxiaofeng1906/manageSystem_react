/* region 1.进度 */

const getProcessColumns = () => {

  const processColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 90,
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
      maxWidth: 110,
      minWidth: 80
    },
    {
      headerName: '计划开始时间',
      field: 'planStart',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际开始时间',
      field: 'actualStart',
      minWidth: 115
      // editable: editRenderer

    },
    {
      headerName: '计划完成时间',
      field: 'planEnd',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '实际完成时间',
      field: 'actualEnd',
      minWidth: 115
      // editable: editRenderer
    },
    {
      headerName: '偏差天数',
      field: 'days',
      // type: 'numericColumn',
      minWidth: 90
    },
    {
      headerName: '偏差率',
      field: 'ratio',
      // type: 'numericColumn',
      minWidth: 90,
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
      cellRenderer: (params: any) => {
        if (!params.value) {
          return `<div style="font-style: italic ;text-align: center">手工录入</div>`;

        }
        return params.value;
      }
    }
  ];

  return processColums;
};

/* endregion  */

// 渲染手工录入
const manualInput = (params: any) => {

  if (params.value === null || params.value === "") {
    return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;

  }
  return params.value;
};

/* region 2.需求稳定性 */

const getStoryStabilityColumns = () => {

  const storyStabilityColums: any = [
    {
      headerName: '',
      field: 'title',
      minWidth: 90,
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
      maxWidth: 110,
      minWidth: 80
    },
    {
      headerName: '预计工时',
      field: 'planTime',
      minWidth: 115,
      editable: true,
      cellRenderer: manualInput
    },
    {
      headerName: '变更工时',
      field: 'updateTime',
      minWidth: 115,
      editable: true,
      cellRenderer: manualInput

    },
    {
      headerName: '变更率',
      field: 'updateRate',
      minWidth: 115
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
      minWidth: 90,
      cellRenderer: (params: any) => {
        return `<div style="font-weight: bold;margin-top: 75px">${params.value}</div>`

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
      maxWidth: 110,
      minWidth: 80
    },
    {
      headerName: '投入人数',
      field: 'manpower',
      minWidth: 115,
      editable: true,
      cellRenderer: manualInput
    },
    {
      headerName: '预计工时',
      field: 'planHours',
      minWidth: 115,
      editable: true,
      cellRenderer: manualInput

    },
    {
      headerName: '实际工时',
      field: 'actualHours',
      minWidth: 115,
      editable: true,
      cellRenderer: manualInput
    },
    {
      headerName: '计划工作量',
      field: 'planWorkload',
      minWidth: 115

    },
    {
      headerName: '实际工作量',
      field: 'actualWorkload',
      minWidth: 115

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
      minWidth: 90,
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

      minWidth: 80
    },
    {
      headerName: '计划值',
      field: 'planValue',
      minWidth: 115,
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput
    },
    {
      headerName: '实际值',
      field: 'actualValue',
      minWidth: 115,
      editable: projectRateEditRenderer,
      cellRenderer: projectRateManualInput

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
      minWidth: 90,
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
      maxWidth: 110,
      minWidth: 80
    },
    {
      headerName: '是否裁剪',
      field: 'cut',
      minWidth: 115,
      // editable: true,
      // cellRenderer: manualInput
    },
    {
      headerName: '发现缺陷数',
      field: 'foundDN',
      minWidth: 115,
      // editable: true,
      // cellRenderer: manualInput
    },
    {
      headerName: '加权有效缺陷数',
      field: 'weightDN',
      minWidth: 115

    },
    {
      headerName: '功能点',
      field: 'funcPoint',
      minWidth: 115

    },
    {
      headerName: '缺陷密度',
      field: 'defectDensity',
      minWidth: 115

    },
    {
      headerName: '评审用时',
      field: 'defectHour',
      minWidth: 115

    },
    {
      headerName: '评审效率',
      field: 'defectRatio',
      minWidth: 115

    }
  ];

  return reviewDefectColums;
};

/* endregion  */
export {
  getProcessColumns,
  getStoryStabilityColumns,
  getStageWorkloadColumns,
  getProductRateColumns,
  getReviewDefectColumns
};
