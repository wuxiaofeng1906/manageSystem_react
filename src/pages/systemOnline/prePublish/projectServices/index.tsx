import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Select, Space, Modal } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  projectUpgradeColumn,
  publishServerColumn,
  upgradeSQLColumn,
  dataReviewColumn,
} from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { initGridTable } from '@/pages/systemOnline/constants';
import EditUpgrade, { UpgradeItem } from './EditUpgrade';
import EditServices, { Iservices } from './EditServices';
import EditSql, { Isql } from './EditSql';

type enumType = 'upgrade' | 'services' | 'sql';
interface Istate<T> {
  visible: boolean;
  data?: T;
}

const ProjectServices = () => {
  const [form] = Form.useForm();

  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const [initData] = useState({
    prePublishEnv: 'nx-release-k8s',
  });
  const [projectUpgrade, setProjectUpgrade] = useState<UpgradeItem[]>([]);
  const [servicesData, setServicesData] = useState<Iservices[]>([]);
  const [upgradeSQLData, setUpgradeSQLData] = useState<Isql[]>([]);
  const [checkReviewData, setCheckReviewData] = useState<Record<string, any>[]>([]);

  const [editUpgrade, setEditUpgrade] = useState<Istate<UpgradeItem> | null>();
  const [editServices, setEditServices] = useState<Istate<Iservices> | null>();
  const [editSql, setEditSql] = useState<Istate<Isql> | null>();

  const getProjectUpgradeData = async () => {
    setProjectUpgrade([
      {
        id: 1,
        name: '笑果文化',
        update_dbs: 'yes',
        recovery: 'no',
        clear: 'yes',
        setting_add: 'no',
        origin_update: 'yes',
        application: 'yes',
        leader: '吹烂',
        mark: 'test',
      },
      {
        id: 2,
        name: '老六',
        update_dbs: 'yes',
        recovery: 'no',
        clear: 'yes',
        setting_add: 'no',
        origin_update: 'no',
        application: 'no',
        leader: '王洼',
        mark: 'test',
      },
    ]);
    setServicesData([
      {
        id: 1,
        online_env: '集群1',
        application: 'h5',
        version: 'yes',
        side: '业务前端',
        date: '2022-05-24 14:13:29',
        rowSpan: 2,
      },
      {
        id: 2,
        online_env: '集群1',
        application: 'global',
        version: 'yes',
        side: '业务前端',
        date: '',
      },
      {
        id: 3,
        online_env: '集群3',
        application: 'web',
        version: 'no',
        side: '业务前端',
        date: '',
        rowSpan: 1,
      },
    ]);
    setUpgradeSQLData([
      {
        id: 1,
        online_env: '集群1',
        upgrade_type: '接口升级',
        upgrade_sql: '后端接口',
        services: 'basebi',
        sql: 'update project set\n;;;;  code=1;\n where projectid=1234 ...',
        method: 'post',
        data: '',
        header: '',
        users: '全量租户',
        record: 'yes',
      },
      {
        id: 2,
        online_env: '',
        upgrade_type: '接口升级',
        upgrade_sql: '后端接口',
        services: 'basebi',
        method: 'post',
        data: '',
        header: '',
        users: '全量租户',
        record: 'no',
      },
    ]);
    setCheckReviewData([
      {
        id: 1,
        review_content: '测试',
        users: 'all',
        type: 'after',
        commit_person: '王德',
        branch: 'hotfux-inte',
        result: '通过',
        repeat: '是',
      },
    ]);
  };
  useEffect(() => {
    getProjectUpgradeData();
  }, []);

  // drag
  const onRowDragMove = useCallback(() => {
    const result: string[] = [];
    gridApi.current?.forEachNode(({ data }: any) => {
      result.push(data.id);
    });
    console.log(result);
  }, []);

  // operation
  const OperationDom = ({ data }: CellClickedEvent, type: enumType, showLog = true) => {
    return (
      <div className={'operation'}>
        <img
          src={require('../../../../../public/edit.png')}
          onClick={() => {
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
              console.log(data);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <h4>
        一、预发布项目&环境填写 <span className="color-tips">【由测试人员依次填写】</span>
      </h4>
      <Form form={form} initialValues={initData}>
        <Row justify={'space-between'}>
          <Col span={8}>
            <Form.Item label={'预发布项目'} name={'prePublishPro'}>
              <Select options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'预发布分支'} name={'prePublishBranch'}>
              <Select
                options={[
                  { value: 'release', label: 'release' },
                  { value: 'hotfix', label: 'hotfix' },
                  { value: 'hotfix-inte', label: 'hotfix-inte' },
                  { value: 'emergency', label: 'emergency' },
                  { value: 'stage-emergency', label: 'stage-emergency' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'测试环境绑定'} name={'prePublishEnv'}>
              <Select
                disabled
                options={[
                  { value: 'nx-release-k8s', label: 'nx-release-k8s' },
                  { value: 'nx-release-db-k8s', label: 'nx-release-db-k8s' },
                  { value: 'nx-hotfix-k8s', label: 'nx-hotfix-k8s' },
                  { value: 'nx-hotfix-inte-k8s', label: 'nx-hotfix-inte-k8s' },
                  { value: 'nx-hotfix-db-k8s', label: 'nx-hotfix-db-k8s' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Space className={'flex-row'} size={40} style={{ marginBottom: 40 }}>
        <div>
          填写人： <span>詹三</span>
        </div>
        <div>
          填写时间： <span>2022-05-08</span>
        </div>
      </Space>
      <h4>
        二、项目升级信息填写 <span className="color-tips">【由后端值班/流程值班人员填写】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridApi)}
          columnDefs={projectUpgradeColumn}
          rowData={projectUpgrade}
          frameworkComponents={{
            operation: (it: CellClickedEvent) => OperationDom(it, 'upgrade'),
          }}
        />
      </div>
      <h4>
        三、发布服务填写{' '}
        <span className="color-tips">【由后端负责人/前端值班/后端值班/流程值班人员填写】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridApi)}
          columnDefs={publishServerColumn}
          rowData={servicesData}
          frameworkComponents={{
            operation: (it: CellClickedEvent) => OperationDom(it, 'services'),
          }}
        />
      </div>
      <h4>
        四、升级接口&升级SQL填写 <span className="color-tips">【前后端值班核对确认】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          animateRows
          rowDragManaged
          suppressRowTransform
          {...initGridTable(gridApi)}
          columnDefs={upgradeSQLColumn}
          rowData={upgradeSQLData}
          onRowDragEnd={onRowDragMove}
          frameworkComponents={{
            operation: (it: CellClickedEvent) => OperationDom(it, 'sql', false),
          }}
          onCellDoubleClicked={({ colDef, value }: CellClickedEvent) => {
            if (colDef.field == 'sql' && value) {
              Modal.info({
                width: 600,
                title: '详情',
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
                okText: '好的',
              });
            }
          }}
        />
      </div>
      <h4>
        五、数据修复Review <span className="color-tips">【由后端值班人员核对确认】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridApi)}
          columnDefs={dataReviewColumn}
          rowData={checkReviewData}
        />
      </div>
      <EditUpgrade {...editUpgrade} onCancel={() => setEditUpgrade(null)} />
      <EditServices {...editServices} onCancel={() => setEditServices(null)} />
      <EditSql {...editSql} onCancel={() => setEditSql(null)} />
    </div>
  );
};
export default ProjectServices;
