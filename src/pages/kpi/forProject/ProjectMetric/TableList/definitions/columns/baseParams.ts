/*
 * @Description: cloumn => 通用的属性配置
 * @Author: jieTan
 * @Date: 2021-12-08 11:27:56
 * @LastEditTime: 2021-12-21 09:26:24
 * @LastEditors: jieTan
 * @LastModify:
 */

import { COLUMN_W } from '@/namespaces';

// width
export const ratioW = { width: COLUMN_W * 2, minWidth: COLUMN_W * 2 };
export const numberW = { width: COLUMN_W, minWidth: COLUMN_W };
export const extraW = { width: COLUMN_W * 1.5, minWidth: COLUMN_W };
export const doubleNumberW = ratioW;
export const stringW = doubleNumberW;

// flex
export const ratioF = { width: COLUMN_W * 2, minWidth: COLUMN_W * 2, flex: COLUMN_W * 2 };
export const numberF = { width: COLUMN_W, minWidth: COLUMN_W, flex: COLUMN_W };
export const extraF = { width: COLUMN_W * 1.5, minWidth: COLUMN_W, flex: COLUMN_W };
export const doubleNumberF = ratioF;
export const stringF = doubleNumberF;
