// 审批状态
const approveStatus = (params: any) => {
  if (params.value === "已驳回 ") {
    return `<span style="font-size: large; color:gray">aborted</span>`;
  }

  if (params.value === "审批中") {
    return `<span style="font-size: large; color:#46A0FC">running</span>`;
  }
  if (params.value === "已通过") {
    return `<span style="font-size: large; color:#32D529">success</span>`;
  }

  return params.value;
};

// 架构审批 、项目负责人审批、QA审批、CCB审批、总设确认、QA确认
const approvePerson = (params: any) => {
  return `
            <div>
               <span style="display: inline-block; width: 140px">${params.value}</span>
                 <label style="margin-left:10px;font-weight: bolder; color: #32D529">√</label>
            </div>`;
};

// 渲染成链接，直接点击进入
const linkRender = (params: any) => {
  return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
};

// 变更申请
const getChangeApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '项目名称',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '项目经理',
      field: 'endtime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '变更申请人',
      field: 'excUser',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '变更来源',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '变更类别',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '变更对象',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '变更所处阶段',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '变更原因',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: '变更内容',
      field: 'taskName',
      minWidth: 150,
    },
    {
      headerName: '变更影响',
      field: 'starttime',
      minWidth: 110,
    },
    {
      headerName: '架构审批（Anyone）',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approvePerson
    },
    {
      headerName: '项目负责人审批',
      field: 'excUser',
      minWidth: 90,
      cellRenderer: approvePerson
    },
    {
      headerName: 'QA审批（Anyone）',
      field: 'ID',
      maxWidth: 70,
      cellRenderer: approvePerson

    },
    {
      headerName: 'CCB审批（Everyone）',
      field: 'taskName',
      minWidth: 150,
      cellRenderer: approvePerson

    },
    {
      headerName: '总设确认',
      field: 'starttime',
      minWidth: 110,
      cellRenderer: approvePerson
    },
    {
      headerName: 'QA确认（Anyone）',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approvePerson

    },
    {
      headerName: '变更涉及文档',
      field: 'excUser',
      minWidth: 90,
      cellRenderer: linkRender
    },
    {
      headerName: '是否涉及交互修改',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: '原计划截止日期',
      field: 'taskName',
      minWidth: 150,
    },
    {
      headerName: '调整后计划截止日期',
      field: 'starttime',
      minWidth: 110,
      // cellRenderer: cellRendererForId
    },
    {
      headerName: '变更天数',
      field: 'endtime',
      minWidth: 110,
    },
    {
      headerName: '是否变更里程碑计划',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '变更工时影响（H）',
      field: 'endtime',
      minWidth: 110,
    },
    {
      headerName: '备注',
      field: 'excUser',
      minWidth: 90,
    }
  ];

  return columns;

};

// 开发hotfix上线申请
const getDevHotfixOnlineColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '产品/迭代名称',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '申请人',
      field: 'endtime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'excUser',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '是否紧急修复',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '期望上线时间',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: 'hotfix所属端',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: 'hotfix类型',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: 'hotfix编号',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: 'hotfix内容详情',
      field: 'taskName',
      minWidth: 150,
    },
    {
      headerName: 'hotfix标记',
      field: 'starttime',
      minWidth: 110,
    },
    {
      headerName: '测试建议及安排',
      field: 'endtime',
      minWidth: 110,
    },
    {
      headerName: '部署环境说明',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: 'hotfix清单',
      field: 'ID',
      maxWidth: 70,

    },
    {
      headerName: '备注',
      field: 'taskName',
      minWidth: 150,

    },
    {
      headerName: '指定审批人',
      field: 'starttime',
      minWidth: 110,
      cellRenderer: approvePerson
    },
    {
      headerName: '测试经理审批',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approvePerson

    },
    {
      headerName: '测试审批',
      field: 'excUser',
      minWidth: 90,
    }
  ];

  return columns;

};

// 产品hotfix修复申请
const getProductHotfixRepaireApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '申请人',
      field: 'endtime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'excUser',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '紧急程度',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: 'hotfix类型',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '修改说明/测试建议',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '备注',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: '指定审批人',
      field: 'taskName',
      minWidth: 150,
      cellRenderer: approvePerson
    },
    {
      headerName: '测试经理审批（Anyone）',
      field: 'starttime',
      minWidth: 110,
      cellRenderer: approvePerson
    }

  ];

  return columns;

};

// UED-hotfix修复申请
const getUEDHotfixApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '申请人',
      field: 'endtime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'excUser',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '紧急程度',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: 'hotfix类型',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '是否需要测试验证',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: 'hotfix修复内容',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: '修改说明/测试建议',
      field: 'taskName',
      minWidth: 150,
    },
    {
      headerName: '备注',
      field: 'starttime',
      minWidth: 110,
    },
    {
      headerName: '产妍负责人审批',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approvePerson
    },
    {
      headerName: '指定审批人',
      field: 'excUser',
      minWidth: 90,
      cellRenderer: approvePerson
    },
    {
      headerName: '测试经理审批（Anyone）',
      field: 'ID',
      maxWidth: 70,
      cellRenderer: approvePerson

    }
  ];

  return columns;

};

// emergency申请
const getEmergencyApplyColumns = () => {
  const columns: any = [
    {
      headerName: '序号',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '审批编号',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: 'emergency类型',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '禅道编号',
      field: 'endtime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '申请人',
      field: 'excUser',
      minWidth: 90,
      pinned: 'left',
    },
    {
      headerName: '开发经理',
      field: 'ID',
      maxWidth: 70,
      pinned: 'left',
    },
    {
      headerName: '所属端',
      field: 'taskName',
      minWidth: 150,
      pinned: 'left',
    },
    {
      headerName: '期望修复时间',
      field: 'starttime',
      minWidth: 110,
      pinned: 'left',
    },
    {
      headerName: '当前审批状态',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approveStatus,
      pinned: 'left',
    },
    {
      headerName: '申请标记',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: 'emergency修复内容',
      field: 'ID',
      maxWidth: 70,
    },
    {
      headerName: '紧急原因及影响',
      field: 'taskName',
      minWidth: 150,
    },
    {
      headerName: '修改说明/测试建议',
      field: 'starttime',
      minWidth: 110,
    },
    {
      headerName: '发布环境',
      field: 'endtime',
      minWidth: 110,
    },
    {
      headerName: '备注',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '指定审批人',
      field: 'starttime',
      minWidth: 110,
      cellRenderer: approvePerson
    },
    {
      headerName: 'CCB审批（Everyone）',
      field: 'endtime',
      minWidth: 110,
      cellRenderer: approvePerson

    },
    {
      headerName: '测试经理审批（Anyone）',
      field: 'excUser',
      minWidth: 90,
    },
    {
      headerName: '测试审批（Anyone）',
      field: 'excUser',
      minWidth: 90,
    }
  ];

  return columns;

};


export {
  getChangeApplyColumns,
  getDevHotfixOnlineColumns,
  getProductHotfixRepaireApplyColumns,
  getUEDHotfixApplyColumns,
  getEmergencyApplyColumns
}
