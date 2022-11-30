import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Form,
  Select,
  Checkbox,
  Table,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Modal,
  Spin,
} from 'antd';
import {
  preServerColumn,
  repairColumn,
  serverConfirmColumn,
  upgradeServicesColumn,
} from '@/pages/onlineSystem/config/column';
import { groupBy, isEmpty, uniq } from 'lodash';
import { initGridTable, mergeCellsTable } from '@/utils/utils';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import styles from '@/pages/onlineSystem/config/common.less';
import { infoMessage } from '@/publicMethods/showMessages';
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { history, useModel, useParams } from 'umi';
import IPagination from '@/components/IPagination';
import {
  ClusterType,
  onLog,
  ServerConfirmType,
  WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';
import moment from 'moment';
import PreReleaseServices from '@/services/preRelease';
import { OnlineSystemServices } from '@/services/onlineSystem';

const color = { yes: '#2BF541', no: '#faad14' };

const ProcessDetail = (props: any, ref: any) => {
  const { release_num } = useParams() as { release_num: string };
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const {
    globalState,
    basic,
    server,
    api,
    repair,
    serverConfirm,
    getReleaseInfo,
    removeRelease,
    getRepairInfo,
    updateBasic,
    updateSealing,
    updateServerConfirm,
  } = useModel('onlineSystem');

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [checked, setChecked] = useState(false); // 服务项
  const [loading, setLoading] = useState(false);
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

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  useImperativeHandle(
    ref,
    () => ({
      onShow: () => {
        setStoryModal({ visible: true, data: basic });
      },
      onCancelPublish: () => {
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          centered: true,
          title: '取消发布提醒',
          content: '取消发布将删除发布工单，请确认是否取消发布?',
          icon: <InfoCircleOutlined style={{ color: 'red' }} />,
          okButtonProps: { disabled: confirmDisabled },
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
              history.replace(`/onlineSystem/profile/${basic.branch}?key='process`);
            } catch (e) {
              setConfirmDisabled(false);
            }
          },
        });
      },
      onRefresh: () => init(true),
    }),
    [release_num, basic],
  );

  const init = async (refresh = false) => {
    try {
      setLoading(true);
      reset();
      await getReleaseInfo(
        { release_num },
        refresh ? { release_num, user_id: user?.userid ?? '' } : null,
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!release_num) return;
    Modal.destroyAll?.();
    init();
  }, [release_num]);

  useEffect(() => {
    if (!basic?.branch) return;
    OnlineSystemServices.branchEnv({ branch: basic?.branch }).then((res) =>
      setBranchEnv(res?.map((it: string) => ({ label: it, value: it }))),
    );
  }, [basic?.branch]);

  useEffect(() => {
    if (!isEmpty(basic)) {
      form.setFieldsValue({
        ...basic,
        plan_release_time: basic?.plan_release_time ? moment(basic?.plan_release_time) : null,
        cluster: basic?.cluster?.includes('cn-northwest-')
          ? basic?.cluster?.replaceAll('cn-northwest-', '集群')
          : basic?.cluster,
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

  const onSeal = async (flag = 'yes') => {
    let tips = '请选择未封板项目进行封板';
    if (!flag) tips = '请选择已封板项目进行解除封板';
    if (isEmpty(selectedRowKeys)) return infoMessage(`请先选择需${flag ? '' : '解除'}封板项目`);
    if (selectedRowKeys?.some((it) => it.is_sealing == flag)) return infoMessage(tips);
    Modal.confirm({
      title: `${flag ? '' : '解除'}封板提示`,
      content: `请确认是否将该项目${flag ? '' : '解除'}封板?`,
      onOk: async () => {
        setLoading(true);
        reset();
        // 1.校验用例是否通过
        if (flag == 'yes') {
          await OnlineSystemServices.sealingCheck({
            apps: selectedRowKeys?.map((it) => it.apps)?.join(',') ?? '',
            release_num,
          });
        }
        await updateSealing(
          {
            user_id: user?.userid ?? '',
            app_id: selectedRowKeys?.map((it) => it._id)?.join(',') ?? '',
            is_seal: flag == 'yes',
          },
          { release_num },
        );
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
    if (isEmpty(gridSelected)) return infoMessage('请先选择需移除的项目！');
    if (type == 'server' && gridSelected?.some((it) => it.is_sealing == 'yes'))
      return infoMessage('已封板项目不能移除！');
    Modal.confirm({
      title: '移除提示',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: `请确认是否要移除该项目?`,
      onOk: async () => {
        setLoading(true);
        reset();
        await removeRelease(
          {
            user_id: user?.userid ?? '',
            app_id: gridSelected?.map((it) => it._id)?.join(',') ?? '',
          },
          type,
          { release_num },
        );
        setLoading(false);
      },
    });
  };

  const getTableList = async (page = 1, page_size = 20) => {
    reset();
    await getRepairInfo({ release_num }, page, page_size);
  };

  const reset = () => {
    setChecked(false);
    setCheckBoxOpt([]);
    setSelectedRowKeys([]);
  };

  const onSave = async () => {
    const values = await form.validateFields();
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
        { release_num },
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const changeServerConfirm = async (v: string, param: CellClickedEvent) => {
    Modal.confirm({
      width: 500,
      maskClosable: false,
      centered: true,
      title: '修改服务确认提醒',
      content: `请确认是否将『${ServerConfirmType[param.data.confirm_type]} - ${
        param.column.colId.includes('is_hot_update') ? '是否可热更' : '服务确认完成'
      }』状态调整为: ${WhetherOrNot[v]}`,
      onOk: async () => {
        setLoading(true);
        await updateServerConfirm(
          {
            user_id: user?.userid ?? '',
            confirm_id: param.data._id,
            confirm_result: param.data.confirm_result,
            is_hot_update: param.data.is_hot_update,
            [param.column.colId]: v,
          },
          { release_num },
        );
        setLoading(false);
      },
    });
  };

  // const onLog = (v: string) => {
  //   if (isEmpty(v)) return infoMessage('暂无sql日志！');
  //   Modal.info({
  //     width: 700,
  //     okText: '取消',
  //     title: 'sql详情',
  //     content: (
  //       <div style={{ maxHeight: 500, overflow: 'auto', paddingRight: 10, whiteSpace: 'pre-wrap' }}>
  //         {v}
  //       </div>
  //     ),
  //   });
  // };

  const hasEdit = useMemo(() => globalState.locked || globalState.finished, [globalState]);
  const memoGroup = useMemo(() => {
    const table = mergeCellsTable(server ?? [], 'apps');
    return {
      opts: uniq(server?.map((it) => it.apps)),
      table,
    };
  }, [server]);

  return (
    <Spin spinning={loading} tip={'数据加载中...'}>
      <div className={styles.processDetail}>
        <div className={styles.tableHeader}>
          <h4>一、基础信息</h4>
          <Button size={'small'} onClick={onSave} disabled={hasEdit}>
            保存
          </Button>
        </div>
        <Form size={'small'} className={styles.resetForm} form={form} autoComplete="off">
          <Row justify={'space-between'} gutter={8}>
            <Col span={10}>
              <Form.Item
                label={'批次名称'}
                name={'release_name'}
                rules={[{ required: true, message: '请填写批次名称' }]}
              >
                <Input placeholder={'批次名称'} disabled={hasEdit} />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label={'发布项目'} name={'project'}>
                <Input disabled placeholder={'发布项目'} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={'space-between'} gutter={8}>
            <Col span={5}>
              <Form.Item label={'上线分支'} name={'branch'}>
                <Input disabled placeholder={'上线分支'} />
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
            <Col span={4}>
              <Form.Item label={'发布集群'} name={'cluster'}>
                <Input disabled placeholder={'发布集群'} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={'镜像环境绑定'}
                name={'release_env'}
                rules={[{ required: true, message: '请填写镜像环境绑定' }]}
              >
                <Select placeholder={'镜像环境绑定'} disabled={hasEdit} options={branchEnv} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={'发布时间'}
                name={'plan_release_time'}
                rules={[{ required: true, message: '请填写发布时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={'发布时间'}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  disabled={hasEdit}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.tableHeader}>
          <h4>二、应用服务</h4>
          <Button size={'small'} onClick={() => onSeal('yes')} disabled={hasEdit}>
            封板
          </Button>
          <Button size={'small'} onClick={() => onSeal('no')} disabled={hasEdit}>
            解除封板
          </Button>
          <Button
            size={'small'}
            disabled={hasEdit}
            className={styles.remove}
            onClick={() => onDelete('server')}
          >
            移除
          </Button>
        </div>
        <Checkbox
          disabled={hasEdit}
          checked={checked}
          style={{ marginLeft: 8 }}
          onChange={({ target }) => {
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
            columns={preServerColumn}
            pagination={false}
            scroll={{ y: 400, x: 1200 }}
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
              getCheckboxProps: (record) => ({ disabled: hasEdit }),
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
          >
            移除
          </Button>
          <div style={{ color: 'red' }}>
            <WarningOutlined
              style={{ color: 'orange', fontSize: 18, margin: '0 10px', fontWeight: 'bold' }}
            />
            接口数据解析异常
          </div>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            rowSelection={'multiple'}
            columnDefs={upgradeServicesColumn}
            rowData={api ?? []}
            {...initGridTable({ ref: interfaceRef, height: 30 })}
          />
        </div>
        <div className={styles.tableHeader}>
          <h4>四、数据修复/升级</h4>
          <Button
            disabled={hasEdit}
            size={'small'}
            className={styles.remove}
            onClick={() => onDelete('repair')}
          >
            移除
          </Button>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            rowSelection={'multiple'}
            columnDefs={repairColumn}
            rowData={repair?.data}
            {...initGridTable({ ref: repairRef, height: 30 })}
            frameworkComponents={{
              log: (p: CellClickedEvent) => (
                <img
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                  src={require('../../../../../public/logs.png')}
                  onClick={() => onLog({ title: 'sql详情', log: p.value, noData: '暂无sql日志！' })}
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
          <h4>五、服务确认</h4>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            columnDefs={serverConfirmColumn}
            rowData={serverConfirm}
            {...initGridTable({
              ref: confirmRef,
              height: 30,
            })}
            frameworkComponents={{
              select: (p: CellClickedEvent) => {
                return (
                  <Select
                    size={'small'}
                    value={p.value}
                    disabled={p.data.is_sealing == 'yes'}
                    style={{
                      width: '100%',
                      color: p.column?.colId?.includes('confirm_result')
                        ? color[p.value]
                        : 'initial',
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
            setStoryModal({ visible: false, data: null });
            if (v) {
              reset();
              getReleaseInfo({ release_num });
            }
          }}
        />
      </div>
    </Spin>
  );
};
export default forwardRef(ProcessDetail);
