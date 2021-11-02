// region 动态定义列名


// 审批状态
const approveStatus = (params: any) => {


  let returnValue = params.value;
  if (returnValue) {
    switch (params.value.toString()) {
      case "1":
        returnValue = `<span style="color:#46A0FC">审批中</span>`;
        break;

      case "2":
        returnValue = `<span style="color:#32D529">已通过</span>`;
        break;

      case "3":
        returnValue = `<span style="color:gray">已驳回</span>`;
        break;
      case "4":
        returnValue = `<span>已撤销</span>`;
        break;

      case "6":
        returnValue = `<span>通过后撤销</span>`;
        break;

      case "7":
        returnValue = `<span>已删除</span>`;
        break;

      default:
        break;
    }
  }

  return returnValue;
};

// 架构审批 、项目负责人审批、QA审批、CCB审批、总设确认、QA确认
// const approvePerson = (params: any) => {
//
//   let returnDiv = "";
//   const appData = params.value;
//
//   if (typeof (appData) === "string") {
//     return appData;
//   }
//
//   if (appData) {
//
//     appData.forEach((ele: any) => {
//
//       if (ele.sp_status === 2) {  // 2 为审批通过
//         returnDiv = returnDiv === "" ?
//           `<div>
//            <span style="display: inline-block; width: 45px">${ele.user_name}</span>
//            <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
//         </div>`
//           :
//           `${returnDiv}
//         <div style="margin-top: -20px">
//            <span style="display: inline-block; width: 45px">${ele.user_name}</span>
//            <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
//         </div>`
//       } else {
//         returnDiv = returnDiv === "" ?
//           `<div>
//            <span style="display: inline-block; ">${ele.user_name}</span>
//         </div>`
//           :
//           `${returnDiv}
//         <div style="margin-top: -20px">
//            <span style="display: inline-block; ">${ele.user_name}</span>
//         </div>`
//       }
//
//     });
//   }
//
//   return `<div> ${returnDiv} </div>`;
// };
//
//
// const approveForTester = (params: any) => {
//
//   let returnValue = "";
//   const appData = params.value;
//   if (appData === undefined) {
//     return "";
//   }
//   if (appData[0].sp_status === 2) {
//     returnValue = appData[0].user_name;
//   } else {
//     returnValue = "待审批";
//   }
//   return returnValue;
// };

// 渲染成链接，直接点击进入
const linkRender = (params: any) => {

  if (!params.value) {
    return "";
  }

  const value = params.value.toString();

  // 判断是否包含中文，如果不包含，则就为url链接
  if (escape(value).indexOf("%u") < 0) {
    return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
  }

  // 如果不包含 http 或者https
  if (value.indexOf("http") === -1 && value.indexOf("http") === -1) {
    return value;
  }

  const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  const urlArray = value.match(reg);
  let urlStr = value;

  urlArray.forEach((urls: any) => {
    const baseUrl = ` <a href="${urls}" target="_blank"  style="text-decoration: underline">${urls}</a>`;

    // 判断原字符串中有无这个地址的链接，如果没有，则进行全局匹配来替换，如果有了这个链接，则之前的全局匹配就已经替换完成，无需继续处理替换功能。比如单据：202107270009
    if (urlStr.indexOf(baseUrl) === -1) {
      // 将url字符串替换成超链接
      // urlStr = urlStr.replace(urls, baseUrl);
      // 全局匹配  ，就可以解决
      urlStr = urlStr.replace(new RegExp(urls, 'g'), baseUrl)

    }
  });

  return urlStr;
};

// 当前审批人
const alaCurrentapproval = (params: any) => {

  const status_sp = params.data?.sp_status;
  // 只有在审批中（值为1）的，才显示流程人，其他状态直接显示即可
  if (status_sp !== 1) {

    let returnValue = "";
    switch (status_sp.toString()) {
      case "2":
        returnValue = "审批通过";
        break;

      case "3":
        returnValue = "已驳回";
        break;
      case "4":
        returnValue = "已撤销";
        break;

      case "6":
        returnValue = "通过后撤销";
        break;

      case "7":
        returnValue = "已删除";
        break;

      default:
        break;
    }


    return returnValue;
  }

  const appData = params.value;
  if (JSON.stringify(appData) === "{}") {
    return "";
  }
  // 如果当前审批人为测试审批，那么就显示为：测试待审批

  if (appData.phase === "test_approval") {
    return "测试待审批";
  }
  let returnDiv = "";
  if (appData) {
    //   如果user里面只有一个人，则不显示会签或者或签，直接显示人和审批状态即可
    const userInfoArray = appData.user;
    if (userInfoArray.length === 1) {
      const userInfo = userInfoArray[0];
      if (userInfo.sp_status === 2) {  // 2 为审批通过
        return `<div>
           <span style="display: inline-block; width: 45px">${userInfo.user_name}</span>
           <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
        </div>`;

      }
      return `<div>
           <span style="display: inline-block; ">${userInfo.user_name}</span>
        </div>`;
    }

    //  如果user里面有多个人 ，则 approverattr字段表示：1:或签  2：会签
    if (appData.approverattr === 1) {
      returnDiv = `<div style="font-weight: bold">多人或签:</div>`;
    } else {
      returnDiv = `<div style="font-weight: bold">多人会签:</div>`;
    }

    userInfoArray.forEach((ele: any) => {

      if (ele.sp_status === 2) {  // 2 为审批通过
        returnDiv = `${returnDiv}
      <div style="margin-top: -20px">
         <span style="display: inline-block; width: 45px">${ele.user_name}</span>
         <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
      </div>`
      } else {
        returnDiv = `${returnDiv}
      <div style="margin-top: -20px">
         <span style="display: inline-block; ">${ele.user_name}</span>
      </div>`
      }

    });


    // Object.keys(appData).forEach(key => {
    //
    //
    //   const dataArray = appData[key];
    // dataArray.forEach((ele: any) => {
    //
    //   if (ele.sp_status === 2) {  // 2 为审批通过
    //     returnDiv = returnDiv === "" ?
    //       `<div>
    //      <span style="display: inline-block; width: 45px">${ele.user_name}</span>
    //      <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
    //   </div>`
    //       :
    //       `${returnDiv}
    //   <div style="margin-top: -20px">
    //      <span style="display: inline-block; width: 45px">${ele.user_name}</span>
    //      <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
    //   </div>`
    //   } else {
    //     returnDiv = returnDiv === "" ?
    //       `<div>
    //      <span style="display: inline-block; ">${ele.user_name}</span>
    //   </div>`
    //       :
    //       `${returnDiv}
    //   <div style="margin-top: -20px">
    //      <span style="display: inline-block; ">${ele.user_name}</span>
    //   </div>`
    //   }
    //
    // });

    // });


  }

  return `<div> ${returnDiv} </div>`;

};
// 变更申请
const getChangeApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'sp_no',
      minWidth: 130,
      pinned: 'left',
    },
    {
      headerName: '项目名称',
      field: 'project_name',
      minWidth: 110,
      pinned: 'left',
      tooltipField: "project_name",
      cellRenderer: (params: any) => {
        const rowData = params.data;
        if (!rowData.project_name_meets) {
          return `<span style="color: #cbcc00"> ${params.value}</span>`;
        }

        return params.value;

      }
    },
    {
      headerName: '项目经理',
      field: 'leader',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '变更申请人',
      field: 'applicant',
      minWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '变更来源',
      field: 'change_source',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '变更类别',
      field: 'change_type',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '变更对象',
      field: 'change_obj',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'sp_status',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '当前审批人',
      field: 'current_person',
      minWidth: 110,
      // wrapText: true,
      autoHeight: true,
      cellRenderer: alaCurrentapproval,
    },
    {
      headerName: '变更所处阶段',
      field: 'change_phase',
      minWidth: 100,
    },
    {
      headerName: '变更原因',
      field: 'change_why',
      minWidth: 120,
      tooltipField: "change_why"
    },
    {
      headerName: '变更内容',
      field: 'change_content',
      minWidth: 120,
      tooltipField: "change_content"
    },
    {
      headerName: '变更影响',
      field: 'change_impact',
      minWidth: 120,
      tooltipField: "change_impact"
    },
    // {
    //   headerName: '产品负责人审批',
    //   field: 'product_owner',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '架构审批（Anyone）',
    //   field: 'architecture_approval',
    //   minWidth: 110,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '项目负责人审批',
    //   field: 'project_head_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: 'QA审批（Anyone）',
    //   field: 'qa_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    //
    // },
    // {
    //   headerName: 'CCB审批（Everyone）',
    //   field: 'ccb_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '总设确认',
    //   field: 'total_confirm',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: 'QA确认（Anyone）',
    //   field: 'qa_confirm',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    //
    // },
    {
      headerName: '变更涉及文档',
      field: 'change_doc',
      minWidth: 120,
      tooltipField: "change_doc",
      cellRenderer: linkRender
    },
    {
      headerName: '是否涉及交互修改',
      field: 'change_modify',
      minWidth: 110,
    },
    {
      headerName: '原计划截止日期',
      field: 'original_deadline',
      minWidth: 170,
    },
    {
      headerName: '调整后计划截止日期',
      field: 'adjust_plan_original_deadline',
      minWidth: 150,
    },
    {
      headerName: '变更天数',
      field: 'change_days',
      minWidth: 110,
    },
    {
      headerName: '是否变更里程碑计划',
      field: 'change_milestone_plan',
      minWidth: 90,
    },
    {
      headerName: '变更工时影响（H）',
      field: 'change_hours',
      minWidth: 130,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {

        const {value} = params;
        if (typeof (value) === "string") {
          return value;
        }
        // 如果不是字符串，就为对象，则需要拼接返回值。

        let returnDiv = "";
        if (value) {
          returnDiv = `
        <div>前端：${value["前端"]}</div>
        <div style="margin-top:-15px">后端：${value["后端"]}</div>
        <div style="margin-top:-15px">测试：${value["测试"]}</div>
        <div style="margin-top:-15px">合计：${value["合计"]}</div>`;
        }

        return `<div> ${returnDiv} </div>`;
      }
    },
    {
      headerName: '备注',
      field: 'comment_content',
      minWidth: 110,
      tooltipField: "comment_content",
    }, {
      headerName: '提交时间',
      field: 'apply_time',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
    },
  ];

  return columns;

};

// 开发hotfix上线申请
const getDevHotfixOnlineColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      minWidth: 65,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'sp_no',
      minWidth: 130,
      pinned: 'left',
    },
    {
      headerName: '产品/迭代名称',
      field: 'product_name',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '申请人',
      field: 'applicant',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'leader',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '是否紧急修复',
      field: 'emergency_repair',
      minWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '期望上线时间',
      field: 'online_time',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '所属端',
      field: 'hotfix_server',
      minWidth: 75,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'sp_status',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '当前审批人',
      field: 'current_person',
      minWidth: 110,
      // wrapText: true,
      // autoHeight: true,
      cellRenderer: alaCurrentapproval,
    },
    {
      headerName: '类型',
      field: 'hotfix_type',
      minWidth: 75,
    },
    {
      headerName: '编号',
      field: 'hotfix_num',
      minWidth: 75,
      cellRenderer: (params: any) => {
        if (params.value === undefined) {
          return "";
        }

        const zentao_id = params.value.toString();

        let zentaoArray = [];

        if (zentao_id.includes("、")) {
          zentaoArray = zentao_id.split("、");
        } else {
          zentaoArray.push(zentao_id);
        }

        let returnStr = "";
        zentaoArray.forEach((ele: any) => {
          let zentaoType = "";
          if (params.data.hotfix_type === "需求") {
            zentaoType = "story";
          }

          if (params.data.hotfix_type === "bug") {
            zentaoType = "bug";
          }

          if (params.data.hotfix_type === "task") {
            zentaoType = "task";
          }

          returnStr = returnStr === "" ? `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${zentaoType}-view-${ele}.html'>${ele}</a>`
            : `${returnStr},<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${zentaoType}-view-${ele}.html'>${ele}</a>`;

        });

        return returnStr;
      },
    },
    {
      headerName: '内容详情',
      field: 'hotfix_content',
      minWidth: 150,
      tooltipField: "hotfix_content"
    },
    {
      headerName: 'hotfix标记',
      field: 'hotfix_tag',
      minWidth: 190,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {

        let returnDiv = "";
        const appData = params.value;
        if (appData) {
          returnDiv = `
        <div>
           <span style="display: inline-block; width: 115px">是否涉及数据修复</span>
           <label style="margin-left:15px;">${appData.is_data_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否涉及页面修改</span>
           <label style="margin-left:15px;">${appData.is_page_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否支持热更新</span>
           <label style="margin-left:15px;">${appData.is_hot_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否需要提测演示</span>
           <label style="margin-left:15px;">${appData.is_test_demo}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否需要测试验证</span>
           <label style="margin-left:15px;">${appData.is_test_validation}</label>
        </div>`;

        }

        return `<div> ${returnDiv} </div>`;
      }
    },
    {
      headerName: '测试建议及安排',
      field: 'test_advice',
      minWidth: 110,
      tooltipField: "test_advice"
    },
    {
      headerName: '部署环境说明',
      field: 'dep_env',
      minWidth: 110,
      tooltipField: "dep_env"
    },
    {
      headerName: 'hotfix清单',
      field: 'hotfix_form',
      minWidth: 110,
      tooltipField: "hotfix清单"
    },
    {
      headerName: '备注',
      field: 'comment_content',
      minWidth: 150,
      tooltipField: "comment_content"
    },
    {
      headerName: '提交时间',
      field: 'apply_time',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
    },
    // {
    //   headerName: '指定审批人',
    //   field: 'spec_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '测试经理审批',
    //   field: 'test_leader',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    //
    // },
    // {
    //   headerName: '测试审批',
    //   field: 'test_approval',
    //   minWidth: 90,
    //   cellRenderer: approveForTester
    //
    // }
  ];

  return columns;

};

// 产品hotfix修复申请
const getProductHotfixRepaireApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'sp_no',
      minWidth: 130,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'chandao_num',
      minWidth: 90,
      pinned: 'left',
      cellRenderer: (params: any) => {
        if (params.value === undefined) {
          return "";
        }
        const zentao_id = params.value.toString();

        let zentaoArray = [];

        if (zentao_id.includes("、")) {
          zentaoArray = zentao_id.split("、");
        } else {
          zentaoArray.push(zentao_id);
        }

        let returnStr = "";
        zentaoArray.forEach((ele: any) => {
          let zentaoType = "";
          if (params.data.hotfix_type === "需求") {
            zentaoType = "story";
          }

          if (params.data.hotfix_type === "bug") {
            zentaoType = "bug";
          }

          if (params.data.hotfix_type === "task") {
            zentaoType = "task";
          }

          returnStr = returnStr === "" ? `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${zentaoType}-view-${ele}.html'>${ele}</a>`
            : `${returnStr},<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/${zentaoType}-view-${ele}.html'>${ele}</a>`;

        });

        return returnStr;
      },
    },
    {
      headerName: '申请人',
      field: 'applicant',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'leader',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '紧急程度',
      field: 'emergency_degree',
      minWidth: 100,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'repair_time',
      minWidth: 120,
      pinned: 'left',
    },
    {
      headerName: '类型',
      field: 'hotfix_type',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'sp_status',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '当前审批人',
      field: 'current_person',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
      cellRenderer: alaCurrentapproval,
    },
    {
      headerName: '修改说明/测试建议',
      field: 'test_advice',
      minWidth: 120,
      tooltipField: "test_advice",
    },
    {
      headerName: '备注',
      field: 'comment_content',
      minWidth: 120,
      tooltipField: "comment_content",
    },
    {
      headerName: '提交时间',
      field: 'apply_time',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
    },
    // {
    //   headerName: '指定审批人',
    //   field: 'spec_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '测试经理审批（Anyone）',
    //   field: 'test_leader',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // }

  ];

  return columns;

};

// UED-hotfix修复申请
const getUEDHotfixApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'sp_no',
      minWidth: 130,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'chandao_num',
      minWidth: 90,
      pinned: 'left',
      cellRenderer: (params: any) => {
        if (params.value === undefined) {
          return "";
        }
        if (params.data.hotfix_type === "需求") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/story-view-${params.value}.html'>${params.value}</a>`;
        }
        if (params.data.hotfix_type === "bug") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/bug-view-${params.value}.html'>${params.value}</a>`;
        }

        if (params.data.hotfix_type === "task") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/task-view-${params.value}.html'>${params.value}</a>`;
        }
        return params.value;

      },
    },
    {
      headerName: '申请人',
      field: 'applicant',
      minWidth: 75,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'leader',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '紧急程度',
      field: 'emergency_degree',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'repair_time',
      minWidth: 120,
      pinned: 'left',
    },
    {
      headerName: '类型',
      field: 'hotfix_type',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'sp_status',
      minWidth: 115,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '当前审批人',
      field: 'current_person',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
      cellRenderer: alaCurrentapproval,
    },
    {
      headerName: '是否需要测试验证',
      field: 'validation',
      minWidth: 90,
    },
    {
      headerName: '修复内容',
      field: 'hotfix_content',
      minWidth: 100,
      tooltipField: "hotfix_content",
    },
    {
      headerName: '修改说明/测试建议',
      field: 'test_advice',
      minWidth: 150,
      tooltipField: "test_advice",
    },
    {
      headerName: '备注',
      field: 'comment_content',
      minWidth: 110,
      tooltipField: "comment_content",
    },
    {
      headerName: '提交时间',
      field: 'apply_time',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
    },
    // {
    //   headerName: '产研负责人审批',
    //   field: 'product_leader',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '指定审批人',
    //   field: 'spec_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '测试经理审批（Anyone）',
    //   field: 'test_leader',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    //
    // }
  ];

  return columns;

};

// emergency申请
const getEmergencyApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      minWidth: 65,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'sp_no',
      minWidth: 130,
      pinned: 'left',
    },
    {
      headerName: '类型',
      field: 'emergency_type',
      minWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'chandao_num',
      minWidth: 90,
      pinned: 'left',
      cellRenderer: (params: any) => {

        if (params.data.emergency_type === "需求") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/story-view-${params.value}.html'>${params.value}</a>`;
        }
        if (params.data.emergency_type === "bug") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/bug-view-${params.value}.html'>${params.value}</a>`;
        }
        if (params.data.emergency_type === "task") {
          return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/task-view-${params.value}.html'>${params.value}</a>`;
        }
        return params.value;

      },
    },
    {
      headerName: '申请人',
      field: 'applicant',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'leader',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '所属端',
      field: 'server',
      minWidth: 75,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'repair_time',
      minWidth: 80,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'sp_status',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '当前审批人',
      field: 'current_person',
      minWidth: 110,
      // wrapText: true,
      // autoHeight: true,
      cellRenderer: alaCurrentapproval,
    },
    {
      headerName: '申请标记',
      field: 'apply_tag',
      minWidth: 190,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {

        let returnDiv = "";
        const appData = params.value;
        if (appData) {
          returnDiv = `
        <div>
           <span style="display: inline-block; width: 115px">是否有数据升级</span>
           <label style="margin-left:15px;">${appData.is_data_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否有接口升级</span>
           <label style="margin-left:15px;">${appData.is_api_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否涉及页面修改</span>
           <label style="margin-left:15px;">${appData.is_page_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否支持热更新</span>
           <label style="margin-left:15px;">${appData.is_hot_update}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否需要提测演示</span>
           <label style="margin-left:15px;">${appData.is_test_demo}</label>
        </div>
        <div style="margin-top:-15px ">
           <span style="display: inline-block; width: 115px">是否需要测试验证</span>
           <label style="margin-left:15px;">${appData.is_test_validation}</label>
        </div>`;

        }

        return `<div> ${returnDiv} </div>`;
      }
    },
    {
      headerName: '修复内容',
      field: 'emergency_content',
      minWidth: 200,
      tooltipField: 'emergency_content'
    },
    {
      headerName: '紧急原因及影响',
      field: 'emergency_degree',
      minWidth: 200,
      tooltipField: 'emergency_degree'
    },
    {
      headerName: '修改说明/测试建议',
      field: 'test_advice',
      minWidth: 200,
      tooltipField: 'test_advice'
    },
    {
      headerName: '发布环境',
      field: 'release_env',
      minWidth: 110,
      tooltipField: 'release_env'
    },
    {
      headerName: '备注',
      field: 'comment_content',
      minWidth: 90,
      tooltipField: 'comment_content'
    },
    {
      headerName: '提交时间',
      field: 'apply_time',
      minWidth: 110,
      wrapText: true,
      autoHeight: true,
    }


    // {
    //   headerName: '指定审批人',
    //   field: 'spec_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: 'CCB审批（Everyone）',
    //   field: 'ccb_approval',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '测试经理审批（Anyone）',
    //   field: 'test_leader',
    //   minWidth: 110,
    //   wrapText: true,
    //   autoHeight: true,
    //   cellRenderer: approvePerson
    // },
    // {
    //   headerName: '测试审批（Anyone）',
    //   field: 'test_approval',
    //   minWidth: 110,
    //   cellRenderer: approveForTester
    // }
  ];

  return columns;

};


const getGridColums = (approveType: any) => {

  switch (approveType) {
    case "Bs5Jhq7KtNGsJd4f9Zd2VedigHaBc634AEXhF6Vot":  // 开发hotfix上线申请
      return getDevHotfixOnlineColumns();
      break;
    case "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt":  // 变更申请
      return getChangeApplyColumns();
      break;

    case "3TkaYnRhUKbC4ipUWXabjYJ6MSNNWPy6NcdYPxUx":  // 产品hotfix修复申请
      return getProductHotfixRepaireApplyColumns();
      break;
    case "3TmAULSSURUQT3AbRexQt7HAbEq2x9B8ZxffP7PM": // UED-hotfix修复申请
      return getUEDHotfixApplyColumns();
      break;
    case "Bs7x1Pi9kpPJEEPC1N81bPfAhKrqpLH2CsuTHQCHu": // emergency申请
      return getEmergencyApplyColumns();
      break;

    default:
      return [];
      break;
  }

};

// endregion

// region 解析数据

// 开发hotfix上线申请
const getDevHotfixOnlineDatas = (oraDatas: any, start_id: number) => {
  const datas: any = [];
  oraDatas.forEach((ele: any, index: number) => {

    datas.push({
      ID: start_id + index,
      sp_no: ele.sp_no,
      product_name: ele.product_name,
      applicant: ele.applicant,
      leader: ele.leader,
      emergency_repair: ele.emergency_repair,
      online_time: ele.online_time,
      hotfix_server: ele.hotfix_server,
      sp_status: ele.sp_status,
      hotfix_type: ele.hotfix_type,
      hotfix_num: ele.hotfix_num,
      hotfix_content: ele.hotfix_content,
      hotfix_tag: ele.hotfix_tag,
      test_advice: ele.test_advice,
      dep_env: ele.dep_env,
      hotfix_form: ele.hotfix_form,
      comment_content: ele.comment_content,
      current_person: ele.current_person,
      record_title: ele.record_title,
      record_data: ele.record_data,
      // spec_approval: ele.spec_approval,
      // test_leader: ele.test_leader,
      // test_approval: ele.test_approval,
      apply_time: ele.apply_time

    });
  });

  return datas;

};

// 产品hotfix修复申请
const getProductHotfixRepaireApplyDatas = (oraDatas: any, start_id: number) => {
  const datas: any = [];
  oraDatas.forEach((ele: any, index: number) => {

    datas.push({
      ID: start_id + index,
      sp_no: ele.sp_no,
      chandao_num: ele.chandao_num,
      applicant: ele.applicant,
      leader: ele.leader,
      emergency_degree: ele.emergency_degree,
      repair_time: ele.repair_time,
      hotfix_type: ele.hotfix_type,
      sp_status: ele.sp_status,
      test_advice: ele.test_advice,
      comment_content: ele.comment_content,
      current_person: ele.current_person,
      record_title: ele.record_title,
      record_data: ele.record_data,
      // spec_approval: ele.spec_approval,
      // test_leader: ele.test_leader,
      apply_time: ele.apply_time

    });
  });

  return datas;
};

// UED-hotfix修复申请
const getUEDHotfixApplyDatas = (oraDatas: any, start_id: number) => {
  const datas: any = [];
  oraDatas.forEach((ele: any, index: number) => {

    datas.push({
      ID: start_id + index,
      sp_no: ele.sp_no,
      chandao_num: ele.chandao_num,
      applicant: ele.applicant,
      leader: ele.leader,
      emergency_degree: ele.emergency_degree,
      repair_time: ele.repair_time,
      hotfix_type: ele.hotfix_type,
      sp_status: ele.sp_status,
      validation: ele.validation,
      hotfix_content: ele.hotfix_content,
      test_advice: ele.test_advice,
      comment_content: ele.comment_content,
      current_person: ele.current_person,
      record_data: ele.record_data,
      record_title: ele.record_title,
      // product_leader: ele.product_leader,
      // spec_approval: ele.spec_approval,
      // test_leader: ele.test_leader,
      apply_time: ele.apply_time

    });
  });

  return datas;
};

const getEmergencyApplyDatas = (oraDatas: any, start_id: number) => {

  const datas: any = [];
  oraDatas.forEach((ele: any, index: number) => {

    datas.push({
      ID: start_id + index,
      sp_no: ele.sp_no,
      emergency_type: ele.emergency_type,
      chandao_num: ele.chandao_num,
      applicant: ele.applicant,
      leader: ele.leader,
      server: ele.server,
      repair_time: ele.repair_time,
      sp_status: ele.sp_status,
      apply_tag: ele.apply_tag,
      emergency_content: ele.emergency_content,
      emergency_degree: ele.emergency_degree,
      test_advice: ele.test_advice,
      release_env: ele.release_env,
      comment_content: ele.comment_content,
      current_person: ele.current_person,
      record_title: ele.record_title,
      record_data: ele.record_data,
      apply_time: ele.apply_time,
      // spec_approval: ele.spec_approval,
      // ccb_approval: ele.ccb_approval,
      // test_leader: ele.test_leader,
      // test_approval: ele.test_approval

    });
  });

  return datas;
};

// 变更申请
const getChangeApplyDatas = (oraDatas: any, start_id: number) => {

  const datas: any = [];
  oraDatas.forEach((ele: any, index: number) => {

    datas.push({
      id: index,
      ID: start_id + index,
      sp_no: ele.sp_no,
      project_name: ele.project_name,
      project_name_meets: ele.project_name_meets,
      leader: ele.leader,
      applicant: ele.applicant,
      change_source: ele.change_source,
      change_type: ele.change_type,
      change_obj: ele.change_obj,
      sp_status: ele.sp_status,
      change_phase: ele.change_phase,
      change_why: ele.change_why,
      change_content: ele.change_content,
      change_impact: ele.change_impact,
      current_person: ele.current_person,
      record_data: ele.record_data,
      record_title: ele.record_title,
      // product_owner: ele.product_owner,
      // architecture_approval: ele.architecture_approval,
      // project_head_approval: ele.project_head_approval,
      // qa_approval: ele.qa_approval,
      // ccb_approval: ele.ccb_approval,
      // total_confirm: ele.total_confirm,
      // qa_confirm: ele.qa_confirm,
      change_doc: ele.change_doc,
      change_modify: ele.change_modify,
      original_deadline: ele.original_deadline,
      adjust_plan_original_deadline: ele.adjust_plan_original_deadline,
      change_days: ele.change_days,
      change_milestone_plan: ele.change_milestone_plan,
      change_hours: ele.change_hours,
      comment_content: ele.comment_content,
      apply_time: ele.apply_time

    });
  });

  return datas;

};

const getStartItemId = (page: number, pageSize: number) => {
  const startId = 1 + pageSize * (page - 1);

  return startId;

};


const alaysisDatas = (paramData: any, oraDatas: any) => {

  const start_id = getStartItemId(paramData.page, paramData.pageSize);

  switch (paramData.approvalType) {
    case "Bs5Jhq7KtNGsJd4f9Zd2VedigHaBc634AEXhF6Vot":  // 开发hotfix上线申请
      return getDevHotfixOnlineDatas(oraDatas, start_id);
      break;
    case "3TkaYnRhUKbC4ipUWXabjYJ6MSNNWPy6NcdYPxUx":  // 产品hotfix修复申请
      return getProductHotfixRepaireApplyDatas(oraDatas, start_id);
      break;
    case "3TmAULSSURUQT3AbRexQt7HAbEq2x9B8ZxffP7PM": // UED-hotfix修复申请
      return getUEDHotfixApplyDatas(oraDatas, start_id);
      break;
    case "Bs7x1Pi9kpPJEEPC1N81bPfAhKrqpLH2CsuTHQCHu": // emergency申请
      return getEmergencyApplyDatas(oraDatas, start_id);
      break;
    case "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt":  // 变更申请
      return getChangeApplyDatas(oraDatas, start_id);
      break;

    default:
      return [];
      break;
  }

};

// endregion
export {getGridColums, alaysisDatas}