import type {ColDef, ColGroupDef} from 'ag-grid-community/dist/lib/entities/colDef';

export const announcementListColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
  },
  {
    headerName: 'ID',
    field: 'id',
    minWidth: 150,
  },
  {
    headerName: '公告名称',
    field: 'iteration',
    minWidth: 150,
  },
  {
    headerName: '升级模板',
    field: 'templateTypeId',
    minWidth: 160,
  },
  {
    headerName: '升级时间',
    field: 'updatedTime',
    minWidth: 130,
  },
  {
    headerName: '升级描述',
    field: 'description',
    minWidth: 160,
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
    headerName: '修改人',
    field: 'update_user',
    minWidth: 120,
  },
  {
    headerName: '修改时间',
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
