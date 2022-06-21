import {axiosGet} from "@/publicMethods/axios";
import {getColumns} from "../columns";
import {errorMessage} from "@/publicMethods/showMessages";

// 根据拿到的最后一层文件获取之前的路径
const getParentPathByChild = (data: any, node: any, rt_pathArray: any, rt_allGrid: any, rt_basetimeArray: any) => {
  // 忽略掉对rt_allGrid的检查
  /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["rt_allGrid"] }] */
  for (let i = 0, len = data.length; i < len; i += 1) {
    const current = data[i];
    rt_pathArray.push(current.name);

    // 需要同时判断文件名字和文件格式以及父id
    if (current.file_format !== "folder" && data[i].name === node.name && data[i].file_format === node.file_format&& data[i].parent === node.parent) {
      const fileOrder = (rt_pathArray.length) + 1;
      // 需要先删除掉rt_allGrid中>currentIndex的file，如果不删除，之前的数据会依旧存在rt_allGrid中
      const gridKeys = Object.keys(rt_allGrid);
      gridKeys.forEach((keys: string) => {
        if (keys.indexOf("_file")) {
          const num = keys.replace("_file", "");
          if (num > fileOrder) {
            delete rt_allGrid[`${num}_file`];
          }
        }
      });

      rt_allGrid[`${fileOrder}_file`] = current.name;
      rt_allGrid["author"] = current.author;
      rt_allGrid["file_format"] = current.file_format;
      rt_allGrid["file_url"] = current.file_url;
      rt_allGrid["file_type"] = current.file_type;
      rt_allGrid["guid"] = current.guid;
      // rt_allGrid["execution_save_version"] = current.execution_save_version;

      //   获取version
      const baseLineInfo = current.version;
      rt_allGrid["version_id"] = baseLineInfo.version_id;
      rt_allGrid["is_save_version"] = baseLineInfo.is_save_version;
      rt_allGrid["remark"] = baseLineInfo.remark;
      rt_allGrid["zt_num"] = baseLineInfo.zt_num;
      const baseInfo = baseLineInfo.save_version_data;

      baseInfo.forEach((ele: any, index: number) => {
        rt_allGrid[`${index + 1}_time`] = ele.save_time;
        rt_allGrid[`${index + 1}_saveTimeId`] = ele.save_id; // saveId用于删除当前版本的作用
        // 基线人和基线标识都取最后一个
        if (index === baseInfo.length - 1) {

          rt_allGrid["baseUser"] = ele.save_version_user_name;
          rt_allGrid["baseFlag"] = ele.save_logo;
        }
      });

      rt_basetimeArray.push(baseInfo.length);

      return {rt_pathArray, rt_allGrid, rt_basetimeArray};
    }

    // if (data[i].name === nodeName) {
    //   return {rt_pathArray, rt_allGrid, rt_basetimeArray};
    // }
    const {children} = data[i]
    if (children && children.length) {
      rt_allGrid[`${(rt_pathArray.length + 1)}_file`] = current.name;
      const result: any = getParentPathByChild(children, node, rt_pathArray, rt_allGrid, rt_basetimeArray);
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

      getParentPathByChild(oraData, field, rt_pathArray, rt_allGrid, rt_basetimeArray);

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

// 文件路径各文件排序（没有数字开头的按字母降序，有数字开头的按数字降序）
const sortFileData = (oraData: any, filedArray: any) => {

  const arraySort = filedArray.sort((a: number, b: number) => {
    return b - a
  });
  const maxCount = arraySort[0];

  let newData: any = oraData;
  for (let index = 0; index < maxCount; index += 1) {
    newData = newData.sort((a: any, b: any) => {

      const keys = `${index + 1}_file`;
      if (b[`${index}_file`] === a[`${index}_file`]) { // 如果上一级文件相等，则调整下一个文件的位置，否则，不调整。
        if (Object.keys(a).indexOf(keys) > -1 && Object.keys(b).indexOf(keys) > -1) {
          const rt = b[keys].localeCompare(a[keys]);
          return rt;
        }
      }

      return 0;  // 0 为保持原样
    });
  }
  return newData;
};
// 文件路径的列定义
const getFileColumns = (filedArray: any) => {

  const arraySort = filedArray.sort((a: number, b: number) => {
    return b - a
  });
  const maxCount = arraySort[0];
  const columns: any = [];

  // 如果目录大于4级时，则需要收缩
  if (maxCount > 3) {   // 因为还有一个一级目录需要算上，一共4级才收缩
    columns.push({
      headerName: '1级目录',
      field: '1_file',
      pinned: 'left',
      columnGroupShow: 'open',
      minWidth: 100,
      suppressMenu: false,
    }, {
      headerName: `${maxCount + 1}级目录`,
      field: `final_files`,
      pinned: 'left',
      columnGroupShow: 'closed',
      minWidth: 110,
      suppressMenu: false,
    });
  } else {
    columns.push({
      headerName: '1级目录',
      field: '1_file',
      pinned: 'left',
      minWidth: 100,
      suppressMenu: false,
    });
  }

  for (let index = 2; index <= maxCount + 1; index += 1) {
    if (maxCount > 3) {
      columns.push({
        headerName: `${index}级文件`,
        field: `${index}_file`,
        pinned: 'left',
        columnGroupShow: 'open',
        minWidth: 100,
        suppressMenu: false,
      })
    } else {
      // <= 4层的正常展示
      columns.push({
        headerName: `${index}级文件`,
        field: `${index}_file`,
        pinned: 'left',
        minWidth: 100,
        suppressMenu: false,
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
      headerName: `最新基线时间`,
      field: `final_times`,
      columnGroupShow: 'closed',
      minWidth: 120,
    });
  }

  for (let index = 1; index <= maxCount; index += 1) {
    const baseObject = {
      headerName: `${index}次基线时间`,
      field: `${index}_time`,
      minWidth: 120,
      editable: () => {
        if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
          return true;
        }
        return false;
      }
    };

    if (maxCount > 4) {
      baseObject["columnGroupShow"] = 'open';
    }
    columns.push(baseObject);
  }

  return columns;
};


// 获取迭代数据
const getIterDetailsData = async (fileType: string, executionId: any) => {

  const detailsArray = await axiosGet("/api/verify/shimo/version_detail", {
    file_type: fileType,
    execution_id: executionId
  });
  if (!detailsArray || detailsArray.length === 0 || JSON.stringify(detailsArray) === "{}") {
    return {};
  }

  try {
    let gridData: any = [];

    let allFiledArrayLength: any = []; // 记录所有文件最大长度
    let allBasetimeLength: any = []; // 记录所有文件最大长度

    detailsArray.forEach((details: any) => {


      const gridResult: any = []; // 记录数据
      const filedArrayLength: any = []; // 记录文件最大长度
      const basetimeLength: any = []; // 记录文件最大长度

      if ((details.children) && (details.children).length > 0) {
        getChildData(details.children, details.children, gridResult, filedArrayLength, basetimeLength);
      }
      // 数据
      let grid_data = contactResult(gridResult, details.parent?.name);
      grid_data = sortFileData(grid_data, filedArrayLength);

      // 拼接多个项目的数据
      gridData = gridData.concat(grid_data);
      allFiledArrayLength = allFiledArrayLength.concat(filedArrayLength); // 最大的文件列
      allBasetimeLength = allBasetimeLength.concat(basetimeLength); // 最大的基线时间列
    });

    // 文件和基线时间要用最大的列数
    // 获取文件的列
    const fileColumns = getFileColumns(allFiledArrayLength);
    // 获取基线时间的列
    const basetimeColumns = getBaseTimeColumns(allBasetimeLength);

    return {gridData, columnsData: getColumns(fileColumns, basetimeColumns)}
  } catch (e) {
    errorMessage(e);
    return {};
  }


};

export {getIterDetailsData};
