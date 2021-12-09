/*
 * @Description: 项目基本信息字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:44:08
 * @LastEditTime: 2021-12-08 19:51:04
 * @LastEditors: jieTan
 * @LastModify:
 */

import { DEFAULT_PLACEHOLDER, PROJ_STATUS, TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { doubleNumberW, numberW, stringW } from './baseParams';

/* 主要字段 */
export const TableMajorCols = [
  {
    headerName: '序',
    field: 'order',
    valueGetter: (props: any) => props.node.rowIndex + 1,
    ...numberW,
  },
  {
    headerName: '项目名称',
    field: 'project',
    filter: true,
    valueGetter: (params: any) => params.data.project.name,
    cellRenderer: 'linkTo',
    // cellRendererParams: { liknTo: true },
  },
  {
    headerName: '负责人',
    field: 'user.name',
    filter: true,
    columnGroupShow: SHOW['closed'],
    ...doubleNumberW,
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
    ...stringW,
  },
  {
    headerName: '项目分支',
    columnGroupShow: SHOW['closed'],
    filter: true,
    valueGetter: () => DEFAULT_PLACEHOLDER,
    ...stringW,
  },
  {
    headerName: '开始日期',
    field: 'project.start',
    columnGroupShow: SHOW['closed'],
    ...stringW,
  },
  {
    headerName: '结束日期',
    field: 'project.end',
    columnGroupShow: SHOW['closed'],
    ...stringW,
  },
];
