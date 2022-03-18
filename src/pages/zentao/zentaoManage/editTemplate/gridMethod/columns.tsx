const getTempColumns = () => {
  const column: any = [{
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    pinned: 'left',
  }, {
    headerName: '序号',
    minWidth: 50,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '增加类型',
    field: 'add_type_name',
    minWidth: 120,
    cellRenderer: "addTypeRender"
  }, {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 100,
    editable: true,
  }, {
    headerName: '所属模块',
    field: 'module',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '研发相关需求',
    field: 'subtask_dev_needs',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '指派给',
    field: 'assigned_person_name',
    minWidth: 90,
    cellRenderer: "assignedToRender"
  }, {
    headerName: '优先级',
    field: 'priority',
    minWidth: 90,
    cellRenderer: "priorityRender"
  }, {
    headerName: '任务类型',
    field: 'task_type_name',
    minWidth: 110,
    cellRenderer: "taskTypeRender"
  }, {
    headerName: '最初预计',
    field: 'estimate',
    minWidth: 100,
    editable: true,
  }, {
    headerName: '任务描述',
    field: 'desc',
    minWidth: 90,
    editable: true,
  }, {
    headerName: '所属端',
    field: 'belongs_name',
    minWidth: 90,
    cellRenderer: "belongsSideRender"
  }, {
    headerName: '任务来源',
    field: 'tasksource_name',
    minWidth: 90,
    cellRenderer: "taskSourceRender"
  }, {
    headerName: '是否裁剪',
    field: 'is_tailoring',
    minWidth: 90,
    cellRenderer: "cutRender"
  }, {
    headerName: '操作',
    pinned: 'right',
    maxWidth: 90,
    cellRenderer: (params: any) => {
      debugger;
      const paramData = JSON.stringify(params.data).replace(/'/g, '’');
      return `
            <Button  style="border: none; background-color: transparent;margin-top: -3px " onclick='addTemplateRow(JSON.stringify(${params.rowIndex}),${paramData})'>
              <img src="../add_black2.png" width="15" height="15" alt="新增" title="新增">
            </Button>
           `;

    }
  }];

  return column;

};


export {getTempColumns};
