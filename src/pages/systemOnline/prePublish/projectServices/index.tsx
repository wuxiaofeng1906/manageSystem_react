import React, { useRef, useState } from 'react';
import { Form, Row, Col, Select } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import ITableTitle from '../../components/ITableTitle';
import {
  projectUpgradeColumn,
  publishServerColumn,
  upgradeSQLColumn,
  dataReviewColumn,
} from '@/pages/systemOnline/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

const ProjectServices = () => {
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件

  const [data, setData] = useState({});
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  return (
    <div>
      <ITableTitle data={{ title: '一、预发布项目&环境填写', subTitle: '由测试人员依次填写' }} />
      <Form>
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
      <div style={{ height: 150, width: '100%' }}>
        <AgGridReact
          className={'ag-theme-alpine'}
          columnDefs={projectUpgradeColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
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
          title: '三、发布服务填写',
          subTitle: '由后端负责人/前端值班/后端值班/流程值班人员填写',
        }}
      />
      <div style={{ height: 150, width: '100%' }}>
        <AgGridReact
          className={'ag-theme-alpine'}
          columnDefs={publishServerColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
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
          title: '四、升级接口&升级SQL填写',
          subTitle: '前后端值班核对确认',
        }}
      />
      <div style={{ height: 150, width: '100%' }}>
        <AgGridReact
          className={'ag-theme-alpine'}
          columnDefs={upgradeSQLColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
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
      <div style={{ height: 150, width: '100%' }}>
        <AgGridReact
          className={'ag-theme-alpine'}
          columnDefs={dataReviewColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
export default ProjectServices;
