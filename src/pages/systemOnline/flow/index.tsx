import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import { initConfig } from './init';
import OpContext from './ConditionList/context/FlowContext';
import ZoomLayout from '../components/WechatFlow/ZoomLayout';
import Render, { INode } from '../components/WechatFlow/Render';
import EndNode from '../components/WechatFlow/End';
import MyDrawer from '../components/WechatFlow/MyDrawer';
import SetApprover from '../components/WechatFlow/SetApprover';
import SetCondition from '../components/WechatFlow/SetCondition';
import { OptionTypes, NodeTemplates, NodeTypes } from '../components/WechatFlow/Constants';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

export const Flow = forwardRef(
  (props: { children?: React.ReactNode; config: INode; formItems: any[] }, ref) => {
    const [config, setConfig] = useState<any>(isEmpty(props.config) ? initConfig : props.config);
    const [currentNode, setCurrentNode] = useState<any>({});
    const conditionRef = useRef<any>(null);
    const pRef = useRef<INode>(null);
    const approverRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({}));

    // refresh
    const updateNode = () => {
      setConfig({ ...config });
    };

    // add node
    const onAddNode = (type: number, objRef: Record<string, any>) => {
      const childNode = objRef.childNode;
      if (type === OptionTypes.APPROVER) {
        objRef.childNode = {
          ...NodeTemplates[OptionTypes.APPROVER],
          childNode,
        };
      }
      if (type === OptionTypes.NOTIFIER) {
        objRef.childNode = {
          ...NodeTemplates[OptionTypes.NOTIFIER],
          childNode,
        };
      }
      if (type === OptionTypes.CONDITION) {
        objRef.childNode = {
          ...NodeTemplates[OptionTypes.CONDITION],
          conditionNodes: [
            {
              ...NodeTemplates[OptionTypes.BRANCH],
              nodeName: '条件1',
              childNode,
            },
            { ...NodeTemplates[OptionTypes.BRANCH], nodeName: '条件2' },
          ],
        };
      }
      if (type === OptionTypes.BRANCH) {
        objRef.conditionNodes.push({ ...NodeTemplates[NodeTypes.BRANCH] });
      }
      updateNode();
    };

    // delete node tips
    const onDeleteNode = (pRef: any, objRef: any, type: number, index: number) => {
      Modal.confirm({
        title: '删除提示',
        icon: <ExclamationCircleOutlined />,
        content: '是否该删除节点？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          if (type === NodeTypes.BRANCH) {
            objRef.conditionNodes.splice(index, 1);
          } else {
            pRef.childNode = objRef.childNode;
          }
          updateNode();
          Modal.destroyAll();
        },
      });
    };

    // get current node
    const onSelectNode = (pRef: any, objRef: any) => {
      setCurrentNode(objRef);
    };

    // 打开审批人Drawer
    const handleOpenApproverDrawer = () => approverRef.current.openModal();
    const handleCloseApproverDrawer = () => approverRef.current.closeModal();
    const handleOpenConditionDrawer = () => conditionRef.current.openModal();
    const handleCloseConditionDrawer = () => conditionRef.current.closeModal();

    return (
      <OpContext.Provider
        value={{
          config,
          currentNode,
          updateNode,
          onAddNode,
          onDeleteNode,
          onSelectNode,
          handleOpenApproverDrawer,
          handleCloseApproverDrawer,
          handleOpenConditionDrawer,
          handleCloseConditionDrawer,
        }}
      >
        <div className={styles.flowContainer}>
          <section className="wechat-flow-design">
            <ZoomLayout>
              <Render config={config} pRef={pRef as any} />
              <EndNode />
            </ZoomLayout>
          </section>
          <MyDrawer
            ref={approverRef}
            title={currentNode?.nodeName}
            contentWrapperStyle={{ width: '736px' }}
            closable={false}
          >
            <SetApprover />
          </MyDrawer>
          <MyDrawer
            ref={conditionRef}
            title="条件设置"
            contentWrapperStyle={{ width: '736px' }}
            closable={false}
          >
            <SetCondition formItems={props?.formItems || []} />
          </MyDrawer>
        </div>
      </OpContext.Provider>
    );
  },
);

export default Flow;
