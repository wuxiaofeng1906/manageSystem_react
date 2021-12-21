/*
 * @Description: 项目基本信息字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:44:08
 * @LastEditTime: 2021-12-21 10:00:50
 * @LastEditors: jieTan
 * @LastModify:
 */

import { DEFAULT_PLACEHOLDER, PROJ_STATUS, TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { doubleNumberF, numberF, stringF } from './baseParams';

/* 主要字段 */
export const TableMajorCols: ColDef[] = [
  {
    headerName: '序',
    field: 'order',
    valueGetter: (props: any) => props.node.rowIndex + 1,
    ...numberF,
  },
  {
    headerName: '项目名称',
    field: 'project',
    filter: true,
    valueGetter: (params: any) => params.data.project.name,
    cellRenderer: 'linkTo',
    cellRendererParams: { route: '/kpi/performance/project/detail' },
  },
  {
    headerName: '负责人',
    field: 'user.name',
    filter: true,
    columnGroupShow: SHOW['closed'],
    ...doubleNumberF,
  },
  {
    headerName: '所属部门',
    columnGroupShow: SHOW['closed'],
    field: 'dept.name',
  },
  {
    headerName: '项目状态',
    columnGroupShow: SHOW['closed'],
    field: 'project.status',
    filter: true,
    valueGetter: (params: any) => PROJ_STATUS[params.data.project.status]?.zh,
    cellRenderer: 'projStatus',
    ...stringF,
  },
  {
    headerName: '项目分支',
    columnGroupShow: SHOW['closed'],
    filter: true,
    valueGetter: () => DEFAULT_PLACEHOLDER,
    ...stringF,
  },
  {
    headerName: '开始日期',
    field: 'project.start',
    columnGroupShow: SHOW['closed'],
    ...stringF,
  },
  {
    headerName: '结束日期',
    field: 'project.end',
    columnGroupShow: SHOW['closed'],
    ...stringF,
  },
];
//
export const TableMajorGroup: ColGroupDef = {
  headerName: '项目指标',
  children: TableMajorCols,
};
