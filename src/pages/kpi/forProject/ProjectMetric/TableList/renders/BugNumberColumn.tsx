/*
 * @Description: Bug数字段绘制
 * @Author: jieTan
 * @Date: 2021-11-23 15:16:26
 * @LastEditTime: 2021-11-23 17:02:31
 * @LastEditors: jieTan
 * @LastModify:
 */
import { DEFAULT_PLACEHOLDER } from '@/namespaces';
import { Divider } from 'antd';

export default (props: { value: string }) => {
  //
  const numbers = props?.value?.split(',');
  if (numbers?.length !== 2) return props.value ?? DEFAULT_PLACEHOLDER;
  //
  return (
    <>
      <a href="#">{numbers[0]}</a>
      <Divider type="vertical" />
      <a href="#">{numbers[1]}</a>
    </>
  );
};
