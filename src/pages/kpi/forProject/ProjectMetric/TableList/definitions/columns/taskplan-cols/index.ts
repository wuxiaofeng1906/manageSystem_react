/*
 * @Description: 任务的计划类型的字段: 进度偏差率 + 阶段工作量
 * @Author: jieTan
 * @Date: 2021-12-14 03:16:01
 * @LastEditTime: 2021-12-14 03:30:39
 * @LastEditors: jieTan
 * @LastModify:
 */
import { ColDef } from 'ag-grid-community';
import { ratioW } from '../baseParams';

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
      ...defaultParmas,
    },
    {
      headerName: '开发',
      field: `${moduleName}.devplan`,
      ...defaultParmas,
    },
    {
      headerName: '测试',
      field: `${moduleName}.testplan`,
      ...defaultParmas,
    },
    {
      headerName: '发布',
      field: `${moduleName}.releaseplan`,
      ...defaultParmas,
    },
  ];
  //
  return cols;
};
