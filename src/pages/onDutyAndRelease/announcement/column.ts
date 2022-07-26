import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

export const announcementListColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'ID',
    field: 'num',
    maxWidth: 90,
  },
  {
    headerName: '公告批次名称',
    field: 'name',
    minWidth: 120,
  },
  {
    headerName: '升级前公告时间',
    field: 'beforeTime',
    minWidth: 130,
  },
  {
    headerName: '升级前公告内容',
    field: 'beforeContent',
    minWidth: 130,
  },
  {
    headerName: '升级后公告时间',
    field: 'afterTime',
    minWidth: 130,
  },
  {
    headerName: '升级后公告内容',
    field: 'afterContent',
    minWidth: 130,
  },
  {
    headerName: '创建人',
    field: 'creater',
    minWidth: 120,
    maxWidth: 150,
  },
  {
    headerName: '创建时间',
    field: 'createTime',
    minWidth: 150,
  },
  {
    headerName: '编辑人',
    field: 'editer',
    minWidth: 120,
  },
  {
    headerName: '编辑时间',
    field: 'editeTime',
    minWidth: 100,
  },
  {
    headerName: '操作',
    cellRenderer: 'operation',
    maxWidth: 120,
    minWidth: 100,
  },
];
