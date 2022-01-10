/*
 * @Description: 服务的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2022-01-07 06:29:13
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PERCENTAGE, PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';

/*  */
const moduleName = PROJ_METRIC.serviceAbout.en;

/* 需求稳定性 */
export const ServiceAboutCols: ColDef[] = [
  {
    headerName: `一次发布成功率(${PERCENTAGE['unit']})`,
    field: `${moduleName}.releaseSucc`,
    cellRenderer: 'numToFixed',
    cellRendererParams: { multiple: PERCENTAGE.value },
    width: 156,
    minWidth: 150,
  },
];
//
export const ServiceAboutGroup: ColGroupDef = {
  headerName: PROJ_METRIC.serviceAbout.zh,
  children: ServiceAboutCols,
};
