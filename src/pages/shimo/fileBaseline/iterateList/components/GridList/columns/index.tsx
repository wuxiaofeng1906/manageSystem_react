// 表格列的定义

const columns: any = [
  {
    headerName: '序号',
    minWidth: 70,
    maxWidth: 80,
    pinned: 'left',
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
  }, {
    headerName: '',
    field: 'execution_url',
    cellRenderer: "myUrl"
  }, {
    headerName: '迭代名称',
    field: 'execution_name',
    minWidth: 110,
    cellRenderer: "nameUrl"

  }, {
    headerName: '负责人',
    field: 'execution_head_name',
    minWidth: 100,
  }, {
    headerName: '所属部门',
    field: 'head_depart_name',
    minWidth: 90,
  }, {
    headerName: '迭代状态',
    field: 'execution_status_name',
    minWidth: 90,
  }, {
    headerName: 'SQA',
    field: 'execution_sqa_name',
    minWidth: 90,
  }, {
    headerName: '',
    field: 'demand_directory_url',
    cellRenderer: "myUrl"
  }, {
    headerName: '石墨需求目录',
    field: 'demand_directory',
    minWidth: 120,
    cellRenderer: "shimoStoryContent"
  }, {
    headerName: '需求基线状态',
    field: 'demand_status',
    minWidth: 120,
  }, {
    headerName: '',
    field: 'design_directory_url',
    cellRenderer: "myUrl"
  }, {
    headerName: '石墨概设目录',
    field: 'design_directory',
    minWidth: 120,
    cellRenderer: "shimoOverviewContent"
  }, {
    headerName: '概设基线状态',
    field: 'design_status',
    minWidth: 120,
  }, {
    headerName: '操作',
    minWidth: 90,
    pinned: "right",
    cellRenderer: "operate"
  }];

const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"}
  const whiteFile = ["demand_directory", "design_directory"];
  if (whiteFile.indexOf(params.column?.colId) < 0) {
    style["background-color"] = '#F8F8F8';
  }
  return style;

};
export {columns, setCellStyle}
