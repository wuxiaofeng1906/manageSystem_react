/*
 * @Description: 关联发布单次数详情列表 - 组件
 * @ReferLink: http://zentao.77hub.com/zentao/story-view-18304.html?tid=vhxba2yy
 * @Author: jieTan
 * @Date: 2023-08-23 14:20:10
 * @LastEditTime: 2023-08-24 10:20:01
 * @LastEditors: jieTan
 * @LastModify:
 */

import { Popover } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { useEffect, useState } from 'react';

interface propsInput {
  item: any[];
  placement: TooltipPlacement | undefined;
  trigger: string | string[] | undefined;
}

const ContentList = (props: propsInput) => {
  const elements = props.item?.map((item) => {
    const result = item.release_result == 'unknown' ? '未发布' : '已发布';
    const linkTo =
      item.ready_release == 'ready_release'
        ? `/onlineSystem/releaseOrder/${item.release_num}/${item.release_name}`
        : `/onlineSystem/prePublish/${item.release_num}/${item.release_branch}/${item.release_name}`;
    return (
      <div key={item.release_num}>
        <a target="_blank" href={linkTo}>
          {item.release_name}
        </a>
        ({result})
      </div>
    );
  });

  return <div>{elements}</div>;
};

export default (props: propsInput) => {
  const [content, setContent] = useState<any>();

  useEffect(() => {
    setContent(<ContentList {...props} />);
  }, []);

  return props.item ? (
    <Popover content={content} placement={props.placement} trigger={props.trigger}>
      <span>{props.item.length}</span>
    </Popover>
  ) : (
    <span>0</span>
  );
};
