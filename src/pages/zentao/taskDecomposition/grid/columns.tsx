const gridColumns: any = [
  {
    headerName: '序号',
    field: 'No',
    minWidth: 65,
    width: 90,
    pinned: "left"
  }, {
    headerName: '增加类型',
    field: '',
    pinned: "left"
  }, {
    headerName: '任务名称',
    field: '',
    minWidth: 200,
    width: 90,
    pinned: "left",
    editable: true,
  }, {
    headerName: '所属模块',
    field: '',
  }, {
    headerName: '相关需求',
    field: '',
    cellRenderer: (params: any) => {
      return params.value;
    }
  }, {
    headerName: '指派给',
    field: '',
  }, {
    headerName: '预计开始',
    field: '',
  }, {
    headerName: '预计截止',
    field: '',
  }, {
    headerName: '优先级',
    field: '',
  }, {
    headerName: '任务类型',
    field: '',
  }, {
    headerName: '最初预计',
    field: '',
    editable: true,
  }, {
    headerName: '任务描述',
    field: '',
    editable: true,
  }, {
    headerName: '所属端',
    field: '',
  }, {
    headerName: '任务类型',
    field: '',
  }, {
    headerName: '是否裁剪',
    field: '',
  }
];

export {gridColumns};
