/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-11-30 09:57:14
 * @LastEditTime: 2021-12-02 16:20:36
 * @LastEditors: jieTan
 * @LastModify:
 */
// /*
//  * @Description: 过程质量 => Model数据
//  * @Author: jieTan
//  * @Date: 2021-11-30 09:57:14
//  * @LastEditTime: 2021-11-30 10:17:30
//  * @LastEditors: jieTan
//  * @LastModify:
//  */

import { EXTRA_FILTER_TYPE } from '@/namespaces';
import { useState } from 'react';

export default () => {
  /*  */
  // const extra_filter: EXTRA_FILTER_TYPE = {};
  const projType: EXTRA_FILTER_TYPE = { values: [] };
  /*  */
  const [gqlData, setGqlData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  // const [projType, setProjType] = useState(extra_filter);

  return { gqlData, setGqlData, gridApi, setGridApi, projType };
};
