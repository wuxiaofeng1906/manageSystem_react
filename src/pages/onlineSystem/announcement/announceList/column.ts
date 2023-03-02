import {RELEASE_MODULE} from "../constant";
import dayjs from "dayjs";

export const announcementListColumn: any = [
  {
    headerName: '序号',
    minWidth: 70,
    maxWidth: 70,
    cellRenderer: (params: any) => {
      return Number(params.node.id) + 1;
    },
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
    minWidth: 100,
    cellRenderer: (v: any) => {
      return RELEASE_MODULE[v.value]
    }
  },
  {
    headerName: '升级时间',
    field: 'updatedTime',
    minWidth: 160,
    cellRenderer: (v: any) => {
      return dayjs(v.value).format("YYYY-MM-DD hh:mm:ss")
    }
  },
  {
    headerName: '升级描述',
    field: 'description',
    minWidth: 160,
  },
  {
    headerName: '创建人',
    field: 'create_user',
    minWidth: 100,
    maxWidth: 120,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    minWidth: 160,
  },
  {
    headerName: '修改人',
    field: 'update_user',
    minWidth: 100,
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
