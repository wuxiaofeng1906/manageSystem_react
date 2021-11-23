/*
 * @Description: project字段绘制
 * @Author: jieTan
 * @Date: 2021-11-23 15:13:51
 * @LastEditTime: 2021-11-23 15:43:47
 * @LastEditors: jieTan
 * @LastModify:
 */

export default (props: { value: any }) => {
  const { name } = props?.value;
  return <a href="#">{name}</a>;
};
