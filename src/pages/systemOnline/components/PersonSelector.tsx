import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
export interface OptionType {
  value: string;
  label: string;
  key: string;
}

const PersonSelector = (props: ModalFuncProps & { data: OptionType[] }) => {
  const [list, setList] = useState<OptionType[]>([]);
  const [checkData, setCheckData] = useState<string[]>([]);

  const formatNode = () => {
    const result: OptionType[] = [];
    checkData.map((v) =>
      list.forEach((it) => {
        if (it.value == v) result.push(it);
      }),
    );
    return result;
  };
  useEffect(() => {
    if (props.visible) {
      setList([
        {
          label: '张三',
          value: '101',
          key: '101',
        },
        {
          label: '刘德饭',
          value: '102',
          key: '102',
        },
        {
          label: '王麻子',
          value: '201',
          key: '201',
        },
        {
          label: '赵思',
          value: '202',
          key: '202',
        },
        {
          label: '加斯',
          value: '203',
          key: '203',
        },
      ]);
      setCheckData(props.data?.map((it) => it.value) || []);
    }
  }, [props.visible, props.data]);
  return (
    <Modal
      title={'人员选择'}
      visible={props.visible}
      maskClosable={false}
      onOk={() => props.onOk?.(formatNode())}
      onCancel={props.onCancel}
    >
      <Select
        showArrow
        options={list}
        value={checkData}
        mode={'multiple'}
        style={{ width: '100%' }}
        maxTagCount={5}
        onChange={(v) => setCheckData(v)}
      />
    </Modal>
  );
};
export default PersonSelector;
