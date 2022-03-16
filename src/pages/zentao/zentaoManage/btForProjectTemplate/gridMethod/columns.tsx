const getProjectColumns = () => {
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
    minWidth: 120,
  }, {
    headerName: '任务名称',
    field: 'taskName',
    minWidth: 100,
    editable: true,
  }, {
    headerName: '所属模块',
    field: 'module',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '研发相关需求',
    field: 'devStory',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '指派给',
    field: 'assignedTo',
    minWidth: 90,
  }, {
    headerName: '预计开始',
    field: 'priority',
    minWidth: 90,
  }, {
    headerName: '预计截至',
    field: 'taskType',
    minWidth: 110,
  }, {
    headerName: '优先级',
    field: 'initPlan',
    minWidth: 100,
    editable: true,
  }, {
    headerName: '任务类型',
    field: 'taskDesc',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '最初预计',
    field: 'side',
    minWidth: 90,
  }, {
    headerName: '任务描述',
    field: 'taskSource',
    minWidth: 90,
  }, {
    headerName: '所属端',
    minWidth: 90,
  }, {
    headerName: '任务来源',
    minWidth: 90,
  }, {
    headerName: '是否裁剪',
    minWidth: 90,
  }];
  return column;
};


export {getProjectColumns};
