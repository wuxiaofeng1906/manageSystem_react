// region 开发项目计划偏差率

export const prjPlanDevRateRuleColumns: any = [
  {
    title: '部门',
    dataIndex: 'dept',
    width: 100,
  },
  {
    title: '项目范围',
    dataIndex: 'projectRange',
    render: (value: any, row: any, index: number) => {
      const obj: any = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 1;
      } else if (index === 1) {
        obj.props.rowSpan = 7;
      } else {
        obj.props.rowSpan = 0; // 其他行不进行渲染
      }
      return obj;
    }
  },
  {
    title: '补充说明',
    dataIndex: 'instructions',
    render: (value: any, row: any, index: number) => {
      const obj: any = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 1;
      } else if (index === 1) {
        obj.props.rowSpan = 7;
      } else {
        obj.props.rowSpan = 0; // 其他行不进行渲染
      }
      return obj;
    }
  }
];

export const prjPlanDevRateRuleDatas: any = [
  {
    key: '1',
    dept: '研发中心',
    projectRange: "特性项目+班车项目+emergency项目",
    instructions: ""
  },
  {
    key: '2',
    dept: '经营会计研发部',
    projectRange: "特性项目",
    instructions: "执行概况中的项目负责人是哪个研发部门的，该项目就算在哪个研发部门中"
  }, {
    key: '3',
    dept: '收付报销研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '4',
    dept: ' 财务项目研发部',
    projectRange: "特性项目",
    instructions: ""
  },
  {
    key: '5',
    dept: '前端平台研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '6',
    dept: '后端平台研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '7',
    dept: '供应链研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '8',
    dept: '管理会计研发部',
    projectRange: "特性项目",
    instructions: ""
  }
];

// endregion 开发项目计划偏差率

// region 开发提测计划偏差率

export const testPlanDevRateRuleColumns: any = [
  {
    title: '部门',
    dataIndex: 'dept',
    width: 100,
  },
  {
    title: '项目范围',
    dataIndex: 'projectRange',
    render: (value: any, row: any, index: number) => {
      const obj: any = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 1;
      } else if (index === 1) {
        obj.props.rowSpan = 7;
      } else {
        obj.props.rowSpan = 0; // 其他行不进行渲染
      }
      return obj;
    }
  },
  {
    title: '补充说明',
    dataIndex: 'instructions',
    render: (value: any, row: any, index: number) => {
      const obj: any = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 1;
      } else if (index === 1) {
        obj.props.rowSpan = 7;
      } else {
        obj.props.rowSpan = 0; // 其他行不进行渲染
      }
      return obj;
    }
  }
];

export const testPlanDevRateRuleDatas: any = [
  {
    key: '1',
    dept: '研发中心',
    projectRange: "特性项目+班车项目+emergency项目",
    instructions: ""
  },
  {
    key: '2',
    dept: '经营会计研发部',
    projectRange: "特性项目",
    instructions: "执行概况中的项目负责人是哪个研发部门的，该项目就算在哪个研发部门中"
  }, {
    key: '3',
    dept: '收付报销研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '4',
    dept: ' 财务项目研发部',
    projectRange: "特性项目",
    instructions: ""
  },
  {
    key: '5',
    dept: '前端平台研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '6',
    dept: '后端平台研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '7',
    dept: '供应链研发部',
    projectRange: "特性项目",
    instructions: ""
  }, {
    key: '8',
    dept: '管理会计研发部',
    projectRange: "特性项目",
    instructions: ""
  }
];

// endregion 开发项目计划偏差率

