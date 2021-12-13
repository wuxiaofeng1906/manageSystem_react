/*
 * @Description: 进度偏差率的字段
 * @Author: jieTan
 * @Date: 2021-12-13 09:24:38
 * @LastEditTime: 2021-12-13 10:28:25
 * @LastEditors: jieTan
 * @LastModify:
 */

import { ColDef } from 'ag-grid-community';
import { ratioW } from './baseParams';

const moduleName = 'progressDeviation';
const defaultParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { others: { html: true } },
  ...ratioW,
};

export const ProcessDeviationCols: ColDef[] = [
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
