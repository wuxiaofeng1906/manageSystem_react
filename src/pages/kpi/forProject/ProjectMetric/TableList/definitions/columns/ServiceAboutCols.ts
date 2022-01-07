/*
 * @Description: 服务的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2022-01-07 02:14:06
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';

/*  */
const moduleName = PROJ_METRIC.serviceAbout.en;
const defaultParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { decimal: 4 },
  ...ratioW,
};

/* 需求稳定性 */
export const ServiceAboutCols: ColDef[] = [
  {
    headerName: '一次发布成功率',
    field: `${moduleName}.releaseSucc`,
    ...defaultParmas,
  },
];
//
export const ServiceAboutGroup: ColGroupDef = {
  headerName: PROJ_METRIC.serviceAbout.zh,
  children: ServiceAboutCols,
};
