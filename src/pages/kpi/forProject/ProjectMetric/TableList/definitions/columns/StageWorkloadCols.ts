/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-12-14 03:20:22
 * @LastEditTime: 2021-12-15 05:57:44
 * @LastEditors: jieTan
 * @LastModify:
 */
import { PROJ_METRIC } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';
import taskplanCols from './taskplan-cols';

export const StageWorkloadCols = taskplanCols('stageWorkload', { decimal: 4 });
export const StageWorkloadGroup: ColGroupDef = {
  headerName: PROJ_METRIC.stageWorkload.zh,
  children: StageWorkloadCols,
};
