import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Row } from 'antd';
import { deployColumn } from '@/pages/systemOnline/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DeploySetting from '@/pages/systemOnline/prePublish/deploy/DeploySetting';

const Deploy = () => {
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const [deploySetting, setDeploySetting] = useState(false);
  const [data, setData] = useState({});
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  return (
    <div>
      <Row>
        <Button onClick={() => setDeploySetting(true)}>部署参数设置</Button>
        <Button>一键部署</Button>
      </Row>
      <div style={{ height: 150, width: '100%' }}>
        <AgGridReact
          className={'ag-theme-alpine'}
          columnDefs={deployColumn}
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
              return <div>日志</div>;
            },
          }}
        />
      </div>
      <DeploySetting
        visible={deploySetting}
        title={'部署参数设置'}
        onCancel={(e) => setDeploySetting(false)}
      />
    </div>
  );
};
export default Deploy;
