import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import {
  appServerSide,
  ClusterType,
  TechnicalSide,
  WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';

const formatWhetherNot = (p) => WhetherOrNot[p.value];
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
    field: 'app_name',
    minWidth: 150,
    tooltipField: 'app_name',
    pinned: 'left',
  },
  {
    headerName: '技术侧',
    field: 'side',
    minWidth: 150,
    valueFormatter: (p) => TechnicalSide[p.value],
  },
  {
    headerName: '所属应用类型',
    field: 'technical_side',
    minWidth: 140,
    valueFormatter: (p) => appServerSide[p.value],
  },
  {
    headerName: '可上线环境',
    field: 'release_env',
    minWidth: 130,
    valueFormatter: (p) => ClusterType[p.value],
  },
  {
    headerName: '是否是应用包',
    field: 'is_package',
    minWidth: 130,
    valueFormatter: formatWhetherNot,
  },
  {
    headerName: '是否需要检查单元测试',
    field: 'is_need_test_unit',
    minWidth: 180,
    valueFormatter: formatWhetherNot,
  },
  {
    headerName: '是否需要执行环境一致性检查',
    field: 'is_check_env',
    minWidth: 200,
    valueFormatter: formatWhetherNot,
  },
  {
    headerName: '是否执行"可热更"辅助检查',
    field: 'is_check_hot_update',
    minWidth: 180,
    valueFormatter: formatWhetherNot,
  },
  {
    headerName: '是否涉及数据修复/升级(backend/apps/build)',
    field: 'is_have_data_recovery',
    minWidth: 220,
    valueFormatter: formatWhetherNot,
  },
  {
    headerName: '对应gitlab工程地址',
    field: 'server_path',
    minWidth: 160,
    tooltipField: 'server_path',
  },
  {
    headerName: '备注',
    field: 'remark',
    minWidth: 110,
    tooltipField: 'remark',
  },
  {
    headerName: '创建人',
    field: 'create_user',
    minWidth: 110,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 200,
  },
  {
    headerName: '编辑人',
    field: 'update_user',
    minWidth: 110,
  },
  {
    headerName: '编辑时间',
    field: 'update_time',
    minWidth: 200,
  },
];
