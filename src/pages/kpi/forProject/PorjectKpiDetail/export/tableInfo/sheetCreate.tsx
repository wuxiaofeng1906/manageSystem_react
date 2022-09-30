import {
  getProjectQualityTable, getTestDataTable,
  getProcessQualityTable,
  getProcessTable, getProductRateTable, getReviewDefectTable, getServiceTable, getStageWorkloadTable,
  getStoryStabilityTable
} from "@/pages/kpi/forProject/PorjectKpiDetail/export/tableInfo/tableCreate";

// 设置标题的颜色为白色
const setTableTitleColor = (rowNum: number, sheet: any) => {
  const row = sheet.getRow(rowNum);
  row.font = {color: {argb: 'ffffff'}, bold: true};  // 这里的argb 值前面不能加 # ，不然程序无法识别
  row.commit();
};

// sheet1
export const indicator1SheetCreate = (data: any, newSheet: any) => {

  const sheet = newSheet;
  // 默认行高（默认值为15）
  sheet.properties.defaultRowHeight = 18;
  // 默认列宽设置
  sheet.properties.defaultColWidth = 20;

  /* region 设置表格的主要数据部分:表格内容 */

  // 项目质量
  const processTable: any = getProjectQualityTable(data.prjQualityData);
  sheet.addTable(processTable);

  // 测试数据
  // const storyStabilityTable: any = getTestDataTable(data.storyStabilityData);
  // sheet.addTable(storyStabilityTable);

  /* endregion */


  // 遍历行，设置对其方式和字体
  const rows = sheet.getRows(1, 70);
  rows?.forEach((ele: any) => {
    const row: any = ele;
    row.font = {name: "微软雅黑"};
    row.alignment = {vertical: 'middle', horizontal: 'center'};
    row.commit();
  });
  // 设置标题行的颜色
  [1, 2, 7, 8].forEach((ele: number) => {
    setTableTitleColor(ele, sheet);
  });

  // 按开始行，开始列，结束行，结束列合并

  // 项目质量列的合并
  sheet.mergeCells(1, 3, 1, 8); // 合并汇总
  sheet.mergeCells(1, 9, 1, 12); // 合并有效Bug数
  sheet.mergeCells(1, 13, 1, 16);// 合并Bug总数

  // 测试数据列合并
  sheet.mergeCells(7, 2, 7, 9); // 合并用例执行情况
  sheet.mergeCells(7, 10, 7, 14); // 合并Bug情况
  return sheet;
};

// sheet2
export const indicator2SheetCreate = (data: any, newSheet: any) => {

  const sheet = newSheet;
  // 默认行高（默认值为15）
  sheet.properties.defaultRowHeight = 18;
  // 默认列宽设置
  sheet.properties.defaultColWidth = 20;

  /* region 设置表格的主要数据部分:表格内容 */

  // 阶段工作量（单位：人天）
  const stageWorkloadTable: any = getStageWorkloadTable(data.stageWorkData);
  sheet.addTable(stageWorkloadTable);

  // 产能
  const prodtctRateTable: any = getProductRateTable(data.productCapacityData);
  sheet.addTable(prodtctRateTable);

  // 评审和缺陷
  const reviewDefectTable: any = getReviewDefectTable(data.reviewDefectData);
  sheet.addTable(reviewDefectTable);

  // 过程质量补充数据
  const processQualityTable: any = getProcessQualityTable(data.processQualityData);
  sheet.addTable(processQualityTable);

  // 服务
  const serviceTable: any = getServiceTable(data.serviceData);
  sheet.addTable(serviceTable);
  /* endregion */

  // 自定义列的宽度(本页面暂时无用，需要留着)
  // sheet.columns = sheet.columns.map((e: any) => {
  //   const expr = e.values[1];
  //   switch (expr) {
  //     case "说明":
  //     case "偏差原因":
  //       return {width: 30};
  //     case "Amount":
  //       return {width: 40};
  //     default:
  //       return {width: 15};
  //   }
  // });


  // 遍历行，设置对其方式和字体
  const rows = sheet.getRows(1, 70);
  rows?.forEach((ele: any) => {
    const row: any = ele;
    row.font = {name: "微软雅黑"};
    row.alignment = {vertical: 'middle', horizontal: 'center'};
    row.commit();
  });

  // 设置标题行的颜色
  [1, 9, 15, 13, 31, 42].forEach((ele: number) => {
    setTableTitleColor(ele, sheet);
  });
};

// sheet3
export const indicator3SheetCreate = (data: any, newSheet: any) => {

  const sheet = newSheet;
  // 默认行高（默认值为15）
  sheet.properties.defaultRowHeight = 18;
  // 默认列宽设置
  sheet.properties.defaultColWidth = 20;

  /* region 设置表格的主要数据部分:表格内容 */
  // 1.进度指标的表格
  const processTable: any = getProcessTable(data.milesProcessData);
  sheet.addTable(processTable);

  // 2.需求稳定性
  const storyStabilityTable: any = getStoryStabilityTable(data.storyStabilityData);
  sheet.addTable(storyStabilityTable);
  /* endregion */

  // 自定义列的宽度(本页面暂时无用，需要留着)
  // sheet.columns = sheet.columns.map((e: any) => {
  //   const expr = e.values[1];
  //   switch (expr) {
  //     case "说明":
  //     case "偏差原因":
  //       return {width: 30};
  //     case "Amount":
  //       return {width: 40};
  //     default:
  //       return {width: 15};
  //   }
  // });


  // 遍历行，设置对其方式和字体
  const rows = sheet.getRows(1, 70);
  rows?.forEach((ele: any) => {
    const row: any = ele;
    row.font = {name: "微软雅黑"};
    row.alignment = {vertical: 'middle', horizontal: 'center'};
    row.commit();
  });

  // 设置标题行的颜色
  [1, 9, 15, 23, 27, 45, 56].forEach((ele: number) => {
    setTableTitleColor(ele, sheet);
  });

};
