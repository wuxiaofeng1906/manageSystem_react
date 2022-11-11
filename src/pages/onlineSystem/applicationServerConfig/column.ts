import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

export const applicationConfigColumn: (ColDef | ColGroupDef)[] = [
  {
    headerName: '选择',
    pinned: 'left',
    filter: false,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    maxWidth: 35,
  },
  {
    headerName: '序号',
    field: 'num',
    minWidth: 90,
    maxWidth: 90,
    cellRenderer: (params: any) => String(+params.node.id + 1),
    pinned: 'left',
  },
  {
    headerName: '应用名称',
    field: 'name',
    minWidth: 150,
    tooltipField: 'name',
    pinned: 'left',
  },
  {
    headerName: '技术侧',
    field: 'side',
    minWidth: 150,
  },
  {
    headerName: '所属应用类型',
    field: 'type',
    minWidth: 140,
  },
  {
    headerName: '可上线环境',
    field: 'env',
    minWidth: 130,
    tooltipField: 'env',
  },
  {
    headerName: '是否是应用包',
    field: 'apk',
    minWidth: 130,
  },
  {
    headerName: '是否需要检查单元测试',
    field: 'unit_check',
    minWidth: 180,
  },
  {
    headerName: '是否需要执行环境一致性检查',
    field: 'env_check',
    minWidth: 200,
  },
  {
    headerName: '是否执行"可热更"辅助检查',
    field: 'hot',
    minWidth: 180,
  },
  {
    headerName: '是否涉及数据修复/升级(backend/apps/build)',
    field: 'upgrade',
    minWidth: 220,
  },
  {
    headerName: '对应gitlab工程地址',
    field: 'gitlab',
    minWidth: 160,
    tooltipField: 'gitlab',
  },
  {
    headerName: '备注',
    field: 'mark',
    minWidth: 110,
    tooltipField: 'env',
  },
  {
    headerName: '创建人',
    field: 'creator',
    minWidth: 110,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 200,
  },
  {
    headerName: '编辑人',
    field: 'editor',
    minWidth: 110,
  },
  {
    headerName: '编辑时间',
    field: 'editor_time',
    minWidth: 200,
  },
];
