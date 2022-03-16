import * as XLSX from "xlsx";
import {getTempColumns} from "../gridMethod/columns";

// 解析excel的数据
const loadExcelData = async (file: any) => {

  const result = {
    message: "",
    data: []
  };

  // fileReader.onload 是异步的，需要进行处理
  return new Promise(function (returnValue, reject) {

    const fileReader = new FileReader();  // 通过FileReader对象读取文件
    fileReader.readAsBinaryString(file);   // 以二进制方式打开文件

    fileReader.onload = (event: any) => {
      try {
        const excelData = event.target?.result;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(excelData, {type: 'binary'});
        // 存储获取到的数据
        let resultData: any = [];
        // 遍历每张工作表进行读取
        Object.keys(workbook.Sheets).forEach((sheet: string, index: number) => {
          if (index === 0) { // 只获取第一个sheet的数据
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            resultData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          }
        });

        result.data = resultData;
        returnValue(result); // 返回值
      } catch (e) {
        result.message = e;
        returnValue(result);  // 返回值
      }
    };
  })
};

// 根据已经定义的列获取对应字段和name
const getColumnsField = () => {
  const field = getTempColumns();
  const fieldObject = {};
  field.forEach((column: any) => {
    fieldObject[column.headerName] = column.field;
  });

  return fieldObject;
}

// 获取数据对应gird格式
const getGridDataFromExcel = (excelData: any) => {

  if (!excelData || excelData.length === 0) {
    return [];
  }
  const gridColumn: any = getColumnsField();
  const gridData: any = [];

  excelData.forEach((dts: any) => {
    const gridObject = {};
    Object.keys(dts).forEach((key: string) => {
       const field = gridColumn[key]; // 获取表格对应的name
      if (field) { // 如果界面有相关的列才添加，没有就不管

        if (key === "任务名称") { // 根据任务名称判断添加的类型  是子任务还是新增
          if ((dts[key].toString()).startsWith('>')) {
            gridObject[gridColumn["增加类型"]] = "子任务";
          } else {
            gridObject[gridColumn["增加类型"]] = "新增";
          }
         }

        gridObject[field] = dts[key];  // 添加具体数据
      }
    });

    gridData.push(gridObject);
  });

  return gridData;
};
export {loadExcelData, getGridDataFromExcel};
