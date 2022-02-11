/*
 * @Description: 项目过程质量的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2022-02-10 02:07:43
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
const ratioParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { multiple: PERCENTAGE.value },
  ...ratioW,
};

/* 项目过程质量 */
export const ProcessQualityCols: ColDef[] = [
  {
    // headerName: `ReOpen率(${PERCENTAGE['unit']})`,
    headerName: `ReOpen率`,
    headerTooltip: `ReOpen率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.reopenRatio`,
    cellRenderer: 'numToFixed',
    cellRendererParams: { multiple: PERCENTAGE.value },
    ...ratioW,
  },
  {
    headerName: '前端覆盖率',
    headerTooltip: `前端覆盖率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.frontUnitCover`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '后端覆盖率',
    headerTooltip: `后端覆盖率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.backUnitCover`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: `解决时长`,
    headerTooltip: `Bug解决时长(${HOUR['unit']})`,
    field: `${moduleName}.bugResolveDura`,
    columnGroupShow: SHOW['closed'],
    ...duraParams,
  },
  {
    headerName: `一次提测通过率`,
    headerTooltip: `一次提测通过率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.carryTestPass`,
    columnGroupShow: SHOW['closed'],
    ...ratioParmas,
  },
  {
    headerName: `回归时长`,
    headerTooltip: `Bug回归时长(${HOUR['unit']})`,
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
    headerTooltip: '加权遗留缺陷密度',
    field: `${moduleName}.weightedLegacyDI`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
];
//
export const ProcessQualityGroup: ColGroupDef = {
  headerName: PROJ_METRIC.processQuality.zh,
  children: ProcessQualityCols,
};
