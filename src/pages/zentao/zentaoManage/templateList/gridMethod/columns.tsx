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
    field: 'tempName',
    minWidth: 110,
    pinned: 'left',
  }, {
    headerName: '包含任务数',
    field: 'taskCount',
    minWidth: 100,
  }, {
    headerName: '创建人',
    field: 'creater',
    minWidth: 90,
  }, {
    headerName: '创建时间',
    field: 'createTime',
    minWidth: 170,
  }, {
    headerName: '编辑人',
    field: 'editor',
    minWidth: 90,
  }, {
    headerName: '编辑时间',
    field: 'editTime',
    minWidth: 170,
  }];

  return column;

};

const getTestData = () => {

  return [
    {
      tempName: "上线前检查任务模板",
      taskCount: "25",
      creater: "何江",
      createTime: "2021/10/28 22:00:21",
      editor: "谭杰",
      editTime: "2021/10/28 22:10:21"
    }, {
      tempName: "项目计划模板",
      taskCount: "8",
      creater: "何江",
      createTime: "2021/10/28 22:00:21",
      editor: "",
      editTime: ""
    }
  ];

};

export {getTempColumns, getTestData};
