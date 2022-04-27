const gridColumns: any = [
  {
    headerName: '序号',
    field: 'No',
    minWidth: 65,
    width: 90,
    pinned: "left"
  }, {
    headerName: '增加类型',
    field: 'add_type_name',
    pinned: "left"
  }, {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 200,
    width: 90,
    pinned: "left",
    editable: true,
  }, {
    headerName: '所属模块',
    field: 'module',
  }, {
    headerName: '相关需求',
    field: 'subtask_dev_needs',
    cellRenderer: (params: any) => {
      return params.value;
    }
  }, {
    headerName: '指派给',
    field: 'assigned_person_name',
  }, {
    headerName: '预计开始',
    field: 'plan_start',
  }, {
    headerName: '预计截止',
    field: 'plan_end',
  }, {
    headerName: '优先级',
    field: 'priority',
  }, {
    headerName: '任务类型',
    field: 'task_type_name',
  }, {
    headerName: '最初预计',
    field: 'estimate',
    editable: true,
  }, {
    headerName: '任务描述',
    field: 'desc',
    editable: true,
  }, {
    headerName: '所属端',
    field: 'belongs_name',
  }, {
    headerName: '任务来源',
    field: 'tasksource_name',
  }, {
    headerName: '是否裁剪',
    field: 'is_tailoring',
  }
];

export {gridColumns};
