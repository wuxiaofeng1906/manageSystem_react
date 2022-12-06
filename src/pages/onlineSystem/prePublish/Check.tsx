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
  Tooltip,
} from 'antd';
import {
  AutoCheckType,
  checkInfo,
  CheckStatus,
  CheckTechnicalSide,
  onLog,
} from '@/pages/onlineSystem/config/constant';
import styles from '../config/common.less';
import { isEmpty, omit, delay } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
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
  const [list, setList] = useState(() =>
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
  const [show, setShow] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  useImperativeHandle(
    ref,
    () => ({
      onCheck,
      onLock,
      onRefreshCheck: getDetail,
      onSetting: () => setShow({ visible: true, data: release_num }),
    }),
    [selected, ref, globalState, basic, list],
  );

  const onCheck = async () => {
    if (isEmpty(selected)) return infoMessage('请先选择检查项！');
    // [前端、后端代码遗漏]检查 判断是否设置检查参数
    if (selected.some((key) => key.includes('version_data'))) {
      const param = await OnlineSystemServices.getCheckSettingDetail({ release_num });
      if (param?.default == 'yes') return infoMessage('请先设置检查参数');
    }
    const checkList = list.flatMap((it) =>
      selected.includes(it.rowKey) && it.api_url
        ? [
            {
              user_id: user?.userid ?? '',
              release_num,
              is_ignore: it.open ? 'no' : 'yes',
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
    infoMessage('任务正在进行中，请稍后刷新');
    delay(getDetail, 2000);
  };

  const onLock = async () => {
    /*
     * 1.检查是否封版，是否已确认
     * 2. 检查状态是否通过、忽略
     */

    if (!globalState.locked) {
      await OnlineSystemServices.checkProcess({ release_num });
      const flag = list.some((it) => !['yes', 'skip'].includes(it.status));
      if (flag) return infoMessage('各项检查状态未达到『 通过、忽略 』，不能进行封版锁定');
    }

    await OnlineSystemServices.checkSealingLock({
      user_id: user?.userid ?? '',
      release_num,
      release_sealing: globalState.locked ? 'no' : 'yes',
    });
    // 封版自动跳转工单页
    if (!globalState.locked) {
      history.replace({
        pathname: history.location.pathname,
        query: { subTab: 'sheet', tab: query.tab },
      });
    }
    setGlobalState({ ...globalState, locked: !globalState.locked, step: 2 });
  };

  const getDetail = async () => {
    setSelected([]);
    setSpin(true);
    try {
      const res = await OnlineSystemServices.getCheckInfo({ release_num });
      setList(
        checkInfo.map((it) => {
          const currentKey = res[it.rowKey];
          const flag = it.rowKey == 'auto_obj_data';
          let status = 'skip';
          if (flag) {
            status = isEmpty(currentKey)
              ? ''
              : currentKey?.some((it: any) => it?.check_result == 'no')
              ? 'no'
              : 'yes';
          }
          return {
            ...it,
            disabled: false,
            status: flag ? status : currentKey?.[it.status] ?? '',
            start: flag ? (status == '' ? status : '-') : currentKey?.[it.start] || '',
            end: flag ? (status == '' ? status : '-') : currentKey?.[it.end] || '',
            open: flag ? status !== 'skip' : currentKey?.[it.status] !== 'skip',
            open_pm: currentKey?.[it.open_pm] || '',
            open_time: currentKey?.[it.open_time] || '',
            log: currentKey?.[it.log] || '',
          };
        }),
      );
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  const updateStatus = async (data: any) => {
    await OnlineSystemServices.checkOpts(
      {
        user_id: user?.userid ?? '',
        release_num,
        is_ignore: data.open ? 'no' : 'yes',
        side: data.side,
      },
      data.api_url,
    );
    delay(getDetail, 2000);
  };

  useEffect(() => {
    if (query.subTab == 'check' && release_num && query.tab == 'process') {
      Modal?.destroyAll?.();
      getDetail();
    }
  }, [query, release_num]);

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
              width: 300,
              fixed: 'left',
              render: (v) => (
                <Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>
                  {v}
                </Tooltip>
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
              align: 'center',
              title: '检查开始时间',
              dataIndex: 'start',
              width: 180,
              render: (v, record) =>
                !record.open ? (
                  ''
                ) : (
                  <Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>
                    {v}
                  </Tooltip>
                ),
            },
            {
              align: 'center',
              title: '检查结束时间',
              dataIndex: 'end',
              width: 180,
              render: (v, record) =>
                !record.open ? (
                  ''
                ) : (
                  <Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>
                    {v}
                  </Tooltip>
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
                  disabled={hasEdit || record.disabled}
                  checked={v}
                  onChange={(e) => {
                    list[index].disabled = true;
                    setList([...list]);
                    if (!e) {
                      setSelected(selected.filter((it) => it != record.rowKey));
                    }
                    updateStatus({ ...record, open: e });
                  }}
                />
              ),
            },
            { title: '启用/忽略人', dataIndex: 'open_pm', width: 100 },
            {
              title: '启用/忽略时间',
              dataIndex: 'open_time',
              width: 180,
              render: (v) => (
                <Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>
                  {v}
                </Tooltip>
              ),
            },
            {
              title: '检查日志',
              dataIndex: 'log',
              width: 90,
              fixed: 'right',
              align: 'center',
              render: (v, record) => (
                <img
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 10,
                    ...(hasEdit || !record.open || v == ''
                      ? { filter: 'grayscale(1)', cursor: 'not-allowed' }
                      : { cursor: 'pointer' }),
                  }}
                  src={require('../../../../public/logs.png')}
                  title={'日志'}
                  onClick={() => {
                    if (hasEdit || !record.open || v == '') return;
                    let type = record.rowKey;
                    let content = v;
                    if (type == 'env_data' || record.api_url == 'version-check')
                      return window.open(v);
                    if (type == 'libray_data')
                      content = (
                        <div>
                          <div>
                            线上：
                            <pre style={{ whiteSpace: 'pre-line' }}>{v?.before}</pre>
                          </div>
                          <div>
                            线下：
                            <pre style={{ whiteSpace: 'pre-line' }}>{v?.after}</pre>
                          </div>
                        </div>
                      );
                    return onLog({ title: '检查日志', log: v, noData: '暂无检查日志', content });
                  }}
                />
              ),
            },
          ]}
          dataSource={list}
          pagination={false}
          scroll={{ x: 'min-content' }}
          rowKey={(p) => p.rowKey}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (p) => {
              setSelected(p as string[]);
            },
            getCheckboxProps: (record) => ({
              disabled:
                hasEdit ||
                record.disabled ||
                !record.open ||
                record.status == 'running' ||
                record.rowKey == 'auto_obj_data', // 升级前自动化检查
            }),
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
  const [compareBranch, getLogInfo] = useModel('onlineSystem', (online) => [
    online.branchs,
    online.getLogInfo,
  ]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDetail = async () => {
    setLoading(true);
    try {
      const res = await OnlineSystemServices.getCheckSettingDetail({
        release_num: props.init.data,
      });
      const data = res?.branch_check_data;
      form.setFieldsValue({
        main_branch: data?.main_branch ? data?.main_branch?.split(',') : [],
        main_since: data?.main_since ? moment(data?.main_since).subtract(5, 'days') : undefined,
        auto_data: isEmpty(res?.auto_data)
          ? []
          : res?.auto_data?.flatMap((it: any) => (it.check_result == 'yes' ? [it.check_type] : [])),
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!props.init.visible) return form.resetFields();
    getDetail();
  }, [props.init.visible]);

  const showLog = async () => {
    const log = await getLogInfo({
      release_num: props.init.data,
      options_model: 'online_system_manage_check_detail',
    });
    onLog({
      title: '参数设置日志',
      log: JSON.stringify(log),
      content: (
        <>
          {log?.map((it: any) => (
            <div>{it.operation_content}</div>
          ))}
        </>
      ),
      noData: '暂无参数设置日志！',
    });
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    setDisabled(true);
    await props.onOk?.({
      main_branch: values?.main_branch?.join(',') ?? '',
      main_since: moment(values.main_since)
        .add(5, 'day')
        .startOf('d')
        .format('YYYY-MM-DD HH:mm:ss'),
      auto_data: Object.keys(AutoCheckType)?.map((v: string) => ({
        check_type: v,
        check_result: values.auto_data?.includes(v) ? 'yes' : 'no',
      })),
    });
    setDisabled(false);
  };

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <Modal
        {...props}
        centered
        destroyOnClose
        maskClosable={false}
        title={'检查参数设置'}
        onCancel={() => props?.onOk?.()}
        visible={props.init?.visible}
        footer={[
          <Button onClick={showLog}>查看日志</Button>,
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
    </Spin>
  );
};
