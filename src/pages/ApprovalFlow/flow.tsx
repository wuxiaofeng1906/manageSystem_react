/* region 基础控件 */

// 产品总监审批
const productDirectorApprove = (content: any) => {

};

// 架构评估审批
const archEvaluateApprove = (content: any) => {

};

// 项目负责人审批
const prjPrincipalApprove = (content: any) => {

};

// SQA规范检查
const sqaSpecificateCheck = (content: any) => {

};
/* endregion   */


/* region 不同变更类型组装不同的控件 */
// 需求变更
const storyChange = (datas: any, isModify: boolean) => {

  if (isModify) {
    return <div> 涉及到交互修改</div>
  }

  return <div> 没有涉及到交互修改！</div>

};

// 交互变更
const interactiveChange = (datas: any) => {

  return <div></div>
};

// 方案设计变更
const designChange = (datas: any) => {

  return <div></div>
};

// 交互变更
const moduleInterfaceChange = (datas: any) => {

  return <div></div>
};

// 开发计划变更
const devPlanChange = (datas: any) => {

  return <div></div>
};

// 测试计划变更
const testPlanChange = (datas: any) => {

  return <div></div>
};

/* endregion   */

// 获取不同类型的div
const getFlowDIv = (type: string, datas: any) => {
  let flowDivResult: JSX.Element = <div></div>;

  switch (type) {
    case"需求变更-不涉及交互修改":
      flowDivResult = storyChange(datas, false);
      break;

    case"需求变更-涉及交互修改":
      flowDivResult = storyChange(datas, true);
      break;

    case"交互变更":
      flowDivResult = interactiveChange(datas);
      break;

    case"方案设计变更":
      flowDivResult = designChange(datas);
      break;

    case"模型接口变更":
      flowDivResult = moduleInterfaceChange(datas);
      break;

    case"开发计划变更":
      flowDivResult = devPlanChange(datas)
      break;

    case"测试计划变更":
      flowDivResult = testPlanChange(datas)
      break;

    default:
      break;

  }


  return flowDivResult;
};


export {getFlowDIv}
