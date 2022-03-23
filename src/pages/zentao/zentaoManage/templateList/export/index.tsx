import ExcelJs from "exceljs";
import {
  getTempTable, vertifyFileName
} from "./tableInfo/tableCreate"
import {getTemplateDetails} from "@/pages/zentao/zentaoManage/editTemplate/gridMethod/girdData";

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

// Excel数据导出
const exportToExcel = (data: any, title: string, tempType: string) => {
  const sheetName = vertifyFileName(title);
  // 1.创建工作薄
  const workbook = new ExcelJs.Workbook();

  // 2.添加工作表
  const sheet = workbook.addWorksheet("任务");
  // 默认行高（默认值为15）
  sheet.properties.defaultRowHeight = 15;

  // 不同的类型有不同的表格
  const tempTable: any = getTempTable(data, tempType);
  sheet.addTable(tempTable);

  // 自定义列的宽度
  sheet.columns = sheet.columns.map((e: any) => {
    const expr = e.values[1];
    switch (expr) {
      case "任务名称":
      case "任务描述":
      case "相关需求":
      case "相关研发需求":
        return {width: 30};
      default:
        return {width: 10};
    }
  });
  // 如果是上线前检查模板就需要冻结列（从任务名称开始）
  if (tempType === "auxiliaryReleaseCheck" || tempType === "comprehensiveReleaseCheck") {
    sheet.views = [{state: 'frozen', xSplit: 5}];
  }

  // 设置行的属性
  const {rowCount} = sheet; // 获取有多少行
  const rows = sheet.getRows(1, rowCount);
  rows?.forEach((ele: any, index: number) => {
    const row: any = ele;
    if (index === 0) { // 标题行单独设置
      row.font = {name: "微软雅黑", size: "10px", color: {argb: 'ffffff'}};  // 这里的argb 值前面不能加 # ，不然程序无法识别
    } else {
      row.font = {name: "微软雅黑", size: "10px"};
      row.alignment = {vertical: 'middle', horizontal: 'left'};
    }
    row.commit();
  });


  // 表格的数据绘制完成，定义下载方法，将数据导出到Excel文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    writeFile(`${sheetName}.xls`, buffer);
  });
};

// 下载模板
const downloadTemplateToExcel = async (selectedRows: any) => {

  const tempInfo = [];
  const results: any = [];
  for (let index = 0; index < selectedRows.length; index += 1) {
    tempInfo.push({ // 添加模板名称和模板类型
      tempName: selectedRows[index].temp_name,
      tempType: selectedRows[index].temp_type,
    });
    //  获取数据
    results.push(getTemplateDetails(selectedRows[index].temp_id));
  }

  const tempDetails = await Promise.all(results);

  tempInfo.forEach((info: any, index: number) => {
    exportToExcel(tempDetails[index], info.tempName, info.tempType);
  });

};

export {downloadTemplateToExcel}
