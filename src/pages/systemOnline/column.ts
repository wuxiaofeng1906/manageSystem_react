import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { ColumnsType } from 'antd/lib/table';
import { Iservices } from './prePublish/projectServices/EditServices';

const common_status={
  yes:'是',
  no:'否',
  success: '发布成功',
  feature: '发布失败'
}
const cellRenderStatus = ( {value}: any)=> `<span class="${['no','unknow'].includes(value) ? '': (['yes','success'].includes(value))?'color-success':'color-feature'}">${common_status[value] ||''}</span>`

// 发布列表
const publishColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '正式发布批号',
    field: 'release_num',
  },
  {
    headerName: '发布项目',
    field: 'release_project_name',
  },
  {
    headerName: '发布结果',
    field: 'release_result',
    cellRenderer: cellRenderStatus
  },
  {
    headerName: '项目负责人',
    field: 'pro_manager',
  },
  {
    headerName: '发布分支',
    field: 'release_branch',
  },
  {
    headerName: '发布类型',
    field: 'release_type',
  },
  {
    headerName: '发布方式',
    field: 'release_method',
  },
  {
    headerName: '发布环境',
    field: 'release_env',
  },
  {
    headerName: '正式发布时间',
    field: 'release_date',
  }
];

// 项目升级
const projectUpgradeColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '项目名称',
    field: 'project_name',
  },
  {
    headerName: '项目负责人',
    field: 'manager',
  },
  {
    headerName: '是否涉及数据库升级',
    field: 'is_database_upgrade',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否涉及数据Recovery',
    field: 'is_recovery_database',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否清理缓存',
    field: 'is_clear_redis',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '是否清理应用缓存',
    field: 'is_clear_app_cache',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '后端是否涉及配置项增加',
    field: 'is_add_front_config',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '前端是否涉及元数据更新',
    field: 'is_front_data_update',
    cellRenderer: cellRenderStatus,
    headerClass:'ag-required'
  },
  {
    headerName: '备注',
    field: 'mark',
  },
  {
    headerName: '操作',
    minWidth: 120,
    cellRenderer: 'operation',
  },
];
// 数据修复
const dataReviewColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'review_id',
    minWidth: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '数据修复内容',
    field: 'review_data',
  },
  {
    headerName: '涉及租户',
    field: 'tenant',
  },
  {
    headerName: '类型',
    field: 'review_type',
  },
  {
    headerName: '修复提交人',
    field: 'user',
  },
  {
    headerName: '分支',
    field: 'branch',
  },
  {
    headerName: '评审结果',
    field: 'review_result',
  },
  {
    headerName: '是否可重复执行',
    field:'is_repeat'
  },
];
// 接口升级
const upgradeSQLColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'api_id',
    minWidth: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '上线环境',
    field: 'cluster_name',
    headerClass:'ag-required'
  },
  {
    headerName: '升级类型',
    field: 'update_type',
  },
  {
    headerName: '升级接口',
    field: 'update_api',
  },
  {
    headerName: '接口服务',
    field: 'api_server',
  },
  {
    headerName: '接口Method',
    field: 'api_method',
  },
  {
    headerName: '接口URL或SQL',
    field: 'api_content',
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
    field: 'tenant',
  },
  {
    headerName: '是否记录积压',
    field: 'is_backlog',
    cellRenderer:cellRenderStatus,
    headerClass:'ag-required' // 表头标题添加 * 类名
  },
  {
    headerName: '操作',
    minWidth: 100,
    cellRenderer: 'operation',
    rowDrag:true,        // drag
    cellClass:'ag-drag' // 存在多个图标操作时，需要加上此类名【因为移动图标在最前面，一个情况下可忽略】
  },
];
// 部署
const deployColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    minWidth: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '目标环境',
    field: 'release_env',
  },
  {
    headerName: '部署类型',
    field: 'deployment_type',
  },
  {
    headerName: '目标任务',
    field: 'task',
  },
  {
    headerName: '触发者',
    field: 'executor_name',
  },
  {
    headerName: '启动时间',
    field: 'start_time',
  },
  {
    headerName: '完成时间',
    field: 'end_time',
  },
  {
    headerName: '当前状态',
    field: 'status',
  },
  {
    headerName: '操作',
    minWidth: 120,
    cellRenderer: 'operation',
    pinned:'right'
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
    minWidth: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '所属执行',
    field: 'project_name',
    headerClass:'ag-required'
  },
  {
    headerName: '涉及前端应用',
    field: 'app_name',
    headerClass:'ag-required'
  },
  {
    headerName: '项目状态',
    field: 'status',
    cellRenderer: 'cellTag',
  },
  {
    headerName: '编辑人',
    field: 'edit_user_name',
  },
  {
    headerName: '编辑时间',
    field: 'edit_time',
  },
  {
    headerName: '操作',
    minWidth: 140,
    cellRenderer: 'operation',
  },
];
// 发布服务
const serviceColumn: ColumnsType<Iservices> = [
  {
    title: '序号',
    dataIndex: 'server_id',
    align: 'center',
    onCell: (it) => ({ rowSpan: it.rowSpan || 0 }),
  },
  {
    title: '上线环境',
    dataIndex: 'cluster_name',
    align: 'center',
    onCell: (it) => ({ rowSpan: it.rowSpan || 0 }),
  },
  {
    title: '应用',
    align: 'center',
    dataIndex: 'app_name',
  },
  {
    title: '对应侧',
    align: 'center',
    dataIndex: 'technical_side',
  },
  {
    title: '是否封板',
    align: 'center',
    dataIndex: 'is_seal',
  },
  {
    title: '封板时间',
    align: 'center',
    dataIndex: 'seal_time',
  },
];

export {
  publishColumn,
  projectUpgradeColumn,
  upgradeSQLColumn,
  dataReviewColumn,
  deployColumn,
  checkDetailColumn,
  servicesSettingColumn,
  serviceColumn
};
