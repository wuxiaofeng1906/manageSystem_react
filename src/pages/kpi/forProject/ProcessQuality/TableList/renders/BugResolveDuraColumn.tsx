/*
 * @Description: bug解决时长
 * @Author: jieTan
 * @Date: 2021-11-23 16:00:36
 * @LastEditTime: 2021-11-23 16:39:54
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
