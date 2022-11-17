import React, { useImperativeHandle, useState, forwardRef, useEffect, useCallback } from 'react';
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
import { checkInfo, CheckStatus } from '@/pages/onlineSystem/common/constant';
import styles from '../../common/common.less';
import { isEmpty } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import Ellipsis from '@/components/Elipsis';
import { mergeCellsTable } from '@/utils/utils';

const Check = (props: any, ref: any) => {
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [list, setList] = useState(checkInfo);
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      onRefreshCheck: getDetail,
      onCheck: onCheck,
      onSetting: () => setVisible(true),
      onLock: onLock,
    }),
    [selected, ref],
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

  const getDetail = async () => {
    setList(
      mergeCellsTable(
        list.map((it) => ({ ...it, disabled: !it.open })),
        'side',
      ),
    );
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div className={styles.onlineTable} style={{ height: '100%' }}>
        <Table
          size="small"
          bordered
          columns={[
            {
              title: '序号',
              dataIndex: 'num',
              width: 60,
              align: 'center',
              render: (_, r, i) => i + 1,
            },
            {
              title: '检查类别',
              dataIndex: 'check_type',
              width: '24%',
              render: (v) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '所属端',
              dataIndex: 'side',
              width: 90,
              align: 'center',
              onCell: (v) => ({ rowSpan: v?.rowSpan ?? 1 }),
            },
            {
              title: '检查状态',
              dataIndex: 'status',
              width: 100,
              align: 'center',
              render: (p) => (
                <span style={{ color: CheckStatus[p]?.color ?? '#000000d9' }}>
                  {CheckStatus[p]?.text ?? ''}
                </span>
              ),
            },
            {
              title: '检查开始时间',
              dataIndex: 'start_time',
              width: '12%',
              render: (v) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '检查结束时间',
              dataIndex: 'end_time',
              width: '12%',
              render: (v) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '是否启用',
              dataIndex: 'open',
              width: 90,
              align: 'center',
              render: (v, record, index) => (
                <Switch
                  checkedChildren={'开启'}
                  unCheckedChildren={'忽略'}
                  onChange={(e) => {
                    list[index].open = e;
                    list[index].disabled = !e;
                    setList([...list]);
                    if (!e) {
                      setSelected(selected.filter((it) => it != record.rowKey));
                    }
                  }}
                />
              ),
            },
            { title: '启用/忽略人', dataIndex: 'open_pm', width: 100 },
            {
              title: '启用/忽略时间',
              dataIndex: 'open_time',
              width: '12%',
              render: (v) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '检查日志',
              dataIndex: 'log',
              width: 90,
              fixed: 'right',
              align: 'center',
              render: (p) => (
                <img
                  style={{ width: 18, height: 18, marginRight: 10 }}
                  src={require('../../../../../public/logs.png')}
                  title={'日志'}
                />
              ),
            },
          ]}
          dataSource={list}
          pagination={false}
          scroll={{ x: 1200 }}
          rowKey={(p) => p.rowKey}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (p) => {
              setSelected(p as string[]);
            },
            getCheckboxProps: (record) => ({ disabled: record.disabled }),
          }}
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
          <Select options={[]} allowClear showSearch mode={'multiple'} />
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
