const getTempColumns = () => {
  const column: any = [{
    headerName: '序号',
    minWidth: 70,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '增加类型',
    field: 'addType',
    minWidth: 110,
  }, {
    headerName: '任务名称',
    field: 'taskName',
    minWidth: 100,
  }, {
    headerName: '所属模块',
    field: 'module',
    minWidth: 90,
  }, {
    headerName: '研发相关需求',
    field: 'devStory',
    minWidth: 90,
  }, {
    headerName: '指派给',
    field: 'assignedTo',
    minWidth: 90,
  }, {
    headerName: '优先级',
    field: 'priority',
    minWidth: 90,
  }, {
    headerName: '任务类型',
    field: 'taskType',
    minWidth: 110,
  }, {
    headerName: '最初预计',
    field: 'initPlan',
    minWidth: 100,
  }, {
    headerName: '任务描述',
    field: 'taskDesc',
    minWidth: 90,
  }, {
    headerName: '所属端',
    field: 'side',
    minWidth: 90,
  }, {
    headerName: '任务来源',
    field: 'taskSource',
    minWidth: 90,
  }, {
    headerName: '操作',
    field: 'operate',
    minWidth: 90,
  }];

  return column;

};

const getTestData = () => {

  return [
    {
      addType: "新增",
      taskName: "【上线前检查】",
      module: "检查",
      devStory: "",
      assignedTo: "",
      priority: "1",
      taskType: "检查",
      initPlan: "17",
      taskDesc: "",
      side: "其他",
      taskSource: "任务"
    }, {
      addType: "子任务",
      taskName: ">【前端】前端通知用户升级的消息，是否更新",
      module: "检查",
      devStory: "",
      assignedTo: "",
      priority: "1",
      taskType: "检查",
      initPlan: "0.5",
      taskDesc: "",
      side: "前端",
      taskSource: "任务"
    },
  ];

};

export {getTempColumns, getTestData};
