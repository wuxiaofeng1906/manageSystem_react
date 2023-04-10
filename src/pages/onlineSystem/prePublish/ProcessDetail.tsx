import React, {
  useRef, useState, useEffect,
  useMemo, forwardRef, useImperativeHandle,
} from 'react';
import {
  Form, Select, Checkbox, Table, Row, Col,
  Input, DatePicker, Button, Modal, Spin,
} from 'antd';
import {
  preServerColumn, repairColumn, getDevOpsOrderColumn, serverConfirmColumn, upgradeServicesColumn,
} from '@/pages/onlineSystem/config/column';
import {groupBy, isEmpty, pick, uniq, isEqual} from 'lodash';
import {initGridTable, mergeCellsTable} from '@/utils/utils';
import {AgGridReact} from 'ag-grid-react';
import {CellClickedEvent, GridApi} from 'ag-grid-community';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import styles from '@/pages/onlineSystem/config/common.less';
import {infoMessage} from '@/publicMethods/showMessages';
import {InfoCircleOutlined, WarningOutlined} from '@ant-design/icons';
import {history, useLocation, useModel, useParams} from 'umi';
import IPagination from '@/components/IPagination';
import {
  ClusterType,
  ServerConfirmType,
  WhetherOrNot,
  onLog,
} from '@/pages/onlineSystem/config/constant';
import moment from 'moment';
import PreReleaseServices from '@/services/preRelease';
import {OnlineSystemServices} from '@/services/onlineSystem';
import usePermission from '@/hooks/permission';
import {display} from "html2canvas/dist/types/css/property-descriptors/display";

const color = {yes: '#2BF541', no: '#faad14'};
const pickKey = ['release_name', 'release_env', 'plan_release_time'];
let agEdit = '';
const ProcessDetail = (props: any, ref: any) => {
  const {release_num, branch} = useParams() as { release_num: string; branch: string };
  const {subTab, tab} = useLocation()?.query as { tab: string; subTab: string };

  const {onlineSystemPermission} = usePermission();
  const [globalEnv] = useModel('env', (env) => [env.globalEnv]);
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const {
    globalState, basic, server, api, repair, serverConfirm,
    getReleaseInfo, removeRelease, getRepairInfo, updateBasic, updateSealing, updateServerConfirm, getServerConfirm,
  } = useModel('onlineSystem');

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [checked, setChecked] = useState(false); // 服务项
  const [loading, setLoading] = useState(false);
  const [hasBranch, setHasBranch] = useState(false);
  const [errorTips, setErrorTips] = useState('');
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [checkBoxOpt, setCheckBoxOpt] = useState<string[]>([]);
  const [storyModal, setStoryModal] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  }); // 需求列表
  const [branchEnv, setBranchEnv] = useState<any[]>([]);

  const confirmRef = useRef<GridApi>();
  const interfaceRef = useRef<GridApi>();
  const repairRef = useRef<GridApi>();

  const [form] = Form.useForm();
  const [sealForm] = Form.useForm();

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  useImperativeHandle(
    ref,
    () => ({
      onCancelPublish,
      onRefresh: () => init(true),
      onShow: () => {
        if (basic.branch) setStoryModal({visible: true, data: {...basic, server}});
      },
    }),
    [release_num, basic, subTab, tab, server],
  );

  const init = async (refresh = false) => {
    debugger
    try {
      setLoading(true);
      reset();
      await getReleaseInfo(
        {release_num},
        refresh ? {release_num, user_id: user?.userid ?? ''} : null,
      );
      await OnlineSystemServices.abnormalApi({release_num});
      const res = await OnlineSystemServices.initDataBranch({branch});
      setHasBranch(res?.have_branch == 'yes');
      setLoading(false);
    } catch (e) {
      agEdit = e?.msg;
      setErrorTips(agEdit);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (release_num && subTab == 'server' && tab == 'process') {
      Modal.destroyAll?.();
      setErrorTips('');
      init();
    }
  }, [release_num, subTab, tab]);

  useEffect(() => {
    if (isEmpty(basic?.branch) || subTab !== 'server') return;

    OnlineSystemServices.branchEnv({branch: basic?.branch}).then((res) =>
      setBranchEnv(res?.map((it: string) => ({label: it, value: it}))),
    );
  }, [basic?.branch, subTab]);

  useEffect(() => {
    if (!isEmpty(basic)) {
      form.setFieldsValue({
        ...basic,
        plan_release_time: basic?.plan_release_time ? moment(basic?.plan_release_time) : null,
        cluster: basic?.cluster?.split(',') ?? [],
      });
    }
    if (!isEmpty(repair)) {
      setPages({
        page: repair?.page ?? 1,
        page_size: repair?.page_size ?? 20,
        total: repair?.count ?? 0,
      });
    }
  }, [basic, repair]);
  const onSeal = async (flag = true) => {
    let tips = '请选择未锁定服务进行分支锁定';
    if (!flag) tips = '请选择已锁定服务进行解除分支锁定';
    if (isEmpty(selectedRowKeys)) return infoMessage(`请先选择需${flag ? '' : '解除'}锁定服务`);
    const confirmSide = serverConfirm.flatMap((it) =>
      it.confirm_result == 'yes' ? [it.confirm_type] : [],
    );
    // 对应侧未确认
    let noConfirmSide: string[] = [];
    selectedRowKeys.forEach((it) => {
      if (!confirmSide.includes(it.side)) noConfirmSide.push(ServerConfirmType[it.side]);
    });
    // 校验是否满足锁定、解除的条件
    if (selectedRowKeys?.some((it) => it.is_sealing == (flag ? 'yes' : 'no')))
      return infoMessage(tips);
    // 判断是否有apps、global 服务
    const includeAppsGlobal =
      flag && selectedRowKeys?.some((it) => ['apps', 'global'].includes(it.apps));
    const isRequired =
      selectedRowKeys?.some((it) => ['apps'].includes(it.apps)) &&
      (branch.includes('sprint') || branch.includes('release'));

    // 判断对应侧是否确认
    if (!isEmpty(noConfirmSide))
      return infoMessage(`『${uniq(noConfirmSide)?.join()}』对应侧服务未确认，请先确认后再锁定`);
    includeAppsGlobal && sealForm.resetFields();
    Modal.confirm({
      centered: true,
      width: 500,
      okText: '确认',
      cancelText: '取消',
      title: `${flag ? '' : '解除'}锁定分支提示`,
      okButtonProps: {disabled: confirmDisabled},
      content: (
        <div>
          请确认是否将对应服务的分支
          <strong style={{color: flag ? '#52c41a' : '#fe7b00cf'}}>
            {flag ? '' : '解除'}锁定
          </strong>
          ？
          <Form
            form={sealForm}
            hidden={!includeAppsGlobal}
            size={'small'}
            autoComplete={'off'}
            style={{marginTop: 10}}
            className={styles.resetForm}
          >
            <Form.Item
              name={'is_build'}
              label={'是否构建编译'}
              rules={[{message: '请填写是否构建编译', required: includeAppsGlobal}]}
            >
              <Select
                placeholder={'是否构建编译'}
                options={Object.keys(WhetherOrNot)?.map((it) => ({
                  label: WhetherOrNot[it],
                  value: it,
                }))}
              />
            </Form.Item>
            <Form.Item
              name={'version'}
              label={'前端预制数据版本号'}
              rules={[
                {
                  required: isRequired,
                  validator: (r, v, cb) => {
                    if (!v?.trim() && isRequired) return cb('请填写前端预制数据版本号');
                    else return cb();
                  },
                },
              ]}
            >
              <Input placeholder={'前端预制数据版本号'}/>
            </Form.Item>
          </Form>
        </div>
      ),
      onOk: async () => {
        const values = await sealForm.validateFields();
        try {
          setLoading(true);
          setConfirmDisabled(true);
          reset();
          // 1.校验测试用例是否通过
          if (flag) {
            try {
              await OnlineSystemServices.sealingCheck({
                apps: selectedRowKeys?.map((it) => it.apps)?.join(',') ?? '',
                release_num,
              });
            } catch (e) {
              setConfirmDisabled(false);
              if (e?.code == 4001 && e?.msg) {
                setLoading(false);
                Modal.confirm({
                  title: '测试用例未通过',
                  content: '该服务测试用例未通过,是否前往检查页，设置忽略检查测试用例？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () =>
                    history.replace({
                      pathname: history.location.pathname,
                      query: {tab, subTab: 'check'},
                    }),
                });
                return;
              }
            }
          }
          await updateSealing(
            {
              user_id: user?.userid ?? '',
              app_id: selectedRowKeys?.map((it) => it._id)?.join(',') ?? '',
              is_seal: flag,
              ...values,
              version: values?.version ?? '',
            },
            {release_num},
          );
          setConfirmDisabled(false);
          setLoading(false);
        } catch (e) {
          setConfirmDisabled(false);
          setLoading(false);
        }
      },
      onCancel: () => {
        setLoading(false);
      },
    });
  };

  const onDelete = async (type: 'server' | 'api' | 'repair') => {
    const gridSelected =
      type == 'api'
        ? interfaceRef?.current?.getSelectedRows()
        : type == 'repair'
        ? repairRef?.current?.getSelectedRows()
        : selectedRowKeys;
    if (isEmpty(gridSelected)) return infoMessage('请先勾选移除项！');
    if (type == 'server' && gridSelected?.some((it) => it.is_sealing == 'yes'))
      return infoMessage('已锁定服务不能移除！');
    Modal.confirm({
      centered: true,
      title: '移除提示',
      okText: '确认',
      cancelText: '取消',
      icon: <InfoCircleOutlined style={{color: 'red'}}/>,
      content: `请确认是否要移除 ${
        type == 'server' ? gridSelected?.map((it) => it.apps)?.join(',') + '服务' : ''
      }?`,
      okButtonProps: {disabled: confirmDisabled},
      onOk: async () => {
        setLoading(true);
        setConfirmDisabled(true);
        reset();
        await removeRelease(
          {
            user_id: user?.userid ?? '',
            app_id: gridSelected?.map((it) => it._id)?.join(',') ?? '',
          },
          type,
          {release_num},
        );
        await getServerConfirm({release_num});
        setConfirmDisabled(false);
        setLoading(false);
      },
    });
  };

  const getTableList = async (page = 1, page_size = pages.page_size) => {
    reset();
    await getRepairInfo({release_num}, page, page_size);
  };

  const onCancelPublish = async () => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      centered: true,
      title: '取消发布提醒',
      content: '取消发布将删除发布工单，请确认是否取消发布?',
      icon: <InfoCircleOutlined style={{color: 'red'}}/>,
      okButtonProps: {disabled: confirmDisabled},
      onOk: async () => {
        setConfirmDisabled(true);
        try {
          await PreReleaseServices.cancelPublish({
            user_id: user?.userid ?? '',
            user_name: user?.name ?? '',
            ready_release_num: release_num,
          });
          await PreReleaseServices.removeRelease(
            {
              user_id: user?.userid ?? '',
              release_num: release_num,
            },
            false,
          );
          setConfirmDisabled(false);
          history.replace('/onlineSystem/releaseProcess');
        } catch (e) {
          setConfirmDisabled(false);
        }
      },
    });
  };

  const reset = () => {
    setChecked(false);
    setCheckBoxOpt([]);
    setSelectedRowKeys([]);
  };

  const onSave = async () => {
    const values = await form.validateFields();
    const updateData = pick(
      {
        ...values,
        plan_release_time: moment(values.plan_release_time).format('YYYY-MM-DD HH:mm:ss'),
      },
      pickKey,
    );
    const init = pick(basic, pickKey);
    if (!isEqual(init, updateData)) {
      Modal.confirm({
        centered: true,
        title: '保存基础信息提示',
        content: '请确认是否需要保存基础信息？',
        okText: '确认',
        cancelText: '取消',
        onCancel: () => {
          form.setFieldsValue({
            ...init,
            plan_release_time: init?.plan_release_time ? moment(init?.plan_release_time) : null,
            cluster: basic?.cluster?.split(',') ?? [],
          });
        },
        onOk: async () => {
          try {
            setLoading(true);
            reset();
            await updateBasic(
              {
                user_id: user?.userid ?? '',
                release_env: values?.release_env,
                release_num,
                release_name: values.release_name,
                plan_release_time: moment(values.plan_release_time).format('YYYY-MM-DD HH:mm:ss'),
              },
              {release_num},
            );
            setLoading(false);
          } catch (e) {
            setLoading(false);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (!isEmpty(errorTips)) {
      confirmRef.current?.forEachNode((node) => {
        if (node.data.confirm_type == 'backend') {
          node.setData({
            ...node.data,
            is_sealing: !isEmpty(errorTips) ? 'yes' : node.data.is_sealing,
          });
        }
      });
    }
  }, [errorTips]);

  const changeServerConfirm = async (v: string, param: CellClickedEvent) => {
    Modal.confirm({
      width: 500,
      maskClosable: false,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      title: '修改服务确认提醒',
      content: `请确认是否将『${ServerConfirmType[param.data.confirm_type]} - ${
        param.column.colId.includes('is_hot_update') ? '是否可热更' : '服务确认完成'
      }』状态调整为: ${WhetherOrNot[v]}`,
      okButtonProps: {disabled: confirmDisabled},
      onOk: async () => {
        reset();
        setLoading(true);
        setConfirmDisabled(true);
        await updateServerConfirm(
          {
            user_id: user?.userid ?? '',
            confirm_id: param.data._id,
            confirm_result: param.data.confirm_result,
            is_hot_update: param.data.is_hot_update,
            [param.column.colId]: v,
          },
          {release_num},
        );
        setConfirmDisabled(false);
        setLoading(false);
      },
    });
  };

  const hasEdit = useMemo(() => globalState.locked || globalState.finished, [globalState]);
  const memoGroup = useMemo(() => {
    const table = mergeCellsTable(server ?? [], 'apps');
    return {
      opts: uniq(server?.map((it) => it.apps)),
      table,
    };
  }, [server]);

  const serverColumn = useMemo(() => preServerColumn(server), [server]);

  const hasPermission = useMemo(onlineSystemPermission, [user?.group]);
  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <div className={styles.processDetail}>
        <div className={styles.tableHeader}>
          <h4>一、基础信息</h4>
        </div>
        <Form
          size={'small'}
          className={styles.resetForm + ' no-wrap-form'}
          form={form}
          autoComplete="off"
          onBlur={onSave}
        >
          <Row justify={'space-between'} gutter={8}>
            <Col span={10}>
              <Form.Item
                label={'批次名称'}
                name={'release_name'}
                rules={[{required: true, message: '请填写批次名称'}]}
              >
                <Input placeholder={'批次名称'} disabled={!hasPermission.baseInfo || hasEdit}/>
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label={'发布项目'} name={'project'}>
                <Input disabled placeholder={'发布项目'}/>
              </Form.Item>
            </Col>
          </Row>
          <Row justify={'space-between'} gutter={8}>
            <Col span={5}>
              <Form.Item label={'上线分支'} name={'branch'}>
                <Input disabled placeholder={'上线分支'}/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label={'发布集群类型'} name={'release_env_type'}>
                <Select
                  disabled
                  placeholder={'发布集群类型'}
                  options={Object.keys(ClusterType).map((k) => ({
                    label: ClusterType[k],
                    value: k,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label={'镜像环境绑定'}
                name={'release_env'}
                rules={[{required: true, message: '请填写镜像环境绑定'}]}
              >
                <Select
                  placeholder={'镜像环境绑定'}
                  disabled={!hasPermission.baseInfo || hasEdit}
                  options={branchEnv}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label={'发布时间'}
                name={'plan_release_time'}
                rules={[{required: true, message: '请填写发布时间'}]}
              >
                <DatePicker
                  style={{width: '100%'}}
                  placeholder={'发布时间'}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  disabled={!hasPermission.baseInfo || hasEdit}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label={'发布集群'} name={'cluster'}>
                <Select disabled placeholder={'发布集群'} options={globalEnv} mode={'multiple'}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.tableHeader}>
          <h4>二、应用服务</h4>
          <Button
            size={'small'}
            hidden={!hasPermission.branchLock}
            onClick={() => onSeal(true)}
            disabled={hasEdit}
          >
            锁定分支
          </Button>
          <Button
            size={'small'}
            hidden={!hasPermission.branchUnlock}
            onClick={() => onSeal(false)}
            disabled={hasEdit}
          >
            解除锁定分支
          </Button>
          <Button
            size={'small'}
            disabled={hasEdit}
            className={styles.remove}
            onClick={() => onDelete('server')}
            hidden={!hasPermission.delete}
          >
            移除
          </Button>
        </div>
        <Checkbox
          disabled={hasEdit}
          checked={checked}
          onChange={({target}) => {
            setSelectedRowKeys(target.checked ? server : []);
            setChecked(target.checked);
            setCheckBoxOpt(target.checked ? memoGroup.opts : []);
          }}
        >
          全部项目
        </Checkbox>
        <Checkbox.Group
          disabled={hasEdit}
          options={memoGroup.opts}
          value={uniq(checkBoxOpt)}
          onChange={(v) => {
            setCheckBoxOpt(v as string[]);
            setChecked(v?.length == memoGroup.opts?.length);
            setSelectedRowKeys(server?.flatMap((it) => (v.includes(it.apps) ? [it] : [])));
          }}
        />
        <div className={styles.onlineTable}>
          <Table
            size={'small'}
            rowKey={(record) => +record._id}
            dataSource={memoGroup.table}
            columns={serverColumn ?? []}
            pagination={false}
            bordered
            scroll={{y: 400, x: 'min-content'}}
            rowSelection={{
              selectedRowKeys: selectedRowKeys?.map((it) => +it._id),
              onChange: (v, arr) => {
                let group: string[] = [];
                let compare = groupBy(arr, 'apps');
                let compareAll = groupBy(server, 'apps');
                Object.entries(compareAll).forEach(([k, v]) => {
                  if (compare[k]?.length == v?.length) group.push(k);
                });
                setCheckBoxOpt(group);
                setChecked(arr.length == server?.length);
                setSelectedRowKeys(arr);
              },
              getCheckboxProps: () => ({disabled: hasEdit}),
            }}
          />
        </div>
        <div className={styles.tableHeader}>
          <h4>三、升级接口</h4>
          <Button
            disabled={hasEdit}
            size={'small'}
            className={styles.remove}
            onClick={() => onDelete('api')}
            hidden={!hasPermission.delete}
          >
            移除
          </Button>
          {!isEmpty(errorTips) && (
            <div style={{color: 'red'}}>
              <WarningOutlined
                style={{color: 'orange', fontSize: 18, margin: '0 10px', fontWeight: 'bold'}}
              />
              {errorTips}
            </div>
          )}
        </div>
        <div
          style={{width: '100%', maxHeight: 300, height: api?.length * 40 + 30, minHeight: 150}}
        >
          <AgGridReact
            rowSelection={'multiple'}
            columnDefs={upgradeServicesColumn}
            rowData={api ?? []}
            {...initGridTable({ref: interfaceRef, height: 30})}
          />
        </div>

        <h4 style={{marginTop: 10}}>
          四、backend/apps/init-data库是否存在上线分支： {hasBranch ? '是' : '否'}
        </h4>
        <div className={styles.tableHeader}>
          <h4>五、数据修复/升级</h4>
          <Button
            disabled={hasEdit}
            size={'small'}
            className={styles.remove}
            onClick={() => onDelete('repair')}
            hidden={!hasPermission.delete}
          >
            移除
          </Button>
        </div>
        <div
          style={{
            width: '100%',
            maxHeight: 300,
            minHeight: 150,
            height: repair?.data?.length * 40 + 30,
          }}
        >
          <AgGridReact
            rowSelection={'multiple'}
            columnDefs={repairColumn}
            rowData={repair?.data}
            {...initGridTable({ref: repairRef, height: 30})}
            frameworkComponents={{
              log: (p: CellClickedEvent) => (
                <img
                  style={{width: 16, height: 16, cursor: 'pointer'}}
                  src={require('../../../../public/logs.png')}
                  onClick={() => onLog({title: 'sql详情', log: p.value, noData: '暂无sql日志！'})}
                />
              ),
            }}
          />
        </div>
        <IPagination
          page={pages}
          onChange={(p) => getTableList(p, pages.page_size)}
          showQuickJumper={(p) => getTableList(p, pages.page_size)}
          onShowSizeChange={(size) => getTableList(1, size)}
        />
        <div>
          <h4>六、服务确认</h4>
        </div>
        <div
          style={{
            width: '100%',
            maxHeight: 300,
            minHeight: 150,
            height: serverConfirm?.length * 40 + 30,
          }}
        >
          <AgGridReact
            columnDefs={serverConfirmColumn}
            rowData={serverConfirm}
            {...initGridTable({
              ref: confirmRef,
              height: 30,
            })}
            frameworkComponents={{
              select: (p: CellClickedEvent) => {
                const isConfirm = p.column.colId == 'confirm_result';
                return (
                  <Select
                    size={'small'}
                    value={p.value}
                    disabled={
                      p.data.is_sealing == 'yes' ||
                      !(isConfirm ? hasPermission.serverConfirm : hasPermission.hotUpdate)
                    }
                    style={{
                      width: '100%',
                      color: isConfirm ? color[p.value] : 'initial',
                    }}
                    options={Object.keys(WhetherOrNot)?.map((k) => ({
                      value: k,
                      label: WhetherOrNot[k],
                    }))}
                    onChange={(v) => changeServerConfirm(v, p)}
                  />
                );
              },
            }}
          />
        </div>

        <DemandListModal
          visible={storyModal.visible}
          data={storyModal.data}
          onOk={(v) => {
            setStoryModal({visible: false, data: null});
            if (v) {
              reset();
              getReleaseInfo({release_num});
            }
          }}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(ProcessDetail);
