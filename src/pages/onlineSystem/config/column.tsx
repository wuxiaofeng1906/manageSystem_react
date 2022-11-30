import React from 'react';
import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import type { ColumnsType } from 'antd/lib/table';
import { sum } from 'lodash';
import {
  PublishStatus,
  ReleaseOrderStatus,
  ServerConfirmType,
  WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';
import Ellipsis from '@/components/Elipsis';
const cpWhetherOrNot = { ...WhetherOrNot, unknown: '免' };

const formatCluster = (p) =>
  p?.value?.includes('cn-northwest-') ? p?.value?.replaceAll('cn-northwest-', '集群') : p.value;

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
  {
    headerName: '发布集群',
    field: 'cluster',
    minWidth: 140,
    valueFormatter: formatCluster,
  },
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
    minWidth: 70,
    maxWidth: 70,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  { headerName: '类型', field: 'category', minWidth: 100 },
  { headerName: '编号', field: 'ztNo', minWidth: 110, cellRenderer: 'link' },
  { headerName: '阶段', field: 'stage.show.zh', minWidth: 110 },
  {
    headerName: '执行名称',
    field: 'execution.name',
    minWidth: 150,
    tooltipField: 'execution.name',
  },
  { headerName: '标题名称', field: 'title', minWidth: 150, tooltipField: 'title' },
  {
    headerName: '应用服务',
    field: 'appservices',
    minWidth: 110,
    cellRenderer: (p) => p.value?.join(',') ?? '',
    tooltipField: 'appservices',
  },
  { headerName: '严重等级', field: 'severity', minWidth: 110 },
  { headerName: '所属模块', field: 'module.name', minWidth: 120, tooltipField: 'module.name' },
  { headerName: '创建人', field: 'openedBy.realname', minWidth: 110 },
  { headerName: '指派人', field: 'assignedTo.realname', minWidth: 110 },
];
export const zentaoTestColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 70,
    maxWidth: 70,
    cellRenderer: (params: any) => String(+params.node.id + 1),
  },
  {
    headerName: '归属执行',
    field: 'execution.name',
    minWidth: 170,
    tooltipField: 'execution.name',
  },
  {
    headerName: '测试单名称',
    field: 'testtask',
    minWidth: 170,
    cellRenderer: 'testSheet',
    tooltipField: 'testtask.name',
  },
  { headerName: '测试单对应版本', field: 'build.name', minWidth: 130 },
  {
    headerName: '状态',
    field: 'status.zh',
    minWidth: 130,
  },
  { headerName: '负责人', field: 'owner.realname', minWidth: 110 },
  // caseNums 用例数:[通过, 阻塞, 失败, 未执行]
  {
    headerName: '用例总数',
    field: 'caseNums',
    minWidth: 110,
    valueFormatter: (p) => sum(p.value),
  },
  {
    headerName: '通过用例数',
    field: 'caseNums',
    minWidth: 110,
    valueFormatter: (p) => p.value?.[0],
  },
  {
    headerName: '阻塞用例数',
    field: 'caseNums',
    minWidth: 110,
    cellStyle: (p) => ({
      color: p.value?.[1] > 0 ? 'red' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[1] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[1],
  },
  {
    headerName: '失败用例数',
    field: 'caseNums',
    minWidth: 110,
    cellStyle: (p) => ({
      color: p.value?.[2] > 0 ? 'red' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[2] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[2],
  },
  {
    headerName: '未执行用例数',
    field: 'caseNums',
    minWidth: 130,
    cellStyle: (p) => ({
      color: p.value?.[3] > 0 ? '#bfbfbf' : 'initial',
      lineHeight: '30px',
      fontWeight: p.value?.[3] > 0 ? 'bold' : 'initial',
    }),
    valueFormatter: (p) => p.value?.[3],
  },
  // bugNums bug数:[P0, P1, P2, P3]
  { headerName: 'BUG总数', field: 'bugNums', minWidth: 110, valueFormatter: (p) => sum(p.value) },
  { headerName: 'BUG-P0', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[0] },
  { headerName: 'BUG-P1', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[1] },
  { headerName: 'BUG-P2', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[2] },
  { headerName: 'BUG-P3', field: 'bugNums', minWidth: 110, valueFormatter: (p) => p.value?.[3] },
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
  { headerName: '涉及租户', field: 'tenant', minWidth: 100 },
  { headerName: '类型', field: 'recovery_type', minWidth: 100 },
  { headerName: '修复提交人', field: 'author', minWidth: 100 },
  { headerName: '分支', field: 'branch', minWidth: 120 },
  { headerName: 'sql详情', field: 'sql_detail', width: 90, cellRenderer: 'log' },
];
export const serverConfirmColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '技术侧',
    field: 'confirm_type',
    valueFormatter: (p) => ServerConfirmType[p.value],
  },
  { headerName: '值班人', field: 'server_confirm_user' },
  {
    headerName: '是否可热更',
    field: 'is_hot_update',
    headerClass: 'ag-required',
    cellRenderer: 'select',
  },
  {
    headerName: '服务确认完成',
    field: 'confirm_result',
    cellRenderer: 'select',
    headerClass: 'ag-required',
  },
  { headerName: '确认时间', field: `confirm_time` },
];
export const PublishSeverColumn = (data: any): (ColDef | ColGroupDef)[] => {
  return [
    {
      headerName: '环境',
      field: 'cluster',
      minWidth: 110,
    },
    { headerName: '应用', field: 'apps', minWidth: 110 },
    { headerName: '镜像源环境', field: 'release_env', minWidth: 110 },
    {
      headerName: 'batch版本',
      field: 'batch',
      minWidth: 110,
      hide: data?.release_type == 'global',
    },
    {
      headerName: '数据库版本',
      field: 'database_version',
      minWidth: 110,
    },
    {
      headerName: '数据Recovery',
      field: 'is_recovery',
      minWidth: 130,
      cellRenderer: 'select',
      hide: data?.release_way == 'keep_server',
    },
    {
      headerName: '数据update',
      field: 'is_update',
      minWidth: 130,
      cellRenderer: 'select',
      hide: data?.release_way == 'keep_server',
    },
    {
      headerName: '是否清理redis缓存',
      field: 'clear_redis',
      minWidth: 150,
      cellRenderer: 'select',
    },
    { headerName: '是否清理应用缓存', field: 'clear_cache', minWidth: 150, cellRenderer: 'select' },
    {
      headerName: 'SQL工单',
      field: 'sql',
      minWidth: 130,
      hide: data?.release_way == 'keep_server',
    },
  ];
};
export const PublishUpgradeColumn: (ColDef | ColGroupDef)[] = [
  { headerName: '序号', minWidth: 110, cellRenderer: (params: any) => String(+params.node.id + 1) },
  { headerName: '接口服务', field: 'api_server', minWidth: 110 },
  { headerName: '接口Method', field: 'api_method', minWidth: 110 },
  { headerName: '接口URL', field: 'api_url', minWidth: 110 },
  { headerName: 'Data', field: 'api_data', minWidth: 110 },
  { headerName: 'Header', field: 'api_header', minWidth: 110 },
  { headerName: '涉及租户', field: 'tenant', minWidth: 110 },
  { headerName: '并发数', field: 'concurrent', minWidth: 110, headerClass: 'ag-required' },
  { headerName: '操作', minWidth: 110, cellRenderer: 'operation' },
];
