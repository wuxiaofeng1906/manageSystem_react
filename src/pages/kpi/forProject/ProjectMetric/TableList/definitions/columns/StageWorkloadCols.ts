/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-12-14 03:20:22
 * @LastEditTime: 2022-02-19 11:44:43
 * @LastEditors: jieTan
 * @LastModify:
 */
import { PROJ_METRIC } from '@/namespaces';
import { ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';
import taskplanCols from './taskplan-cols';

const moduleName = 'stageWorkload';
const others = { decimal: 2 };

/*  */
export const StageWorkloadCols = taskplanCols(moduleName, others);
StageWorkloadCols.push({
  headerName: '总计',
  field: `${moduleName}.total`,
  cellRenderer: 'numToFixed',
  cellRendererParams: { ...others },
  ...ratioW,
});

/*  */
export const StageWorkloadGroup: ColGroupDef = {
  headerName: PROJ_METRIC.stageWorkload.zh,
  children: StageWorkloadCols,
};
