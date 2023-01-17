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
import { isEmpty, omit, delay, isString, uniq } from 'lodash';
import { infoMessage } from '@/publicMethods/showMessages';
import moment from 'moment';
import { useLocation, useModel, history, useParams } from 'umi';
import { ICheckType, OnlineSystemServices } from '@/services/onlineSystem';
import dayjs from 'dayjs';
import DutyListServices from '@/services/dutyList';
import usePermission from '@/hooks/permission';

const Check = (props: any, ref: any) => {
  const { tab, subTab } = useLocation()?.query as { tab: string; subTab: string };
  const { release_num } = useParams() as { release_num: string };
  const { onlineSystemPermission } = usePermission();
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [globalState, setGlobalState, basic] = useModel('onlineSystem', (online) => [
    online.globalState,
    online.setGlobalState,
    online.basic,
  ]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dutyPerson, setDutyPerson] = useState<any>();
  let [count, setCount] = useState(0);
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
      contact: '',
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
      onPushCheckFailMsg,
      onRefreshCheck: () => init(true),
      onSetting: () => setShow({ visible: true, data: release_num }),
    }),
    [selected, ref, globalState, basic, list, subTab, tab],
  );

  const onCheck = async () => {
    if (isEmpty(selected)) return infoMessage('请先选择检查项！');
    // [前端、后端代码遗漏]检查 判断是否设置检查参数
    // if (selected.some((key) => key.includes('version_data'))) {
    //   const param = await OnlineSystemServices.getCheckSettingDetail({ release_num });
    //   if (param?.default == 'yes') return infoMessage('请先设置检查参数');
    // }
    try {
      setSpin(true);
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
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  const onLock = async () => {
    /*
     * 1.检查是否封版，是否已确认
     * 2. 检查状态是否通过、忽略[除后端是否可以热更新]
     */

    if (!globalState.locked) {
      await OnlineSystemServices.checkProcess({ release_num });
      const flag = list.some(
        (it) => it.rowKey != 'hot_data' && !['yes', 'skip'].includes(it.status),
      );
      if (flag) return infoMessage('各项检查状态未达到『 通过、忽略 』，不能进行封版锁定');
    }

    await OnlineSystemServices.checkSealingLock({
      user_id: user?.userid ?? '',
      release_num,
      release_sealing: globalState.locked ? 'no' : 'yes',
    });
    setGlobalState({
      ...globalState,
      locked: !globalState.locked,
      step: globalState.locked ? 1 : 2,
    });
    // 封版自动跳转工单页
    if (!globalState.locked) {
      history.replace({
        pathname: history.location.pathname,
        query: { tab, subTab: 'sheet' },
      });
    }
  };

  const init = async (isFresh = false, showLoading = true) => {
    const from = dayjs().subtract(1, 'd').startOf('w').subtract(0, 'w');
    const to = from.endOf('w');

    const range = {
      start_time: dayjs(from).add(1, 'day').format('YYYY/MM/DD'),
      end_time: dayjs(to).add(1, 'day').format('YYYY/MM/DD'),
    };
    setSpin(showLoading);
    setSelected([]);
    try {
      if (isFresh) {
        // 忽略 不用跑检查
        const autoCheck = list.flatMap((it) =>
          ['zt-check-list', 'backend_test_unit', 'story_data'].includes(it.rowKey) && it.open
            ? [it.api_url]
            : [],
        );
        if (!isEmpty(uniq(autoCheck))) {
          await Promise.all(
            uniq(autoCheck).map((type) =>
              OnlineSystemServices.checkOpts(
                { release_num, user_id: user?.userid, api_url: type },
                type as ICheckType,
              ),
            ),
          );
        }
      }
      let orignDuty = dutyPerson;
      // 存在值班人员为空
      const refresh = (isEmpty(orignDuty) && count < 2) || isFresh;
      const [checkItem, firstDuty] = await Promise.all([
        OnlineSystemServices.getCheckInfo({ release_num }),
        refresh ? DutyListServices.getFirstDutyPerson(range) : null,
      ]);
      if (refresh) {
        const duty = firstDuty?.data?.flat().filter((it: any) => it.duty_order == '1');
        duty?.forEach((it: any) => {
          orignDuty = { ...orignDuty, [it.user_tech]: it.user_name };
        });
        setDutyPerson(orignDuty);
        setCount(++count);
      }
      setList(
        checkInfo.map((it) => {
          const currentKey = checkItem[it.rowKey];
          const flag = it.rowKey == 'auto_obj_data';
          let status = 'skip';
          if (flag) {
            status = isEmpty(currentKey)
              ? ''
              : currentKey?.find((it: any) => ['no', 'skip'].includes(it?.check_result))
                  ?.check_result || 'yes';
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
            source: currentKey?.data_from || it.source,
            contact: orignDuty?.[it.contact] || '',
          };
        }),
      );
      setSpin(false);
    } catch (e) {
      console.log(e);
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
    if (data.open) {
      infoMessage('任务正在执行中，请稍后刷新查看');
    } else delay(init, 500);
  };

  const showLog = (v: any, data: any) => {
    if (isEmpty(v) || (isEmpty(v?.before) && data.rowKey == 'libray_data'))
      return infoMessage('暂无检查日志');
    let type = data.rowKey;
    let width = 700;
    let content = v;
    // 链接
    if (['env_data', 'backend_test_unit'].includes(type) || data.api_url == 'version-check')
      return window.open(v);
    // 特殊处理
    if (type == 'libray_data')
      content = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>线上：</strong>
            {Object.entries(v?.before ?? {})?.map(([k, v]) => (
              <div>{`${k}: ${v}`}</div>
            ))}
          </div>
          <div>
            <strong>线下：</strong>
            {Object.entries(v?.after ?? {})?.map(([k, v]) => (
              <div>{`${k}: ${v}`}</div>
            ))}
          </div>
        </div>
      );
    if (type == 'hot_data') {
      width = 1000;
      content = (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>收集数据当前环境数据:</strong>
            <div>{v?.present_env}</div>
          </div>
          <div>
            <strong>收集数据线上环境数据:</strong>
            <div>{v?.online_env}</div>
          </div>
          <div>
            <strong>集群服务状态版本检查:</strong>
            <div>{v?.servers_check}</div>
          </div>
        </div>
      );
    }
    if (type.includes('seal_data') && !isString(v)) {
      content = (
        <div>
          {v?.map((it: any) => (
            <div key={it.name_path}>
              <span>{`【${it.name_path}】`}</span>【
              <span style={{ color: it.sealing_version == 'yes' ? '#52c41a' : '#faad14' }}>
                {it.sealing_version == 'yes' ? '已封版' : '未封版'}
              </span>
              】
              <span>{`封版时间：${
                it.sealing_version_time
                  ? dayjs(it.sealing_version_time).format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }`}</span>
            </div>
          ))}
        </div>
      );
    }

    return onLog({
      title: '检查日志',
      log: isEmpty(v) ? '' : String(v),
      noData: '暂无检查日志',
      content,
      width,
    });
  };
  const onPushCheckFailMsg = () => {
    Modal.confirm({
      centered: true,
      title: '一键推送检查失败信息提示：',
      content: '请确认是否一键推送检查失败信息到值班群？',
      onOk: () => OnlineSystemServices.pushFailMsg({ release_num }),
    });
  };

  useEffect(() => {
    let timer: any;
    if (subTab == 'check' && release_num && tab == 'process') {
      Modal?.destroyAll?.();
      isEmpty(dutyPerson) && init();
      timer = setInterval(() => {
        init(true, false);
      }, 15000);
      if ((globalState.locked || globalState.finished) && timer) {
        clearInterval(timer);
      }
    } else {
      setDutyPerson(undefined);
      setCount(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [subTab, tab, release_num, globalState, dutyPerson]);

  const hasEdit = useMemo(
    () => !onlineSystemPermission().checkStatus || globalState.locked || globalState.finished,
    [globalState, user?.group],
  );
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
              width: 320,
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
              render: (v) => CheckTechnicalSide[v],
            },
            {
              title: '数据来源',
              dataIndex: 'source',
              width: 120,
              align: 'center',
            },
            {
              title: '请联系',
              dataIndex: 'contact',
              width: 100,
              align: 'center',
            },
            {
              title: '检查状态',
              dataIndex: 'status',
              width: 100,
              align: 'center',
              render: (p, record) => {
                let status = p;
                const special = {
                  'sealing-version-check': { yes: 'version', no: 'noVersion' },
                  'hot-update-check': { yes: 'hot', no: 'noHot' },
                };
                // 特殊处理 封板，热更 状态
                if (
                  ['sealing-version-check', 'hot-update-check'].includes(record.api_url) &&
                  ['yes', 'no'].includes(p)
                ) {
                  status = special[record.api_url][p];
                }
                return (
                  <span
                    style={{ color: CheckStatus[status]?.color ?? '#000000d9', fontWeight: 500 }}
                  >
                    {CheckStatus[status]?.text ?? status}
                  </span>
                );
              },
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
            { title: '启用/忽略人', dataIndex: 'open_pm', width: 100, align: 'center' },
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
                    cursor: 'pointer',
                  }}
                  src={require('../../../../public/logs.png')}
                  title={'日志'}
                  onClick={() => showLog(v, record)}
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
  const [getLogInfo] = useModel('onlineSystem', (online) => [online.getLogInfo]);

  const [compareBranch, setCompareBranch] = useState<any[]>();
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
        main_since: data?.main_since ? moment(data?.main_since) : undefined,
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
    OnlineSystemServices.getBranch().then((res) => {
      setCompareBranch(res?.map((it: any) => ({ label: it.branch_name, value: it.branch_name })));
    });
    getDetail();
  }, [props.init.visible]);

  const showLog = async () => {
    const log = await getLogInfo({
      release_num: props.init.data,
      options_model: 'online_system_manage_check_detail',
    });
    onLog({
      title: '参数设置日志',
      log: isEmpty(log) ? '' : '参数',
      content: (
        <>
          {log?.map((it: any) => (
            <div>
              {it.create_time} {it.operation_content}
            </div>
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
      main_since: moment(values.main_since).format('YYYY-MM-DD'),
      auto_data: Object.keys(AutoCheckType)?.map((v: string) => ({
        check_type: v,
        check_result: values.auto_data?.includes(v) ? 'yes' : 'no',
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
        <Button onClick={showLog}>查看日志</Button>,
        <Button onClick={() => props.onOk?.()}>取消</Button>,
        <Button type={'primary'} disabled={disabled || loading} onClick={onConfirm}>
          确定
        </Button>,
      ]}
    >
      <Spin spinning={loading} tip={'数据加载中...'}>
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
              }))}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
