import React, { useContext } from 'react';
import { RightOutlined } from '@ant-design/icons';
import NodeWrap from './Wrap';
import TitleElement from './TitleElement';
import WFC from '../../flow/ConditionList/context/FlowContext';

function ApproverNode(props: {
  pRef: any;
  objRef: any;
  nodeName: React.ReactNode;
  owner: React.ReactNode;
}) {
  const { onDeleteNode, onSelectNode, handleOpenApproverDrawer } = useContext(WFC) as any;
  const delNode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    onDeleteNode(props.pRef, props.objRef);
  };

  function onContentClick() {
    onSelectNode(props.pRef, props.objRef);
    handleOpenApproverDrawer();
  }

  // TODO: 这里读取props数据
  const TitleEl = <TitleElement delNode={delNode} nodeName={props.nodeName} />;
  return (
    <NodeWrap
      type={0}
      titleStyle={{ backgroundColor: 'rgb(255, 148, 62)' }}
      onContentClick={onContentClick}
      title={TitleEl}
      objRef={props.objRef}
      pRef={props.pRef}
    >
      <div className="text">{props.owner ? props.owner : '请选择审核人'}</div>
      <RightOutlined />
    </NodeWrap>
  );
}

export default ApproverNode;
