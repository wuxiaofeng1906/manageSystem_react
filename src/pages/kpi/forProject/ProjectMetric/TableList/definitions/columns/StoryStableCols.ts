/*
 * @Description: 需求稳定性的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2022-01-07 02:10:27
 * @LastEditors: jieTan
 * @LastModify:
 */

import { TABLE_GROUP_SHOW as SHOW, PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';

/*  */
const moduleName = PROJ_METRIC.storyStable.en;
const defaultParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { decimal: 4 },
  ...ratioW,
};

/* 需求稳定性 */
export const StoryStableCols: ColDef[] = [
  {
    headerName: '开发',
    field: `${moduleName}.devplan`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '测试',
    field: `${moduleName}.testplan`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '发布',
    field: `${moduleName}.releaseplan`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '项目周期',
    field: `${moduleName}.processcycle`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
];
//
export const StoryStableGroup: ColGroupDef = {
  headerName: PROJ_METRIC.storyStable.zh,
  children: StoryStableCols,
};
