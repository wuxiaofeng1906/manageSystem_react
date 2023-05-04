import React, {useImperativeHandle, useState, forwardRef, useEffect, useMemo} from 'react';
import {
  Table, Switch, Spin, Modal, Checkbox, Select,
  Form, DatePicker, ModalFuncProps, Button, Tooltip, Input
} from 'antd';
import {
  AutoCheckType, checkInfo, CheckStatus, CheckTechnicalSide, onLog,
} from '@/pages/onlineSystem/config/constant';
import styles from '../config/common.less';
import {isEmpty, omit, delay, isString, uniq} from 'lodash';
import {errorMessage, infoMessage} from '@/publicMethods/showMessages';
import moment from 'moment';
import {useLocation, useModel, history, useParams} from 'umi';
import {ICheckType, OnlineSystemServices} from '@/services/onlineSystem';
import dayjs from 'dayjs';
import DutyListServices from '@/services/dutyList';
import usePermission from '@/hooks/permission';

const {TextArea} = Input;
const Check = (props: any, ref: any) => {
  let timer: any;
  const {tab, subTab} = useLocation()?.query as { tab: string; subTab: string };
  const {release_num} = useParams() as { release_num: string };
  const {onlineSystemPermission} = usePermission();
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
      check_person: '',
      desc: ""
    })),
  );
  // 检查参数设置是否可见
  const [show, setShow] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  // 是否启用关闭说明弹窗是否可见
  const [descShow, setDescShow] = useState<{ visible: boolean; data: any; param: any }>({
    visible: false,
    data: null,
    param: null
  });

  useImperativeHandle(
    ref,
    () => ({
      onCheck,
      onLock,
      onPushCheckFailMsg,
      onRefreshCheck: () => {
        timer && clearInterval(timer);
        init(true);
      },
      onSetting: () => setShow({visible: true, data: release_num}),
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
      await OnlineSystemServices.checkProcess({release_num});
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
        query: {tab, subTab: 'sheet'},
      });
    }
  };

  const init = async (isFresh = false, showLoading = true) => {
    setSpin(showLoading);
    setSelected([]);
    let autoCheck: string[] = [];
    let orignDuty = dutyPerson;
    let formatCheckInfo: any[] = [];
    try {
      if (isFresh) {
        // 忽略 不用跑检查(前端单元测试和后端单元测试有一个不是忽略状态都要跑test-unit 接口)
        autoCheck = list.flatMap((it) =>
          ['backend_test_unit', 'front_test_unit'].includes(it.rowKey) && it.open
            ? [it.api_url]
            : [],
        );
      }
      Promise.all(
        uniq(autoCheck).map((type) => {
          }
          // OnlineSystemServices.checkOpts(
          //   {release_num, user_id: user?.userid, api_url: type},
          //   type as ICheckType,
          // ),
        ),
      ).finally(async () => {
        // 存在值班人员为空
        const refresh = isEmpty(orignDuty) && count < 2;
        const checkItem = await OnlineSystemServices.getCheckInfo({release_num});
        formatCheckInfo = checkInfo.map((it) => {
          const currentKey = checkItem[it.rowKey];
          //升级前自动化检查是否通过 的状态要特殊处理
          const flag = it.rowKey == 'auto_obj_data';
          let status = 'skip';
          if (flag) {
            if (isEmpty(currentKey)) {
              status = '';
            } else {
              //  如果包含wait就显示未开始（优先级最高），如果包含no就显示不通过(优先级第二)（yes和skip优先级一样）
              for (let i = 0; i < currentKey.length; i++) {
                const rowStatus = currentKey[i].check_result;
                if (rowStatus === "wait") {
                  status = rowStatus;
                  break;
                } else if (rowStatus === "no") {
                  status = rowStatus;
                  break;
                } else {
                  status = rowStatus;
                }
              }
            }
          }
          if (!currentKey || currentKey.length === 0) {
            return {}
          }

          return {
            ...it,
            disabled: false,
            status: flag ? status : currentKey?.[it.status] ?? '',
            start: flag ? (status == '' ? status : '-') : currentKey?.[it.start] || '',
            end: flag ? (status == '' ? status : '-') : currentKey?.[it.end] || '',
            open: flag ? status !== 'skip' : currentKey?.[it.status] !== 'skip',
            open_pm: flag ? currentKey[0][it.open_pm] : currentKey?.[it.open_pm] || '',
            open_time: flag ? currentKey[0][it.open_time] : currentKey?.[it.open_time] || '',
            log: flag ? currentKey[0][it.log] : currentKey?.[it.log] || '',
            source: currentKey?.data_from || it.source,
            // contact: orignDuty?.[it.contact] || '',
            check_person: flag ? currentKey[0][it.check_person] : currentKey?.[it.check_person] || '',
            desc: flag ? currentKey[0][it.desc] : currentKey?.[it.desc] || '',
          };

        });
        if (refresh) {
          // 获取当前检查周日期 默认为当周
          const currentTime =
            formatCheckInfo.find((it: any) => it?.start && it.start != '-')?.start || dayjs();
          const from = dayjs(currentTime).subtract(1, 'd').startOf('w').subtract(0, 'w');
          const to = from.endOf('w');
          const range = {
            start_time: dayjs(from).add(1, 'day').format('YYYY/MM/DD'),
            end_time: dayjs(to).add(1, 'day').format('YYYY/MM/DD'),
          };
          const firstDuty = await DutyListServices.getFirstDutyPerson(range);
          const duty = firstDuty?.data?.flat().filter((it: any) => it.duty_order == '1');
          duty?.forEach((it: any) => {
            orignDuty = {...orignDuty, [it.user_tech]: it.user_name};
          });
          setDutyPerson(orignDuty);
          setCount(++count);
        }
        setList(formatCheckInfo?.map((it) => ({...it, contact: orignDuty?.[it.contact] || ''})));
        setSpin(false);
      });
    } catch (e) {
      console.log(e);
      setSpin(false);
    }
  };

  const updateStatus = async (index: number, e: boolean, record: any) => {

    list[index].disabled = true;
    setList([...list]);
    if (!e) {
      setSelected(selected.filter((it) => it != record.rowKey));
    }

    await OnlineSystemServices.checkOpts(
      {
        user_id: user?.userid ?? '',
        release_num,
        is_ignore: e ? 'no' : 'yes',
        side: record.side,
        remark: record.desc
      },
      record.api_url,
    );
    setDescShow({visible: false, data: null, param: null})
    if (e) {
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
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
              <span style={{color: it.sealing_version == 'yes' ? '#52c41a' : '#faad14'}}>
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
      onOk: () => OnlineSystemServices.pushFailMsg({release_num}),
    });
  };

  useEffect(() => {
    if (subTab == 'check' && release_num && tab == 'process') {
      Modal?.destroyAll?.();
      isEmpty(dutyPerson) && init();
    } else {
      setDutyPerson(undefined);
      setCount(0);
    }
  }, [subTab, tab, release_num, globalState, dutyPerson]);

  useEffect(() => {
    if (globalState.locked || globalState.finished || !(subTab == 'check' && tab == 'process')) {
      clearInterval(timer);
    } else {
      Modal?.destroyAll?.();
      timer = setInterval(() => {
        init(false, false);
      }, 15000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [JSON.stringify(list), subTab, tab, globalState]);

  // 确定是否可以编辑
  const hasEdit: boolean = useMemo(
    () => !onlineSystemPermission().checkStatus || globalState.locked || globalState.finished,
    [globalState, user?.group],
  );
  return (
    <Spin spinning={spin} tip={'数据加载中...'}>
      <div className={styles.onlineTable} style={{height: '100%'}}>
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
                  'sealing-version-check': {yes: 'version', no: 'noVersion'},
                  'hot-update-check': {yes: 'hot', no: 'noHot'},
                };
                // 特殊处理 封板，热更 状态
                if (['sealing-version-check', 'hot-update-check'].includes(record.api_url) && ['yes', 'no'].includes(p)) {
                  status = special[record.api_url][p];
                }
                return (
                  <span style={{color: CheckStatus[status]?.color ?? '#000000d9', fontWeight: 500}}>
                    {CheckStatus[status]?.text ?? status}
                  </span>
                );
              },
            },
            {
              title: '检查人',
              dataIndex: 'check_person',
              width: 100,
              align: 'center',
              render: (v, record) => !record.open ? "" : v,
            },
            {
              title: '检查开始时间',
              align: 'center',
              dataIndex: 'start',
              width: 180,
              render: (v, record) =>
                !record.open ?
                  ('') : (<Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>{v}</Tooltip>),
            },
            {
              title: '检查结束时间',
              align: 'center',
              dataIndex: 'end',
              width: 180,
              render: (v, record) =>
                !record.open ?
                  ('') : (<Tooltip title={v} placement={'bottomLeft'} color={'#108ee9'}>{v}</Tooltip>),
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
                    // 开启变成忽略时需要弹出说明框写说明
                    if (!e) return setDescShow({visible: true, data: record, param: {index, e}});

                    // list[index].disabled = true;
                    // setList([...list]);
                    // if (!e) {
                    //   setSelected(selected.filter((it) => it != record.rowKey));
                    // }
                    // 忽略变成开启不需要写说明
                    updateStatus(index, e, record);
                  }}
                />
              ),
            },
            {title: '启用/忽略人', dataIndex: 'open_pm', width: 100, align: 'center'},
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
              title: '说明',
              dataIndex: 'desc',
              width: 100,
              align: 'left',
              // fixed: 'right',
              render: (v, record) => record.open ? "" : v,
              onCell: (v, index) => {
                // 历史记录不能再被编辑
                if (!(hasEdit || v.disabled)) {
                  return {
                    onDoubleClick: () => {
                      setDescShow({visible: true, data: v, param: {index, e: v.open}});
                    }
                  }
                }
                return {};
              }
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
          scroll={{x: 'min-content'}}
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
          // onRow={(row, index) => {
          //
          //   // 历史记录不能再被编辑
          //   if (!(hasEdit || row.disabled)) {
          //     return {
          //       onDoubleClick: () => {
          //         setDescShow({visible: true, data: row, param: {index, e: row.open}});
          //       }
          //     }
          //   }
          //   return {};
          // }}
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
            setShow({visible: false, data: null});
          }}
          editMode={hasEdit}
        />

        {/* 说明弹窗 */}
        <OpenDescModal init={descShow}
                       onCancel={async () => setDescShow({visible: false, data: null, param: null})}
                       onOk={updateStatus}

        />

      </div>
    </Spin>
  );
};
export default forwardRef(Check);

// 检查参数弹窗
const CheckSettingModal = (props: ModalFuncProps & { init: { visible: boolean; data: any }, editMode: boolean }) => {

  const [form] = Form.useForm();
  const [getLogInfo] = useModel('onlineSystem', (online) => [online.getLogInfo]);

  const [compareBranch, setCompareBranch] = useState<any[]>();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDetail = async () => {
    setLoading(true);
    try {
      let queryParam = {
        release_num: props.init.data,
        include_deleted: true
      };
      // 不能编辑（删除或者去取消发布）的时候也要展示原始记录
      // if (props.editMode) {
      //   queryParam["include_deleted"] = true;
      // }

      const res = await OnlineSystemServices.getCheckSettingDetail(queryParam);

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
      setCompareBranch(res?.map((it: any) => ({label: it.branch_name, value: it.branch_name})));
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
        <Button type={'primary'} disabled={disabled || loading || props.editMode} onClick={onConfirm}>
          确定
        </Button>,
      ]}
    >
      <Spin spinning={loading} tip={'数据加载中...'}>
        <Form form={form} labelCol={{span: 6}}>
          <h4>一、检查上线分支是否包含对比分支的提交</h4>
          <Form.Item
            label={'被对比的主分支'}
            name={'main_branch'}
            rules={[{message: '请选择对比分支', required: true}]}
          >
            <Select
              options={compareBranch} allowClear showSearch mode={'multiple'}
              disabled={props.editMode}
            />
          </Form.Item>
          <Form.Item
            label={'对比起始时间'}
            name={'main_since'}
            rules={[{message: '请选择对比起始时间', required: true}]}
          >
            <DatePicker style={{width: '100%'}} format={'YYYY-MM-DD'} disabled={props.editMode}/>
          </Form.Item>
          <h4>二、升级前自动化检查是否通过</h4>
          <Form.Item name={'auto_data'}>
            <Checkbox.Group
              disabled={props.editMode}
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

// 忽略说明弹窗
const OpenDescModal = (props: ModalFuncProps & { init: { visible: boolean; data: any } }) => {
  const [form] = Form.useForm();

  // 确定忽略
  const onConfirm = () => {
    const values = form.getFieldValue("ignoreDesc");
    if (isEmpty(values.trim())) {
      errorMessage("忽略说明不能为空！");
      return;
    }

    const params: any = props?.init;
    // 执行 updateStatus 进行状态更新
    props?.onOk?.(params.param.index, params.param.e, {...params.data, desc: values});
  };

  useEffect(() => {
    if (!props.init.visible) return form.resetFields();
    form.setFieldsValue({
      ignoreDesc: props.init?.data?.desc
    });

  }, [props.init.visible]);


  return (
    <Modal
      {...props}
      centered
      destroyOnClose
      maskClosable={false}
      title={'是否启用忽略说明'}
      onCancel={() => props?.onCancel?.()}
      visible={props.init?.visible}
      footer={[
        <Button onClick={() => props.onCancel?.()}>取消</Button>,
        <Button type={'primary'} onClick={onConfirm}>
          确定
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item
          label={'忽略说明'}
          name={'ignoreDesc'}
          rules={[{message: '忽略说明不能为空！', required: true}]}
        >
          <TextArea rows={4}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

