import {axiosGet} from "@/publicMethods/axios";
import {getColumns} from "../columns";

const getParentPathByChild = (data: any, nodeName: any, rt_pathArray: any, rt_allGrid: any) => {

  for (let i = 0, len = data.length; i < len; i += 1) {
    const current = data[i];
    rt_pathArray.push(current.name);
    if (current.file_format !== "folder" && data[i].name === nodeName) {
      rt_allGrid[`${(rt_pathArray.length) + 1}_file`] = current.name;
      rt_allGrid["author"] = current.author;
      rt_allGrid["file_format"] = current.file_format;
    }

    if (data[i].name === nodeName) {
      return {rt_pathArray, rt_allGrid};
    }
    const {children} = data[i]
    if (children && children.length) {
      rt_allGrid[`${(rt_pathArray.length + 1)}_file`] = current.name;
      const result: any = getParentPathByChild(children, nodeName, rt_pathArray, rt_allGrid)
      if (result) {
        return {rt_pathArray, rt_allGrid};
      }
    }
    rt_pathArray.pop()
  }

  return false;
};

// 递归解析数据
const getChildData = (oraData: any, childData: any, gridResult: any, filedArrayLength: any) => {

  childData.forEach((field: any) => {
    if (field.file_format === "folder") { // 是文件夹，表示还有下一层children，继续遍历。
      getChildData(oraData, field.children, gridResult, filedArrayLength);
    } else {
      // 获取父节点路径
      const rt_pathArray: any = [];
      const rt_allGrid: any = {};
      getParentPathByChild(oraData, field.name, rt_pathArray, rt_allGrid);
      gridResult.push(rt_allGrid);
      filedArrayLength.push(rt_pathArray.length);
    }
  });

};
const contactResult = (oraData: any, firstName: string) => {
  const result: any = [];
  oraData.forEach((dts: any) => {
    const newObject = {...dts};
    newObject["1_file"] = firstName;
    result.push(newObject);
  });

  return result;
};

//
const getFileColumns = (filedArray: any) => {

  const arraySort = filedArray.sort((a: number, b: number) => {
    return b - a
  });

  const maxCount = arraySort[0];

  const columns: any = [{
    headerName: '1级目录',
    field: 'total',
    pinned: 'left',
    columnGroupShow: 'closed',
  }, {
    headerName: '1级目录',
    field: '1_file',
    pinned: 'left',
    columnGroupShow: 'open',
  }];
  for (let index = 2; index <= maxCount + 1; index += 1) {
    columns.push({
      headerName: `${index}级文件`,
      field: `${index}_file`,
      pinned: 'left',
      columnGroupShow: 'open',
    })
  }

  return columns;
};


// 获取迭代数据
const getIterDetailsData = async (myGuid: any) => {
  const details = await axiosGet("/api/verify/shimo/version_detail", {guid: myGuid});
  // 文件和基线时间要用最大的列数
  // parent是一定有的(一级目录)。
  const firstContent = {"1_file": details.parent?.name};
  // 判断file_format 类型是不是为folder，是的话就有下级目录。其他类型就没有下级目录
  if (details.parent?.file_format !== "folder") {
    return [firstContent];
  }

  const gridResult: any = []; // 记录数据
  const filedArrayLength: any = []; //记录文件最大长度
  if ((details.children) && (details.children).length > 0) {
    getChildData(details.children, details.children, gridResult, filedArrayLength);
  }
  // 数据
  const gridData = contactResult(gridResult, details.parent?.name);

  // 获取文件的列
  const fileColumns = getFileColumns(filedArrayLength);

  const columnsData = getColumns(fileColumns, []);

  return {gridData, columnsData}

};

export {getIterDetailsData};
