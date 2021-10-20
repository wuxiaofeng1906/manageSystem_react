/* region 基础控件 */

const applayTitle = (applicant: string, approveNo: string,) => {
  return <div>
    <div>申请人： {applicant} </div>
    <div>审批编号： {approveNo} </div>
    <div style={{marginTop: 15}}>审批流程：</div>
  </div>;
};

const approveCommonMethod = (title: string, content: any) => {

  let titleDiv = <div style={{marginTop:15}}>{title}</div>;
  if (content === undefined) {
    return titleDiv;
  }

  let contentDiv;

  // 只有一个人，则不显示会签或者或签
  if (content.length === 1) {
    if (content[0].sp_status === 2) {
      contentDiv = <div>
        <label style={{
          display: "inline-block",
          textAlign: "center",
          width: 90
        }}>{content[0].user_name}</label>
        <label style={{marginLeft: 150}}>已同意&nbsp;&nbsp;{content[0].sp_time}</label>
      </div>;
    } else {
      contentDiv = <div><label style={{
        display: "inline-block",
        textAlign: "center",
        width: 90
      }}> {content[0].user_name}</label></div>;
    }

    return <div>
      {titleDiv}
      {contentDiv}
    </div>
  }

  // 多人的话，状态都是一样的。。所以判断第一个即可 1：或签  2：会签
  if (content[0].approverattr === 1) {
    titleDiv = <div style={{marginTop:15}}>
      <label>{title}.</label>
      <label style={{color: "#46A0FC",marginTop:15}}>或签</label>
    </div>;
  } else if (content[0].approverattr === 2) {
    titleDiv = <div style={{marginTop:15}}>
      <label>{title}.</label>
      <label style={{color: "#46A0FC"}}>会签</label>
    </div>;
  }

  contentDiv = content.map((items: any) => {
      if (items.sp_status === 2) {
        return <div>
          <label style={{
            display: "inline-block",
            textAlign: "center",

            width: 90
          }}>{items.user_name}</label>
          <label style={{marginLeft: 150}}>已同意&nbsp;&nbsp;{items.sp_time}</label>
        </div>;
      }

      return <div><label style={{
        display: "inline-block",
        textAlign: "center",
        width: 90
      }}>{items.user_name}</label></div>;
    }
  );


  return <div>
    {titleDiv}
    {contentDiv}
  </div>

};


// 产品总监审批
const productDirectorApprove = (content: any) => {

  let titleDiv = <div>产品总监审批</div>;
  if (content === undefined) {

    return titleDiv;
  }

  let contentDiv = <div></div>;
  // 只有一个人，则不显示会签或者或签
  if (content.length === 1) {
    if (content[0].sp_status === 2) {
      contentDiv = <div>
        <label style={{textIndent: "2em"}}>{content[0].user_name}</label>
        <label style={{marginLeft: 200}}>已同意&nbsp;&nbsp;{content[0].sp_time}</label>
      </div>;
    } else {
      contentDiv = <div style={{textIndent: "2em"}}>{content[0].user_name}</div>;
    }

  } else {

    // 多人的话，状态都是一样的。。所以判断第一个即可 1：或签  2：会签
    if (content[0].approverattr === 1) {
      titleDiv = <div>
        <label>产品总监审批.</label>
        <label style={{color: "#46A0FC"}}>或签</label>
      </div>;
    } else if (content[0].approverattr === 2) {
      titleDiv = <div>
        <label>产品总监审批.</label>
        <label style={{color: "#46A0FC"}}>会签</label>
      </div>;
    }

    contentDiv = content.map((items: any) => {

        if (items.sp_status === 2) {
          return <div>
            <label style={{textIndent: "2em"}}>{items.user_name}</label>
            <label style={{marginLeft: 200}}>已同意&nbsp;&nbsp;{items.sp_time}</label>
          </div>;
        }

        return <div><label style={{textIndent: "2em"}}>{items.user_name}</label></div>;
      }
    );
  }

  return <div>
    {titleDiv}
    {contentDiv}
  </div>

};

// 架构评估审批
const archEvaluateApprove = (content: any) => {


  let titleDiv = <div>架构评估审批</div>;
  if (content === undefined) {

    return titleDiv;
  }

  let contentDiv = <div></div>;
  // 只有一个人，则不显示会签或者或签
  if (content.length === 1) {
    if (content[0].sp_status === 2) {
      contentDiv = <div>
        <label style={{textIndent: "2em"}}>{content[0].user_name}</label>
        <label style={{marginLeft: 200}}>已同意&nbsp;&nbsp;{content[0].sp_time}</label>
      </div>;
    } else {
      contentDiv = <div style={{textIndent: "2em"}}>{content[0].user_name}</div>;
    }

  } else {

    // 多人的话，状态都是一样的。。所以判断第一个即可 1：或签  2：会签
    if (content[0].approverattr === 1) {
      titleDiv = <div>
        <label>架构评估审批.</label>
        <label style={{color: "#46A0FC"}}>或签</label>
      </div>;
    } else if (content[0].approverattr === 2) {
      titleDiv = <div>
        <label>架构评估审批.</label>
        <label style={{color: "#46A0FC"}}>会签</label>
      </div>;
    }

    contentDiv = content.map((items: any) => {

        if (items.sp_status === 2) {
          return <div>
            <label style={{textIndent: "2em"}}>{items.user_name}</label>
            <label style={{marginLeft: 200}}>已同意&nbsp;&nbsp;{items.sp_time}</label>
          </div>;
        }

        return <div><label style={{textIndent: "2em"}}>{items.user_name}</label></div>;
      }
    );
  }

  return <div>
    {titleDiv}
    {contentDiv}
  </div>

};

// 项目负责人审批
const prjPrincipalApprove = (content: any) => {

};

// SQA规范检查
const sqaSpecificateCheck = (content: any) => {

};

// CCB审批
const ccbApprove = (content: any) => {

};

// 研发总经理审批
const devManagerApprove = (content: any) => {

};

// SQA通知需求变更
const sqaNotifyStoryUpdate = (content: any) => {

};

// UED评估审批
const uedEvaluateApprove = (content: any) => {

};
/* endregion   */


/* region 不同变更类型组装不同的控件 */

// 需求变更
const storyChange = (datas: any, isModify: boolean) => {
  const {applicant} = datas;
  const ApproveNo = datas.sp_no;
  const flowData = datas.record_data;

  const applyTitles = applayTitle(applicant, ApproveNo); // 界面统一的title
  // const prdDirApprove = productDirectorApprove(flowData.product_dire); // 产品总监审批
  const prdDirApprove = approveCommonMethod("产品总监审批", flowData.product_dire);
  // const archEvalApprove = archEvaluateApprove(flowData.architecture_apply); // 架构评估审批
  const archEvalApprove = approveCommonMethod("架构评估审批", flowData.architecture_apply);
  // const prjPrinciApprove = prjPrincipalApprove(datas);  // 项目负责人评估
  const prjPrinciApprove = approveCommonMethod("项目负责人评估", flowData.pro_apply);
  // const sqaSpecCheck = sqaSpecificateCheck(datas);// SQA规范检查
  const sqaSpecCheck = approveCommonMethod("SQA规范检查", flowData.sqa_check);

  // const ccbApp = ccbApprove(datas);// CCB审批
  const ccbApp = approveCommonMethod("CCB审批", flowData.ccb_apply);

  // const devManApprove = devManagerApprove(datas);// 研发总经理审批
  const devManApprove = approveCommonMethod("研发总经理审批", flowData.manager_apply);

  // const sqaNotStUpdate = sqaNotifyStoryUpdate(datas);// SQA通知需求变更
  const sqaNotStUpdate = approveCommonMethod("SQA通知需求变更", flowData.sqa_notice);

  // const uedEvalApprove = uedEvaluateApprove(datas);// UED评估审批  涉及交互修改才用得到

  const uedEvalApprove = approveCommonMethod("UED经理审批", flowData.ued_apply);


  if (isModify) {
    return <div>
      {applyTitles}
      {prdDirApprove}
      {archEvalApprove}
      {uedEvalApprove}
      {prjPrinciApprove}
      {sqaSpecCheck}
      {ccbApp}
      {devManApprove}
      {sqaNotStUpdate}
    </div>;
  }

  return <div>
    {applyTitles}
    {prdDirApprove}
    {archEvalApprove}
    {prjPrinciApprove}
    {sqaSpecCheck}
    {ccbApp}
    {devManApprove}
    {sqaNotStUpdate}
  </div>;

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

  debugger;
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
