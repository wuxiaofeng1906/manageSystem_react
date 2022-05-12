import React, { useContext } from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { Popover } from 'antd';
import AddNodeList from './AddOptionList';
import WFC from '../../flow/ConditionList/context/FlowContext';
import 'antd/dist/antd.css';

function AddNode(props: { pRef?: any; objRef: any }) {
  const ctx = useContext(WFC) as any;

  function onOptionClick(type: any) {
    ctx?.onAddNode(type, props.pRef, props.objRef);
  }

  return (
    <div className="add-node-btn-box">
      <div className="add-node-btn">
        <Popover
          placement="right"
          content={<AddNodeList onOptionClick={onOptionClick} />}
          trigger="hover"
        >
          <PlusCircleFilled style={{ color: '#3296fa', fontSize: '32px' }} className="add-icon" />
        </Popover>
      </div>
    </div>
  );
}

export default AddNode;
