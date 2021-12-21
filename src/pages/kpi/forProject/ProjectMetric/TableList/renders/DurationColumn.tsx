/*
 * @Description: 时长字段
 * @Author: jieTan
 * @Date: 2021-12-20 06:32:13
 * @LastEditTime: 2021-12-20 06:45:07
 * @LastEditors: jieTan
 * @LastModify:
 */

import { DEFAULT_DENOMINATOR, DEFAULT_PLACEHOLDER, DEFAULT_DECIMAL_PLACES } from '@/namespaces';

export default (props: { value: number; delta?: number; decimal?: number }) => {
  const ratio = props?.value / (props.delta ?? DEFAULT_DENOMINATOR);
  if (!ratio) return props.value ?? DEFAULT_PLACEHOLDER;
  //
  return ratio.toFixed(props?.decimal ?? DEFAULT_DECIMAL_PLACES);
};
