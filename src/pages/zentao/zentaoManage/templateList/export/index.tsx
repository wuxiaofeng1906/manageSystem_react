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
  sheet.properties.defaultRowHeight = 18;
  // 默认列宽设置
  sheet.properties.defaultColWidth = 20;

  // 不同的类型有不同的表格
  const tempTable: any = getTempTable(data, tempType);

  sheet.addTable(tempTable);

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
