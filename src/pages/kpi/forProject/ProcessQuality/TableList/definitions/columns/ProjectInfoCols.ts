/*
 * @Description: 项目基本信息字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:44:08
 * @LastEditTime: 2021-11-29 16:00:14
 * @LastEditors: jieTan
 * @LastModify:
 */

import { COLUMN_W, TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';

export const numberW = { width: COLUMN_W, minWidth: COLUMN_W };
export const doubleNumberW = { width: COLUMN_W * 2, minWidth: COLUMN_W * 2 };

/* 主要字段 */
export const TableMajorCols: ColGroupDef = {
  headerName: '项目信息',
  children: [
    {
      headerName: '序',
      field: 'order',
      valueGetter: (props: any) => (props.node?.rowIndex as number) + 1,
      ...numberW,
    },
    {
      headerName: '项目名称',
      field: 'project',
      cellRenderer: 'idWithName',
      cellRendererParams: { liknTo: true },
    },
    {
      headerName: '负责人',
      field: 'user',
      columnGroupShow: SHOW['closed'],
      cellRenderer: 'idWithName',
      ...doubleNumberW,
    },
    {
      headerName: '所属部门',
      columnGroupShow: SHOW['closed'],
      field: 'dept',
      cellRenderer: 'idWithName',
    },
  ],
};
