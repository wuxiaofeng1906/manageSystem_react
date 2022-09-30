import ExcelJs from "exceljs";
import {vertifyFileName} from "./tableInfo/tableCreate";
import {indicator1SheetCreate, indicator2SheetCreate, indicator3SheetCreate} from "./tableInfo/sheetCreate";

// exceljs的说明文档： https://github.com/exceljs/exceljs/blob/master/README_zh.md

// Excel数据导出
export const exportToExcel = (data: any, title: string) => {
  const sheetName = vertifyFileName(title);
  // 1.创建工作薄
  const workbook = new ExcelJs.Workbook();
  // 2.添加sheeet(一共三个Tab 的数据分开显示)
  const indicator1Sheet = workbook.addWorksheet("度量指标1");
  indicator1SheetCreate(data[0], indicator1Sheet);

  const indicator2Sheet = workbook.addWorksheet("度量指标2");
  indicator2SheetCreate(data[1], indicator2Sheet);

  const indicator3Sheet = workbook.addWorksheet("度量指标3");
  indicator3SheetCreate(data[2], indicator3Sheet);

  // 表格的数据绘制完成，定义下载方法，将数据导出到Excel文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    const link = document.createElement("a");
    const blob = new Blob([buffer], {
      type: "application/vnd.ms-excel;charset=utf-8;"
    });
    link.download = `${sheetName}.xls`;
    link.href = URL.createObjectURL(blob);
    link.click();
  });
};


