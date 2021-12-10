/*
 * @Description: Bug回归时长
 * @Author: jieTan
 * @Date: 2021-11-23 16:16:32
 * @LastEditTime: 2021-11-29 15:21:53
 * @LastEditors: jieTan
 * @LastModify:
 */

import { DEFAULT_DENOMINATOR, DEFAULT_PLACEHOLDER } from '@/namespaces';
import { ProjectQualityResult } from '@/namespaces/interface';

export default (props: { value: ProjectQualityResult; delta: number; linkTo?: string }) => {
  const { value: params, delta, linkTo } = props;
  const ratio = (params?.bugFlybackDura ?? 0) / (delta ?? DEFAULT_DENOMINATOR);
  if (!ratio) return params?.bugFlybackDura ?? DEFAULT_PLACEHOLDER;
  //
  return linkTo ? <a href={linkTo}>{ratio.toFixed(2)}</a> : ratio.toFixed(2);
};
