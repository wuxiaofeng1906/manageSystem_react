import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import type { ColumnsType } from 'antd/lib/table';
export const calendarColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '上线分支',
    field: 'branch',
    minWidth: 150,
    tooltipField: 'branch',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 150,
    tooltipField: 'project_name',
  },
  {
    headerName: '项目负责人',
    field: 'pro_name',
    minWidth: 140,
  },
  {
    headerName: '应用服务',
    field: 'appservice',
    minWidth: 130,
    tooltipField: 'project_name',
  },
  {
    headerName: '状态',
    field: 'status',
    minWidth: 110,
  },
];
// 发布过程列表
export const preProcessColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '发布批次名',
    field: 'name',
    minWidth: 150,
    tooltipField: 'name',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project_name',
    minWidth: 150,
    tooltipField: 'project_name',
  },
  {
    headerName: '发布集群',
    field: 'env',
    minWidth: 140,
  },
  {
    headerName: '上线分支',
    field: 'branch',
    minWidth: 130,
    tooltipField: 'branch',
  },
  {
    headerName: '发布服务',
    field: 'appservice',
    minWidth: 110,
  },
  {
    headerName: '创建人',
    field: 'creater',
    minWidth: 110,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 110,
  },
  {
    headerName: '发布单状态',
    field: 'status',
    minWidth: 110,
  },
  {
    headerName: '工单部署结束时间',
    field: 'end_time',
    minWidth: 110,
  },
];
// 禅道概况
export const zentaoStoryColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '类型',
    field: 'name',
    minWidth: 120,
  },
  {
    headerName: '编号',
    field: 'num',
    minWidth: 110,
    cellRenderer: 'link',
  },
  {
    headerName: '阶段',
    field: 'phase',
    minWidth: 110,
  },
  {
    headerName: '执行名称',
    field: 'execution',
    minWidth: 130,
  },
  {
    headerName: '标题名称',
    field: 'title',
    minWidth: 110,
  },
  {
    headerName: '应用服务',
    field: 'server',
    minWidth: 110,
  },
  {
    headerName: '严重等级',
    field: 'level',
    minWidth: 110,
  },
  {
    headerName: '所属模块',
    field: 'module',
    minWidth: 110,
  },
  {
    headerName: '创建人',
    field: 'creator',
    minWidth: 110,
  },
  {
    headerName: '指派人',
    field: 'assignedPm',
    minWidth: 110,
  },
];
export const zentaoTestColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '归属执行',
    field: 'execution',
    minWidth: 120,
  },
  {
    headerName: '测试单名称',
    field: 'name',
    minWidth: 110,
    cellRenderer: 'testSheet',
  },
  {
    headerName: '测试单对应版本',
    field: 'version',
    minWidth: 110,
  },
  {
    headerName: '状态',
    field: 'status',
    minWidth: 130,
  },
  {
    headerName: '负责人',
    field: 'pm',
    minWidth: 110,
  },
  {
    headerName: '用例总数',
    field: 'total',
    minWidth: 110,
  },
  {
    headerName: '通过用例数',
    field: 'passNum',
    minWidth: 110,
  },
  {
    headerName: '阻塞用例数',
    field: 'blockNum',
    minWidth: 110,
  },
  {
    headerName: '失败用例数',
    field: 'failNum',
    minWidth: 110,
  },
  {
    headerName: '未执行用例数',
    field: 'notExecutedNum',
    minWidth: 110,
  },
  {
    headerName: 'BUG总数',
    field: 'bug',
    minWidth: 110,
  },
  {
    headerName: 'BUG-P1',
    field: 'p1',
    minWidth: 110,
  },
  {
    headerName: 'BUG-P2',
    field: 'p2',
    minWidth: 110,
  },
  {
    headerName: 'BUG-P3',
    field: 'p3',
    minWidth: 110,
  },
  {
    headerName: 'BUG-P4',
    field: 'p4',
    minWidth: 110,
  },
];

export const preServerColumn: ColumnsType<any> = [
  {
    title: '应用',
    dataIndex: 'applicant',
    onCell: (v) => ({ rowSpan: v?.rowSpan ?? 1 }),
    fixed: 'left',
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
    fixed: 'left',
  },
  {
    title: '是否封板',
    dataIndex: 'env',
  },
  {
    title: '封板/封板人',
    dataIndex: 'branch',
  },
  {
    title: '封板/封板时间',
    dataIndex: 'time',
  },
  {
    title: '需求编号',
    dataIndex: 'num',
  },
  {
    title: '需求标题',
    dataIndex: 'title',
  },
  {
    title: '是否涉及数据update',
    dataIndex: 'update',
  },
  {
    title: '是否涉及数据Recovery',
    dataIndex: 'recovery',
  },
  {
    title: '是否可热更',
    dataIndex: 'hot',
  },
  {
    title: '需求创建人',
    dataIndex: 'create_pm',
  },
  {
    title: '需求指派人',
    dataIndex: 'point_pm',
  },
];
// 升级接口
export const upgradeServicesColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '接口服务',
    field: 'service',
    minWidth: 120,
  },
  {
    headerName: '接口Methhod',
    field: 'method',
    minWidth: 110,
  },
  {
    headerName: '接口URL',
    field: 'url',
    minWidth: 110,
  },
  {
    headerName: 'Data',
    field: 'data',
    minWidth: 130,
  },
  {
    headerName: 'Header',
    field: 'header',
    minWidth: 110,
  },
  {
    headerName: '租户ID',
    field: 'tendent',
    minWidth: 110,
  },
];
export const repaireColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '数据修复内容',
    field: 'content',
    minWidth: 120,
  },
  {
    headerName: '涉及租户',
    field: 'tendence',
    minWidth: 110,
  },
  {
    headerName: '类型',
    field: 'type',
    minWidth: 110,
  },
  {
    headerName: '修复提交人',
    field: 'repaire_pm',
    minWidth: 130,
  },
  {
    headerName: '分支',
    field: 'branch',
    minWidth: 110,
  },
  {
    headerName: 'sql详情',
    field: 'detail',
    minWidth: 110,
  },
];
export const serverConfirmColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '前端值班',
    field: 'front_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'front_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'front_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'front_time',
    minWidth: 130,
  },
  {
    headerName: '后端值班',
    field: 'backend_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'backend_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'backend_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'backend_time',
    minWidth: 130,
  },
  {
    headerName: '流程值班',
    field: 'process_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'process_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'process_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'process_time',
    minWidth: 130,
  },
  {
    headerName: 'jsf值班',
    field: 'jsf_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'jsf_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'jsf_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'jsf_time',
    minWidth: 130,
  },
  {
    headerName: 'global值班',
    field: 'global_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'global_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'global_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'global_time',
    minWidth: 130,
  },
  {
    headerName: 'openapi&qtms值班',
    field: 'openapi_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'openapi_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'openapi_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'openapi_time',
    minWidth: 130,
  },
  {
    headerName: 'emitter值班',
    field: 'emitter_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'emitter_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'emitter_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'emitter_time',
    minWidth: 130,
  },
  {
    headerName: 'qbos&store值班',
    field: 'qbos_user_name',
    minWidth: 120,
  },
  {
    headerName: '是否可热更',
    field: 'qbos_hot',
    minWidth: 110,
  },
  {
    headerName: '服务确认完成',
    field: 'qbos_confirm',
    minWidth: 110,
    cellRenderer: 'select',
  },
  {
    headerName: '确认时间',
    field: 'qbos_time',
    minWidth: 130,
  },
];
export const PublishSeverColumn: (ColDef | ColGroupDef)[] = [
  { headerName: '环境', field: 'env', minWidth: 110, cellRenderer: 'env' },
  { headerName: '应用', field: 'applicant', minWidth: 110 },
  { headerName: '镜像源环境', field: 'origin_env', minWidth: 110 },
  { headerName: 'batch版本', field: 'batch', minWidth: 110 },
  { headerName: '数据库版本', field: 'access', minWidth: 110 },
  { headerName: '数据Recovery', field: 'recovery', minWidth: 110 },
  { headerName: '数据update', field: 'update', minWidth: 110 },
  { headerName: '是否清理redis缓存', field: 'redis', minWidth: 110 },
  { headerName: '是否清理应用缓存', field: 'app', minWidth: 110 },
  { headerName: 'SQL工单', field: 'sql', minWidth: 110 },
];
export const PublishUpgradeColumn: (ColDef | ColGroupDef)[] = [
  { headerName: '序号', minWidth: 110, cellRenderer: (params: any) => String(+params.node.id + 1) },
  { headerName: '接口Method', field: 'method', minWidth: 110 },
  { headerName: '接口URL', field: 'url', minWidth: 110 },
  { headerName: 'Data', field: 'data', minWidth: 110 },
  { headerName: 'Header', field: 'header', minWidth: 110 },
  { headerName: '涉及租户', field: 'tendent', minWidth: 110 },
  { headerName: '并发数', field: 'count', minWidth: 110 },
  { headerName: '操作', minWidth: 110, cellRenderer: 'operation' },
];
