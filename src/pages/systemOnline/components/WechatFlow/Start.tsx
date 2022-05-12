import React from 'react';
import NodeWrap from './Wrap';

const getOwner = (userList = []): string => {
  if (!userList?.length) return '';
  return userList?.map((user: any) => user.name).join('、');
};

function StartNode(props: any) {
  return (
    <NodeWrap
      type={0}
      objRef={props.objRef}
      onContentClick={(e) => {}}
      title={<span>{props.nodeName}</span>}
    >
      <div className="text" title={getOwner(props.nodeUserList)}>
        {props.nodeUserList?.length > 0 && getOwner(props.nodeUserList)}
      </div>
      {/* <RightOutlined /> */}
    </NodeWrap>
  );
}

export default StartNode;
