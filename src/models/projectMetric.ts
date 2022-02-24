/*
 * @Description: 过程质量 => Model数据
 * @Author: jieTan
 * @Date: 2021-11-30 09:57:14
 * @LastEditTime: 2022-02-24 03:46:52
 * @LastEditors: jieTan
 * @LastModify:
 */

import { EXTRA_FILTER_TYPE } from '@/namespaces';
import { useState } from 'react';

export default () => {
  /*  */
  const projType: EXTRA_FILTER_TYPE = { values: [] };
  /*  */
  const [gridApi, setGridApi] = useState(null);
  const [gqlData, setGqlData] = useState([]);
  const [dynamicCols, setDynamicCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pkGqlParmas, setPkGqlParmas] = useState(null);
  const [gridRef, setGridRef] = useState(() => {}); // 项目指标Table的ref使用

  /*  */
  const gridHeight = { row: 32 }; // 设置grid的行高

  return {
    gqlData,
    setGqlData,
    projType,
    dynamicCols,
    setDynamicCols,
    gridApi,
    setGridApi,
    loading,
    setLoading,
    gridHeight,
    pkGqlParmas,
    setPkGqlParmas,
    gridRef,
    setGridRef,
  };
};
