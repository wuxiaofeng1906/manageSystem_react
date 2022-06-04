import React, { useEffect, useState } from 'react';
import { Modal, TreeSelect } from 'antd';
import { useModel, useLocation } from 'umi';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import OnlineServices from '@/services/online';

const OneKeyDeploy = (props: ModalFuncProps) => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [data, setData] = useState([]);

  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [disabled] = useModel('systemOnline', (system) => [system.disabled]);

  const onFinish = async () => {
    if (!idx || disabled) return;
    const res = await OnlineServices.deployConfirm({
      user_id: currentUser?.userid,
      release_num: idx,
    });
    console.log(res);
  };

  useEffect(() => {
    if (!props.visible) setData([]);
  }, [props.visible]);

  return (
    <Modal
      title={'一键部署'}
      visible={props.visible}
      onOk={onFinish}
      onCancel={props.onCancel}
      maskClosable={false}
      okText="点击部署"
    >
      <TreeSelect
        disabled={disabled}
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
