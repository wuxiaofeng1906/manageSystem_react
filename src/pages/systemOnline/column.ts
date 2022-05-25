import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
const common_status={
  yes:'是',
  no:'否',
  success: '发布成功',
  failure: '发布失败'
}
const cellRenderStatus = ( {value}: any)=> `<span class="${['no','unknow'].includes(value) ? '': (['yes','success'].includes(value))?'color-success':'color-failure'}">${common_status[value] ||''}</span>`

// 发布列表
const publishColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '正式发布批号',
    field: 'publish_version',
  },
  {
    headerName: '发布项目',
    field: 'publish_project',
  },
  {
    headerName: '发布结果',
    field: 'publish_result',
    cellRenderer: cellRenderStatus
  },
  {
    headerName: '项目负责人',
    field: 'publish_person',
  },
  {
    headerName: '发布分支',
    field: 'publish_branch',
  },
  {
    headerName: '发布类型',
    field: 'publish_type',
  },
  {
    headerName: '发布方式',
    field: 'publish_by',
  },
  {
    headerName: '发布环境',
    field: 'publish_env',
  },
  {
    headerName: '正式发布时间',
    field: 'publish_date',
  }
];

// 项目升级
const projectUpgradeColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '项目名称',
    field: 'name',
  },
  {
    headerName: '项目负责人',
    field: 'leader',
  },
  {
    headerName: '是否涉及数据库升级',
    field: 'update_dbs',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否涉及数据Recovery',
    field: 'recovery',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否清理缓存',
    field: 'clear',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否清理应用缓存',
    field: 'application',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '后端是否涉及配置项增加',
    field: 'setting_add',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '前端是否涉及元数据更新',
    field: 'origin_update',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '备注',
    field: 'mark',
  },
  {
    headerName: '操作',
    width: 120,
    pinned: 'right',
    cellRenderer: 'operation',
  },
];
// 发布服务
const publishServerColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    minWidth: 60,
    cellRenderer: (params: any) => {
      if(params.data.rowSpan) return (+params.node.id + 1).toString()
      return ''
    },
    cellClass:'cell-span',
    rowSpan:(v)=>v.data.rowSpan||1,
  },
  {
    headerName: '上线环境',
    field: 'online_env',
    headerClass:'ag-required',
    cellClass:'cell-span',
    rowSpan:(v)=>v.data.rowSpan||1,
    cellRenderer: (params: any) => {
      if(params.data.rowSpan) return params.value
      return ''
    },
  },
  {
    headerName: '应用',
    field: 'application',
  },
  {
    headerName: '对应侧',
    field: 'side',
  },
  {
    headerName: '是否封板',
    field: 'version',
    headerClass:'ag-required',
    cellRenderer:cellRenderStatus
  },
  {
    headerName: '封板时间',
    field: 'date',
  },
  {
    headerName: '操作',
    cellRenderer: 'operation',
    width: 160,
  },
];
// 数据修复
const dataReviewColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '数据修复内容',
    field: 'review_content',
  },
  {
    headerName: '涉及租户',
    field: 'users',
  },
  {
    headerName: '类型',
    field: 'type',
  },
  {
    headerName: '修复提交人',
    field: 'commit_person',
  },
  {
    headerName: '分支',
    field: 'branch',
  },
  {
    headerName: '评审结果',
    field: 'result',
  },
  {
    headerName: '是否可重复执行',
    field:'repeat'
  },
];
// 接口升级
const upgradeSQLColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'publish_num',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '上线环境',
    field: 'online_env',
    headerClass:'ag-required'
  },
  {
    headerName: '升级类型',
    field: 'upgrade_type',
  },
  {
    headerName: '升级接口',
    field: 'upgrade_sql',
  },
  {
    headerName: '接口服务',
    field: 'services',
  },
  {
    headerName: '接口Method',
    field: 'method',
  },
  {
    headerName: '接口URL或SQL',
    field: 'sql',
  },
  {
    headerName: 'Data',
    field: 'data',
  },
  {
    headerName: 'Header',
    field: 'header',
  },
  {
    headerName: '涉及租户',
    field: 'users',
  },
  {
    headerName: '是否记录积压',
    field: 'record',
    cellRenderer:cellRenderStatus,
    headerClass:'ag-required' // 表头标题添加 * 类名
  },
  {
    headerName: '操作',
    minWidth: 90,
    cellRenderer: 'operation',
    rowDrag:true,        // drag
    cellClass:'ag-drag' // 存在多个图标操作时，需要加上此类名【因为移动图标在最前面，一个情况下可忽略】
  },
];
// 部署
const deployColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '目标环境',
    field: 'env',
  },
  {
    headerName: '部署类型',
    field: 'type',
  },
  {
    headerName: '目标任务',
    field: 'task',
  },
  {
    headerName: '触发者',
    field: 'trigger',
  },
  {
    headerName: '启动时间',
    field: 'start_date',
  },
  {
    headerName: '完成时间',
    field: 'finish_date',
  },
  {
    headerName: '当前状态',
    field: 'status',
  },
  {
    headerName: '操作',
    minWidth: 90,
    cellRenderer: 'operation',
  },
];

// 检查详情
const checkDetailColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    width: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '检查类别',
    field: 'type',
  },
  {
    headerName: '检查状态',
    field: 'status',
  },
  {
    headerName: '检查开始时间',
    field: 'start_time',
    colSpan:(v)=>v.data.colSpan || 1
  },
  {
    headerName: '检查结束时间',
    field: 'end_time',
  },
  {
    headerName: '操作',
    width: 90,
    cellRenderer: 'operation',
  },
];

// 前端服务配置
const servicesSettingColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    width: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '所属执行',
    field: 'macking',
    headerClass:'ag-required'
  },
  {
    headerName: '涉及前端应用',
    field: 'application',
    headerClass:'ag-required'
  },
  {
    headerName: '项目状态',
    field: 'status',
    cellRenderer: 'cellTag',
  },
  {
    headerName: '编辑人',
    field: 'editor',
  },
  {
    headerName: '编辑时间',
    field: 'time',
  },
  {
    headerName: '操作',
    width: 120,
    cellRenderer: 'operation',
  },
];
export {
  publishColumn,
  projectUpgradeColumn,
  publishServerColumn,
  upgradeSQLColumn,
  dataReviewColumn,
  deployColumn,
  checkDetailColumn,
  servicesSettingColumn
};
