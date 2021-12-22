/*
 * @Description: 过程质量 => Model数据
 * @Author: jieTan
 * @Date: 2021-11-30 09:57:14
 * @LastEditTime: 2021-11-30 10:17:30
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

  return { gqlData, setGqlData, projType, dynamicCols, setDynamicCols, gridApi, setGridApi };
};