import React from 'react';
import { NodeTypes } from './Constants';
import AddNode from './Add';

function NodeWrap(props: {
  type: number;
  onContentClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
  titleStyle?: React.CSSProperties | undefined;
  title: React.ReactNode;
  children: React.ReactNode;
  objRef: any;
  pRef: any;
}) {
  return (
    <div>
      <div className="node-wrap">
        <div
          className={'node-wrap-box ' + (props.type === NodeTypes.START ? 'start-node' : '')}
          onClick={props.onContentClick}
        >
          <div className="title" style={props.titleStyle || {}}>
            {props.title}
          </div>
          <div className="content">{props.children}</div>
        </div>
        <AddNode objRef={props.objRef} pRef={props.pRef} />
      </div>
    </div>
  );
}

export default NodeWrap;
