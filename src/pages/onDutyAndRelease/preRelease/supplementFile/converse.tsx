// 是否的转化
const getIfOrNot = (idStr: string) => {
  let name = "";
  if (idStr === "1") {
    name = "是";
  } else if (idStr === "2") {
    name = "否";
  }
  // else {
  //   // 还有一种9的情况 ，显示为空即可
  // }

  return name;
};

// 通过的转化
const getPassOrNot = (idStr: string) => {
  let name = "";
  if (idStr === "1") {
    name = "通过";
  } else if (idStr === "2") {
    name = "不通过";
  }
  // else {
  //   // 还有一种9的情况 ，显示为空即可
  // }

  return name;
};


// 发布项转化
const getReleaseItem = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "前端";
      break;
    case "2":
      name = "前端镜像";
      break;
    case "3":
      name = "后端";
      break;
    case "4":
      name = "后端镜像";
      break;
    case "5":
      name = "流程";
      break;
    case "6":
      name = "流程镜像";
      break;
    default:
      break;

  }

  return name;
};

// 是否涉及接口和数据库升级
const getDatabseAndApiUpgrade = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "否";
      break;
    case "2":
      name = "仅接口升级";
      break;
    case "3":
      name = "仅数据库升级";
      break;
    case "4":
      name = "接口与数据库同时升级";
      break;
    default:
      break;

  }

  return name;
};

// 接口method
const getApiMethod = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "get";
      break;
    case "2":
      name = "put";
      break;
    case "3":
      name = "post";
      break;
    case "4":
      name = "delete";
      break;
    case "5":
      name = "patch";
      break;
    default:
      break;

  }

  return name;
};

// 升级接口
const getUpgradeApi = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "前端接口";
      break;
    case "2":
      name = "后端接口";
      break;
    case "3":
      name = "流程接口";
      break;
    default:
      break;

  }

  return name;
};

// 上线环境
const getOnlineDev = (idStr: string) => {

  const devArray = idStr.split(",");
  let returnValue = "";
  devArray.forEach((ele: string) => {
    let name = "";
    switch (ele) {
      case "1":
        name = "global";
        break;
      case "2":
        name = "集群1";
        break;
      case "3":
        name = "集群2";
        break;
      case "4":
        name = "集群3";
        break;
      case "5":
        name = "集群4";
        break;
      case "6":
        name = "集群5";
        break;
      case "7":
        name = "集群6";
        break;

      case "9":
        name = "";
        break;

      default:
        break;

    }

    returnValue = returnValue === "" ? name : `${returnValue},${name}`;
  });


  return returnValue;
};

// 修复类型
const getRepaireType = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "After";
      break;
    case "2":
      name = "Before";
      break;
    case "3":
      name = "Recover";
      break;
    case "4":
      name = "接口";
      break;
    default:
      break;

  }

  return name;
};

// 修复类型
const getTechSide = (idStr: string) => {
  let name = "";
  switch (idStr) {
    case "1":
      name = "前端";
      break;
    case "2":
      name = "后端";
      break;
    case "3":
      name = "前后端";
      break;
    default:
      break;

  }

  return name;
};

export {
  getReleaseItem, getIfOrNot, getDatabseAndApiUpgrade, getApiMethod, getUpgradeApi,
  getOnlineDev, getRepaireType, getPassOrNot, getTechSide
}
