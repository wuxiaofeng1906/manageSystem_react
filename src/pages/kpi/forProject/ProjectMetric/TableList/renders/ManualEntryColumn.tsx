/*
 * @Description: 手工录入cell的绘制
 * @Author: jieTan
 * @Date: 2022-01-18 06:33:27
 * @LastEditTime: 2022-01-18 07:04:38
 * @LastEditors: jieTan
 * @LastModify:
 */

import { MANUAL_CELL } from '@/namespaces';

export default (props: { value: any }) => {
  const { value } = props;
  if (value !== null) return value;

  // 根据不同的值类型，适配不同颜色的文本样式
  const textStyle = { color: MANUAL_CELL.color, fontStyle: `${MANUAL_CELL.fontStyle}` };
  if (value instanceof Number || !isNaN(parseFloat(value)))
    textStyle['color'] = MANUAL_CELL.numberColor;

  //
  return <div style={textStyle}>{MANUAL_CELL.text}</div>;
};
