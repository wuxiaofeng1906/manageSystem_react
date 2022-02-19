/*
 * @Description: 评审和缺陷的字段
 * @Author: jieTan
 * @Date: 2021-11-29 15:47:07
 * @LastEditTime: 2022-02-19 12:29:17
 * @LastEditors: jieTan
 * @LastModify:
 */

import { TABLE_GROUP_SHOW as SHOW, PROJ_METRIC } from '@/namespaces';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ratioW } from './baseParams';

/*  */
const moduleName = 'reviewDefect';
const defaultParmas = {
  cellRenderer: 'numToFixed',
  cellRendererParams: { decimal: 2 },
  ...ratioW,
};

/* 项目过程质量 */
export const ReviewDefectCols: ColDef[] = [
  {
    headerName: `需求（预审+评审）`,
    field: `${moduleName}.storyPreReview`,
    cellRenderer: 'numToFixed',
    cellRendererParams: { decimal: 2 },
    width: 156,
    minWidth: 150,
  },
  {
    headerName: 'UED评审',
    field: `${moduleName}.ueReview`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '概设评审',
    field: `${moduleName}.overviewReview`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '详设评审',
    field: `${moduleName}.detailReview`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: '用例评审',
    field: `${moduleName}.caseReview`,
    columnGroupShow: SHOW['closed'],
    ...defaultParmas,
  },
  {
    headerName: 'CodeReview',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.codeReview`,
    ...defaultParmas,
  },
  {
    headerName: '提测演示',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.testPresentation`,
    ...defaultParmas,
  },
  {
    headerName: '开发自测/联调',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.integrationTest`,
    ...defaultParmas,
  },
  {
    headerName: '系统测试',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.systemTest`,
    ...defaultParmas,
  },
  {
    headerName: '发布测试',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.releaseTest`,
    ...defaultParmas,
  },
  {
    headerName: '合计',
    columnGroupShow: SHOW['closed'],
    field: `${moduleName}.total`,
    ...defaultParmas,
  },
];
//
export const ReviewDefectGroup: ColGroupDef = {
  headerName: PROJ_METRIC.reviewDefect.zh,
  children: ReviewDefectCols,
};
