/*
 * @Description: cloumn => 通用的属性配置
 * @Author: jieTan
 * @Date: 2021-12-08 11:27:56
 * @LastEditTime: 2021-12-08 11:30:23
 * @LastEditors: jieTan
 * @LastModify: 
 */

import { COLUMN_W } from "@/namespaces";

export const ratioW = { width: COLUMN_W * 2, minWidth: COLUMN_W * 2 };
export const numberW = { width: COLUMN_W, minWidth: COLUMN_W };
export const doubleNumberW = ratioW;
export const stringW = doubleNumberW;
