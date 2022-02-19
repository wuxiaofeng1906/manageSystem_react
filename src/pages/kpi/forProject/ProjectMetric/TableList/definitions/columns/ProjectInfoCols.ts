/*
 * @Description: 项目基本信息字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:44:08
 * @LastEditTime: 2022-02-19 15:29:20
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PROJ_STATUS, TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { doubleNumberF, numberF, stringF } from './baseParams';
import pkEditValueSetter from './editables';

/* 计算整数位数 */
const getFillDigit = (value: number) => {
  let digit = 1;
  let ret = value / 10;
  while (Math.floor(ret) > 0) {
    ret /= 10;
    digit++;
  }
  //
  return digit;
};
let gDigit: number;

/* 主要字段 */
export const TableMajorCols: ColDef[] = [
  {
    headerName: '序',
    valueFormatter: (params: any) => {
      if (gDigit === undefined) gDigit = getFillDigit(params.node.parent.allChildrenCount);
      return `${params.node.rowIndex + 1}`.padStart(gDigit, '0');
    },
    cellRenderer: 'projLinkZt',
    pinned: 'left',
    ...numberF,
  },
  {
    headerName: '项目名称',
    field: 'project',
    filter: true,
    valueGetter: (params: any) => params.data.project.name,
    cellRenderer: 'linkTo',
    cellRendererParams: { route: '/kpi/performance/project/detail' },
    pinned: 'left',
  },
  {
    headerName: '负责人',
    field: 'user.name',
    sortable: true,
    filter: true,
    columnGroupShow: SHOW['closed'],
    pinned: 'left',
    ...doubleNumberF,
  },
  {
    headerName: '所属部门',
    field: 'dept.name',
    sortable: true,
    filter: true,
    columnGroupShow: SHOW['closed'],
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
    field: 'project.branch',
    filter: true,
    editable: true,
    cellRenderer: 'manualEntry',
    valueSetter: (params) => pkEditValueSetter('branch', params),
    ...stringF,
  },
  {
    headerName: '开始日期',
    field: 'project.start',
    sort: 'desc',
    sortable: true,
    columnGroupShow: SHOW['closed'],
    ...stringF,
  },
  {
    headerName: '结束日期',
    field: 'project.end',
    sortable: true,
    columnGroupShow: SHOW['closed'],
    ...stringF,
  },
];
//
export const TableMajorGroup: ColGroupDef = {
  headerName: '项目指标',
  children: TableMajorCols,
};
