import React from 'react';
import MatchNode from './Node';

export interface IRender {
  config: INode;
  pRef: INode;
}

export interface INode extends IChildNode {
  childNode: IChildNode & { ccSelfSelectFlag: number };
  conditionNodes: IChildNode[];
  rule?: string;
}

export interface IChildNode {
  nodeName: string;
  type?: 0 | 1 | 2 | 3 | 4;
  nodeUserList: { id: string; name: string; type?: 0 | 1 | 2 | 3 | 4 }[];
  error: boolean;
  conditionList: Record<string, any>;
}

function Render({ config, pRef }: IRender) {
  console.log(pRef, config, 'pRef');
  return (
    <React.Fragment>
      <MatchNode pRef={pRef} config={config} />
      {config.childNode && <Render pRef={config} config={config.childNode as any} />}
    </React.Fragment>
  );
}

export default Render;
