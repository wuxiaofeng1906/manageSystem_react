import React from 'react';

import StartNode from './Start';
import ApproverNode from './Approver';
import NotifierNode from './Notifier';
import ConditionNode from './Condition';
import { IRender } from '@/pages/systemOnline/components/WechatFlow/Render';

const NodeMaps = {
  0: StartNode,
  1: ApproverNode,
  2: NotifierNode,
  4: ConditionNode,
};

function MatchNode({ config, pRef }: IRender) {
  const Node = config.type == undefined ? null : NodeMaps[config.type];
  return Node && <Node {...config} objRef={config} pRef={pRef} />;
}

export default MatchNode;
