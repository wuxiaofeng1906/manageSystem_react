import * as XLSX from "xlsx";

// 解析excel的数据
const loadExcelData = async (file: any) => {

  const result = {
    message: "",
    data: []
  };

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
      })

      result.data = resultData;
      return result;
    } catch (e) {
      result.message = e;
      return result;
    }
  };

};


const getGridDataFromExcel = (excelData: any) => {

  // if (!excelData || excelData.length === 0) {
  //   return [];
  // }
  // debugger;
  console.log(excelData);
  // const gridData: any = [];
  // excelData.forEach((dts: any) => {
  //   debugger;
  //
  // });

  // return gridData;
};
export {loadExcelData, getGridDataFromExcel};
