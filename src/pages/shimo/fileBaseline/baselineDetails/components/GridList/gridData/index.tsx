import {axiosGet} from "@/publicMethods/axios";

const getParentPathByChild = (data: any, nodeName: any, indexArray: any, rt_all: any) => {

  for (let i = 0, len = data.length; i < len; i += 1) {
    const current = data[i];
    indexArray.push(current.name);
    if (current.file_format !== "folder" && data[i].name === nodeName) {
      rt_all[`${(indexArray.length) + 1}_file`] = current.name;
      rt_all["author"] = current.author;
      rt_all["file_format"] = current.file_format;
    }

    if (data[i].name === nodeName) {
      return {indexArray, rt_all};
    }
    const {children} = data[i]
    if (children && children.length) {
      rt_all[`${(indexArray.length + 1)}_file`] = current.name;
      const result: any = getParentPathByChild(children, nodeName, indexArray, rt_all)
      if (result) {
        return {indexArray, rt_all};
      }
    }
    indexArray.pop()
  }

  return false;
};

// 递归解析数据
const getChildData = (oraData: any, childData: any, result: any, filedArrayLength: any) => {

  childData.forEach((field: any) => {
    if (field.file_format === "folder") { // 是文件夹，表示还有下一层children，继续遍历。
      getChildData(oraData, field.children, result, filedArrayLength);
    } else {
      // 获取父节点路径
      const rt_path: any = [];
      const rt_all: any = {};
      getParentPathByChild(oraData, field.name, rt_path, rt_all);
      result.push(rt_all);
      filedArrayLength.push(rt_path.length);
    }
  });

};
//
const getGridDataAndColumns = (data: any) => {

  // 文件和基线时间要用最大的列数
  // parent是一定有的(一级目录)。
  const firstContent = {"1_file": data.parent?.name};
  // 判断file_format 类型是不是为folder，是的话就有下级目录。其他类型就没有下级目录
  if (data.parent?.file_format !== "folder") {
    return [firstContent];
  }

  const result: any = [];
  const filedArrayLength: any = [];
  if ((data.children) && (data.children).length > 0) {
    getChildData(data.children, data.children, result, filedArrayLength);
  }

  console.log("result", result, filedArrayLength);
  return result;
};

// 获取迭代数据
const getIterDetailsData = async (myGuid: any) => {
  const details = await axiosGet("/api/verify/shimo/version_detail", {guid: myGuid});
  return getGridDataAndColumns(details);

};

export {getIterDetailsData};
