import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal/Modal';

const DeploySetting = (props: ModalFuncProps) => {
  return (
    <Modal visible={props.visible} title={props.title} onCancel={props.onCancel}>
      <div>部署参数设置</div>
    </Modal>
  );
};
export default DeploySetting;
