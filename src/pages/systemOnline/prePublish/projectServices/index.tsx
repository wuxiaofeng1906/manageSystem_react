import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Row, Col, Select, Modal, Spin, Tooltip, Alert } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sortBy, clone } from 'lodash';
import cls from 'classnames';
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  projectUpgradeColumn,
  upgradeSQLColumn,
  dataReviewColumn,
  serverColumn,
} from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { initGridTable, PLATE_STATUS } from '@/pages/systemOnline/constants';
import { useModel, useLocation } from 'umi';
import EditUpgrade from './EditUpgrade';
import EditServices from './EditServices';
import EditSql from './EditSql';
import OnlineServices from '@/services/online';
import type { PreServices, PreSql, PreUpgradeItem } from '@/namespaces/interface';
import { useShowLog } from '@/hooks/online';

type enumType = 'online_project' | 'online_server' | 'online_upgrade_sql';
interface Istate<T> {
  visible: boolean;
  data?: T;
}

interface ITitle {
  data: {
    title: string;
    subTitle?: string;
  };
}
const ITableTitle = ({ data }: ITitle) => {
  return (
    <h4>
      {data.title}
      {data.subTitle ? (
        <Tooltip overlayInnerStyle={{ color: '#2f2f2f' }} title={data.subTitle} color={'white'}>
          <InfoCircleOutlined style={{ color: '#000000b0', marginLeft: 5, fontSize: '16px' }} />
        </Tooltip>
      ) : (
        <React.Fragment />
      )}
    </h4>
  );
};

const SealVersionForm = ({ disabled, idx }: { disabled: boolean; idx: string }) => {
  const { setShowLog } = useShowLog();
  const [sealForm] = Form.useForm();
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const [sealVersion, setSealVersion] = useState<Record<string, any>>();

  const getSealVersion = async () => {
    if (!idx) return;
    const res = await OnlineServices.getSealVersion(idx);
    setSealVersion(res);
    const formatResult = clone(res);
    if (formatResult) {
      for (const k in formatResult) {
        if (!formatResult[k]) {
          formatResult[k] = '免';
        }
        if (formatResult[k] == 'unknown') {
          formatResult[k] = '';
        }
      }
    }
    sealForm.setFieldsValue({ ...formatResult });
  };

  const updateSealVersion = async (value: Record<string, any>) => {
    const [k, v] = Object.entries(value).flat() as [string, any];
    await OnlineServices.updateSealVersion({
      user_id: user?.userid,
      release_num: idx,
      side: k?.replace('business_', ''),
      is_seal: v,
    });
    await getSealVersion();
  };

  useEffect(() => {
    getSealVersion();
  }, [idx]);

  return (
    <>
      <Form form={sealForm} onValuesChange={updateSealVersion}>
        <Row gutter={5}>
          <Col span={6}>
            <Form.Item label={'业务前端应用可封版'} name={'business_front'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.business_front}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.business_front == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'业务后端应用可封版'} name={'business_backend'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.business_backend}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.business_backend == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'流程应用可封版'} name={'process'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.process}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.process == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'global可封版'} name={'global'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.global}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.global == 'yes' })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={5}>
            <Form.Item label={'openapi可封版'} name={'openapi'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.openapi}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.openapi == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'qbos可封版'} name={'qbos'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.qbos}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.qbos == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'store可封版'} name={'store'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.store}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.store == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'jsf可封版'} name={'jsf'}>
              <Select
                options={PLATE_STATUS}
                disabled={disabled || !sealVersion?.jsf}
                style={{ width: '100%' }}
                className={cls({ 'form-select': sealVersion?.jsf == 'yes' })}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label={'日志'}>
              <img
                width={20}
                style={{ cursor: 'pointer' }}
                src={require('../../../../../public/logs.png')}
                onClick={() =>
                  setShowLog({
                    visible: true,
                    data: { operation_id: idx, operation_address: 'online_seal_version' },
                    title: '服务可封板操作日志详情',
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const ProjectServices = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const { projectSelectors, branchSelectors, getProInfo, updateColumn, proInfo, disabled } =
    useModel('systemOnline');
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [form] = Form.useForm();
  const gridUpgradeRef = useRef<GridApi>();
  const gridSQLRef = useRef<GridApi>();
  const gridReviewRef = useRef<GridApi>();
  const gridServerRef = useRef<GridApi>();

  const { setShowLog } = useShowLog();
  const [editUpgrade, setEditUpgrade] = useState<Istate<PreUpgradeItem> | null>();
  const [editServices, setEditServices] = useState<Istate<PreServices> | null>();
  const [editSql, setEditSql] = useState<Istate<PreSql> | null>();
  const [preEnv, setPreEnv] = useState([]);
  const [spinning, setPinning] = useState(false);
  const [showTip, setShowTip] = useState('');

  const updatePreData = async (value: any, values: any) => {
    // 分支对应环境
    if (value.release_branch || value.release_env) {
      await checkBranch();
    }
    if (value.release_project || value.release_branch || value.release_env) {
      await updateColumn({
        ...proInfo?.release_project,
        release_project: values.release_project?.join(',') || '',
        release_branch: values.release_branch || '',
        release_env: values.release_env || '',
      });
      setPinning(true);
      await getProInfo(idx).finally(() => setPinning(false));
    }
  };
  const checkBranch = async () => {
    if (!idx) return;
    try {
      await OnlineServices.branchCheck(idx);
    } catch (e: any) {
      setShowTip(e.msg || '');
    }
  };

  const sortServiceData = useMemo(
    () => sortBy(proInfo?.upgrade_api || [], (it) => it.index),
    [proInfo?.upgrade_api],
  );

  // drag
  const onRowDragMove = useCallback(async () => {
    Modal.confirm({
      width: 600,
      title: '提示：',
      okText: '确认移动',
      content: '工单有从上到下的依次执行顺序，请谨慎移动！',
      onOk: async () => {
        const data: { api_id: string; index: number; user_id: string }[] = [];
        gridSQLRef.current?.forEachNode((node, index) => {
          data.push({ api_id: node.data.api_id, index, user_id: user?.userid || '' });
        });
        await OnlineServices.preInterfaceSort(data);
        await getProInfo(idx);
      },
      onCancel: () => {
        gridSQLRef.current?.setRowData(sortServiceData);
      },
    });
  }, []);

  // operation
  const OperationDom = (data: any, type: enumType, showLog = true) => {
    // const isEditCluster = type == 'online_upgrade_sql' && data.update_type == 'upgradeApi';

    const optionLogMap = {
      online_upgrade_sql: { title: '升级接口&SQL操作日志', id: data.api_id },
      online_project: { title: '项目升级信息操作日志', id: data.pro_id },
      online_server: { title: '服务发布环境操作日志', id: idx },
    };
    return (
      <div className={'operation'}>
        <img
          src={require('../../../../../public/edit.png')}
          // style={isEditCluster ? { filter: 'grayscale(1)', cursor: 'not-allowed' } : {}}
          onClick={() => {
            const params = { visible: true, data };
            if (type == 'online_project') setEditUpgrade(params);
            else if (type == 'online_server') setEditServices(params);
            else setEditSql(params);
          }}
        />
        {showLog && (
          <img
            src={require('../../../../../public/logs.png')}
            onClick={() =>
              setShowLog({
                visible: true,
                data: {
                  operation_id: optionLogMap[type].id,
                  operation_address: type,
                },
                title: optionLogMap[type].title,
              })
            }
          />
        )}
      </div>
    );
  };

  // sql detail
  const showDetail = ({ colDef, value }: CellClickedEvent) => {
    if (colDef.field && ['url_or_sql', 'content'].includes(colDef.field) && value) {
      Modal.info({
        width: 600,
        title: colDef.headerName,
        okText: '好的',
        centered: true,
        content: (
          <div
            style={{
              maxHeight: 400,
              overflow: 'auto',
              margin: '10px 0',
              whiteSpace: 'pre-line',
            }}
          >
            {value}
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    Modal.destroyAll();
    OnlineServices.preEnv().then((res) => {
      setPreEnv(res?.map((it: any) => ({ key: it.id, label: it.image_env, value: it.image_env })));
    });
  }, []);

  useEffect(() => {
    const info = proInfo?.release_project;
    form.setFieldsValue({
      release_project: info?.release_project ? info.release_project.split(',') : [],
      release_branch: info?.release_branch,
      release_env: info?.release_env,
    });
    info && checkBranch();
  }, [JSON.stringify(proInfo)]);

  return (
    <Spin spinning={spinning} tip={'数据加载中,请稍等...'}>
      <div>
        <ITableTitle
          data={{
            title: '一、预发布项目名称&分支填写',
            subTitle: '由测试值班人员填写-按从左到右一次填写',
          }}
        />
        <Form form={form} onValuesChange={updatePreData} className={'system-init-form'}>
          <Row gutter={4}>
            <Col span={8}>
              <Form.Item label={'预发布项目'} name={'release_project'} style={{ width: '100%' }}>
                <Select
                  options={projectSelectors}
                  mode="multiple"
                  maxTagCount="responsive"
                  optionFilterProp="label"
                  disabled={disabled}
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'预发布分支'} name={'release_branch'} style={{ width: '100%' }}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  disabled={disabled}
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
                  }
                >
                  {branchSelectors?.map((it) => (
                    <Select.Option key={it.label}>{it.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label={'镜像环境绑定'}
                name={'release_env'}
                style={{ width: '100%' }}
                help={
                  showTip ? (
                    <strong className={'color-failure'}>
                      <WarningOutlined style={{ margin: '8px 5px 0 0' }} />
                      {showTip}
                    </strong>
                  ) : (
                    ''
                  )
                }
              >
                <Select
                  disabled={disabled}
                  optionFilterProp="label"
                  options={preEnv}
                  showSearch
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label={'日志'}>
                <img
                  width={20}
                  src={require('../../../../../public/logs.png')}
                  onClick={() =>
                    setShowLog({
                      visible: true,
                      data: { operation_id: idx, operation_address: 'online_release_task' },
                      title: '预发布项目名称&分支操作日志',
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ITableTitle data={{ title: '二、服务发布环境填写', subTitle: '由测试值班人员填写' }} />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            {...initGridTable(gridServerRef)}
            columnDefs={serverColumn}
            rowData={proInfo?.upgrade_app || []}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) =>
                data.cluster_name == 'global' ? <div /> : OperationDom(data, 'online_server'),
            }}
          />
        </div>
        <ITableTitle data={{ title: '三、服务可封版确认', subTitle: '由测试值班人员填写' }} />
        <SealVersionForm disabled={disabled} idx={idx} />
        <ITableTitle
          data={{
            title: '四、项目升级信息填写',
            subTitle: '特性项目由端负责人填写，班车项目由前后端周值班人填写',
          }}
        />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            {...initGridTable(gridUpgradeRef)}
            columnDefs={projectUpgradeColumn}
            rowData={proInfo?.upgrade_project || []}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => OperationDom(data, 'online_project'),
            }}
          />
        </div>
        <ITableTitle
          data={{
            title: '五、升级接口&升级SQL填写',
            subTitle: '特性项目由端负责人填写，班车项目由前后端周值班人填写',
          }}
        />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            animateRows
            rowDragManaged
            suppressAutoSize
            suppressRowDrag={disabled}
            {...initGridTable(gridSQLRef)}
            columnDefs={upgradeSQLColumn}
            rowData={sortServiceData}
            onRowDragEnd={onRowDragMove}
            onCellDoubleClicked={showDetail}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => OperationDom(data, 'online_upgrade_sql'),
            }}
          />
        </div>
        <ITableTitle
          data={{
            title: '六、数据修复Review',
            subTitle: '特性项目由后端技术负责人确认，班车项目由后端周值班人确认',
          }}
        />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            {...initGridTable(gridReviewRef)}
            columnDefs={dataReviewColumn}
            rowData={proInfo?.upgrade_review || []}
            onCellDoubleClicked={showDetail}
          />
        </div>
        <EditUpgrade
          {...editUpgrade}
          onCancel={(status) => {
            if (status == true) getProInfo(idx);
            setEditUpgrade(null);
          }}
        />
        <EditServices
          {...editServices}
          onCancel={(status) => {
            if (status == true) getProInfo(idx);
            setEditServices(null);
          }}
        />
        <EditSql
          {...editSql}
          onCancel={(status) => {
            if (status == true) getProInfo(idx);
            setEditSql(null);
          }}
        />
      </div>
    </Spin>
  );
};
export default ProjectServices;
