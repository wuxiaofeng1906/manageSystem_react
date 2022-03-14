const getTempColumns = () => {
  const column: any = [{
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 50,
    pinned: 'left',
  }, {
    headerName: '序号',
    maxWidth: 80,
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '模板名称',
    field: '',
  }, {
    headerName: '包含任务数',
    field: '',
  }, {
    headerName: '创建人',
    field: '',
  }, {
    headerName: '编辑人',
    field: '',
  }, {
    headerName: '编辑时间',
    field: '',
    minWidth: 100,
  }];

  return column;

};

export {getTempColumns};
