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
  cellRenderer: (params: any) => {
    return `
        <a href="" target="_blank" >
              <img src="/taskUrl.png" width="15" height="15" alt="日志" title="日志">
         </a>
           `;
  }
}, {
  headerName: '迭代名称',
  field: 'temp_type_name',
  minWidth: 110,

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
  minWidth: 90,
}, {
  headerName: 'SQA',
  field: 'update_user_name',
  minWidth: 90,
}, {
  headerName: '',
  field: 'shimo_url',
  cellRenderer: (params: any) => {

    return `
        <a href=" " target="_blank" >
            <img src="/taskUrl.png" width="15" height="15" alt="日志" title="日志">
        </a>
           `;
  }
}, {
  headerName: '石墨需求目录',
  field: 'shimo_url',
  minWidth: 120,
  cellRenderer: "shimoStoryContent"
}, {
  headerName: '需求基线状态',
  field: 'shimo_url',
  minWidth: 120,
}, {
  headerName: '',
  field: 'shimo_url',
  cellRenderer: (params: any) => {

    return `
        <a href=" " target="_blank" >
            <img src="/taskUrl.png" width="15" height="15" alt="日志" title="日志">
        </a>
           `;
  }
}, {
  headerName: '石墨概设目录',
  field: 'shimo_url',
  minWidth: 120,
  cellRenderer: "shimoOverviewContent"
}, {
  headerName: '概设基线状态',
  field: 'shimo_url',
  minWidth: 120,
}, {
  headerName: '操作',
  minWidth: 90,
  pinned: "right"
}];

// 表格测试数据
const testData = [
  {
    temp_type_name: "222"
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
