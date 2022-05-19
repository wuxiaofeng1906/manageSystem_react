// 打删除线
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
export {textDecorateRender, stageValueGetter, stageRenderer};
