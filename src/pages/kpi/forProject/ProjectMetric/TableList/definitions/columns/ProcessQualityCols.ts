/*
 * @Description: 项目过程质量的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2021-12-15 05:44:24
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PERCENTAGE, HOUR, TABLE_GROUP_SHOW as SHOW, PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ProjectQualityResult } from '@/namespaces/interface';
import { doubleNumberW, ratioW } from './baseParams';

/*  */
//
const sortByTarget = (valueA: ProjectQualityResult, valueB: ProjectQualityResult, key: string) => {
  //
  if (valueA[key] === null) return 1;
  //
  if (valueB[key] === null) return -1;
  //
  return valueA[key] - valueB[key];
};
//
const customSort = (targetKey: string) => ({
  sortable: true,
  comparator: (valueA: any, valueB: any) => sortByTarget(valueA, valueB, targetKey),
});

/* 项目过程质量 */
export const ProcessQualityCols: ColDef[] = [
  {
    headerName: `ReOpen率(${PERCENTAGE['unit']})`,
    field: 'projectQuality',
    cellRenderer: 'reopenRatio',
    cellRendererParams: { delta: PERCENTAGE['value'] },
    ...ratioW,
    ...customSort('reopenRatio'),
  },
  {
    headerName: '千行Bug率',
    field: '',
    columnGroupShow: SHOW['closed'],
    ...ratioW,
  },
  {
    headerName: '单元覆盖率',
    field: 'unitCover',
    columnGroupShow: SHOW['closed'],
    ...ratioW,
  },
  {
    headerName: `回归时长(${HOUR['unit']})`,
    field: 'projectQuality',
    columnGroupShow: SHOW['closed'],
    cellRenderer: 'bugFlybackDura',
    cellRendererParams: { delta: HOUR['value'] },
    ...doubleNumberW,
    ...customSort('bugFlybackDura'),
  },
  {
    headerName: '用例覆盖率',
    field: '',
    columnGroupShow: SHOW['closed'],
    ...ratioW,
  },
  {
    headerName: '加权遗留DI',
    columnGroupShow: SHOW['closed'],
    field: '',
  },
];
// 
export const ProcessQualityGroup: ColGroupDef = {
  headerName: PROJ_METRIC.processQuality.zh,
  children: ProcessQualityCols,
};
