import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Space } from 'antd';
import { deployColumn } from '@/pages/systemOnline/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DeploySetting from '@/pages/systemOnline/prePublish/deploy/DeploySetting';
import OneKeyDeploy from '@/pages/systemOnline/prePublish/deploy/OneKeyDeploy';
import cls from 'classnames';
import { initColDef } from '@/pages/systemOnline/constants';

const Deploy = () => {
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const [deploySetting, setDeploySetting] = useState(false);
  const [oneKeyDeploy, setOneKeyDeploy] = useState(false);
  // const [data, setData] = useState({});
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  return (
    <div>
      <Space size={16}>
        <Button type={'primary'} onClick={() => setDeploySetting(true)}>
          部署参数设置
        </Button>
        <Button type={'primary'} onClick={() => setOneKeyDeploy(true)}>
          一键部署
        </Button>
      </Space>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          className={cls('ag-theme-alpine', 'ag-initialize-theme')}
          columnDefs={deployColumn}
          rowData={[]}
          defaultColDef={initColDef}
          onGridReady={onGridReady}
          frameworkComponents={{
            operation: () => {
              return <div>日志</div>;
            },
          }}
        />
      </div>
      <DeploySetting
        visible={deploySetting}
        title={'部署参数设置'}
        onCancel={() => setDeploySetting(false)}
        onOk={(v) => {
          console.log(v);
        }}
      />
      <OneKeyDeploy
        visible={oneKeyDeploy}
        onCancel={() => setOneKeyDeploy(false)}
        onOk={(it) => {
          setOneKeyDeploy(false);
          console.log(it);
        }}
      />
    </div>
  );
};
export default Deploy;
