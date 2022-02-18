/* region 各个指标的Table定义 */
// 1.进度指标数据
const getProcessTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "里程碑"},
    {name: "计划开始时间"},
    {name: "实际开始时间"},
    {name: "计划完成时间"},
    {name: "实际完成时间"},
    {name: "偏差天数"},
    {name: "偏差率"},
    {name: "偏差原因"},
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {

      // 需要对偏差率进行小数点保留和百分号展示
      let ratioValue = "";
      if (ele.ratio === "0" || ele.ratio === 0) {
        ratioValue = "0";
      } else if (ele.ratio) {
        ratioValue = `${Number(ele.ratio).toFixed(2)}%`;
      }

      const currentRow: any = [
        ele.title,
        ele.milestone,
        ele.planStart === "" ? "" : new Date(ele.planStart),
        ele.actualStart === "" ? "" : new Date(ele.actualStart),
        ele.planEnd === "" ? "" : new Date(ele.planEnd),
        ele.actualEnd === "" ? "" : new Date(ele.actualEnd),
        ele.days,
        ratioValue,
        ele.description];

      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "processTable", // 表格名称
    ref: "A1",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,  // 用交替的背景色显示行
      // font: {name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true,color:"#FF0000"}

    },
    columns: column,
    rows: rowData,
    // font: {name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true,color:"#FF0000"}

  };

  return tableInfo;
};

// 2.需求稳定性
const getStoryStabilityTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "阶段"},
    {name: "预计工时"},
    {name: "变更工时"},
    {name: "变更率"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      // 对预计工时保留两位小数
      let planHours = "";
      if (ele.planHours === "0" || ele.planHours === 0) {
        planHours = "0.00";
      } else if (ele.planHours) {
        planHours = `${Number(ele.planHours).toFixed(2)}`;
      }

      // 变更工时为0时显示为空
      let stableHours = "";
      if (ele.stableHours) {
        stableHours = ele.stableHours;
      }
      // 对变更率保留四位小数
      let ratio = "";
      if (ele.ratio) {
        ratio = `${Number(ele.ratio).toFixed(4)}`;
      }

      const currentRow: any = [
        ele.title,
        ele.stage,
        planHours,
        stableHours,
        ratio,
        ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "storyStablityTable", // 表格名称
    ref: "A9",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,  // 用交替的背景色显示行
    },
    columns: column,
    rows: rowData,

  };

  return tableInfo;
};

// 3.阶段工作量（单位：人天）
const getStageWorkloadTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "阶段"},
    {name: "投入人力"},
    {name: "预计工时"},
    {name: "实际工时"},
    {name: "计划工作量"},
    {name: "实际工作量"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      // 计划工作量保留两位小数
      let planWorkload = "";
      if (ele.planWorkload) {
        planWorkload = `${Number(ele.planWorkload).toFixed(2)}`
      }
      // 实际工作量保留两位小数
      let actualWorkload = "";
      if (ele.actualWorkload) {
        actualWorkload = `${Number(ele.actualWorkload).toFixed(2)}`
      }

      const currentRow: any = [
        ele.title,
        ele.stage,
        ele.manpower,
        ele.planHours,
        ele.actualHours,
        planWorkload,
        actualWorkload,
        ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "stageWorkloadTable",
    ref: "A15",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 4.生产率
const getProductRateTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "阶段"},
    {name: "计划值"},
    // {name: "实际值"},  暂时隐藏实际值的显示
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      // 计划值需要保留两位小数
      let planValue = "";
      if (ele.planValue) {
        planValue = `${Number(ele.planValue).toFixed(2)}`
      }
      const currentRow: any = [ele.title, ele.stage, planValue, ele.description]; // ele.actualValue,
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "productRateTable",
    ref: "A23",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 5.评审和缺陷
const getReviewDefectTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "阶段"},
    {name: "是否裁剪"},
    {name: "发现缺陷数"},
    {name: "加权有效缺陷数"},
    {name: "功能点"},
    {name: "缺陷密度"},
    {name: "评审用时"},
    {name: "评审效率"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      let stage = "";
      if (ele.kind !== "用例评审2" && ele.kind !== "codereview") {
        stage = ele.kind;
      }

      // 是否裁剪转为中文
      let cutFlag = ele.cut;
      if (cutFlag !== "是否裁剪") {
        cutFlag = ele.cut === true ? "是" : "否";
      }

      const currentRow: any = [ele.title, stage, cutFlag, ele.foundDN, ele.weightDN, ele.funcPoint,
        ele.defectDensity, ele.reviewHour, ele.reviewRatio, ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "reviewDefectTable",
    ref: "A27",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: column,
    rows: rowData
  };

  return tableInfo;
};


// 6 过程质量补充数据
const getProcessQualityTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "所属模块"},
    {name: "是否裁剪"},
    {name: "度量值"},
    {name: "基线值"},
    {name: "实际值"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {

      // 是否裁剪转为中文
      let cutFlag = ele.cut;
      if (cutFlag !== "度量值" && cutFlag !== "一次提测通过率") {
        cutFlag = ele.cut === true ? "是" : "否";
      }

      // 实际值的转化（bug解决时长和回归时长需要/3600,并且保留两位小数；一次提测通过率需要保留两位小数和百分比）
      let realValue = "";
      if (ele.realValue) {
        if (ele.kind === "Bug解决时长" || ele.kind === "Bug回归时长") {
          // 需要除以3600 转为小时
          realValue = (Number(ele.realValue) / 3600).toFixed(2);
        } else if (ele.cut === "一次提测通过率") {
          realValue = `${(Number(ele.realValue) * 100).toFixed(2)}%`;
        } else if (ele.realValue === "一次提测通过率") {
          realValue = "一次提测通过率";
        } else {
          realValue = Number(ele.realValue).toFixed(2);
        }
      }

      const currentRow: any = [ele.title, ele.module, cutFlag, ele.kind, ele.baseline, realValue,
        ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "processQualityTable",
    ref: "A45",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: column,
    rows: rowData
  };

  return tableInfo;
};


// 7 服务
const getServiceTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "内容"},
    {name: "度量值"},
    {name: "成功发布数"},
    {name: "发布次数"},
    {name: "一次成功发布率"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      // 一次成功发布率需要*100并且显示百分号
      let ratio = "";
      if (ele.ratio) {
        ratio = `${(Number(ele.ratio) * 100).toFixed(2)}%`;
      }
      const currentRow: any = [ele.title, ele.module, ele.item, ele.succN,
        ele.totalN, ratio, ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "serviceTable",
    ref: "A56",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,
    },
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

/* endregion */


export {
  getProcessTable,
  getStoryStabilityTable,
  getStageWorkloadTable,
  getProductRateTable,
  getReviewDefectTable,
  getProcessQualityTable,
  getServiceTable
}
