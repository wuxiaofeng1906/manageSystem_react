const getTaskColumns = () => {
  const column: any = [{
    headerName: '序号',
    minWidth: 60,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '增加类型',
    field: 'add_type_name',
    minWidth: 100,
    pinned: 'left',
  }, {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 100,
    pinned: 'left',
    cellRenderer: (params: any) => {
      if (params.data.is_tailoring === "yes" || params.data.is_tailoring === "是") {
        return `<span style="color: gray">${params.value}</span>`
      }
      return params.value;
    }
  }, {
    headerName: '所属模块',
    field: 'module',
    minWidth: 90,
  }, {
    headerName: '研发相关需求',
    field: 'subtask_dev_needs',
    minWidth: 90,
  }, {
    headerName: '指派给',
    field: 'assigned_person_name',
    minWidth: 90,
  }, {
    headerName: '预计开始',
    field: 'plan_start',
    minWidth: 150,
    cellRenderer: "timeRender"
  }, {
    headerName: '预计截至',
    field: 'plan_end',
    minWidth: 150,
    cellRenderer: "timeRender"
  }, {
    headerName: '优先级',
    field: 'priority',
    minWidth: 80,
  }, {
    headerName: '任务类型',
    field: 'task_type_name',
    minWidth: 90,
  }, {
    headerName: '最初预计',
    field: 'estimate',
    minWidth: 90,
  }, {
    headerName: '任务描述',
    field: 'desc',
    minWidth: 90,
  }, {
    headerName: '所属端',
    field: "belongs_name",
    minWidth: 90,
  }, {
    headerName: '任务来源',
    field: "tasksource_name",
    minWidth: 90,
  }, {
    headerName: '是否裁剪',
    field: 'is_tailoring',
    minWidth: 90,
    cellRenderer: "cutRender"
  }];
  return column;
};


export {getTaskColumns};
