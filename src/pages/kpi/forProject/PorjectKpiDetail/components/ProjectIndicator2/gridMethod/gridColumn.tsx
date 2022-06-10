import {getRowSpanMarginPosition} from "@/publicMethods/agGrid/cellRenderer";
import {CELL_LENGTH} from "@/pages/kpi/forProject/PorjectKpiDetail/components/constant";

const TitleWidth = {
  minWidth: CELL_LENGTH.SIX_LENGTH,
  maxWidth: CELL_LENGTH.SIX_LENGTH,
  pinned: "left"
};
const CommonWidth = {
  minWidth: CELL_LENGTH.EIGHT_LENGTH,
  maxWidth: CELL_LENGTH.EIGHT_LENGTH,
};

const manualInput_black = (params: any) => {
  if (!params.value) {
    return '';
  }
  return `<div style="text-align: left">${params.value}</div>`;
};

// 项目质量列
export const stageWorkloadColumn: any = [
  {
    headerName: '',
    field: 'title',
    ...TitleWidth,
    cellClass: 'cell-span',
    rowSpan: (params: any) => params.data?.rowSpan || 1,
    cellRenderer: (params: any) => {
      if (params.data?.rowSpan) {
        return `<div style="font-weight: bold;margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, true)}px">
                    <div>阶段工作量<br/>（单位：人天）</div>
                </div>`;
      }
      return "";
    }
  },
  {
    headerName: '阶段',
    field: 'stage',
    ...TitleWidth,
  },
  {
    headerName: '投入人力',
    field: 'manpower',
    ...CommonWidth,
    editable: true,
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === '' || params.value === undefined) {
        return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
      }
      if (params.value === -999999) {
        return 0;
      }
      return Math.abs(params.value);
    },
  },
  {
    headerName: '预计工时',
    field: 'planHours',
    ...CommonWidth,
    // editable: true,
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === '' || params.value === undefined) {
        return '';
      }

      const values = Number(params.value);
      if (values.toFixed(0) === '-999999') {
        return `<span style="color: orange">0</span>`;
      }
      if (values < 0) {
        return `<span style="color: orange"> ${Math.abs(values).toFixed(2)}</span>`;
      }
      return values.toFixed(2);
    },
  },
  {
    headerName: '实际工时',
    field: 'actualHours',
    ...CommonWidth,
    // editable: true,
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === '' || params.value === undefined) {
        return '';
      }
      const values = Number(params.value);
      if (values.toFixed(0) === '-999999') {
        return `<span style="color: orange">0</span>`;
      }
      if (values < 0) {
        return `<span style="color: orange"> ${Math.abs(values).toFixed(2)}</span>`;
      }
      return values.toFixed(2);
    },
  },
  {
    headerName: '计划工作量',
    field: 'planWorkload',
    ...CommonWidth,
    valueFormatter: (params: any) => {
      if (params.value) {
        return Number(params.value).toFixed(2);
      }
      return params.value;
    },
  },
  {
    headerName: '实际工作量',
    field: 'actualWorkload',
    ...CommonWidth,
    valueFormatter: (params: any) => {
      if (params.value) {
        return Number(params.value).toFixed(2);
      }
      return params.value;
    },
  },
  {
    headerName: '阶段生产率',
    field: 'stageRatio',
    ...CommonWidth,
    valueFormatter: (params: any) => {
      if (params.value) {
        return Number(params.value).toFixed(2);
      }
      return params.value;
    },
  },
  {
    headerName: '说明',
    field: 'description',
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    editable: true,
    cellRenderer: manualInput_black,
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
  },
];

// 渲染手工录入
const projectRateManualInput = (params: any) => {
  if (params.data?.stage === '功能点') {
    if (params.value === null || params.value === '') {
      return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
    }
    return Number(params.value).toFixed(2);
  }

  if (params.value) {
    return `<div style="margin-top: 10px">${Number(params.value).toFixed(2)}</div>`;
  }
  return '';
};

const projectRateEditRenderer = (param: any) => {
  if (param.data?.stage === '功能点') {
    return true;
  }
  return false;
};
// 产能
export const StageWorkloadColums: any = [
  {
    headerName: '',
    field: 'title',
    ...TitleWidth,
    cellClass: 'cell-span',
    rowSpan: (params: any) => params.data?.rowSpan || 1,
    cellRenderer: (params: any) => {
      if (params.data?.rowSpan) {
        return `<div style="font-weight: bold;margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px">
                   ${params.value}
                </div>`;
      }
      return "";
    }
  },
  {
    headerName: '阶段',
    field: 'stage',
    ...TitleWidth,
    cellRenderer: (params: any) => {
      if (params.value === '生产率(功能点/人天）') {
        return `<div>
                    <div>生产率</div>
                    <div style="margin-top: -10px"> (功能点/人天）</div>
                </div>`;
      }
      return params.value;
    },
  },
  {
    headerName: '计划值',
    field: 'planValue',
    ...CommonWidth,
    editable: projectRateEditRenderer,
    cellRenderer: projectRateManualInput,
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
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellRenderer: (params: any) => {
      if (params.value) {
        if (params.data?.stage === '生产率(功能点/人天）') {
          return `<div style="margin-top: 10px; text-align: left">${params.value}</div>`;
        }
        return `<div style="text-align: left">${params.value}</div>`;
      }

      return '';
    },
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
  },
];

// 评审缺陷问题
export const reviewDefectColums: any = [
  {
    headerName: '',
    field: 'title',
    ...TitleWidth,
    cellClass: 'cell-span',
    rowSpan: (params: any) => params.data?.rowSpan || 1,
    cellRenderer: (params: any) => {
      if (params.data?.rowSpan) {
        return `<div style="font-weight: bold;margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px">
                   ${params.value}
                </div>`;
      }
      return "";
    }
  },
  {
    headerName: '',
    field: 'kind',
    ...TitleWidth,
    cellClassRules: {
      'cell-span': 'value !== undefined',
    },
    rowSpan: (params: any) => {
      if (params.data.kind === '用例评审' || params.data.kind === 'CodeReview') {
        return 2;
      }
      return 1;
    },
    cellRenderer: (params: any) => {
      if (params.value === '用例评审' || params.value === 'CodeReview') {
        return `<div style="margin-top: 18px">${params.value}</div>`;
      }
      return params.value;
    },
  },
  {
    headerName: '是否裁剪',
    field: 'cut',
    ...CommonWidth,
    cellRenderer: "reviewCutRenderer"
    // editable: (params: any) => {
    //   if (params.data?.kind === '合计' || params.data?.cut === '是否裁剪') {
    //     return false;
    //   }
    //   return true;
    // },
    // cellEditor: 'agSelectCellEditor',
    // cellEditorParams: {values: ['是', '否']},
    // cellRenderer: (params: any) => {
    //   if (params.data?.kind === '合计') {
    //     return '-';
    //   }
    //   if (
    //     params.value === null ||
    //     params.value === undefined ||
    //     params.value === '' ||
    //     params.value === false ||
    //     params.value === '否'
    //   ) {
    //     return '否'; // 默认值
    //   }
    //
    //   if (params.value === true || params.value === '是') {
    //     return '是';
    //   }
    //   if (params.value === '是否裁剪') {
    //     return `<span style="font-weight: bold">${params.value}</span>`;
    //   }
    //   return params.value;
    // },
  },
  {
    headerName: '发现缺陷数',
    field: 'foundDN',
    ...CommonWidth,
    // valueFormatter: (params: any) => {
    //   if (!params.value) {
    //     return "";
    //   }
    //   return params.value;
    // },
    cellRenderer: (params: any) => {
      if (params.value === '发现问题数' || params.value === '发现缺陷数') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      if (!params.value) {
        return '';
      }
      return params.value;
    },
  },
  {
    headerName: '加权有效缺陷数',
    field: 'weightDN',
    ...CommonWidth,
    // valueFormatter: (params: any) => {
    //
    //   // 只要发现缺陷数为0或者空，这个值也需要为空
    //   if (!params.data?.foundDN) {
    //     return "";
    //   }
    //   return params.value;
    // },
    cellRenderer: (params: any) => {
      if (params.value === '加权有效问题数' || params.value === '加权有效缺陷数') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      // 只要发现缺陷数为0或者空，这个值也需要为空
      if (!params.data?.foundDN) {
        return '';
      }
      return params.value;
    },
    minWidth: 140,
    maxWidth: 140,
  },
  {
    headerName: '功能点',
    field: 'funcPoint',
    ...CommonWidth,
    editable: (params: any) => {
      if (params.data?.kind === 'codereview') {
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
      if (params.value === '功能点' || params.value === '代码量') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      // 只要发现缺陷数为0或者空，这个值也需要为空(代码量除外)
      if (!params.data?.foundDN && params.data?.kind !== 'codereview') {
        return '';
      }

      if (params.data?.kind === 'codereview') {
        if (params.value === '' || params.value === null) {
          return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
        }
        return params.value;
      }
      return Number(params.value).toFixed(2);
    },
  },
  {
    headerName: '缺陷密度',
    field: 'defectDensity',
    ...CommonWidth,
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
      if (params.value === '加权有效问题率' || params.value === '加权有效缺陷密度') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      // 只要发现缺陷数为0或者空，这个值也需要为空
      if (!params.data?.foundDN) {
        return '';
      }
      if (params.value) {
        return Number(params.value).toFixed(2);
      }
      return params.value;
    },
  },
  {
    headerName: '评审用时',
    field: 'reviewHour',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.value === '评审用时') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      if (
        params.data?.kind === '提测演示' ||
        params.data?.kind === '开发自测/联调' ||
        params.data?.kind === '集成测试' ||
        params.data?.kind === '系统测试' ||
        params.data?.kind === '发布测试' ||
        params.data?.kind === '合计'
      ) {
        return '-';
      }
      // 如果是否裁剪为是，则不能编辑，则不显示手工录入
      if (params.data?.cut === true) {
        return '';
      }
      // 只要发现缺陷数为0或者空，这个值也需要为空
      if (!params.data?.foundDN) {
        return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
      }

      if (params.value === null || params.value === '' || params.value === undefined) {
        return `<div style="color: red;font-style: italic ;text-align: center">手工录入</div>`;
      }

      const values = Number(params.value);
      if (values.toFixed(0) === '-999999') {
        return `<span style="color: orange">0</span>`;
      }
      if (values < 0) {
        return `<span style="color: orange"> ${Math.abs(values)}</span>`;
      }
      return values;
    },
    editable: (params: any) => {
      if (
        params.data?.kind === '提测演示' ||
        params.data?.kind === '开发自测/联调' ||
        params.data?.kind === '集成测试' ||
        params.data?.kind === '系统测试' ||
        params.data?.kind === '发布测试' ||
        params.data?.kind === '合计'
      ) {
        return false;
      }
      // 如果是否裁剪值为是，则评审用时不可修改。
      if (params.data?.cut === '是否裁剪' || params.data?.cut === true) {
        return false;
      }
      return true;
    },
  },
  {
    headerName: '评审效率',
    field: 'reviewRatio',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.value === '评审效率') {
        return `<span style="font-weight: bold">${params.value}</span>`;
      }
      if (
        params.data?.kind === '提测演示' ||
        params.data?.kind === '开发自测/联调' ||
        params.data?.kind === '集成测试' ||
        params.data?.kind === '系统测试' ||
        params.data?.kind === '发布测试' ||
        params.data?.kind === '合计'
      ) {
        return '-';
      }

      if (params.value) {
        return Number(params.value).toFixed(2);
      }
      return '';
    },
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    // cellRenderer: (params: any) => {
    //   if (params.value === '说明') {
    //     return `<span style="font-weight: bold;text-align: left;color: red">${params.value}</span>`;
    //   }
    //   if (!params.value) {
    //     return '';
    //   }
    //   return `<div style="text-align: left">${params.value}</div>`;
    // },
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
  },
];

// 过程质量补充数据
export const processQualityColums: any = [
  {
    headerName: '',
    field: 'title',
    ...TitleWidth,
    cellClass: 'cell-span2',
    rowSpan: (params: any) => params.data?.rowSpan || 1,
    cellRenderer: (params: any) => {
      if (params.data?.rowSpan) {
        return `<div style="font-weight: bold;margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, true)}px">
                   过程质量<br/>补充数据
                </div>`;
      }
      return "";
    }
  },
  {
    headerName: '',
    field: 'module',
    ...TitleWidth,
    cellRenderer: (params: any) => {
      if (params.value === '开发') {
        return `<div style="margin-top: 50px">${params.value}</div>`;
      }
      if (params.value === '测试') {
        return `<div style="margin-top: 35px">${params.value}</div>`;
      }
      if (params.value === '质量') {
        return `<div style="margin-top: 35px">${params.value}</div>`;
      }
      return `<div>${params.value}</div>`;
    },
    cellClassRules: {
      'cell-span2': 'value !== undefined',
    },
    rowSpan: (params: any) => {
      if (params.data?.module === '开发') {
        return 4;
      }
      if (params.data?.module === '测试') {
        return 3;
      }
      if (params.data?.module === '质量') {
        return 2.6;
      }
      return 1;
    },
  },
  {
    headerName: '是否裁剪',
    field: 'cut',
    ...CommonWidth,
    cellRenderer: "processQuaCutRenderer"
    // editable: (params: any) => {
    //   if (params.data?.cut === '度量值' || params.data?.cut === '一次提测通过率') {
    //     return false;
    //   }
    //   return true;
    // },
    // cellEditor: 'agSelectCellEditor',
    // cellEditorParams: {values: ['是', '否']},
    // cellRenderer: (params: any) => {
    //   if (
    //     params.value === null ||
    //     params.value === undefined ||
    //     params.value === '' ||
    //     params.value === '否'
    //   ) {
    //     return '否';
    //   }
    //
    //   if (params.value === true || params.value === '是') {
    //     return '是';
    //   }
    //   if (params.value === '度量值') {
    //     return `<div style="font-weight: bold">度量值</div>`;
    //   }
    //
    //   if (params.value === '一次提测通过率') {
    //     return `<div>
    //                 <div>一次提测</div>
    //                 <div style="margin-top: -10px">通过率</div>
    //             </div>`;
    //   }
    //
    //   return params.value;
    // },
  },
  {
    headerName: '度量值',
    field: 'kind',
    minWidth: 170,
    maxWidth: 170,
    editable: (params: any) => {
      if (params.data?.cut === '一次提测通过率') {
        return true;
      }
      return false;
    },
    cellRenderer: (params: any) => {
      if (params.data?.cut === '度量值') {
        return `<div style="font-weight: bold">${params.value}</div>`;
      }
      if (params.data?.cut === '一次提测通过率') {
        if (params.value === null || params.value === '' || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;
        }
        return `<div style="margin-top: 10px">${params.value}</div>`;
      }
      return params.value;
    },
  },
  {
    headerName: '基线值',
    field: 'baseline',
    minWidth: 130,
    maxWidth: 130,
    editable: (params: any) => {
      if (params.data?.cut === '一次提测通过率') {
        return true;
      }
      return false;
    },
    cellRenderer: (params: any) => {
      if (params.data?.cut === '度量值') {
        return `<div style="font-weight: bold">${params.value}</div>`;
      }
      if (params.data?.cut === '一次提测通过率') {
        if (params.value === null || params.value === '' || params.value === undefined) {
          return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;
        }
        return `<div style="margin-top: 10px">${params.value}</div>`;
      }
      return params.value;
    },
  },
  {
    headerName: '实际值',
    field: 'realValue',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.data?.cut === true) {
        return '';
      }

      if (params.data?.kind === 'Bug解决时长' || params.data?.kind === 'Bug回归时长') {
        // 需要除以3600 转为小时
        if (params.value) {
          return (Number(params.value) / 3600).toFixed(2);
        }
        return params.value;
      }

      if (params.value === '一次提测通过率') {
        return `<div style=" font-weight: bold"> 一次提测通过率</div>`;
      }

      if (params.value) {
        if (params.data?.cut === '一次提测通过率') {
          return `<div style="margin-top: 10px">${(Number(params.value) * 100).toFixed(
            2,
          )}%</div>`;
        }
        return Number(params.value).toFixed(2);
      }
      return params.value;
    },
  },
  {
    headerName: '说明',
    field: 'description',
    editable: (params: any) => {
      if (params.data?.description === '说明') {
        return false;
      }
      return true;
    },
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellRenderer: (params: any) => {
      if (params.value === '说明') {
        return `<div style="font-weight: bold;text-align: left"> 说明</div>`;
      }

      if (params.value) {
        if (params.data?.cut === '一次提测通过率') {
          return `<div style="text-align: left;margin-top: 10px">${params.value}</div>`;
        }
        return `<div style="text-align: left">${params.value}</div>`;
      }
      return '';
    },
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
  },
];

// 服务
export const serviceColums: any = [
  {
    headerName: '',
    field: 'title',
    ...TitleWidth,
    cellRenderer: (params: any) => {
      return `<div style="font-weight: bold;margin-top: 12px">${params.value}</div>`;
    },
  },
  {
    headerName: '',
    field: 'module',
    ...TitleWidth,
    cellRenderer: (params: any) => {
      return `<div style="margin-top: 12px">${params.value} </div>`;
    },
  },
  {
    headerName: '度量值',
    field: 'item',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.value === '一次发布成功率') {
        return `<div>
                    <div>一次发布</div>
                    <div style="margin-top: -10px">成功率</div>
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
      if (params.value === null || params.value === '' || params.value === undefined) {
        return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;
      }
      return `<div style="margin-top: 12px">${params.value} </div>`;
    },
  },
  {
    headerName: '发布次数',
    field: 'totalN',
    minWidth: 130,
    maxWidth: 130,
    editable: true,
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === '' || params.value === undefined) {
        return `<div style="color: red;font-style: italic ;text-align: center;margin-top: 12px">手工录入</div>`;
      }
      return `<div style="margin-top: 12px">${params.value} </div>`;
    },
  },
  {
    headerName: '一次成功发布率',
    field: 'ratio',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.value) {
        return `<div style="margin-top: 12px">${(Number(params.value) * 100).toFixed(2)}%</div>`;
      }
      return '';
    },
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellRenderer: (params: any) => {
      if (!params.value) {
        return '';
      }
      return `<div style="margin-top: 12px;text-align: left">${params.value}</div>`;
    },
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
  },
];
