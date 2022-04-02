// 表格列的定义

const columns: any = [{
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
  cellRenderer: "myUrl"
}, {
  headerName: '变更禅道编号',
  field: 'shimo_url',
  minWidth: 120,
  cellRenderer: "shimoOverviewContent"
}, {
  headerName: '备注说明',
  field: 'shimo_url',
  minWidth: 120,
}];

// 表格测试数据
const testData = [
  {
    temp_type_name: "迭代名称"
  }
]

const setCellStyle = (params: any) => {
  const style = {"line-height": "28px"}
  if (params.column?.colId === "description") {
    style["background-color"] = '#F8F8F8';
  }
  return style;

};
export {columns, testData, setCellStyle}
