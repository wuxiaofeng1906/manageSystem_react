import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

const dutyColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'NO.',
    width: 90,
    cellRenderer: (params: any) => (+params.node.id + 1).toString(),
  },
  {
    headerName: '值班名单',
    field: 'duty_name',
    cellRenderer: 'dutyName',
    minWidth: 120,
  },
  {
    headerName: '项目名称',
    field: 'project_name',
  },
  {
    headerName: '值班日期',
    field: 'duty_date',
  },
  {
    headerName: '发布环境',
    field: 'release_env',
  },
  {
    headerName: '发布方式',
    field: 'release_method',
  },
  {
    headerName: '发布时间',
    field: 'release_time',
  },
];
export default dutyColumn;
