import ExcelJs from "exceljs";
import {
  getProcessTable, getStoryStabilityTable, getStageWorkloadTable,
  getProductRateTable, getReviewDefectTable, getProcessQualityTable, getServiceTable,vertifyFileName
} from "./tableInfo/tableCreate"

// exceljs的说明文档： https://github.com/exceljs/exceljs/blob/master/README_zh.md

// 写入文件
const writeFile = (fileName: any, content: any) => {
  const link = document.createElement("a");
  const blob = new Blob([content], {
    type: "application/vnd.ms-excel;charset=utf-8;"
  });
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  link.click();
};

// 设置标题的颜色为白色
const setTableTitleColor = (rowNum: number, sheet: any) => {
  const row = sheet.getRow(rowNum);
  row.font = {color: {argb: 'ffffff'}};  // 这里的argb 值前面不能加 # ，不然程序无法识别
  row.commit();
};

// Excel数据导出
const exportToExcel = (data: any, title: string) => {
  const sheetName = vertifyFileName(`项目指标-${title}`);
  // 1.创建工作薄
  const workbook = new ExcelJs.Workbook();

  // 2.添加工作表
  const sheet = workbook.addWorksheet(sheetName);
  // 默认行高（默认值为15）
  sheet.properties.defaultRowHeight = 18;
  // 默认列宽设置
  sheet.properties.defaultColWidth = 20;

  /* region 设置表格的主要数据部分:表格内容 */

  // 1.进度指标的表格
  const processTable: any = getProcessTable(data.processData);
  sheet.addTable(processTable);

  // 2.需求稳定性
  const storyStabilityTable: any = getStoryStabilityTable(data.storyStabilityData);
  sheet.addTable(storyStabilityTable);

  // 3.阶段工作量（单位：人天）
  const stageWorkloadTable: any = getStageWorkloadTable(data.stageWorkData);
  sheet.addTable(stageWorkloadTable);

  // 4.生产率
  const prodtctRateTable: any = getProductRateTable(data.productRateData);
  sheet.addTable(prodtctRateTable);

  // 5.评审和缺陷
  const reviewDefectTable: any = getReviewDefectTable(data.reviewDefectData);
  sheet.addTable(reviewDefectTable);

  // 6 过程质量补充数据
  const processQualityTable: any = getProcessQualityTable(data.processQualityData);
  sheet.addTable(processQualityTable);

  // 7.服务
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
    row.alignment = {vertical: 'middle', horizontal: 'left'};
    ele.commit();
  });

  // 设置标题行的颜色
  [1, 9, 15, 23, 27, 45, 56].forEach((ele: number) => {
    setTableTitleColor(ele, sheet);
  });

  // 按开始行，开始列，结束行，结束列合并
  // sheet.mergeCells(2, 1, 7, 1);

  // 表格的数据绘制完成，定义下载方法，将数据导出到Excel文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    writeFile(sheetName, buffer);
  });
};

export {exportToExcel}
