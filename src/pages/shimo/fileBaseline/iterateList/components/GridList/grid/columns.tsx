const getColumns = () => {

  const column: any = [{
    headerName: '序号',
    minWidth: 70,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '',
    field: 'zentao_url',
    minWidth: 110,
    pinned: 'left',
  }, {
    headerName: '迭代名称',
    field: 'temp_type_name',
    minWidth: 110,
    pinned: 'left',
  }, {
    headerName: '负责人',
    field: 'count',
    minWidth: 100,
  }, {
    headerName: '所属部门',
    field: 'create_user_name',
    minWidth: 90,
  }, {
    headerName: '迭代状态',
    field: 'create_time',
    minWidth: 170,
  }, {
    headerName: 'SQA',
    field: 'update_user_name',
    minWidth: 90,
  }, {
    headerName: '',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '石墨需求目录',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '需求基线状态',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '石墨概设目录',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '概设基线状态',
    field: 'shimo_url',
    minWidth: 170,
  }, {
    headerName: '操作',
     minWidth: 170,
  }];

  return column;

};

export {getColumns}
