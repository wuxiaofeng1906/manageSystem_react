import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { COMMON_STATUS, DEPLOY_TYPE } from './constants';

const cellRenderStatus = ({ value }: any) =>
  `<span class="${
    ['no', 'unknown'].includes(value)
      ? ''
      : ['yes', 'success'].includes(value)
      ? 'color-success'
      : 'color-failure'
  }">${COMMON_STATUS[value] || ''}</span>`;

const formatDeployStatus = ({ value }: any) => `<span class="color-${value}">${value || ''}</span>`;

// 发布列表
const publishColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 60,
  },
  {
    headerName: '正式发布批次号',
    field: 'release_num',
  },
  {
    headerName: '发布项目',
    field: 'release_project_name',
    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left' },
  },
  {
    headerName: '发布结果',
    field: 'release_result',
    cellRenderer: cellRenderStatus,
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
    cellRenderer: 'typeFormat',
  },
  {
    headerName: '发布方式',
    field: 'release_method',
    cellRenderer: 'methodFormat',
  },
  {
    headerName: '发布环境',
    field: 'release_cluster',
  },
  {
    headerName: '正式发布时间',
    field: 'release_date',
  },
];

// 项目升级
const projectUpgradeColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
    minWidth: 60,
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 120,
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '项目负责人',
    field: 'manager',
    minWidth: 120,
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '是否涉及数据库升级',
    field: 'is_database_upgrade',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 170,
  },
  {
    headerName: '是否涉及数据Recovery',
    field: 'is_recovery_database',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 190,
  },
  {
    headerName: '是否清理缓存',
    field: 'is_clear_redis',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 120,
  },
  {
    headerName: '是否清理应用缓存',
    field: 'is_clear_app_cache',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 140,
  },
  {
    headerName: '后端是否涉及配置项增加',
    field: 'is_add_front_config',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 180,
  },
  {
    headerName: '前端是否涉及元数据更新',
    field: 'is_front_data_update',
    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required',
    minWidth: 180,
  },
  {
    headerName: '备注',
    field: 'mark',
  },
  {
    headerName: '操作',
    pinned: 'right',
    minWidth: 120,
    cellRenderer: 'operation',
  },
];
const serverColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
    width: 90,
  },
  {
    headerName: '应用',
    field: 'app_name',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '对应侧',
    field: 'technical_side',
    cellStyle: { background: '#f5f5f5' },
    valueFormatter: ({ value }) => COMMON_STATUS[value] || '-',
  },
  {
    headerName: '测试确认封板',
    field: 'is_seal',
    headerClass: 'ag-required',
    cellRenderer: cellRenderStatus,
  },
  {
    headerName: '测试确认封版时间',
    field: 'seal_time',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '操作',
    pinned: 'right',
    width: 90,
    cellRenderer: 'operation',
  },
];
// 数据修复
const dataReviewColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'review_id',
    width: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '数据修复内容',
    field: 'description',
    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left', background: '#f5f5f5' },
  },
  {
    headerName: '涉及租户',
    field: 'tenant_ids',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '类型',
    field: 'review_type',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '修复提交人',
    field: 'commiter',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '分支',
    field: 'branch',
    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: 'sql详情',
    field: 'content',
    cellStyle: { background: '#f5f5f5' },
  },
  // {
  //   headerName: '评审结果',
  //   field: 'review_result',
  // },
  // {
  //   headerName: '是否可重复执行',
  //   field: 'is_repeat',
  // },
];
// 接口升级
const upgradeSQLColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'api_id',
    minWidth: 60,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  // {
  //   headerName: '上线环境',
  //   field: 'cluster_name',
  //   headerClass: 'ag-required',
  // },
  {
    headerName: '升级类型',
    field: 'update_type',
    cellStyle: { background: '#f5f5f5' },
    minWidth: 120,
    valueFormatter: ({ value }) => COMMON_STATUS[value] || '-',
  },
  {
    headerName: '升级接口',
    field: 'update_api',
    minWidth: 120,

    cellStyle: { background: '#f5f5f5' },
    valueFormatter: ({ value }) => COMMON_STATUS[value] || '-',
  },
  {
    headerName: '接口服务',
    field: 'app_server',
    minWidth: 120,

    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left', background: '#f5f5f5' },
  },
  {
    headerName: '接口Method',
    field: 'method_name',
    minWidth: 120,

    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '接口URL或SQL',
    field: 'url_or_sql',
    minWidth: 120,
    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left', background: '#f5f5f5' },
  },
  {
    headerName: 'Data',
    field: 'request_data',
    minWidth: 120,

    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left', background: '#f5f5f5' },
  },
  {
    headerName: 'Header',
    field: 'header',
    minWidth: 120,
    headerClass: 'ag-align-left',
    cellStyle: { textAlign: 'left', background: '#f5f5f5' },
  },
  {
    headerName: '涉及租户',
    field: 'tenant_ids',
    minWidth: 120,

    cellStyle: { background: '#f5f5f5' },
  },
  {
    headerName: '是否记录积压',
    field: 'record_backlog',
    minWidth: 120,

    cellRenderer: cellRenderStatus,
    headerClass: 'ag-required', // 表头标题添加 * 类名
  },
  {
    headerName: '操作',
    minWidth: 140,
    cellRenderer: 'operation',
    pinned: 'right',
    rowDrag: true, // drag
    cellClass: 'ag-drag', // 存在多个图标操作时，需要加上此类名【因为移动图标在最前面，一个情况下可忽略】
  },
];
// 部署
const deployColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
    minWidth: 60,
  },
  {
    headerName: '一键部署ID',
    field: 'sheet_id',
    minWidth: 120,
  },
  {
    headerName: '目标环境',
    field: 'release_env',
    minWidth: 120,
  },
  {
    headerName: '部署类型',
    field: 'deployment',
    minWidth: 120,

    valueFormatter: ({ value }) => DEPLOY_TYPE[value] || '-',
  },
  {
    headerName: '目标任务',
    field: 'deployment_app',
    minWidth: 120,
  },
  {
    headerName: '触发者',
    field: 'executor_name',
    minWidth: 120,
  },
  {
    headerName: '启动时间',
    field: 'start_time',
    minWidth: 120,
  },
  {
    headerName: '完成时间',
    field: 'end_time',
    minWidth: 120,
  },
  {
    headerName: '当前状态',
    field: 'status',
    minWidth: 120,
    cellRenderer: formatDeployStatus,
  },
  {
    headerName: '操作',
    minWidth: 120,
    cellRenderer: 'operation',
    pinned: 'right',
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
    cellRenderer: 'checkStatus',
  },
  {
    headerName: '检查开始时间',
    field: 'start_time',
    colSpan: (v) => v.data.colSpan || 1,
  },
  {
    headerName: '检查结束时间',
    field: 'end_time',
  },
  {
    headerName: '操作',
    pinned: 'right',
    width: 110,
    cellRenderer: 'operation',
  },
];

// 前端服务配置
const servicesSettingColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 60,
  },
  {
    headerName: '所属执行',
    field: 'project_name',
    headerClass: 'ag-required',
  },
  {
    headerName: '涉及前端应用',
    field: 'app_name',
    headerClass: 'ag-required',
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
    pinned: 'right',
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
  serverColumn,
};
