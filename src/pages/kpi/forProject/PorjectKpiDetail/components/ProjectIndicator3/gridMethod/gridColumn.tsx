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


// 里程碑进度
export const milestoneColums: any = [
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
    headerName: '里程碑',
    field: 'milestone',
    ...TitleWidth,
  },
  {
    headerName: '计划开始时间',
    field: 'planStart',
    cellRenderer: "cellTimeRenderer",
    ...CommonWidth,
  },
  {
    headerName: '计划完成时间',
    field: 'planEnd',
    cellRenderer: "cellTimeRenderer",
    ...CommonWidth,
  },
  {
    headerName: '实际开始时间',
    field: 'actualStart',
    cellRenderer: "cellTimeRenderer",
    ...CommonWidth,
  },
  {
    headerName: '实际完成时间',
    field: 'actualEnd',
    cellRenderer: "cellTimeRenderer",
    ...CommonWidth,
  },
  {
    headerName: '延期天数',
    field: 'days',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      //   >0 显示绿色，< 0 显示红色，0是黑色
      const values = params.value;
      if (values === 0) {
        return 0;
      }
      if (!values) {
        return '';
      }
      if (Number(values) > 0) {
        return `<span style="color: red">+${values}</span>`;
      }
      return `<span style="color: green">${values}</span>`;
    },
  },
  {
    headerName: '延期率',
    field: 'ratio',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      let values = params.value;
      if (values === 0 || values === '0') {
        return 0;
      }
      if (!values) {
        return '';
      }

      values = Number(params.value).toFixed(2);
      if (Number(values) > 0) {
        return `<span style="color: red">+${values}%</span>`;
      }
      return `<span style="color: green">${values}%</span>`;
    },
  },
  {
    headerName: '延期原因说明',
    field: 'description',
    editable: true,
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellRenderer: manualInput_black,
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
    headerClass: 'title_left',
  },
];

// 需求稳定性
export const storyStabilityColums: any = [
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
  },
  {
    headerName: '预计工时',
    field: 'planHours',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (params.value === null || params.value === '' || params.value === undefined) {
        return '';
      }
      const values = Number(params.value);
      if (values.toFixed(0) === '-999999') {
        return `<span style="color: orange">0</span>`;
      }
      if (values < 0) {
        return `<span style="color: orange"> ${Math.abs(Number(values.toFixed(2)))}</span>`;
      }
      return values.toFixed(2);
    },
  },
  {
    headerName: '变更工时',
    field: 'stableHours',
    ...CommonWidth,
    cellRenderer: (params: any) => {
      if (!params.value) {
        return '';
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
  },
  {
    headerName: '变更率',
    field: 'ratio',
    ...CommonWidth,
    valueFormatter: (params: any) => {
      if (!params.value) {
        return '';
      }
      return `${Number(params.value).toFixed(4)}`;
    },
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellRenderer: manualInput_black,
    tooltipField: 'description',
    tooltipComponent: 'customTooltip',
    headerClass: 'title_left',
  },
];

