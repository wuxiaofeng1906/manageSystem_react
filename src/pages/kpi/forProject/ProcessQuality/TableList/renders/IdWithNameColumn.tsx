/*
 * @Description: project字段绘制
 * @Author: jieTan
 * @Date: 2021-11-23 15:13:51
 * @LastEditTime: 2021-11-29 14:52:21
 * @LastEditors: jieTan
 * @LastModify:
 */

export default (props: { value: any; liknTo?: boolean }) => {
  const { name } = props?.value;
  return props.liknTo ? <a href="#">{name}</a> : name;
};
