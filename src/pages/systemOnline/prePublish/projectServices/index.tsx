import React, { useRef, useState, useEffect } from 'react';
import { Form, Row, Col, Select, Space } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import ITableTitle from '../../components/ITableTitle';
import {
  projectUpgradeColumn,
  publishServerColumn,
  upgradeSQLColumn,
  dataReviewColumn,
} from '@/pages/systemOnline/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { initColDef } from '@/pages/systemOnline/constants';
import cls from 'classnames';

const ProjectServices = () => {
  const [form] = Form.useForm();

  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const [data] = useState({
    prePublishEnv: 'nx-release-k8s',
  });
  const [projectUpgrade, setProjectUpgrade] = useState<Record<string, any>[]>([]);
  const [servicesData, setServicesData] = useState<Record<string, any>[]>([]);
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const getProjectUpgradeData = async () => {
    setProjectUpgrade([
      {
        id: 1,
        name: '笑果文化',
        update_dbs: '是',
        recovery: '否',
        clear: '否',
        setting_add: '否',
        origin_update: '否',
        mark: 'test',
      },
      {
        id: 2,
        name: '笑果文化',
        update_dbs: '是',
        recovery: '否',
        clear: '否',
        setting_add: '否',
        origin_update: '否',
        mark: 'test',
      },
    ]);
    setServicesData([
      {
        id: 1,
        online_env: '集群1',
        application: 'h5',
        mark: '测试',
      },
      {
        id: 2,
        online_env: '集群1',
        application: 'global',
        mark: '测试',
      },
      {
        id: 3,
        online_env: '集群1',
        application: 'web',
        mark: '测试',
      },
    ]);
  };
  useEffect(() => {
    getProjectUpgradeData();
  }, []);

  return (
    <div>
      <ITableTitle data={{ title: '一、预发布项目&环境填写', subTitle: '由测试人员依次填写' }} />
      <Form form={form} initialValues={data}>
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
      <ITableTitle
        data={{ title: '二、项目升级信息填写', subTitle: '由后端值班/流程值班人员填写' }}
      />
      <div className={'AgGridReactTable'}>
        <AgGridReact
          className={cls('ag-theme-alpine', 'ag-initialize-theme')}
          columnDefs={projectUpgradeColumn}
          rowData={projectUpgrade}
          defaultColDef={initColDef}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridReady}
          frameworkComponents={{
            operation: (it: GridReadyEvent) => {
              return (
                <Space size={10} className={'operation'}>
                  <img
                    src={require('../../../../../public/edit.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                  <img
                    src={require('../../../../../public/logs.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                </Space>
              );
            },
          }}
        />
      </div>
      <ITableTitle
        data={{
          title: '三、发布服务填写',
          subTitle: '由后端负责人/前端值班/后端值班/流程值班人员填写',
        }}
      />
      <div className={'AgGridReactTable'}>
        <AgGridReact
          className={cls('ag-theme-alpine', 'ag-initialize-theme')}
          columnDefs={publishServerColumn}
          rowData={servicesData}
          defaultColDef={initColDef}
          onGridReady={onGridReady}
          frameworkComponents={{
            operation: (it: GridReadyEvent) => {
              return (
                <Space size={15} className={'operation'}>
                  <img
                    src={require('../../../../../public/add_1.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                  <img
                    src={require('../../../../../public/edit.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                  <img
                    src={require('../../../../../public/delete_2.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                  <img
                    src={require('../../../../../public/logs.png')}
                    onClick={() => {
                      console.log(it);
                    }}
                  />
                </Space>
              );
            },
          }}
        />
      </div>
      <ITableTitle
        data={{
          title: '四、升级接口&升级SQL填写',
          subTitle: '前后端值班核对确认',
        }}
      />
      <div className={'AgGridReactTable'}>
        <AgGridReact
          className={cls('ag-theme-alpine', 'ag-initialize-theme')}
          columnDefs={upgradeSQLColumn}
          rowData={[]}
          defaultColDef={initColDef}
          onGridReady={onGridReady}
          frameworkComponents={{
            operation: () => {
              return <div>编辑</div>;
            },
          }}
        />
      </div>
      <ITableTitle
        data={{
          title: '五、数据修复Review',
          subTitle: '由后端值班人员核对确认',
        }}
      />
      <div className={'AgGridReactTable'}>
        <AgGridReact
          className={cls('ag-theme-alpine', 'ag-initialize-theme')}
          columnDefs={dataReviewColumn}
          rowData={[]}
          defaultColDef={initColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
export default ProjectServices;
