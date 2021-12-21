/*
 * @Description: float保留小数位
 * @Author: jieTan
 * @Date: 2021-12-13 09:49:07
 * @LastEditTime: 2021-12-20 06:58:47
 * @LastEditors: jieTan
 * @LastModify:
 */

import {
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_PLACEHOLDER,
  JS_PROTOTYPE_TYPE,
  PERCENTAGE,
} from '@/namespaces';

export default (props: {
  value: any;
  decimal?: number; // 小数位
  html?: boolean; // 是否绘制Tag
  multiple?: number; // 倍数
  unit?: string; // 显示的单位
}) => {
  // 适配非数字的value值
  if (Object.prototype.toString.call(props.value) != JS_PROTOTYPE_TYPE['Number'])
    return props.value ? props.value : DEFAULT_PLACEHOLDER;

  const decimalPlaces = props.decimal ?? DEFAULT_DECIMAL_PLACES;
  const multiple = props.multiple ? props.multiple : 1;
  const unit = props.unit ?? PERCENTAGE.unit;
  const value = props.value * multiple;
  // 判断是否需要绘制html
  if (!props.html) return parseFloat(value?.toFixed(decimalPlaces));

  // 绘制颜色
  if (value < 0)
    return <span style={{ color: 'red' }}>{parseFloat(value.toFixed(decimalPlaces)) + unit}</span>;
  if (value > 0)
    return (
      <span style={{ color: 'green' }}>
        {'+' + parseFloat(value.toFixed(decimalPlaces)) + unit}
      </span>
    );
  return value;
};
