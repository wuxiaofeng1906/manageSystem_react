/* region 各个指标的Table定义 */
// 1.进度指标数据
import dayjs from "dayjs";

// 上线前检查模板
const getOnlineCheckTempTable = (data: any) => {
  const column = [
    {name: "编号"}, {name: "所属执行"}, {name: "所属模块"}, {name: "相关研发需求"},
    {name: "任务名称"}, {name: "任务描述"}, {name: "任务类型"}, {name: "优先级"},
    {name: "预计开始"}, {name: "实际开始"}, {name: "截止日期"}, {name: "任务状态"},
    {name: "最初预计"}, {name: "总计消耗"}, {name: "预计剩余"}, {name: "抄送给"},
    {name: "进度"}, {name: "由谁创建"}, {name: "创建日期"}, {name: "指派给"},
    {name: "指派日期"}, {name: "由谁完成"}, {name: "实际完成"}, {name: "由谁取消"},
    {name: "取消时间"}, {name: "由谁关闭"}, {name: "关闭时间"}, {name: "关闭原因"},
    {name: "最后修改"}, {name: "最后修改日期"}, {name: "所属端"}, {name: "子状态"},
    {name: "任务来源"}, {name: "附件"}

  ];

  const rowData: any = [["还","在","测","试","中"],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]];
  if (data && data.length > 0) {
    // data.forEach((ele: any) => {
    //   // 实际完成时间
    //   let actualEnd = "";
    //   if (ele.actualEnd && ele.actualEnd !== "0000-00-00") {
    //     actualEnd = dayjs(ele.actualEnd).format("YYYY-MM-DD");
    //   }
    //
    //   const currentRow: any = [ele.title, ele.description];
    //   rowData.push(currentRow);
    // });
  }

  return {column, rowData};
};

// 项目模板
const getProjectTempTable = (data: any) => {

  const column = [
    {name: "所属执行"}, {name: "所属模块"}, {name: "相关需求"},
    {name: "指派给"}, {name: "任务名称"}, {name: "任务描述"}, {name: "任务类型"},
    {name: "优先级"}, {name: "最初预计"}, {name: "预计开始"}, {name: "截止日期"},
    {name: "所属端"}, {name: "任务来源"}];

  const rowData: any = [];
  if (data && data.length > 0) {
    // data.forEach((ele: any) => {
    //
    //   const currentRow: any = [
    //     ele.title, ele.milestone, ele.description];
    //
    //   rowData.push(currentRow);
    // });
  }

  return {column, rowData};
};

//
const getTempTable = (data: any, tempType: string) => {

  let column = [];
  let rowData = [];

  // 根据不同的模板类型解析不同的数据和表格内容
  if (tempType === "auxiliaryReleaseCheck" || tempType === "comprehensiveReleaseCheck") {
    const tbInfo = getOnlineCheckTempTable(data);
    column = tbInfo.column;
    rowData = tbInfo.rowData;
  } else {
    const tbInfo = getProjectTempTable(data);
    column = tbInfo.column;
    rowData = tbInfo.rowData;
  }

  const tableInfo = {
    name: "processTable", // 表格名称
    ref: "A1",
    style: {
      theme: 'TableStyleMedium9',
      showRowStripes: true,  // 用交替的背景色显示行
    },
    columns: column,
    rows: rowData,
  };

  return tableInfo;
};
/* endregion */

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

  return sheetName;
};

export {
  getTempTable,
  vertifyFileName
}
