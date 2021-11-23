/*
 * @Description: Bug回归时长
 * @Author: jieTan
 * @Date: 2021-11-23 16:16:32
 * @LastEditTime: 2021-11-23 17:03:33
 * @LastEditors: jieTan
 * @LastModify:
 */

import { DEFAULT_DENOMINATOR, DEFAULT_PLACEHOLDER } from '@/namespaces';

export default (props: { value: number; delta: number }) => {
  const ratio = props?.value / (props.delta ?? DEFAULT_DENOMINATOR);
  if (!ratio) return props.value ?? DEFAULT_PLACEHOLDER;
  //
  return <a href="#">{ratio.toFixed(2)}</a>;
};
