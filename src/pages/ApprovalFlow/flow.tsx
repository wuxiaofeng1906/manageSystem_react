/* region 基础控件 */

// 公用title属性
const applayTitle = (applicant: string, approveNo: string,) => {
  return <div style={{marginTop: -17}}>
    <div><label style={{color: "gray"}}>申请人： </label>&nbsp;&nbsp; {applicant} </div>
    <div><label style={{color: "gray"}}>审批编号： </label> {approveNo} </div>
    <div style={{color: "gray"}}>审批流程：</div>
  </div>;
};

// 审批流内容详情
const approveCommonMethod = (title: string, content: any) => {

  if (content === undefined) {
    return <div></div>;
  }

  let contentDiv;
  let titleDiv = <div style={{marginTop: 8}}>{title}</div>;

  // 只有一个人，则不显示会签或者或签
  if (content.length === 1) {
    if (content[0].sp_status === 2) {
      contentDiv = <div>
        <label style={{
          display: "inline-block",
          textAlign: "center",
          width: 100
        }}>{content[0].user_name}</label>
        <label style={{marginLeft: 130}}>已同意&nbsp;&nbsp;{content[0].sp_time}</label>
      </div>;
    } else {
      contentDiv = <div><label style={{
        display: "inline-block",
        textAlign: "center",
        width: 100
      }}> {content[0].user_name}</label></div>;
    }

    return <div>
      {titleDiv}
      {contentDiv}
    </div>
  }

  // 多人的话，状态都是一样的。。所以判断第一个即可 1：或签  2：会签
  if (content[0].approverattr === 1) {
    titleDiv = <div style={{marginTop: 8}}>
      <label>{title}.</label>
      <label style={{color: "#46A0FC"}}>或签</label>
    </div>;
  } else if (content[0].approverattr === 2) {
    titleDiv = <div style={{marginTop: 8}}>
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
            width: 100
          }}>{items.user_name}</label>
          <label style={{marginLeft: 130}}>已同意&nbsp;&nbsp;{items.sp_time}</label>
        </div>;
      }

      return <div><label style={{
        display: "inline-block",
        textAlign: "center",
        width: 100
      }}>{items.user_name}</label></div>;
    }
  );

  return <div>
    {titleDiv}
    {contentDiv}
  </div>

};

/* endregion   */

// 获取不同类型的div
const getFlowDIv = (datas: any) => {
  // 获取审批流的共用属性
  const applyTitles = applayTitle(datas.applicant, datas.sp_no);

  // 获取审批流内容详情
  const flowData = datas.record_data;
  const flowDataTitle = datas.record_title;

  const divArray: any = [];
  flowDataTitle.forEach((ele: any) => {
    const divResult = approveCommonMethod(ele.cn_name, flowData[ele.en_name]);
    divArray.push(divResult);
  });


  // div 里面是可以用数组的。。。
  return <div>
    {applyTitles}
    {divArray}

  </div>;
};


export {getFlowDIv}
