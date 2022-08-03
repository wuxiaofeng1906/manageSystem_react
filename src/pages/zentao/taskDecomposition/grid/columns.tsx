const gridColumns: any = [
  {
    headerName: '序号',
    field: 'No',
    minWidth: 65,
    width: 90,
    pinned: 'left',
    cellRenderer: (params: any) => {
      if (params.data?.No === 6) {
        return '';
      }
      return params.value;
    },
  },
  {
    headerName: '增加类型',
    field: 'add_type_name',
    pinned: 'left',
  },
  {
    headerName: '任务名称',
    field: 'task_name',
    minWidth: 300,
    width: 90,
    pinned: 'left',
    cellEditorPopup: true,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
      rows: 2,
    },
    editable: (params: any) => {
      if (params.data?.No === 6) {
        return false;
      }
      return true;
    },
  },
  {
    headerName: '所属模块',
    field: 'module',
    valueFormatter: (params: any) => {
      if (params.data?.No === 6) {
        return '';
      }
      if (!params.value) {
        return '/';
      }
      return params.value;
    },
  },
  {
    headerName: '相关需求',
    field: 'subtask_dev_needs',
    minWidth: 90,
    cellRenderer: (params: any) => {
      // const storyId = params.data?.subtask_dev_id;
      if (params.value) {
        return `
          <div>
                <a target="_blank"; href='http://zentao.77hub.com/zentao/story-view-${params.value}.html'> ${params.value}</a>
          </div>`;
      }
      return params.value;
    },
  },
  {
    headerName: '指派给',
    field: 'assigned_person',
    minWidth: 120,
    cellRenderer: 'assigenedTo',
  },
  {
    headerName: '预计开始',
    field: 'plan_start',
    minWidth: 150,
    cellRenderer: 'timeRender',
  },
  {
    headerName: '预计截止',
    field: 'plan_end',
    minWidth: 150,
    cellRenderer: 'timeRender',
  },
  {
    headerName: '优先级',
    field: 'priority',
  },
  {
    headerName: '任务类型',
    field: 'task_type_name',
  },
  {
    headerName: '最初预计',
    field: 'estimate',
    editable: (params: any) => {
      if (params.data?.No === 6) {
        return false;
      }
      return true;
    },
  },
  {
    headerName: '任务描述',
    field: 'desc',
    editable: (params: any) => {
      if (params.data?.No === 6) {
        return false;
      }
      return true;
    },
  },
  {
    headerName: '是否裁剪',
    field: 'is_tailoring',
    cellRenderer: 'tailoring',
  },
  {
    minWidth: 150,
    headerName: '应用服务',
    field: 'app_server',
    cellRenderer: 'appServer',
  },
  {
    headerName: '所属端',
    field: 'belongs_name',
  },
  {
    headerName: '任务来源',
    field: 'tasksource_name',
  },
];

// 设置cell颜色，可编辑为白色，不可编辑为灰色。
const setCellStyle = (params: any) => {
  if (params.data?.No === 6) {
    return { 'background-color': 'white' };
  }
  const style = { 'line-height': '25px' };
  const whiteCell = [
    'task_name',
    'assigned_person',
    'plan_start',
    'plan_end',
    'estimate',
    'desc',
    'is_tailoring',
    'app_server',
  ];
  if (whiteCell.indexOf(params.column?.colId) < 0) {
    style['background-color'] = '#F8F8F8';
  } else {
    style['background-color'] = 'white';
  }
  return style;
};
export { gridColumns, setCellStyle };
