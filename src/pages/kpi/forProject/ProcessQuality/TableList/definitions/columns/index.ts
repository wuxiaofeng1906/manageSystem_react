/*
 * @Description: Table => column 字段的定义
 * @Author: jieTan
 * @Date: 2021-11-26 15:46:47
 * @LastEditTime: 2021-11-29 15:01:20
 * @LastEditors: jieTan
 * @LastModify:
 */
import { COLUMN_W, HOUR, PERCENTAGE, TABLE_GROUP_SHOW as SHOW } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';

/*  */
const ratioW = { width: COLUMN_W * 2, minWidth: COLUMN_W * 2 };
const numberW = { width: COLUMN_W, minWidth: COLUMN_W };
const doubleNumberW = ratioW;

// const EmptyUi = () => DEFAULT_PLACEHOLDER;

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
      headerName: '项目负责人',
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

/* 项目过程质量 */
export const ProcessQualityCols: ColGroupDef = {
  headerName: '过程质量',
  children: [
    {
      headerName: `ReOpen率(${PERCENTAGE['unit']})`,
      field: 'projectQuality',
      cellRenderer: 'reopenRatio',
      cellRendererParams: { delta: PERCENTAGE['value'] },
      ...ratioW,
    },
    {
      headerName: '千行Bug率',
      field: '',
      columnGroupShow: SHOW['open'],
      ...ratioW,
    },
    {
      headerName: '单元覆盖率',
      field: 'unitCover',
      columnGroupShow: SHOW['open'],
      ...ratioW,
    },
    {
      headerName: `回归时长(${HOUR['unit']})`,
      field: 'projectQuality',
      columnGroupShow: SHOW['open'],
      cellRenderer: 'bugFlybackDura',
      cellRendererParams: { delta: HOUR['value'] },
      ...doubleNumberW,
    },
    {
      headerName: '用例覆盖率',
      field: '',
      columnGroupShow: SHOW['open'],
      ...ratioW,
    },
    {
      headerName: '加权遗留DI',
      columnGroupShow: SHOW['open'],
      field: '',
    },
  ],
};
