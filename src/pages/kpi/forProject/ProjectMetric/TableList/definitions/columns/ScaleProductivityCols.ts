/*
 * @Description: 生产率&规模的字段
 * @Author: jieTan
 * @Date: 2021-12-15 03:35:05
 * @LastEditTime: 2021-12-15 05:47:56
 * @LastEditors: jieTan
 * @LastModify:
 */

import { ColDef, ColGroupDef } from 'ag-grid-community';
import { PROJ_METRIC } from '@/namespaces';
import { extraW, ratioW } from './baseParams';

const moduleName = PROJ_METRIC.scaleProductivity.en;

export const ScaleProductivityCols: ColDef[] = [
  {
    headerName: '功能点',
    field: `${moduleName}.actualValue`,
    ...extraW,
  },
  {
    headerName: '生产率',
    field: `${moduleName}.actualRatio`,
    cellRenderer: 'numToFixed',
    ...ratioW,
  },
];
//
export const ScaleProductivityGroup: ColGroupDef = {
  headerName: PROJ_METRIC.scaleProductivity.zh,
  children: ScaleProductivityCols,
};
