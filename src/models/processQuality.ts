/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-11-30 09:57:14
 * @LastEditTime: 2021-11-30 10:56:08
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

import { useState } from 'react';

export default () => {
  /*  */
  const [gqlData, setGqlData] = useState([]);

  return { gqlData, setGqlData };
};
