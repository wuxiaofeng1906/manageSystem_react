/*
 * @Description: 任务的计划类型的字段: 进度偏差率 + 阶段工作量
 * @Author: jieTan
 * @Date: 2021-12-14 03:16:01
 * @LastEditTime: 2021-12-16 12:12:36
 * @LastEditors: jieTan
 * @LastModify:
 */
import { ColDef } from 'ag-grid-community';
import { ratioW } from '../baseParams';
import { TABLE_GROUP_SHOW as SHOW } from '@/namespaces';

export default (moduleName: string, others?: { decimal?: number; html?: boolean }) => {
  /*  */
  const defaultParmas = {
    cellRenderer: 'numToFixed',
    cellRendererParams: { others },
    ...ratioW,
  };

  /*  */
  const cols: ColDef[] = [
    {
      headerName: '需求',
      field: `${moduleName}.storyplan`,
      ...defaultParmas,
    },
    {
      headerName: '概设&计划',
      field: `${moduleName}.designplan`,
      columnGroupShow: SHOW['closed'],
      ...defaultParmas,
    },
    {
      headerName: '开发',
      field: `${moduleName}.devplan`,
      columnGroupShow: SHOW['closed'],
      ...defaultParmas,
    },
    {
      headerName: '测试',
      field: `${moduleName}.testplan`,
      columnGroupShow: SHOW['closed'],
      ...defaultParmas,
    },
    {
      headerName: '发布',
      field: `${moduleName}.releaseplan`,
      columnGroupShow: SHOW['closed'],
      ...defaultParmas,
    },
  ];
  //
  return cols;
};
