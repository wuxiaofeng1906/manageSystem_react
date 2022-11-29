import React, { useImperativeHandle, useState, forwardRef, useEffect, useMemo } from 'react';
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
import {
  AutoCheckType,
  checkInfo,
  CheckStatus,
  CheckTechnicalSide,
} from '@/pages/onlineSystem/config/constant';
import styles from '../../config/common.less';
import { isEmpty, omit } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import Ellipsis from '@/components/Elipsis';
import moment from 'moment';
import { useLocation, useModel, history, useParams } from 'umi';
import { ICheckType, OnlineSystemServices } from '@/services/onlineSystem';

const Check = (props: any, ref: any) => {
  const query = useLocation()?.query;
  const { release_num } = useParams() as { release_num: string };
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [globalState, setGlobalState, basic] = useModel('onlineSystem', (online) => [
    online.globalState,
    online.setGlobalState,
    online.basic,
  ]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [list, setList] = useState(checkInfo);
  const [show, setShow] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  useImperativeHandle(
    ref,
    () => ({
      onRefreshCheck: getDetail,
      onCheck: onCheck,
      onSetting: () => setShow({ visible: true, data: null }),
      onLock: onLock,
    }),
    [selected, ref, globalState, basic],
  );

  const onCheck = async () => {
    if (isEmpty(selected)) return infoMessage('请先选择检查项！');
    const checkList = list.flatMap((it) =>
      selected.includes(it.rowKey) && it.api_url
        ? [
            {
              user_id: user?.userid ?? '',
              release_num,
              is_ignore: !it.open,
              side: it.side,
              api_url: it.api_url as ICheckType,
            },
          ]
        : [],
    );
    await Promise.all(
      checkList.map((data) =>
        OnlineSystemServices.checkOpts(omit(data, ['api_url']), data.api_url),
      ),
    );
    console.log(checkList);
  };

  const onLock = async () => {
    /*
     * 1.检查是否封板，是否已确认
     * 2. 检查状态是否通过、忽略
     */
    await OnlineSystemServices.checkSealingLock({
      user_id: user?.userid ?? '',
      release_num,
      release_sealing: globalState.locked ? 'no' : 'yes',
    });
    if (!globalState.finished) {
      setGlobalState({ ...globalState, locked: !globalState.locked });
    }
  };

  const getDetail = async () => {
    setSelected([]);
    try {
      const res = await OnlineSystemServices.getCheckInfo({ release_num });
      setList(
        checkInfo.map((it) => {
          const currentKey = res[it.rowKey];
          return {
            ...it,
            disabled: currentKey?.[it.status] !== 'skip',
            status: currentKey?.[it.status] ?? '',
            start: currentKey?.[it.start] || '',
            end: currentKey?.[it.end] || '',
            open: currentKey?.[it.status] == 'skip',
            open_pm: currentKey?.[it.open_pm] || '',
            open_time: currentKey?.[it.open_time] || '',
            log: currentKey?.[it.log] || '',
          };
        }),
      );
    } catch (e) {
      setList(
        checkInfo.map((it) => ({
          ...it,
          disabled: !it.open,
          status: '',
          start: '',
          end: '',
          open_pm: '',
          open_time: '',
          log: '',
        })),
      );
    }
  };

  const updateStatus = async (data: any) => {
    const res = await OnlineSystemServices.updateCheckStatus({
      user_id: user?.userid,
      release_num,
      is_ignore: data.status,
      side: data.side,
    });
  };

  useEffect(() => {
    if (query.key == 'check') {
      getDetail();
    }
  }, [query.key]);

  useEffect(() => {
    if (globalState.locked && globalState.step == 2) {
      console.log('check');
      history.replace({ pathname: history.location.pathname, query: { key: 'sheet' } });
    }
  }, [globalState]);

  const hasEdit = useMemo(() => globalState.locked || globalState.finished, [globalState]);

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
              fixed: 'left',
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
              render: (v) => CheckTechnicalSide[v],
            },
            {
              title: '检查状态',
              dataIndex: 'status',
              width: 100,
              align: 'center',
              render: (p) => (
                <span style={{ color: CheckStatus[p]?.color ?? '#000000d9', fontWeight: 500 }}>
                  {CheckStatus[p]?.text ?? p}
                </span>
              ),
            },
            {
              title: '检查开始时间',
              dataIndex: 'start',
              width: '12%',
              render: (v) => (
                <Ellipsis title={v} width={'100%'} placement={'bottomLeft'} color={'#108ee9'} />
              ),
            },
            {
              title: '检查结束时间',
              dataIndex: 'end',
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
                  disabled={hasEdit}
                  checked={v}
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
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    ...(hasEdit ? { filter: 'grayscale(1)', cursor: 'not-allowed' } : {}),
                  }}
                  src={require('../../../../../public/logs.png')}
                  title={'日志'}
                  onClick={() => {
                    if (hasEdit) return;
                  }}
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
            getCheckboxProps: (record) => ({ disabled: hasEdit || record.disabled }),
          }}
        />
        <CheckSettingModal
          init={show}
          onOk={async (values) => {
            if (values) {
              await OnlineSystemServices.checkSetting({
                user_id: user?.userid,
                release_num,
                ...values,
              });
            }
            setShow({ visible: false, data: null });
          }}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(Check);

const CheckSettingModal = (props: ModalFuncProps & { init: { visible: boolean; data: any } }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  const [compareBranch, setCompareBranch] = useState<any[]>([]);

  const getBranch = async () => {
    const res = await OnlineSystemServices.getBranch();
    setCompareBranch(res?.map((it) => ({ label: it.branch_name, value: it.branch_id })));
  };

  useEffect(() => {
    if (!props.init.visible) return form.resetFields();
    getBranch();
    if (props.init.data) form.setFieldsValue({ ...props.init.data });
  }, [props.init.visible]);

  const onConfirm = async () => {
    const values = await form.validateFields();
    setDisabled(true);
    await props.onOk?.({
      main_branch: values?.main_branch?.join(',') ?? '',
      main_since: moment(values.main_since).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
      auto_data: Object.keys(AutoCheckType)?.map((v: string) => ({
        check_type: v,
        check_result: values.auto_data?.includes(v),
      })),
    });
    setDisabled(false);
  };

  return (
    <Modal
      {...props}
      centered
      destroyOnClose
      maskClosable={false}
      title={'检查参数设置'}
      onCancel={() => props?.onOk?.()}
      visible={props.init?.visible}
      footer={[
        <Button
          onClick={() => {
            console.log(props.init?.data);
          }}
        >
          查看日志
        </Button>,
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
          name={'main_branch'}
          rules={[{ message: '请选择对比分支', required: true }]}
        >
          <Select options={compareBranch} allowClear showSearch mode={'multiple'} />
        </Form.Item>
        <Form.Item
          label={'对比起始时间'}
          name={'main_since'}
          rules={[{ message: '请选择对比起始时间', required: true }]}
        >
          <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
        </Form.Item>
        <h4>二、升级前自动化检查是否通过</h4>
        <Form.Item name={'auto_data'}>
          <Checkbox.Group
            options={Object.keys(AutoCheckType).map((v) => ({
              label: AutoCheckType[v],
              value: v,
              key: v,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
