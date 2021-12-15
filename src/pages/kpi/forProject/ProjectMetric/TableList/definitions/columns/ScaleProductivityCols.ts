/*
 * @Description: 生产率&规模的字段
 * @Author: jieTan
 * @Date: 2021-12-15 03:35:05
 * @LastEditTime: 2021-12-15 03:43:51
 * @LastEditors: jieTan
 * @LastModify:
 */

import { ColDef } from 'ag-grid-community';
import { PROJ_METRIC} from '@/namespaces';
import { extraW, ratioW } from './baseParams';

const moduleName = PROJ_METRIC.scaleProductivity.en

export const ScaleProductivityCols: ColDef[] = [
  {
    headerName: '功能点',
    field: `${moduleName}.actualValue`,
    ...extraW
  },
  {
    headerName: '生产率',
    field: `${moduleName}.actualRatio`,
    cellRenderer: 'numToFixed',
    ...ratioW,
  },
];
