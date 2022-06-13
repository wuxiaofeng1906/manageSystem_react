// 进度指标数据
import dayjs from "dayjs";

const cellStyle = {
  theme: 'TableStyleMedium15',
  showRowStripes: true, // 用交替的背景色显示行
}


// 项目质量
const getProjectQualityTable = (data: any) => {

  const column = [
    {name: "title"}, {name: "技术侧"}, {name: "汇总"}, {name: "汇总1"}, {name: "汇总2"},
    {name: "汇总3"}, {name: "汇总4"}, {name: "汇总5"}, {name: "有效Bug数"},
    {name: "有效Bug数1"}, {name: "有效Bug数2"}, {name: "有效Bug数3"}, {name: "Bug总数"},
    {name: "Bug总数1"}, {name: "Bug总数2"}, {name: "Bug总数3"}, {name: "说明"}];
  const secondTitle = ["", "", "Bug总数", "有效Bug数", "加权有效Bug数", "代码量", "有效千行Bug率",
    "加权有效千行Bug率", "P0", "P1", "P2", "P3", "P0", "P1", "P2", "P3", ""];
  const rowData: any = [secondTitle];

  if (data && data.length) {
    data.forEach((dts: any) => {
      rowData.push([
        dts.detail_title,
        dts.tech,
        // 汇总
        dts.total_bug,
        dts.effective_bug,
        dts.weighted_effective_bug,
        dts.code_count,
        dts.effective_bug_rate,
        dts.weighted_effective_bug_rate,
        // 有效Bug数
        dts.effective_p0,
        dts.effective_p1,
        dts.effective_p2,
        dts.effective_p3,
        // Bug数
        dts.total_p0,
        dts.total_p1,
        dts.total_p2,
        dts.total_p3,
        //   说明
        dts.description,
      ]);
    });
  }


  const tableInfo = {
    name: "projectQuaTable", // 表格名称
    ref: "A1",
    style: cellStyle,
    columns: column,
    rows: rowData,

  };

  return tableInfo;
};

// 测试数据
const getTestDataTable = (data: any) => {
  console.log(data);
  const column = [
    {name: "title"}, {name: "用例执行情况"}, {name: "用例执行情况1"}, {name: "用例执行情况2"}, {name: "用例执行情况3"},
    {name: "用例执行情况4"}, {name: "用例执行情况5"}, {name: "用例执行情况6"}, {name: "用例执行情况7"},
    {name: "Bug情况"}, {name: "Bug情况1"}, {name: "Bug情况2"}, {name: "Bug情况3"}, {name: "Bug情况4"}, {name: "说明"}];
  const secondTitle = ["", "轮次测试", "用例总数", "用例执行次数", "已通过用例数", "未执行用例数", "未指派用例数", "执行率",
    "通过率", "Bug总数", "有效Bug数", "加权有效Bug数", "激活Bug", "Reopen率", "说明"];
  const rowData: any = [secondTitle];

  rowData.push([1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10], [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10],
    [1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 8, 10]);

  const tableInfo = {
    name: "testDataTable", // 表格名称
    ref: "A7",
    style: cellStyle,
    columns: column,
    rows: rowData,
  };

  return tableInfo;
};

// 过程质量
const getProcessTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "里程碑"},
    {name: "计划开始时间"},
    {name: "计划完成时间"},
    {name: "实际开始时间"},
    {name: "实际完成时间"},
    {name: "延期天数"},
    {name: "延期率"},
    {name: "延期原因说明"},
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {

      // 需要对延期率进行小数点保留和百分号展示
      let ratioValue = "";
      if (ele.ratio === "0" || ele.ratio === 0) {
        ratioValue = "0";
      } else if (ele.ratio) {
        ratioValue = `${Number(ele.ratio).toFixed(2)}%`;
      }

      // 计划开始时间
      let planStart = "";
      if (ele.planStart && ele.planStart !== "0000-00-00") {
        planStart = dayjs(ele.planStart).format("YYYY-MM-DD");
      }

      // 计划完成时间
      let planEnd = "";
      if (ele.planEnd && ele.planEnd !== "0000-00-00") {
        planEnd = dayjs(ele.planEnd).format("YYYY-MM-DD");
      }

      // 实际开始时间
      let actualStart = "";
      if (ele.actualStart && ele.actualStart !== "0000-00-00") {
        actualStart = dayjs(ele.actualStart).format("YYYY-MM-DD");
      }

      // 实际完成时间
      let actualEnd = "";
      if (ele.actualEnd && ele.actualEnd !== "0000-00-00") {
        actualEnd = dayjs(ele.actualEnd).format("YYYY-MM-DD");
      }

      const currentRow: any = [
        ele.title, ele.milestone, planStart, planEnd,
        actualStart, actualEnd, ele.days,
        ratioValue, ele.description];

      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "processTable", // 表格名称
    ref: "A1",
    style: {
      theme: 'TableStyleMedium15',  // TableStyleMedium9
      showRowStripes: true,  // 用交替的背景色显示行
      // font: {name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true,color:"#FF0000"}

    },
    columns: column,
    rows: rowData,
    // font: {name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true,color:"#FF0000"}

  };

  return tableInfo;
};

// 需求稳定性
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
      if (ele.planHours === "0" || ele.planHours === 0 || ele.planHours === -999999) {
        planHours = "0";
      } else if (ele.planHours) {
        planHours = `${Math.abs(Number(ele.planHours)).toFixed(2)}`;
      }

      // 变更工时为0时显示为空
      let stableHours = "";
      if (ele.stableHours) {
        stableHours = ele.stableHours === -999999 ? "0" : Math.abs(Number(ele.stableHours)).toString();
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
      theme: 'TableStyleMedium15',
      showRowStripes: true,  // 用交替的背景色显示行
    },
    columns: column,
    rows: rowData,

  };

  return tableInfo;
};

// 阶段工作量（单位：人天）
const getStageWorkloadTable = (data: any) => {
  const column = [
    {name: "title"},
    {name: "阶段"},
    {name: "投入人力"},
    {name: "预计工时"},
    {name: "实际工时"},
    {name: "计划工作量"},
    {name: "实际工作量"},
    {name: "阶段生产率"},
    {name: "说明"}
  ];

  const rowData: any = [];
  if (data && data.length > 0) {
    data.forEach((ele: any) => {
      // 计划工作量保留两位小数
      let planWorkload = "";
      if (ele.planWorkload) {
        planWorkload = `${Number(ele.planWorkload).toFixed(2)}`;
      }
      // 实际工作量保留两位小数
      let actualWorkload = "";
      if (ele.actualWorkload) {
        actualWorkload = `${Number(ele.actualWorkload).toFixed(2)}`;
      }

      // 投入人力
      let manpower = "";
      if (ele.manpower) {
        manpower = ele.manpower === -999999 ? "0" : Math.abs(ele.manpower).toString();
      }

      // 预计工时
      let planHours = "";
      if (ele.planHours) {
        planHours = ele.planHours === -999999 ? "0" : Math.abs(ele.planHours).toString();
      }
      // 实际工时
      let actualHours = "";
      if (ele.actualHours) {
        actualHours = ele.actualHours === -999999 ? "0" : Math.abs(ele.actualHours).toString();
      }

      // 实际工时
      let stageRatio = "";
      if (ele.stageRatio) {
        stageRatio = ele.stageRatio === -999999 ? "0" : `${Number(ele.stageRatio).toFixed(2)}`;
      }

      const currentRow: any = [
        ele.title, ele.stage,
        manpower, planHours, actualHours,
        planWorkload, actualWorkload, stageRatio,
        ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "stageWorkloadTable",
    ref: "A1",
    style: cellStyle,
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 产能
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
    ref: "A9",
    style: cellStyle,
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 评审和缺陷
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
      // 发现缺陷数(发现缺陷数为0或者空，其他除了说明以外的值也需要为空)

      let foundDN = "";
      // 加权有效缺陷数
      let weightDN = "";
      // 功能点
      let funcPoint = "";
      // 缺陷密度
      let defectDensity = "";
      // 评审用时
      let reviewHour = "";
      // 评审效率
      let reviewRatio = "";
      if (ele.foundDN) {
        foundDN = ele.foundDN;
        if (ele.weightDN) {
          weightDN = ele.weightDN;
        }
        if (ele.funcPoint) {
          if (ele.kind === "codereview" || ele.funcPoint === "功能点" || ele.funcPoint === "代码量") {
            funcPoint = ele.funcPoint;
          } else {
            funcPoint = Number(ele.funcPoint).toFixed(2);
          }
        }
        if (ele.defectDensity) {
          if (ele.defectDensity === "加权有效问题率" || ele.defectDensity === "加权有效缺陷密度") {
            defectDensity = ele.defectDensity;
          } else {
            defectDensity = Number(ele.defectDensity).toFixed(2);
          }
        }
        if (ele.reviewHour || ele.reviewHour === 0) {
          if (ele.reviewHour === "评审用时") {
            reviewHour = "评审用时";
          } else {
            reviewHour = ele.reviewHour === -999999 ? "0" : Math.abs(ele.reviewHour).toString();
          }
        }
        if (ele.reviewRatio) {
          if (ele.reviewRatio === "评审效率") {
            reviewRatio = ele.reviewRatio;
          } else {
            reviewRatio = Number(ele.reviewRatio).toFixed(2);
          }
        }
      }

      const currentRow: any = [
        ele.title,
        stage,
        cutFlag,
        foundDN,
        weightDN,
        funcPoint,
        defectDensity,
        reviewHour,
        reviewRatio, ele.description];
      rowData.push(currentRow);
    });
  }

  const tableInfo = {
    name: "reviewDefectTable",
    ref: "A13",
    style: cellStyle,
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 过程质量补充数据
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
    ref: "A31",
    style: cellStyle,
    columns: column,
    rows: rowData
  };

  return tableInfo;
};

// 服务
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
    ref: "A42",
    style: cellStyle,
    columns: column,
    rows: rowData
  };

  return tableInfo;
};


// 正则表达式验证table sheet名是否可用（不可用则进行处理）
const vertifyFileName = (stName: string) => {
  let sheetName = stName;
  // 工作表名规则：不能包含有 \  /  ?  *  [  ]  这几种特殊字符，名称的开始和结尾不能有单引号
  if (stName.startsWith("'") || stName.endsWith("'")) {
    sheetName = stName.replaceAll("'", "")
  }

  // 正则表达式匹配 \  /  ?  *  [  ]
  const reg = /\/|\?|\*|\[|\]|\\/g;
  sheetName = sheetName.replaceAll(reg, "-");

  return `${sheetName}_项目度量表_V1.0`;
};

export {
  getProjectQualityTable,
  getTestDataTable,
  getProcessTable,
  getStoryStabilityTable,
  getStageWorkloadTable,
  getProductRateTable,
  getReviewDefectTable,
  getProcessQualityTable,
  getServiceTable,
  vertifyFileName
}
