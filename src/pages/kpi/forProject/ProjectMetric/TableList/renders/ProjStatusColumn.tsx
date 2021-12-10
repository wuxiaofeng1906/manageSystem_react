/*
 * @Description: 项目当前状态
 * @Author: jieTan
 * @Date: 2021-12-08 14:18:15
 * @LastEditTime: 2021-12-08 15:09:45
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Tag } from 'antd';
import { PROJ_STATUS } from '@/namespaces';

export default (props: { value: any }) => {
  switch (props?.value) {
    case PROJ_STATUS.wait.zh:
      return <Tag style={{ color: 'gray' }} children={props.value} />;
    case PROJ_STATUS.doing.zh:
      return <Tag color="processing" children={props.value} />;
    case PROJ_STATUS.suspended.zh:
      return <Tag color="warning" children={props.value} />;
    case PROJ_STATUS.closed.zh:
      return <Tag color="success" children={props.value} />;
  }

  return;
};
