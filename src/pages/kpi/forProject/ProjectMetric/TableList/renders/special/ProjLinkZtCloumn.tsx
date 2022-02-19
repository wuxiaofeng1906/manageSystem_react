/*
 * @Description: 跳转链接字段: 原生
 * @Author: jieTan
 * @Date: 2021-11-23 15:13:51
 * @LastEditTime: 2022-02-19 03:09:38
 * @LastEditors: jieTan
 * @LastModify:
 */
import { ztExectionUrl } from '@/namespaces';
import { LinkOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

export default (props: any) => (
  <>
    {props?.valueFormatted}
    <Divider type="vertical" />
    <a href={ztExectionUrl(props.data.project.id)} target="_blank">
      <LinkOutlined />
    </a>
  </>
);
