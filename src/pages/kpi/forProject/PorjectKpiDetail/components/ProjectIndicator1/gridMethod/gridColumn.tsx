import {getRowSpanMarginPosition} from "@/publicMethods/agGrid/cellRenderer";
import {CELL_LENGTH} from "../../constant";

const TitleWidth = {
  minWidth: CELL_LENGTH.TITLE_LENGTH,
  maxWidth: CELL_LENGTH.TITLE_LENGTH,
};

const CommonWidth = {
  minWidth: CELL_LENGTH.EIGHT_LENGTH,
  maxWidth: CELL_LENGTH.EIGHT_LENGTH,
};

// 项目质量列
export const prjQualityColumn: any = [
  {
    headerName: '',
    children: [{
      ...TitleWidth,
      headerName: '',
      pinned: "left",
      field: 'detail_title',
      cellClass: 'cell-span',
      rowSpan: (params: any) => params.data?.rowSpan || 1,
      cellRenderer: (params: any) => {
        if (params.data?.rowSpan) {
          return `<div style="margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px">${params.value}</div>`;
        }
        return "";
      }
    }, {
      ...TitleWidth,
      headerName: '技术侧',
      field: 'tech',
      pinned: "left"
    }]
  },
  {
    headerName: '汇总',
    children: [
      {
        headerName: 'Bug总数',
        field: 'total_bug',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: "有效Bug数",
        field: 'effective_bug',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '加权有效Bug数',
        field: 'weighted_effective_bug',
        ...CommonWidth,
      }, {
        headerName: '代码量',
        field: 'code_count',
        columnGroupShow: 'closed',
        editable: (params: any) => {
          if (params.data?.tech === "项目") {
            return false;
          }
          return true;
        },
        cellRenderer:"codeRenderer",
        ...CommonWidth,
      }, {
        headerName: '有效千行Bug率',
        field: 'effective_bug_rate',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '加权有效千行Bug率',
        field: 'weighted_effective_bug_rate',
        columnGroupShow: 'closed',
        ...CommonWidth,
      },
      // {
      //   headerName: '解Bug时长',
      //   field: 'solved_bug_time',
      //   columnGroupShow: 'closed',
      //   ...CommonWidth,
      // }
    ]
  },
  {
    headerName: '有效Bug数',
    children: [
      {
        headerName: 'P0',
        field: 'effective_p0',
        ...CommonWidth,
      }, {
        headerName: 'P1',
        field: 'effective_p1',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: 'P2',
        field: 'effective_p2',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: 'P3',
        field: 'effective_p3',
        columnGroupShow: 'open',
        ...CommonWidth,
      }
    ]
  },
  {
    headerName: 'Bug总数',
    children: [
      {
        ...CommonWidth,
        headerName: 'P0',
        field: 'total_p0'
      }, {
        headerName: 'P1',
        field: 'total_p1',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: 'P2',
        field: 'total_p2',
        columnGroupShow: 'open',
        ...CommonWidth,

      }, {
        headerName: 'P3',
        field: 'total_p3',
        columnGroupShow: 'open',
        ...CommonWidth,

      }
    ]
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellEditor: 'agLargeTextCellEditor',
    headerClass: 'title_left',
    cellEditorParams: {
      rows: 2
    },
  }];

// 测试数据列
export const testDataColumn: any = [
  {
    headerName: '',
    children: [{
      ...TitleWidth,
      headerName: '',
      pinned: "left",
      field: 'detail_title',
      cellClass: 'cell-span',
      rowSpan: (params: any) => params.data?.rowSpan || 1,
      cellRenderer: (params: any) => {
        if (params.data?.rowSpan) {
          return `<div style="margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px">${params.value}</div>`;
        }
        return "";
      }
    }, {
      headerName: '轮次测试',
      field: 'title',
      pinned: "left",
      ...TitleWidth,
    }]
  },
  {
    headerName: '用例执行情况',
    children: [
      {
        headerName: '用例总数',
        field: 'total_p0',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '用例执行次数',
        field: 'total_p1',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '已通过用例数',
        field: 'total_p2',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '未执行用例数',
        field: 'total_p3',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '未指派用例数',
        field: 'total_p3',
        columnGroupShow: 'closed',
        ...CommonWidth,
      }, {
        headerName: '执行率',
        field: 'total_p3',
        ...CommonWidth,
      }, {
        headerName: '通过率',
        field: 'total_p3',
        columnGroupShow: 'closed',
        ...CommonWidth,
      },
      // {  迭代1暂时不做
      //   headerName: '用例有效率',
      //   field: 'total_p3',
      //   minWidth: CELL_LENGTH.FIVE_LENGTH,
      //   maxWidth: CELL_LENGTH.FIVE_LENGTH,
      // }
    ]
  },
  {
    headerName: 'Bug情况',
    children: [
      {
        headerName: 'Bug总数',
        field: 'effective_p0',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: '有效Bug数',
        field: 'effective_p1',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: '加权有效Bug数',
        field: 'effective_p2',
        ...CommonWidth,
      }, {
        headerName: '激活Bug数',
        field: 'effective_p3',
        columnGroupShow: 'open',
        ...CommonWidth,
      }, {
        headerName: 'Reopen数',
        field: 'total_p3',
        columnGroupShow: 'open',
        ...CommonWidth,
      }
    ]
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    headerClass: 'title_left',
    minWidth: CELL_LENGTH.DESC_LENGTH,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
      rows: 2
    },
  }];

// 开发人员数据列
export const devUserColumn: any = [
  {
    headerName: '',
    children: [{
      headerName: '',
      minWidth: CELL_LENGTH.TITLE_LENGTH,
      maxWidth: CELL_LENGTH.TITLE_LENGTH,
      field: 'detail_title',
      cellClass: 'cell-span',
      rowSpan: (params: any) => params.data?.rowSpan || 1,
      cellRenderer: (params: any) => {
        if (params.data?.rowSpan) { // white-space: pre-line
          return `<div style="margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px;">${params.value}</div>`;
        }
        return "";
      }
    }, {
      headerName: '姓名',
      field: 'name',
    }, {
      headerName: '技术侧',
      field: 'tech',
    }]
  },
  {
    headerName: '任务完成情况',
    children: [
      {
        headerName: '任务总数',
        field: 'total_p0',
      }, {
        headerName: '已完成',
        field: 'total_p1',
      }, {
        headerName: '待完成',
        field: 'total_p2',
      }, {
        headerName: '已延期',
        field: 'total_p3',
      }, {
        headerName: '预计总工时',
        field: 'total_p3',
      }, {
        headerName: '已用工时',
        field: 'total_p3',
      }, {
        headerName: '预计剩余工时',
        field: 'total_p3',
      }, {
        headerName: '工时估算偏差',
        field: 'total_p3',
      }, {
        headerName: '任务完成率',
        field: 'total_p3',
      }, {
        headerName: '工时偏差率',
        field: 'total_p3',
      }
    ]
  }, {
    headerName: 'Bug情况',
    children: [
      {
        headerName: 'Bug总数',
        field: 'effective_p0',
      }, {
        headerName: '有效Bug数',
        field: 'effective_p1',
      }, {
        headerName: '加权有效Bug数',
        field: 'effective_p2',
      }, {
        headerName: '激活Bug数',
        field: 'effective_p3',
      }, {
        headerName: '解Bug时长',
        field: 'total_p3',
      }
    ]
  },
  {
    headerName: '产能',
    children: [{
      headerName: '代码量',
      field: 'code',
      editable: true,
    }]
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    minWidth: 300,
    maxWidth: 1000,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
      rows: 2
    },
  }];

// 测试人员数据列
export const testUserColumn: any = [
  {
    headerName: '',
    children: [{
      headerName: '',
      minWidth: CELL_LENGTH.TITLE_LENGTH,
      maxWidth: CELL_LENGTH.TITLE_LENGTH,
      field: 'detail_title',
      cellClass: 'cell-span',
      rowSpan: (params: any) => params.data?.rowSpan || 1,
      cellRenderer: (params: any) => {
        if (params.data?.rowSpan === 1) {
          return params.value;
        }
        if (params.data?.rowSpan) { // white-space: pre-line
          return `<div style="margin-top: ${getRowSpanMarginPosition(params.data?.rowSpan, false)}px;">${params.value}</div>`;
        }
        return "";
      }
    }, {
      headerName: '姓名',
      field: 'name',
    }]
  },
  {
    headerName: '任务完成情况',
    children: [
      {
        headerName: '任务总数',
        field: 'total_p0',
      }, {
        headerName: '已完成',
        field: 'total_p1',
      }, {
        headerName: '待完成',
        field: 'total_p2',
      }, {
        headerName: '已延期',
        field: 'total_p3',
      }, {
        headerName: '预计总工时',
        field: 'total_p3',
      }, {
        headerName: '已用工时',
        field: 'total_p3',
      }, {
        headerName: '预计剩余工时',
        field: 'total_p3',
      }, {
        headerName: '工时估算偏差',
        field: 'total_p3',
      }, {
        headerName: '任务完成率',
        field: 'total_p3',
      }, {
        headerName: '工时偏差率',
        field: 'total_p3',
      }
    ]
  }, {
    headerName: '产能',
    children: [
      {
        headerName: '用例总数',
        field: 'effective_p0',
      }, {
        headerName: '执行用例数',
        field: 'effective_p1',
      }, {
        headerName: '执行用例次数',
        field: 'effective_p2',
      }, {
        headerName: '未执行用例数',
        field: 'effective_p3',
      }, {
        headerName: '创建Bug数',
        field: 'total_p3',
      }, {
        headerName: '待回归Bug数',
        field: 'total_p3',
      }, {
        headerName: '回归Bug时长',
        field: 'total_p3',
      }
    ]
  },
  {
    headerName: '说明',
    field: 'description',
    editable: true,
    minWidth: 300,
    maxWidth: 1000,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
      rows: 2
    },
  }];

export const projectQualityData: any = [
  {
    detail_title: "项目质量",
    tech: "前端",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    total_bug: "190",
    effective_bug: "90",
    weighted_effective_bug: "38",
    code_count: "1300",
    effective_bug_rate: "90%",
    weighted_effective_bug_rate: "50%",
    solved_bug_time: "6",
    description: "这个只是测试数据而已",
    rowSpan: 3
  },
  {
    detail_title: "项目质量",
    tech: "后端",
    total_p0: "14",
    total_p1: "22",
    total_p2: "40",
    total_p3: "59",
    effective_p0: "24",
    effective_p1: "45",
    effective_p2: "9",
    effective_p3: "67",
    total_bug: "100",
    effective_bug: "100",
    weighted_effective_bug: "90",
    code_count: "800",
    effective_bug_rate: "97%",
    weighted_effective_bug_rate: "70%",
    solved_bug_time: "2",
    description: "这个只是测试数据而已2222",

  },
  {
    detail_title: "项目质量",
    tech: "项目",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",

  }

];
export const testDataData: any = [
  {
    detail_title: "测试数据",
    title: "第一轮测试",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
    rowSpan: 6
  }, {
    detail_title: "测试数据",
    title: "第二轮测试",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
  }, {
    detail_title: "测试数据",
    title: "冒烟轮测试",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
  }, {
    detail_title: "测试数据",
    title: "自定义测试轮",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
  }, {
    detail_title: "测试数据",
    title: "测试总执行",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
  }, {
    detail_title: "测试数据",
    title: "提测演示",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    description: "这个只是测试数据而已",
  }];
export const devUserDataData: any = [
  {
    detail_title: "开发人员数据",
    name: "开发1",
    tech: "前端",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    total_bug: "190",
    effective_bug: "90",
    weighted_effective_bug: "38",
    code_count: "1300",
    effective_bug_rate: "90%",
    weighted_effective_bug_rate: "50%",
    solved_bug_time: "6",
    description: "这个只是测试数据而已",
    rowSpan: 5
  },
  {
    detail_title: "开发人员数据",
    name: "开发2",
    tech: "后端",
    total_p0: "14",
    total_p1: "22",
    total_p2: "40",
    total_p3: "59",
    effective_p0: "24",
    effective_p1: "45",
    effective_p2: "9",
    effective_p3: "67",
    total_bug: "100",
    effective_bug: "100",
    weighted_effective_bug: "90",
    code_count: "800",
    effective_bug_rate: "97%",
    weighted_effective_bug_rate: "70%",
    solved_bug_time: "2",
    description: "这个只是测试数据而已2222",

  },
  {
    detail_title: "开发人员数据",
    name: "开发3",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "开发人员数据",
    name: "开发4",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "开发人员数据",
    name: "开发5",
    tech: "前端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }

];
export const testUserDataData: any = [
  {
    detail_title: "测试人员数据",
    name: "测试1",
    tech: "前端",
    total_p0: "21",
    total_p1: "24",
    total_p2: "33",
    total_p3: "84",
    effective_p0: "64",
    effective_p1: "52",
    effective_p2: "52",
    effective_p3: "81",
    total_bug: "190",
    effective_bug: "90",
    weighted_effective_bug: "38",
    code_count: "1300",
    effective_bug_rate: "90%",
    weighted_effective_bug_rate: "50%",
    solved_bug_time: "6",
    description: "这个只是测试数据而已",
    rowSpan: 10
  },
  {
    detail_title: "测试人员数据",
    name: "测试2",
    tech: "后端",
    total_p0: "14",
    total_p1: "22",
    total_p2: "40",
    total_p3: "59",
    effective_p0: "24",
    effective_p1: "45",
    effective_p2: "9",
    effective_p3: "67",
    total_bug: "100",
    effective_bug: "100",
    weighted_effective_bug: "90",
    code_count: "800",
    effective_bug_rate: "97%",
    weighted_effective_bug_rate: "70%",
    solved_bug_time: "2",
    description: "这个只是测试数据而已2222",

  }, {
    detail_title: "测试人员数据",
    name: "测试2",
    tech: "后端",
    total_p0: "14",
    total_p1: "22",
    total_p2: "40",
    total_p3: "59",
    effective_p0: "24",
    effective_p1: "45",
    effective_p2: "9",
    effective_p3: "67",
    total_bug: "100",
    effective_bug: "100",
    weighted_effective_bug: "90",
    code_count: "800",
    effective_bug_rate: "97%",
    weighted_effective_bug_rate: "70%",
    solved_bug_time: "2",
    description: "这个只是测试数据而已2222",

  },
  {
    detail_title: "测试人员数据",
    name: "测试3",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试4",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试5",
    tech: "前端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试2",
    tech: "后端",
    total_p0: "14",
    total_p1: "22",
    total_p2: "40",
    total_p3: "59",
    effective_p0: "24",
    effective_p1: "45",
    effective_p2: "9",
    effective_p3: "67",
    total_bug: "100",
    effective_bug: "100",
    weighted_effective_bug: "90",
    code_count: "800",
    effective_bug_rate: "97%",
    weighted_effective_bug_rate: "70%",
    solved_bug_time: "2",
    description: "这个只是测试数据而已2222",

  },
  {
    detail_title: "测试人员数据",
    name: "测试3",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试4",
    tech: "后端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试5",
    tech: "前端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
  }, {
    detail_title: "测试人员数据",
    name: "测试5",
    tech: "前端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",
    rowSpan: 2
  }, {
    detail_title: "测试人员数据",
    name: "测试5",
    tech: "前端",
    total_p0: "36",
    total_p1: "15",
    total_p2: "89",
    total_p3: "0",
    effective_p0: "88",
    effective_p1: "12",
    effective_p2: "29",
    effective_p3: "19",
    total_bug: "180",
    effective_bug: "55",
    weighted_effective_bug: "90",
    code_count: "2300",
    effective_bug_rate: "98%",
    weighted_effective_bug_rate: "80%",
    solved_bug_time: "9",
    description: "这个只是测试数据而已3333",

  }
];



