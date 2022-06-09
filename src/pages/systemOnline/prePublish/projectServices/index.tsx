import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Row, Col, Select, Space, Modal, Table, Spin, Tooltip } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sortBy } from 'lodash';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  projectUpgradeColumn,
  upgradeSQLColumn,
  dataReviewColumn,
  serverColumn,
} from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { COMMON_STATUS, initGridTable } from '@/pages/systemOnline/constants';
import { useModel, useLocation } from 'umi';
import EditUpgrade from './EditUpgrade';
import EditServices from './EditServices';
import EditSql from './EditSql';
import OnlineServices from '@/services/online';
import type { PreServices, PreSql, PreUpgradeItem } from '@/namespaces/interface';
import { ColumnsType } from 'antd/lib/table/Table';
import { GridReadyEvent } from 'ag-grid-community';

type enumType = 'upgrade' | 'services' | 'sql';
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

  const [editUpgrade, setEditUpgrade] = useState<Istate<PreUpgradeItem> | null>();
  const [editServices, setEditServices] = useState<Istate<PreServices> | null>();
  const [editSql, setEditSql] = useState<Istate<PreSql> | null>();
  const [preEnv, setPreEnv] = useState([]);
  const [spinning, setPinning] = useState(false);
  const updatePreData = async (value: any, values: any) => {
    // if (value.release_branch) {
    //   // 分支对应环境
    // }

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

  useEffect(() => {
    const info = proInfo?.release_project;
    form.setFieldsValue({
      release_project: info?.release_project ? info.release_project.split(',') : [],
      release_branch: info?.release_branch,
      release_env: info?.release_env,
    });
  }, [JSON.stringify(proInfo)]);

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
    return (
      <div className={'operation'}>
        <img
          src={require('../../../../../public/edit.png')}
          onClick={() => {
            if (disabled) return;
            const params = { visible: true, data };
            if (type == 'upgrade') setEditUpgrade(params);
            else if (type == 'services') setEditServices(params);
            else setEditSql(params);
          }}
        />
        {showLog && (
          <img
            src={require('../../../../../public/logs.png')}
            onClick={() => {
              if (data.logUrl) {
                window.open(data.log_url);
              }
            }}
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

  return (
    <Spin spinning={spinning} tip={'数据加载中,请稍等...'}>
      <div>
        <ITableTitle
          data={{
            title: '一、预发布项目名称&分支填写',
            subTitle: '由测试值班人员填写-按从左到右一次填写',
          }}
        />
        <Form form={form} onValuesChange={updatePreData}>
          <Row justify={'space-between'}>
            <Col span={8}>
              <Form.Item label={'预发布项目'} name={'release_project'}>
                <Select
                  options={projectSelectors}
                  style={{ width: '100%' }}
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
              <Form.Item label={'预发布分支'} name={'release_branch'}>
                <Select
                  disabled={disabled}
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  showSearch
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
            <Col span={8}>
              <Form.Item label={'镜像环境绑定'} name={'release_env'}>
                <Select
                  disabled={disabled}
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  options={preEnv}
                  showSearch
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space className={'flex-row'} size={40} style={{ marginBottom: 40 }}>
          <div>
            填写人： <span>{proInfo?.release_project?.edit_user || '-'}</span>
          </div>
          <div>
            填写时间： <span>{proInfo?.release_project?.edit_time || '-'}</span>
          </div>
        </Space>
        <ITableTitle
          data={{
            title: '二、项目升级信息填写',
            subTitle: '特性项目由端负责人填写，班车项目由前后端周值班人填写',
          }}
        />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            {...initGridTable(gridUpgradeRef)}
            columnDefs={projectUpgradeColumn}
            rowData={proInfo?.upgrade_project || []}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => OperationDom(data, 'upgrade'),
            }}
          />
        </div>
        <ITableTitle data={{ title: '三、发布服务填写', subTitle: '由测试值班人员填写' }} />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            {...initGridTable(gridServerRef)}
            columnDefs={serverColumn}
            rowData={proInfo?.upgrade_app || []}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => OperationDom(data, 'services'),
            }}
          />
        </div>
        <ITableTitle
          data={{
            title: '四、升级接口&升级SQL填写',
            subTitle: '特性项目由端负责人填写，班车项目由前后端周值班人填写',
          }}
        />
        <div className={'AgGridReactTable'}>
          <AgGridReact
            animateRows
            rowDragManaged
            suppressAutoSize
            suppressRowTransform
            {...initGridTable(gridSQLRef)}
            columnDefs={upgradeSQLColumn}
            rowData={sortServiceData}
            onRowDragEnd={onRowDragMove}
            frameworkComponents={{
              operation: ({ data }: CellClickedEvent) => OperationDom(data, 'sql'),
            }}
            onCellDoubleClicked={showDetail}
          />
        </div>
        <ITableTitle
          data={{
            title: '五、数据修复Review',
            subTitle: '特性项目由后端技术负责人确认，班车项目由后端周值班人填写',
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
