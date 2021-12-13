/*
 * @Description: float保留小数位
 * @Author: jieTan
 * @Date: 2021-12-13 09:49:07
 * @LastEditTime: 2021-12-13 10:29:27
 * @LastEditors: jieTan
 * @LastModify:
 */

import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_PLACEHOLDER,
  JS_PROTOTYPE_TYPE,
  PERCENTAGE,
} from '@/namespaces';

export default (props: { value: any; others?: { decimal?: number; html?: boolean } }) => {
  // 适配非数字的value值
  const { value, others } = props;
  if (Object.prototype.toString.call(value) != JS_PROTOTYPE_TYPE['Number'])
    return value ? value : DEFAULT_PLACEHOLDER;

  // 判断是否需要绘制html
  if (!others?.html) return value?.toFixed(DEFAULT_DECIMAL_PLACES);

  // 绘制颜色
  if (value < 0)
    return (
      <span style={{ color: 'red' }}>
        {value.toFixed(DEFAULT_DECIMAL_PLACES) + PERCENTAGE.unit}
      </span>
    );
  if (value > 0)
    return (
      <span style={{ color: 'green' }}>
        {'+' + value.toFixed(DEFAULT_DECIMAL_PLACES) + PERCENTAGE.unit}
      </span>
    );
  return value;
};
