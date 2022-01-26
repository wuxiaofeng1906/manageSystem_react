/*
 * @Description: 跳转链接字段
 * @Author: jieTan
 * @Date: 2021-11-23 15:13:51
 * @LastEditTime: 2021-12-21 10:05:15
 * @LastEditors: jieTan
 * @LastModify:
 */
import {Link} from 'umi';

export default (props: { value: any; route?: string; data?: any }) => {
  debugger;
  const href = props.route ? `${props.route}?id=${props.data.project.id}&name=${props.data.project.name}` : '#';
  return <Link to={href}>{props?.value}</Link>;
};
