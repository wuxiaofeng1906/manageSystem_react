import React, { useImperativeHandle, useState, forwardRef, useEffect } from 'react';
import {
  Table,
  Switch,
  Spin,
  Modal,
  Checkbox,
  Select,
  Form,
  DatePicker,
  ModalFuncProps,
  Button,
} from 'antd';
import { checkInfo } from '@/pages/onlineSystem/common/constant';
import styles from '../../common/common.less';
import { isEmpty } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';

const Check = (props: any, ref: any) => {
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState([]);
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      onRefreshCheck: getDetail,
      onCheck: onCheck,
      onSetting: () => setVisible(true),
      onLock: onLock,
    }),
    [],
  );
  const onCheck = async () => {
    if (isEmpty(selected)) return infoMessage('请先选择检查项！');
  };

  const onLock = async () => {
    /*
     * 1.检查是否封板，是否已确认
     * 2. 检查状态是否通过、忽略
     */
  };

  const getDetail = async () => {};

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div className={styles.onlineTable}>
        <Table
          columns={[
            { title: '序号', dataIndex: 'num', render: (_, r, i) => i + 1 },
            { title: '检查类别', dataIndex: 'check_type' },
            { title: '所属端', dataIndex: 'side' },
            { title: '检查状态', dataIndex: 'status' },
            { title: '检查开始时间', dataIndex: 'start_time' },
            { title: '检查结束时间', dataIndex: 'end_time' },
            {
              title: '是否启用',
              dataIndex: 'open',
              render: (p) => <Switch checkedChildren={'开启'} unCheckedChildren={'忽略'} />,
            },
            { title: '启用/忽略人', dataIndex: 'open_pm' },
            { title: '启用/忽略时间', dataIndex: 'open_time' },
            {
              title: '检查日志',
              dataIndex: 'log',
              render: (p) => (
                <img
                  style={{ width: 18, height: 18, marginRight: 10 }}
                  src={require('../../../../../public/logs.png')}
                  title={'日志'}
                />
              ),
            },
          ]}
          dataSource={checkInfo}
          pagination={false}
          rowKey={(p) => p.id}
          rowSelection={{ selectedRowKeys: selected }}
        />
        <CheckSettingModal
          visible={visible}
          onOk={(e) => {
            setVisible(false);
          }}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(Check);

const CheckSettingModal = (props: ModalFuncProps) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!props.visible) return form.resetFields();
  }, [props.visible]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    props.onOk?.(true);
  };
  return (
    <Modal
      {...props}
      centered
      destroyOnClose
      maskClosable={false}
      title={'检查参数设置'}
      onCancel={() => props?.onOk?.()}
      footer={[
        <img
          style={{ width: 18, height: 18, marginRight: 10 }}
          src={require('../../../../../public/logs.png')}
          title={'日志'}
        />,
        <Button onClick={() => props.onOk?.()}>取消</Button>,
        <Button type={'primary'} disabled={disabled} onClick={onConfirm}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <h4>一、检查上线分支是否包含对比分支的提交</h4>
        <Form.Item
          label={'被对比的主分支'}
          name={'branch'}
          rules={[{ message: '请选择对比分支', required: true }]}
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item
          label={'对比起始时间'}
          name={'time'}
          rules={[{ message: '请选择对比起始时间', required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <h4>二、升级前自动化检查是否通过</h4>
        <Form.Item>
          <Checkbox.Group
            options={[
              { label: 'ui执行通过', value: 'ui' },
              { label: '小程序执行通过', value: 'applet' },
              { label: '接口执行通过', value: 'api' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
