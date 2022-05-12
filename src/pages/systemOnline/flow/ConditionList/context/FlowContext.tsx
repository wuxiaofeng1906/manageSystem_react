import React from 'react';
import { INode } from '@/pages/systemOnline/components/WechatFlow/Render';

export interface IContext {
  config: INode;
  currentNode: any;
  updateNode: Function;
  onAddNode: (type: number, objRef: Record<string, any>) => void;
  onDeleteNode: (pRef: any, objRef: any, type: number, index: number) => void;
  onSelectNode: (pRef: any, objRef: any) => void;
  handleOpenApproverDrawer: () => void;
  handleCloseApproverDrawer: () => void;
  handleOpenConditionDrawer: () => void;
  handleCloseConditionDrawer: () => void;
}

const Context = React.createContext({});
export default Context;
