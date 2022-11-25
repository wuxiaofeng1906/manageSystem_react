import React from 'react';
import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import type { ColumnsType } from 'antd/lib/table';
import {
  PublishStatus,
  ReleaseOrderStatus,
  WhetherOrNot,
  ZentaoPhase,
  ZentaoStatus,
  ZentaoType,
} from '@/pages/onlineSystem/config/constant';
import Ellipsis from '@/components/Elipsis';
const cpWhetherOrNot = { ...WhetherOrNot, unknown: '免' };

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
    field: 'online_branch',
    minWidth: 150,
    tooltipField: 'online_branch',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project',
    minWidth: 150,
    tooltipField: 'project',
  },
  { headerName: '项目负责人', field: 'project_manager', minWidth: 140 },
  {
    headerName: '应用服务',
    field: 'apps',
    minWidth: 130,
    tooltipField: 'apps',
  },
  {
    headerName: '状态',
    field: 'online_status',
    minWidth: 110,
    valueFormatter: (p) => PublishStatus[p.value] ?? '',
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
    field: 'release_name',
    minWidth: 150,
    tooltipField: 'release_name',
    cellRenderer: 'link',
  },
  {
    headerName: '项目名称',
    field: 'project',
    minWidth: 150,
    tooltipField: 'project',
  },
  { headerName: '发布集群', field: 'cluster', minWidth: 140 },
  {
    headerName: '上线分支',
    field: 'branch',
    minWidth: 130,
    tooltipField: 'branch',
  },
  { headerName: '发布服务', field: 'apps', minWidth: 110 },
  { headerName: '创建人', field: 'create_user', minWidth: 110 },
  { headerName: '创建时间', field: 'create_time', minWidth: 110 },
  {
    headerName: '发布单状态',
    field: 'release_result',
    minWidth: 110,
    valueFormatter: (p) => ReleaseOrderStatus[p.value] ?? '',
  },
  { headerName: '工单部署结束时间', field: 'repair_order_fish_time', minWidth: 110 },
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
    field: 'type',
    minWidth: 120,
    valueFormatter: (p) => ZentaoType[p.value] ?? '',
  },
  { headerName: '编号', field: 'num', minWidth: 110, cellRenderer: 'link' },
  {
    headerName: '阶段',
    field: 'phase',
    minWidth: 110,
    valueFormatter: (p) => ZentaoPhase[p.value] ?? '',
  },
  { headerName: '执行名称', field: 'execution', minWidth: 130 },
  { headerName: '标题名称', field: 'title', minWidth: 110 },
  { headerName: '应用服务', field: 'server', minWidth: 110 },
  { headerName: '严重等级', field: 'level', minWidth: 110 },
  { headerName: '所属模块', field: 'module', minWidth: 110 },
  { headerName: '创建人', field: 'creator', minWidth: 110 },
  { headerName: '指派人', field: 'assignedPm', minWidth: 110 },
];
export const zentaoTestColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  { headerName: '归属执行', field: 'execution', minWidth: 120 },
  {
    headerName: '测试单名称',
    field: 'name',
    minWidth: 110,
    cellRenderer: 'testSheet',
  },
  { headerName: '测试单对应版本', field: 'version', minWidth: 110 },
  {
    headerName: '状态',
    field: 'status',
    minWidth: 130,
    valueFormatter: (p) => ZentaoStatus[p.value] ?? '',
  },
  { headerName: '负责人', field: 'pm', minWidth: 110 },
  { headerName: '用例总数', field: 'total', minWidth: 110 },
  { headerName: '通过用例数', field: 'passNum', minWidth: 110 },
  {
    headerName: '阻塞用例数',
    field: 'blockNum',
    minWidth: 110,
    cellStyle: { color: 'red' },
  },
  {
    headerName: '失败用例数',
    field: 'failNum',
    minWidth: 110,
    cellStyle: { color: 'red' },
  },
  { headerName: '未执行用例数', field: 'notExecutedNum', minWidth: 110 },
  { headerName: 'BUG总数', field: 'bug', minWidth: 110 },
  { headerName: 'BUG-P1', field: 'p1', minWidth: 110 },
  { headerName: 'BUG-P2', field: 'p2', minWidth: 110 },
  { headerName: 'BUG-P3', field: 'p3', minWidth: 110 },
  { headerName: 'BUG-P4', field: 'p4', minWidth: 110 },
];

export const preServerColumn: ColumnsType<any> = [
  {
    title: '应用',
    dataIndex: 'apps',
    onCell: (v) => ({ rowSpan: v?.rowSpan ?? 1 }),
    width: 100,
  },
  {
    title: '项目名称',
    dataIndex: 'project',
    width: 200,
    ellipsis: { showTitle: false },
    render: (v) => <Ellipsis title={v} width={190} placement={'bottomLeft'} color={'#108ee9'} />,
  },
  {
    title: '是否封板',
    dataIndex: 'is_sealing',
    width: 120,
    render: (v) => (
      <span style={{ color: v == 'yes' ? 'green' : 'initial' }}>{cpWhetherOrNot[v] ?? v}</span>
    ),
  },
  { title: '封板/封板人', dataIndex: 'sealing_user', width: 120 },
  { title: '封板/封板时间', dataIndex: 'sealing_time', width: 120 },
  { title: '需求编号', dataIndex: 'story_num', width: 120 },
  {
    title: '需求标题',
    dataIndex: 'title',
    width: 200,
    render: (v) => <Ellipsis title={v} width={190} placement={'bottomLeft'} color={'#108ee9'} />,
  },
  {
    title: '是否涉及数据update',
    dataIndex: 'data_upgrade',
    width: 150,
    render: (v) => cpWhetherOrNot[v] ?? v,
  },
  {
    title: '是否涉及数据Recovery',
    dataIndex: 'is_recovery',
    width: 160,
    render: (v) => cpWhetherOrNot[v] ?? v,
  },
  {
    title: '是否可热更',
    dataIndex: 'is_hot_update',
    width: 120,
    render: (v) => cpWhetherOrNot[v] ?? v,
  },
  { title: '需求创建人', dataIndex: 'create_user_name', width: 120 },
  { title: '需求指派人', dataIndex: 'assigned_to_name', width: 120 },
];
// 升级接口
export const upgradeServicesColumn: (ColDef | ColGroupDef)[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 35,
    minWidth: 35,
    pinned: 'left',
  },
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    pinned: 'left',
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  { headerName: '接口服务', field: 'api_server', minWidth: 120 },
  { headerName: '接口Method', field: 'api_method', minWidth: 110 },
  { headerName: '接口URL', field: 'api_url', minWidth: 110 },
  { headerName: 'Data', field: 'api_data', minWidth: 130 },
  { headerName: 'Header', field: 'api_header', minWidth: 110 },
  { headerName: '租户ID', field: 'tenant', minWidth: 110 },
];
export const repairColumn: (ColDef | ColGroupDef)[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 35,
    minWidth: 35,
    pinned: 'left',
  },
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    pinned: 'left',
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  { headerName: '数据修复内容', field: 'title', minWidth: 120 },
  { headerName: '涉及租户', field: 'tenant', minWidth: 110 },
  { headerName: '类型', field: 'recovery_type', minWidth: 110 },
  { headerName: '修复提交人', field: 'author', minWidth: 130 },
  { headerName: '分支', field: 'branch', minWidth: 110 },
  { headerName: 'sql详情', field: 'sql_detail', width: 100, cellRenderer: 'log' },
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
  { headerName: '接口服务', field: 'server', minWidth: 110 },
  { headerName: '接口Method', field: 'method', minWidth: 110 },
  { headerName: '接口URL', field: 'url', minWidth: 110 },
  { headerName: 'Data', field: 'data', minWidth: 110 },
  { headerName: 'Header', field: 'header', minWidth: 110 },
  { headerName: '涉及租户', field: 'tendent', minWidth: 110 },
  { headerName: '并发数', field: 'count', minWidth: 110, headerClass: 'ag-required' },
  { headerName: '操作', minWidth: 110, cellRenderer: 'operation' },
];
