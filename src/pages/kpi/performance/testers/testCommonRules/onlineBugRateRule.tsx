// region 千行bug率代码量获取部门对应

export const ruleColumns: any = [
  {
    title: '部门',
    dataIndex: 'dept',
  },
  {
    title: '代码量取值',
    dataIndex: 'codesRule',
  }
];

export const ruleDatas: any = [
  {
    dept: '研发中心',
    codesRule: "前端平台+后端平台+经营会计研发部+架构",
  }, {
    dept: '测试部',
    codesRule: "前端平台+后端平台+经营会计研发部+架构",
  }, {
    dept: '平台测试部',
    codesRule: "前端平台+后端平台+经营会计研发部+架构",
  }, {
    dept: '收付报销测试部',
    codesRule: "收付报销研发部代码量",
  }, {
    dept: '财务项目测试部',
    codesRule: "财务项目研发部代码量",
  }, {
    dept: '供应链测试',
    codesRule: "供应链研发部代码量",
  }, {
    dept: '管理会计测试',
    codesRule: "管理会计研发部代码量",
  },
];

// endregion 千行bug率代码量获取部门对应

// region 测试计划偏差率

export const planDevRateRuleColumns: any = [
  {
    title: '部门',
    dataIndex: 'dept',
  },
  {
    title: '项目范围',
    dataIndex: 'projectRange',
  },
  {
    title: '补充说明',
    dataIndex: 'instructions',
  }
];

export const planDevRateRuleDatas: any = [
  {
    dept: '研发中心',
    projectRange: "特性项目+班车项目+emergency项目",
    instructions: ""
  },
  {
    dept: '测试部',
    projectRange: "特性项目+班车项目+emergency项目",
    instructions: ""
  }, {
    dept: '平台测试部',
    projectRange: "特性项目",
    instructions: "执行概况中的测试负责人是哪个测试部门的，该项目就算在哪个测试部门中。"
  }, {
    dept: ' 收付报销测试部',
    projectRange: "特性项目",
    instructions: "执行概况中的测试负责人是哪个测试部门的，该项目就算在哪个测试部门中。"
  },
  {
    dept: '财务项目测试部',
    projectRange: "特性项目",
    instructions: "执行概况中的测试负责人是哪个测试部门的，该项目就算在哪个测试部门中。"
  }, {
    dept: '供应链测试',
    projectRange: "特性项目",
    instructions: "执行概况中的测试负责人是哪个测试部门的，该项目就算在哪个测试部门中。"
  }, {
    dept: '管理会计测试',
    projectRange: "特性项目",
    instructions: "执行概况中的测试负责人是哪个测试部门的，该项目就算在哪个测试部门中。"
  }
];

// endregion 千行bug率代码量获取部门对应
