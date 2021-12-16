/*
 * @Description: float保留小数位
 * @Author: jieTan
 * @Date: 2021-12-13 09:49:07
 * @LastEditTime: 2021-12-16 12:43:05
 * @LastEditors: jieTan
 * @LastModify:
 */

import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_PLACEHOLDER,
  JS_PROTOTYPE_TYPE,
  PERCENTAGE,
} from '@/namespaces';

export default (props: { value: any; decimal?: number; html?: boolean }) => {
  // 适配非数字的value值
  if (Object.prototype.toString.call(props.value) != JS_PROTOTYPE_TYPE['Number'])
    return props.value ? props.value : DEFAULT_PLACEHOLDER;

  const decimalPlaces = props.decimal ?? DEFAULT_DECIMAL_PLACES;
  // 判断是否需要绘制html
  if (!props.html) return parseFloat(props.value?.toFixed(decimalPlaces));

  // 绘制颜色
  if (props.value < 0)
    return (
      <span style={{ color: 'red' }}>
        {parseFloat(props.value.toFixed(decimalPlaces)) + PERCENTAGE.unit}
      </span>
    );
  if (props.value > 0)
    return (
      <span style={{ color: 'green' }}>
        {'+' + parseFloat(props.value.toFixed(decimalPlaces)) + PERCENTAGE.unit}
      </span>
    );
  return props.value;
};
