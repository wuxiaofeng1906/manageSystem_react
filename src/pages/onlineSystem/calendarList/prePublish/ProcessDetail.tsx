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
  Popconfirm,
} from 'antd';
import {
  preServerColumn,
  repairColumn,
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
import { ClusterType, ServerConfirmType, WhetherOrNot } from '@/pages/onlineSystem/config/constant';
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
  const [checkBoxOpt, setCheckBoxOpt] = useState<string[]>([]);
  const [storyModal, setStoryModal] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  }); // 需求列表
  const [envs, setEnvs] = useState<any[]>([]);

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
          title: '取消发布提示',
          content: '请确认是否取消发布？',
          closable: false,
          onOk: async () => {
            console.log('取消');
            history.replace('/onlineSystem/calendarList');
          },
        });
      },
      onRefresh: init,
    }),
    [release_num, basic],
  );

  const init = async () => {
    try {
      setLoading(true);
      reset();
      await getReleaseInfo({ release_num });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const getSelectList = async () => {
    const res = await PreReleaseServices.environment();
    setEnvs(
      res?.map((it: any) => ({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
      })),
    );
  };
  useEffect(() => {
    if (!release_num) return;
    Modal.destroyAll?.();
    getSelectList();
    init();
  }, [release_num]);

  useEffect(() => {
    if (!isEmpty(basic)) {
      form.setFieldsValue({
        ...basic,
        plan_release_time: basic?.plan_release_time ? moment(basic?.plan_release_time) : null,
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
        reset();
        await removeRelease(
          {
            user_id: user?.userid ?? '',
            app_id: gridSelected?.map((it) => it._id)?.join(',') ?? '',
          },
          type,
          { release_num },
        );
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

  const memoGroup = useMemo(() => {
    const table = mergeCellsTable(server ?? [], 'apps');
    return {
      opts: uniq(server?.map((it) => it.apps)),
      table,
    };
  }, [server]);

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
      maskClosable: false,
      centered: true,
      title: `【${ServerConfirmType[param.data.confirm_type]}值班】修改服务确认提醒：`,
      content: `请确认是否将『${
        param.column.colId.includes('is_hot_update') ? '是否可热更' : '服务确认完成'
      }』状态调整为 ${WhetherOrNot[v]}`,
      onOk: async () => {
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
      },
    });
  };

  const hasEdit = useMemo(() => globalState.locked || globalState.finished, [globalState]);

  const memoServerConfirmColumn = useMemo(() => {
    let column: any[] = [];
    let rowData: any = {};
    if (!isEmpty(serverConfirm)) {
      serverConfirm.forEach((it) => {
        const side = it.confirm_type;
        column.push(
          {
            headerName: `${ServerConfirmType[side]}值班`,
            field: `${side}_user`,
            minWidth: 130,
          },
          {
            headerName: '是否可热更',
            field: `${side}_is_hot_update`,
            minWidth: 150,
            headerClass: 'ag-required',
            cellRenderer: 'select',
          },
          {
            headerName: '服务确认完成',
            field: `${side}_confirm_result`,
            minWidth: 150,
            cellRenderer: 'select',
            headerClass: 'ag-required',
          },
          { headerName: '确认时间', field: `${side}_confirm_time`, minWidth: 190 },
        );
        rowData = {
          ...rowData,
          [`${side}_server_confirm`]: it.server_confirm, // userid
          [`${side}_user`]: it.server_confirm_user,
          [`${side}_confirm_type`]: it.confirm_type,
          [`${side}_confirm_time`]: it.confirm_time,
          [`${side}_confirm_result`]: it.confirm_result,
          [`${side}_is_hot_update`]: it.is_hot_update,
          [`${side}_id`]: it._id,
        };
      });
    }
    return { column, rowData: [rowData] };
  }, [serverConfirm]);

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
                <Select disabled placeholder={'发布集群'} options={envs} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label={'镜像环境绑定'}
                name={'release_env'}
                rules={[{ required: true, message: '请填写镜像环境绑定' }]}
              >
                <Select placeholder={'镜像环境绑定'} disabled={hasEdit} />
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
              log: (p) => (
                <img
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                  src={require('../../../../../public/logs.png')}
                  onClick={() => {
                    console.log(p.value);
                  }}
                />
              ),
            }}
          />
        </div>
        <IPagination
          page={pages}
          onChange={getTableList}
          showQuickJumper={getTableList}
          onShowSizeChange={(size) => getTableList(1, size)}
        />
        <div>
          <h4>五、服务确认</h4>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            // columnDefs={memoServerConfirmColumn?.column}
            // rowData={memoServerConfirmColumn.rowData ?? []}
            columnDefs={[
              {
                headerName: '技术侧',
                field: 'confirm_type',
                minWidth: 130,
                valueFormatter: (p) => ServerConfirmType[p.value],
              },
              {
                headerName: '值班人',
                field: 'server_confirm_user',
                minWidth: 130,
              },
              {
                headerName: '是否可热更',
                field: 'is_hot_update',
                minWidth: 150,
                headerClass: 'ag-required',
                cellRenderer: 'select',
              },
              {
                headerName: '服务确认完成',
                field: 'confirm_result',
                minWidth: 150,
                cellRenderer: 'select',
                headerClass: 'ag-required',
              },
              { headerName: '确认时间', field: `confirm_time`, minWidth: 190 },
            ]}
            rowData={serverConfirm}
            {...initGridTable({ ref: confirmRef, height: 30 })}
            frameworkComponents={{
              select: (p: CellClickedEvent) => {
                return (
                  <Select
                    size={'small'}
                    value={p.value}
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
