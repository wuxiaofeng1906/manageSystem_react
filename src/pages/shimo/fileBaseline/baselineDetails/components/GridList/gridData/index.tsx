import {axiosGet} from "@/publicMethods/axios";
import {getColumns} from "../columns";


const getParentPathByChild = (data: any, nodeName: any, rt_pathArray: any, rt_allGrid: any, rt_basetimeArray: any) => {
  // 忽略掉对rt_allGrid的检查
  /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["rt_allGrid"] }] */
  for (let i = 0, len = data.length; i < len; i += 1) {
    const current = data[i];
    rt_pathArray.push(current.name);
    if (current.file_format !== "folder" && data[i].name === nodeName) {
      // eslint-disable-next-line no-param-reassign
      rt_allGrid[`${(rt_pathArray.length) + 1}_file`] = current.name;
      rt_allGrid["author"] = current.author;
      rt_allGrid["file_format"] = current.file_format;
      rt_allGrid["file_url"] = current.file_url;
      rt_allGrid["file_type"] = current.file_type;
      rt_allGrid["guid"] = current.guid;
      //   获取version
      const baseLineInfo = current.version;
      rt_allGrid["version_id"] = baseLineInfo.version_id;
      rt_allGrid["is_save_version"] = baseLineInfo.is_save_version;
      rt_allGrid["remark"] = baseLineInfo.remark;
      rt_allGrid["zt_num"] = baseLineInfo.zt_num;
      const baseInfo = baseLineInfo.save_version_data;
      baseInfo.forEach((ele: any, index: number) => {
        rt_allGrid[`${index + 1}_time`] = ele.save_time;
        // 基线人和基线标识都取最后一个
        if (index === baseInfo.length - 1) {
          rt_allGrid["baseUser"] = ele.save_version_user_name;
          rt_allGrid["baseFlag"] = ele.save_logo;
        }
      });

      rt_basetimeArray.push(baseInfo.length);
    }

    if (data[i].name === nodeName) {
      return {rt_pathArray, rt_allGrid, rt_basetimeArray};
    }
    const {children} = data[i]
    if (children && children.length) {
      rt_allGrid[`${(rt_pathArray.length + 1)}_file`] = current.name;
      const result: any = getParentPathByChild(children, nodeName, rt_pathArray, rt_allGrid, rt_basetimeArray);
      if (result) {
        return {rt_pathArray, rt_allGrid, rt_basetimeArray};
      }
    }
    rt_pathArray.pop();
  }

  return false;
};

// 递归解析数据
const getChildData = (oraData: any, childData: any, gridResult: any, filedArrayLength: any, basetimeLength: any) => {

  childData.forEach((field: any) => {
    if (field.file_format === "folder") { // 是文件夹，表示还有下一层children，继续遍历。
      if (field.children) {
        getChildData(oraData, field.children, gridResult, filedArrayLength, basetimeLength);
      }

    } else {
      // 获取父节点路径
      const rt_pathArray: any = [];
      const rt_basetimeArray: any = [];
      const rt_allGrid: any = {};
      getParentPathByChild(oraData, field.name, rt_pathArray, rt_allGrid, rt_basetimeArray);

      gridResult.push(rt_allGrid);
      filedArrayLength.push(rt_pathArray.length);
      basetimeLength.push(rt_basetimeArray);
    }
  });

};

// 将（file和time）最后一条数据新增一个字段final_file和final_time
const contactResult = (oraData: any, firstName: string) => {
  const result: any = [];
  oraData.forEach((dts: any) => {

    const newObject = {...dts};
    newObject["1_file"] = firstName;
    // 需要判断tile和time最多有多少个
    let fileTitleCount = 0;
    let timeTitleCount = 0;

    const keys = Object.keys(newObject);
    keys.forEach((ele: any) => {
      if (ele.indexOf("_file") > -1) {
        fileTitleCount += 1;
      } else if (ele.indexOf("_time") > -1) {
        timeTitleCount += 1;
      }
    });

    // 此列是总计列，需要取最新的数据
    newObject["final_files"] = newObject[`${fileTitleCount}_file`];
    newObject["final_times"] = newObject[`${timeTitleCount}_time`];

    result.push(newObject);
  });

  return result;
};

// 文件路径的列定义
const getFileColumns = (filedArray: any) => {

  const arraySort = filedArray.sort((a: number, b: number) => {
    return b - a
  });
  const maxCount = arraySort[0];
  const columns: any = [];

  // 如果目录大于4级时，则需要收缩
  if (maxCount > 4) {
    columns.push({
      headerName: '1级目录',
      field: '1_file',
      pinned: 'left',
      columnGroupShow: 'open',
    }, {
      headerName: `${maxCount + 1}级目录`,
      field: `final_files`,
      pinned: 'left',
      columnGroupShow: 'closed',
    });
  } else {
    columns.push({
      headerName: '1级目录',
      field: '1_file',
      pinned: 'left'
    });
  }

  for (let index = 2; index <= maxCount + 1; index += 1) {
    if (maxCount > 4 && index > 4) {
      columns.push({
        headerName: `${index}级文件`,
        field: `${index}_file`,
        pinned: 'left',
        columnGroupShow: 'open',
      })
    } else {
      // <= 4层的正常展示
      columns.push({
        headerName: `${index}级文件`,
        field: `${index}_file`,
        pinned: 'left',
      })
    }

  }

  return columns;
};

// 获得基线时间的列
const getBaseTimeColumns = (timeArray: any) => {
  if (timeArray.length === 0) {
    return [];
  }

  const baseArray: any = [];
  timeArray.forEach((ele: any) => {
    baseArray.push(ele[0]);
  });
  const arraySort = baseArray.sort((a: number, b: number) => {
    return b - a
  });

  const maxCount = arraySort[0];
  const columns: any = [];
  // 超过4列则收缩
  if (maxCount > 4) {
    columns.push({
      headerName: `${maxCount}次基线时间`,
      field: `final_times`,
      columnGroupShow: 'closed',
    });
  }

  for (let index = 1; index <= maxCount; index += 1) {
    const baseObject = {
      headerName: `${index}次基线时间`,
      field: `${index}_time`,
    };

    if (maxCount > 4) {
      baseObject["columnGroupShow"] = 'open';
    }
    columns.push(baseObject);
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
  const filedArrayLength: any = []; // 记录文件最大长度
  const basetimeLength: any = []; // 记录文件最大长度

  if ((details.children) && (details.children).length > 0) {
    getChildData(details.children, details.children, gridResult, filedArrayLength, basetimeLength);
  }
  // 数据
  const gridData = contactResult(gridResult, details.parent?.name);

  // 获取文件的列
  const fileColumns = getFileColumns(filedArrayLength);
  // 获取基线时间的列
  const basetimeColumns = getBaseTimeColumns(basetimeLength);

  const columnsData = getColumns(fileColumns, basetimeColumns);

  return {gridData, columnsData}

};

export {getIterDetailsData};
