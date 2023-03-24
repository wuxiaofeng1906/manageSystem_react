import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

export const announcementListColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
  },
  {
    headerName: 'ID',
    field: 'announcement_num',
    minWidth: 150,
  },
  {
    headerName: '公告批次名称',
    field: 'announcement_name',
    minWidth: 150,
  },
  // {
  //   headerName: '升级前公告时间',
  //   field: 'before_upgrade_time',
  //   minWidth: 160,
  // },
  // {
  //   headerName: '升级前公告内容',
  //   field: 'before_upgrade_description',
  //   minWidth: 130,
  // },
  {
    headerName: '升级后公告时间',
    field: 'after_upgrade_time',
    minWidth: 160,
  },
  {
    headerName: '升级后公告内容',
    field: 'after_upgrade_description',
    minWidth: 130,
  },
  {
    headerName: '创建人',
    field: 'create_user',
    minWidth: 120,
    maxWidth: 150,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 160,
  },
  {
    headerName: '编辑人',
    field: 'update_user',
    minWidth: 120,
  },
  {
    headerName: '编辑时间',
    field: 'update_time',
    minWidth: 160,
  },
  {
    headerName: '操作',
    cellRenderer: 'operation',
    maxWidth: 120,
    minWidth: 100,
    pinned: 'right',
  },
];
