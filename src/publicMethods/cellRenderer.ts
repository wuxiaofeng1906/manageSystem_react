const numberRenderToYesNo = (params: any) => {
  if (params.value === null || params.value === undefined) {
    return "";
  }
  if (params.value === "0") {
    if (params.data.stage === 8) {
      return `<span style="text-decoration:line-through"> 否 </span>`;
    }
    return "否";
  }
  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> 是 </span>`;
  }
  return "是";
};

const numberRenderTopass = (params: any) => {
  if (params.value === null || params.value === undefined) {
    return "";
  }
  if (params.value === "0") {
    if (params.data.stage === 8) {
      return `<span style="text-decoration:line-through"> 未通过 </span>`;
    }
    return "未通过";
  }
  if (params.value === "1") {
    if (params.data.stage === 8) {
      return `<span style="text-decoration:line-through"> 验证通过 </span>`;
    }
    return "验证通过";
  }
  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> 无需验证 </span>`;
  }
  return "无需验证";
};

const numberRenderToCurrentStage = (params: any) => {
  let stage = "";

  if (params.value !== null && params.value !== undefined) {
    switch (params.value.toString()) {
      case "1":
        stage = "未开始";
        break;
      case "2":
        stage = "开发中";
        break;
      case "3":
        stage = "开发完";
        break;
      case "4":
        stage = "已提测";
        break;
      case "5":
        stage = "测试中";
        break;
      case "6":
        stage = "TE测试环境已验过";
        break;
      case "7":
        stage = "UED测试环境已验过";
        break;
      case "8":
        stage = "已取消";
        break;
      case "9":
        stage = "开发已revert";
        break;
      case "10":
        stage = "测试已验证revert";
        break;
      case "11":
        stage = "灰度已验过";
        break;
      case "12":
        stage = "线上已验过";
        break;

      default:
        break;
    }

  }

  return stage;

};


const stageForLineThrough = (params: any) => {
  if (params.value === null || params.value === undefined) {
    return "";
  }
  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> ${params.value} </span>`;
  }
  return params.value;

};


const numberRenderToCurrentStageForColor = (params: any) => {
  let stage = "";

  if (params.value !== null && params.value !== undefined) {
    switch (params.value.toString()) {
      case "1":
        stage = "未开始";
        break;
      case "2":
        stage = "开发中";
        break;
      case "3":
        stage = "开发完";
        break;
      case "4":
        stage = "已提测";
        break;
      case "5":
        stage = "测试中";
        break;
      case "6":
        stage = "TE测试环境已验过";
        break;
      case "7":
        stage = "UED测试环境已验过";
        break;
      case "8":
        stage = "已取消";
        break;
      case "9":
        stage = "开发已revert";
        break;
      case "10":
        stage = "测试已验证revert";
        break;
      case "11":
        stage = "灰度已验过";
        break;
      case "12":
        stage = "线上已验过";
        break;

      default:
        break;
    }

  }


  if (stage === "未开始") {
    return `<span style="color: red"> ${stage} </span>`;
  }
  if (stage === "已取消") {
    return `<span style="text-decoration:line-through"> ${stage} </span>`;
  }
  return stage;

};

const stageChangeToNumber = (params: string) => {

  let stageNum = -1;

  if (params !== null && params !== undefined) {
    switch (params.toString()) {
      case "未开始":
        stageNum = 1;
        break;
      case "开发中":
        stageNum = 2;
        break;
      case "开发完":
        stageNum = 3;
        break;
      case "已提测":
        stageNum = 4;
        break;
      case "测试中":
        stageNum = 5;
        break;
      case "TE测试环境已验过":
        stageNum = 6;
        break;
      case "UED测试环境已验过":
        stageNum = 7;
        break;
      case "已取消":
        stageNum = 8;
        break;
      case "开发已revert":
        stageNum = 9;
        break;
      case "测试已验证revert":
        stageNum = 10;
        break;
      case "灰度已验过":
        stageNum = 11;
        break;
      case "线上已验过":
        stageNum = 12;
        break;

      default:
        break;
    }
  }

  return stageNum;
};

const numberRenderToZentaoType = (params: any,) => {
  // BUG = 1,
  // TASK = 2,
  // STORY = 3,
  let type = "";
  switch (params.value) {
    case "1":
      type = "Bug";
      break;
    case "2":
      type = "Task";
      break;
    case "3":
      type = "story";
      break;
    default:
      break;
  }

  return type;
};

const numberRenderToZentaoTypeForLine = (params: any,) => {
  // BUG = 1,
  // TASK = 2,
  // STORY = 3,
  let type = "";
  switch (params.value) {
    case "1":
      type = "Bug";
      break;
    case "2":
      type = "Task";
      break;
    case "3":
      type = "Story";
      break;
    default:
      break;
  }

  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> ${type} </span>`;

  }
  return type;
};

const numberRenderToZentaoSeverity = (params: any) => {

  // P0 = 1,
  //  P1 = 2,
  //  P2 = 3,
  //  P3 = 4,
  let severity = "";
  switch (params.value) {
    case "1":
      severity = "P0";
      break;
    case "2":
      severity = "P1";
      break;
    case "3":
      severity = "P2";
      break;
    case "4":
      severity = "P3";
      break;
    default:
      break;
  }

  return severity;
};

const numRenderForSevAndpri = (params: any) => {
  let severity = "";
  switch (params.value) {
    case "1":
      severity = "P0";
      break;
    case "2":
      severity = "P1";
      break;
    case "3":
      severity = "P2";
      break;
    case "4":
      severity = "P3";
      break;
    default:
      break;
  }


  return severity;
};

const numRenderForSevAndpriForLine = (params: any) => {
  let severity = "";
  switch (params.value) {
    case "1":
      severity = "P0-";
      break;
    case "2":
      severity = "P1-";
      break;
    case "3":
      severity = "P2-";
      break;
    case "4":
      severity = "P3-";
      break;
    default:
      break;
  }
  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through">  ${severity}${params.data.priority}级 </span>`;
  }

  return `${severity}${params.data.priority}级`;
};


const numberRenderToZentaoStatus = (params: any) => {

  let status = "";
  switch (params.value) {
    case "active":
      status = "激活";
      break;
    case "closed":
      status = "已关闭";
      break;
    case "verified":
      status = " 已验证";
      break;
    case "resolved":
      status = "已解决";
      break;
    case "wait":
      status = "未开始";
      break;
    case "doing":
      status = "进行中";
      break;
    case "done":
      status = "已完成";
      break;
    case "pause":
      status = "已暂停";
      break;
    case "cancel":
      status = "已取消";
      break;
    case "changed":
      status = "已更改";
      break;
    case "draft":
      status = "已草拟";
      break;
    default:
      break;
  }
  return status;
};

const numberRenderToZentaoStatusForRed = (params: any) => {

  let status = "";
  switch (params.value) {
    case "active":
      status = "激活";
      break;
    case "closed":
      status = "已关闭";
      break;
    case "verified":
      status = " 已验证";
      break;
    case "resolved":
      status = "已解决";
      break;
    case "wait":
      status = "未开始";
      break;
    case "doing":
      status = "进行中";
      break;
    case "done":
      status = "已完成";
      break;
    case "pause":
      status = "已暂停";
      break;
    case "cancel":
      status = "已取消";
      break;
    case "changed":
      status = "已更改";
      break;
    case "draft":
      status = "已草拟";
      break;
    default:
      break;
  }

  if (status === "激活" || status === "未开始") {
    if (params.data.stage === 8) {
      return `<span style="color: red;text-decoration:line-through"> ${status} </span>`;
    }
    return `<span style="color: red"> ${status} </span>`;
  }

  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> ${status} </span>`;
  }
  return status;
};

const numberRenderToSource = (params: any) => {
  // WAIT = 1,
  // DOING,
  // DONE,
  // PAUSE,
  // CANCEL,
  // CLOSED,
  let source = "";
  switch (params.value) {
    case "1":
      source = "《产品hotfix申请》";
      break;
    case "2":
      source = "《UED-hotfix申请》";
      break;
    case "3":
      source = "《开发hotfix申请》";
      break;
    case "4":
      source = "《emergency申请》";
      break;
    case "5":
      source = "《开发热更新申请》";
      break;
    case "6":
      source = "禅道自动写入";
      break;
    case "7":
      source = "手工录入";
      break;
    default:
      break;
  }

  if (params.data.stage === 8) {
    return `<span style="text-decoration:line-through"> ${source} </span>`;
  }

  return source;
};

const linkToZentaoPage = (params: any) => {

  let ztCategory = "bug";
  switch (params.data.category) {
    case "1":
      ztCategory = "bug";
      break;
    case "2":
      ztCategory = "task";
      break;
    case "3":
      ztCategory = "story";
      break;
    default:
      break;
  }

  if (params.data.stage === 8) {
    // return `<span style="text-decoration:line-through"> ${type} </span>`;
    return `<a target="_blank" style="color:blue;text-decoration: line-through" href='http://zentao.77hub.com/zentao/${ztCategory}-view-${params.value}.html'>${params.value}</a>`;
  }
  return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${ztCategory}-view-${params.value}.html'>${params.value}</a>`;

};

const moduleChange = (params: string) => {

  let module = "";
  switch (params) {
    case "1":
      module = "前端";
      break;
    case "2":
      module = "后端";
      break;
    case "3":
      module = "测试";
      break;
    case "4":
      module = "产品";
      break;
    case "5":
      module = "其他";
      break;
    default:
      break;
  }

  return module;
};


function colorRender(params: any) {
  if (params.value === "" || params.value === undefined || Number(params.value) === 0 || Number(params.value) === 0.00)
    return ` <span style="color: Silver  ">  ${0} </span> `;
  return params.value;  // 为了将聚合函数实现格式化
}

export {
  numberRenderToYesNo,
  numberRenderTopass,
  numberRenderToCurrentStage,
  numberRenderToZentaoType,
  numberRenderToZentaoTypeForLine,
  numberRenderToZentaoSeverity,
  numRenderForSevAndpriForLine,
  numberRenderToZentaoStatus,
  numberRenderToSource,
  linkToZentaoPage,
  moduleChange,
  colorRender,
  numberRenderToZentaoStatusForRed,
  numberRenderToCurrentStageForColor,
  stageChangeToNumber,
  stageForLineThrough,
  numRenderForSevAndpri,

};

