const getTempColumns = () => {
  const column: any = [{
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    pinned: 'left',
  }, {
    headerName: '序号',
    minWidth: 70,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '模板名称',
    field: 'temp_name',
    minWidth: 110,
    pinned: 'left',
  }, {
    headerName: '模板类型',
    field: 'temp_type_name',
    minWidth: 110,
    pinned: 'left',
  }, {
    headerName: '包含任务数',
    field: 'count',
    minWidth: 100,
  }, {
    headerName: '创建人',
    field: 'create_user_name',
    minWidth: 90,
  }, {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 170,
  }, {
    headerName: '编辑人',
    field: 'update_user_name',
    minWidth: 90,
  }, {
    headerName: '编辑时间',
    field: 'update_time',
    minWidth: 170,
  }];

  return column;

};


export {getTempColumns};
