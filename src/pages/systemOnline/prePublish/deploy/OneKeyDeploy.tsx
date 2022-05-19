import React, { useEffect, useState } from 'react';
import { Modal, TreeSelect } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal/Modal';

const OneKeyDeploy = (props: ModalFuncProps) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!props.visible) setData([]);
  }, [props.visible]);
  return (
    <Modal
      title={'一键部署'}
      visible={props.visible}
      onOk={() => props.onOk?.(data)}
      onCancel={props.onCancel}
      maskClosable={false}
      okText="点击部署"
    >
      <TreeSelect
        style={{ width: '100%' }}
        value={data}
        allowClear
        treeCheckable
        multiple
        showArrow
        treeDefaultExpandAll
        onChange={(value) => setData(value)}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'一键部署'}
        treeData={[
          {
            title: '全部',
            value: 'all',
            children: [
              { title: 'apps', value: 'apps' },
              { title: 'web', value: 'web' },
              { title: 'h5', value: 'h5' },
              { title: 'trek', value: 'trek' },
              { title: 'global', value: 'global' },
            ],
          },
        ]}
      />
    </Modal>
  );
};
export default OneKeyDeploy;
