/*
 * @Description: 项目基本信息字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:44:08
 * @LastEditTime: 2021-12-08 11:35:27
 * @LastEditors: jieTan
 * @LastModify:
 */

import { TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';
import { doubleNumberW, numberW } from './baseParams';

/* 主要字段 */
export const TableMajorCols: ColGroupDef = {
  headerName: '项目信息',
  children: [
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
      valueGetter: (params) => params.data.project.name,
      cellRenderer: 'linkTo',
      // cellRendererParams: { liknTo: true },
    },
    {
      headerName: '负责人',
      field: 'user',
      filter: true,
      valueGetter: (params) => params.data.user.name,
      columnGroupShow: SHOW['closed'],
      ...doubleNumberW,
    },
    {
      headerName: '所属部门',
      columnGroupShow: SHOW['closed'],
      field: 'dept',
      valueGetter: (params) => params.data.dept.name,
    },
  ],
};
