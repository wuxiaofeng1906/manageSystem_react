import React, { useContext } from 'react';
import { RightOutlined } from '@ant-design/icons';
import NodeWrap from './Wrap';
import TitleElement from './TitleElement';
import WFC from '../../flow/ConditionList/context/FlowContext';

function NotifierNode(props: {
  pRef: { childNode: { nodeName: any } };
  objRef: any;
  onContentClick: () => any;
  nodeName: React.ReactNode;
  owner: React.ReactNode;
}) {
  const { onDeleteNode, onSelectNode } = useContext(WFC) as any;

  function delNode() {
    onDeleteNode(props.pRef, props.objRef);
  }

  // function onChange(val: any) {
  //   props.pRef.childNode.nodeName = val;
  // }

  function onContentClick() {
    onSelectNode(props.pRef, props.objRef);
    props.onContentClick?.();
  }

  const TitleEl = (
    <TitleElement
      delNode={delNode}
      nodeName={props.nodeName}
      // placeholder={props.nodeName}
      // onTitleChange={onChange}
    />
  );
  return (
    <NodeWrap
      type={0}
      titleStyle={{ backgroundColor: 'rgb(50, 150, 250)' }}
      onContentClick={onContentClick}
      title={TitleEl}
      objRef={props.objRef}
      pRef={props.pRef}
    >
      <div className="text">{props.owner ? props.owner : '请选择抄送人'}</div>
      <RightOutlined />
      {/* <i className="anticon anticon-right arrow"></i> */}
    </NodeWrap>
  );
}

export default NotifierNode;
