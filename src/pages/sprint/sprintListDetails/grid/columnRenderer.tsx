// 打删除线
import * as dayjs from "dayjs";

const textDecorateRender = (params: any) => {

  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="text-decoration:line-through"> ${params.value} </span>`;
  }
  return params.value;

};

// 阶段值转换
const stageValueGetter = (params: any) => {
  let stage = "";
  if (params.data?.stage) {
    stage = (params.data?.stage).toString();
  }

  const stageValue = {
    "1": "未开始",
    "2": "开发中",
    "3": "开发完",
    "4": "已提测",
    "5": "测试中",
    "6": "TE测试环境已验过",
    "7": "UED测试环境已验过",
    "8": "已取消",
    "9": "开发已revert",
    "10": "测试已验证revert",
    "11": "灰度已验过",
    "12": "线上已验过"
  }
  return stageValue[stage];
};

// 阶段颜色渲染
const stageRenderer = (params: any) => {
  const stage = params.value;
  if (stage === "未开始") {
    return `<span style="color: red"> ${stage} </span>`;
  }
  if (stage === "已取消" || stage === "开发已revert" || stage === "测试已验证revert") {  //
    return `<span style="text-decoration:line-through"> ${stage} </span>`;
  }
  return stage;

};

// 测试值转换
const testerValueGetter = (params: any) => {
  const testArray = params.data?.tester;
  if (testArray && testArray.length > 0) {
    let testers = "";
    testArray.forEach((tester: any) => {
      testers = testers === "" ? tester.name : `${testers},${tester.name}`;
    });

    return testers
  }
  return "NA";
};

// 测试颜色渲染
const testerRenderer = (params: any) => {
  const testArray = params.value;
  let myColor = "gray"; // 测试验证：已验证为黑色，没验证为灰色
  const testConfirm = params.data?.testConfirmed;
  if (testConfirm === "1") {
    myColor = "black";
  }
  // if (!testArray || testArray.length === 0) {
  //   return `<span style="color: ${myColor}"> NA </span>`;
  // }
  // let testers = "";
  // testArray.forEach((tester: any) => {
  //   testers = testers === "" ? tester.name : `${testers},${tester.name}`;
  // });
  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="color: ${myColor};text-decoration:line-through"> ${testArray} </span>`;
  }
  return `<span style="color: ${myColor}"> ${testArray} </span>`;

};

// 测试确认值转换
const testConfirmValueGetter = (params: any) => {
  const testConfirme = params.data?.testConfirmed;
  if (testConfirme === "0" || testConfirme === null || testConfirme === undefined) {
    return "否";
  }
  return "是";
};

// 类型值转换
const catagoryValueGetter = (params: any) => {
  let type = "";
  if (params.data?.category) {
    type = (params.data?.category).toString();
  }

  const typeValue = {
    "1": "Bug",
    "2": "Task",
    "3": "Story",
    "-3": "B_Story",
  };
  return typeValue[type];
};
// 渲染禅道编号跳转到禅道
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
    case "-3":
      ztCategory = "story";
      break;
    default:
      break;
  }

  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<a target="_blank" style="color:blue;text-decoration: line-through" href='http://zentao.77hub.com/zentao/${ztCategory}-view-${params.value}.html'>${params.value}</a>`;
  }
  return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${ztCategory}-view-${params.value}.html'>${params.value}</a>`;

};

// 严重等级值的转换
const servertyValueGetter = (params: any) => {
  let severity = "";
  if (params.data?.severity !== null && params.data?.severity !== undefined) {
    switch (params.data?.severity.toString()) {
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
  }

  const pri = params.data.priority === null ? "" : params.data.priority;
  if (pri === "" && severity === "") {
    return "";
  }
  return `${severity}${pri}级`;
};

// 状态值的转换
const statusValueGetter = (params: any) => {
  let status = "";
  if (params.data?.ztStatus) {
    status = (params.data?.ztStatus).toString();
  }

  const statusValue = {
    "active": "激活",
    "closed": "已关闭",
    "verified": "已验证",
    "resolved": "已解决",
    "wait": "未开始",
    "doing": "进行中",
    "done": "已完成",
    "pause": "已暂停",
    "cancel": "已取消",
    "changed": "已更改",
    "draft": "已草拟"
  };
  return statusValue[status];

};

// 状态渲染
const statusRenderer = (params: any) => {

  const status = params.value;
  if (params.data.category === "1" && status === "激活") {  // bug的激活要标红,其他类型的不标红

    if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
      return `<span style="color: red;text-decoration:line-through"> ${status} </span>`;
    }
    return `<span style="color: red"> ${status} </span>`;

  }

  // 所有类型的未开始要标红
  if (status === "未开始") {
    if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
      return `<span style="color: red;text-decoration:line-through"> ${status} </span>`;
    }
    return `<span style="color: red"> ${status} </span>`;
  }

  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="text-decoration:line-through"> ${status} </span>`;
  }
  return status;

};

// 指派人值获取
const assignedToValueGetter = (params: any) => {
  const assignedInfo = params.data?.assignedTo;
  if (assignedInfo) {
    return params.data?.assignedTo.name
  }
  return "";
};

// 解决完成人值的转换
const solvedByValueGetter = (params: any) => {
  const finishedBy = params.data?.finishedBy;
  if (finishedBy && finishedBy.length > 0) {
    let finishedBys = "";
    finishedBy.forEach((finisher: any) => {
      finishedBys = finishedBys === "" ? finisher.name : `${finishedBys},${finisher.name}`;
    });
    return finishedBys;
  }

  return "";
};

// 相关数量链接
const relatedNumberRender = (params: any) => {

  let count = 0;
  if (params.value) {
    count = Number(params.value);
  }

  // 如果是个数
  if (count < 500) {
    if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
      return `<a target="_blank" style="color:blue;text-decoration: line-through">${count}</a>`;
    }
    return `<a target="_blank" style="color:blue;text-decoration: underline">${count}</a>`;
  }

  // 如果是禅道id
  let zetaoType = "task";
  if (params.colDef.field === "relatedStories") {
    zetaoType = "story";
  }

  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<a target="_blank" style="color:blue;text-decoration: line-through" href='http://zentao.77hub.com/zentao/${zetaoType}-view-${count}.html'>${count}</a>`;
  }
  return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${zetaoType}-view-${count}.html'>${count}</a>`;
};

// 截止日期
const timestampRenderer = (params: any) => {

  let times;
  if (params.value) {
    times = dayjs(Number(params.value)).format("YYYY-MM-DD");

    const diffDay = dayjs(times).diff(dayjs(), 'day');  // diffDay 代表延期多少天（-1：延期1天）
    // 没延期
    if (diffDay >= 0) {
      if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
        return `<a target="_blank" style="color:blue;text-decoration: line-through">${times}</a>`;
      }
      return times;
    }


    // 延期了
    // 判断有没有超时，有超时则判断
    // BUG = 1,
    // TASK = 2,
    // STORY = 3,

    // 如果是bug，状态为 激活 的标红
    if (params.data.category === "1") {
      if (params.data.ztStatus === "active") {
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<a target="_blank" style="color:red;text-decoration: line-through">${times}</a>`;
        }
        return `<a target="_blank" style="color:red;">${times}</a>`;

      }

      if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
        return `<a target="_blank" style="color:black;text-decoration: line-through">${times}</a>`;
      }
      return times;
    }

    // 如果是task，状态为 未开始 或 进行中   的标红
    if (params.data.category === "2") {
      if (params.data.ztStatus === "wait" || params.data.ztStatus === "doing") {
        if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
          return `<a target="_blank" style="color:red;text-decoration: line-through">${times}</a>`;
        }
        return `<a target="_blank" style="color:red;">${times}</a>`;

      }

      if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
        return `<a target="_blank" style="color:black;text-decoration: line-through">${times}</a>`;
      }
      return times;
    }

    // 如果是story，则需求下任务延期了就延期（暂定不做）
    if (params.data.category === "3") {
      if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
        return `<a target="_blank" style="color:black;text-decoration: line-through">${times}</a>`;
      }
      return times;
    }

  }

  return "0000-00-00";
};

// 是否涉及XXX 值的转换
const isOrNotValueGetter = (value: any) => {

  if (value) {
    if (value === "-1" || value === "1") {
      return "是";
    }
    if (value === "-0" || value === "0") {
      return "否";
    }
  }

  return "";
};

// 是否需要测试验证
const testConfirmTooltipValueGetter = (params: any) => {
  const values = params.value;
  if (!values) {
    return "";
  }
  if (values === "-1") { // 手动：是
    return "手动生成";
  }
  if (values === "-0") { // 手动：否
    return "手动生成";
  }
  if (values === "0") { // 自动：否
    return "自动生成";
  }
  if (values === "1") { // 自动：是
    return "自动生成";
  }
  return values;
};

// 测试验证渲染
const testConfirmedRenderer = (params: any) => {
  // testCheck: 手动修改标识: "-1"、"-0";自动的是：0 ，1
  // 自动规则生成的‘是’默认黑色，自动规则生成的‘否’默认红色
  // 手动修改的‘是’默认紫色，手动修改的‘否’默认黄色
  const values = params.value;
  if (!values) {
    return "";
  }

  let result = "";
  let my_color = "";
  if (values === "-1") { // 手动：是
    result = "是";
    my_color = "purple";// 紫色
  } else if (values === "-0") { // 手动：否
    result = "否";
    my_color = "orange";// 黄色
  } else if (values === "0") { // 自动：否
    result = "否";
    my_color = "red";// 红色
  } else if (values === "1") { // 自动：是
    result = "是";
    my_color = "black";// 黑色
  }
  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="text-decoration:line-through"> ${result} </span>`;
  }
  return `<span style="color: ${my_color}"> ${result}  </span>`;
};

// 测试验证
const testVertifyFilter = (params: any) => {
  const testVertify = params.value;
  if (testVertify === "0") {
    return "否（自动）";
  }
  if (testVertify === "-0") {
    return "否（手动）";
  }
  if (testVertify === "1") {
    return "是（自动）";
  }
  if (testVertify === "-1") {
    return "是（手动）";
  }

  return testVertify;
};

// 已提测值转换
const proposedTestValueGetter = (params: any) => {
  if (params.data?.proposedTest === null || params.data?.proposedTest === undefined) {
    return "";
  }

  let value = "";
  switch (params.data?.proposedTest.toString()) {
    case "0":
      value = "否";
      break;
    case "1":
      value = "是";
      break;
    case "2":
      value = "免";
      break;
    case "3":
      value = "驳回修改中";
      break;
    default:
      break;
  }
  return value;
};


// 用户是否有感
const consumerAffectedRenderer = (params: any) => {
  //  默认是：红色。修改的是：橙色，否都为黑色。
  const values = params.value;
  if (!values) {
    return "";
  }

  let result = "";
  let my_color = "";
  if (values === "-1") { // 手动：是
    result = "是";
    my_color = "orange";// 橙色
  } else if (values === "-0" || values === "0") { // 手动：否
    result = "否";
    my_color = "black";// 黄色
  } else if (values === "1") { // 自动：是
    result = "是";
    my_color = "red";// 红色
  }
  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="text-decoration:line-through"> ${result} </span>`;
  }
  return `<span style="color: ${my_color}"> ${result}  </span>`;
};

// 验证结果
const vertifyResultValueGetter = (values: any) => {
  if (values === null || values === undefined) {
    return "";
  }
  if (values === "0") {
    return "未通过";
  }
  if (values === "1") {
    return "验证通过";
  }
  return "无需验证";
};
// 来源值的转换
const sourceValueGetter = (params: any) => {
  let source = "";
  if (params.data?.source) {
    source = (params.data?.source).toString();
  }

  const sourceValue = {
    "1": "《产品hotfix申请》",
    "2": "《UED-hotfix申请》",
    "3": "《开发hotfix申请》",
    "4": "《emergency申请》",
    "5": "《开发热更新申请》",
    "6": "禅道自动写入",
    "7": "手工录入",
    "8": "自动获取"

  }
  return sourceValue[source];
};

const timeRenderer = (params: any) => {

  if (params.value === null || params.value === undefined) {
    return "";
  }

  const times = dayjs(Number(params.value)).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
  if (params.data.stage === 8 || params.data.stage === 9 || params.data.stage === 10) {
    return `<span style="text-decoration:line-through"> ${times} </span>`;
  }
  return times;

};

export {
  textDecorateRender, stageValueGetter, stageRenderer, testerValueGetter, testerRenderer,
  testConfirmValueGetter, catagoryValueGetter, linkToZentaoPage, servertyValueGetter, consumerAffectedRenderer,
  statusValueGetter, statusRenderer, assignedToValueGetter, solvedByValueGetter, relatedNumberRender,
  timestampRenderer, isOrNotValueGetter, testConfirmTooltipValueGetter, testConfirmedRenderer,
  proposedTestValueGetter, testVertifyFilter,
  vertifyResultValueGetter, sourceValueGetter, timeRenderer
};
