/*
 * @Description: 进度偏差率的字段
 * @Author: jieTan
 * @Date: 2021-12-13 09:24:38
 * @LastEditTime: 2022-02-10 02:35:45
 * @LastEditors: jieTan
 * @LastModify:
 */
import { PROJ_METRIC } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';
import taskplanCols from './taskplan-cols';

const moduleName = 'progressDeviation';
const others = { html: true }

/*  */
export const ProcessDeviationCols = taskplanCols(moduleName, { html: true });
ProcessDeviationCols.unshift({
  headerName: '项目计划',
  field: `${moduleName}.projectplan`,
  cellRenderer: 'numToFixed',
  cellRendererParams: { ...others },
  ...ratioW,
});

/*  */
export const ProcessDeviationGroup: ColGroupDef = {
  headerName: PROJ_METRIC.progressDeviation.zh,
  children: ProcessDeviationCols,
};
