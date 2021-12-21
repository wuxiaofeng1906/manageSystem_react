/*
 * @Description: 进度偏差率的字段
 * @Author: jieTan
 * @Date: 2021-12-13 09:24:38
 * @LastEditTime: 2021-12-15 06:03:40
 * @LastEditors: jieTan
 * @LastModify:
 */
import { PROJ_METRIC } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';
import taskplanCols from './taskplan-cols';

export const ProcessDeviationCols = taskplanCols('progressDeviation', { html: true });
export const ProcessDeviationGroup: ColGroupDef = {
  headerName: PROJ_METRIC.progressDeviation.zh,
  children: ProcessDeviationCols,
};
