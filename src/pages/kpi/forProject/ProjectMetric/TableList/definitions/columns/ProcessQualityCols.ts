/*
 * @Description: 项目过程质量的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2021-12-20 07:01:34
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PERCENTAGE, HOUR, TABLE_GROUP_SHOW as SHOW, PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';

/*  */
const moduleName = 'projectQuality';
const defaultParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { decimal: 4 },
  ...ratioW,
};
const duraParams = {
  cellRenderer: 'duration',
  cellRendererParams: { delta: HOUR['value'] },
  ...ratioW,
};

/* 项目过程质量 */
export const ProcessQualityCols: ColDef[] = [
  {
    headerName: `ReOpen率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.reopenRatio`,
    cellRenderer: 'numToFixed',
    cellRendererParams: { multiple: PERCENTAGE.value },
    ...ratioW,
  },
  {
    headerName: `解决时长(${HOUR['unit']})`,
    field: `${moduleName}.bugResolveDura`,
    columnGroupShow: SHOW['closed'],
    ...duraParams,
  },
  {
    headerName: `回归时长(${HOUR['unit']})`,
    field: `${moduleName}.bugFlybackDura`,
    columnGroupShow: SHOW['closed'],
    ...duraParams,
  },
  {
    headerName: '加权遗留缺陷',
    field: `${moduleName}.weightedLegacyDefect`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '加权遗留DI',
    field: `${moduleName}.weightedLegacyDI`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '前端覆盖率',
    field: `${moduleName}.frontUnitCover`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '后端覆盖率',
    field: `${moduleName}.backUnitCover`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
];
//
export const ProcessQualityGroup: ColGroupDef = {
  headerName: PROJ_METRIC.processQuality.zh,
  children: ProcessQualityCols,
};
