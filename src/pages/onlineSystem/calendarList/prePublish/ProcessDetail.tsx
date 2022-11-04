import React, { useRef, useState, useEffect } from 'react';
import { Form, Select, Checkbox } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { preServerColumn } from '@/pages/onlineSystem/common/column';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { history } from 'umi';
import { uniq } from 'lodash';

const ProcessDetail = () => {
  const gridRef = useRef<GridApi>();
  const [serverData, setServerData] = useState<any[]>([]);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    const mock = [
      { project_name: '笑果文化', release_num: '202209190001', applicant: 'h5' },
      { project_name: '薪资提计', release_num: '202209190003', applicant: 'h5' },
      { project_name: '笑果文化', release_num: '202209190004', applicant: 'web' },
      { project_name: 'stage-patch20220919', release_num: '202209190009', applicant: 'app' },
    ];
    setServerData(mock);
  }, []);
  return (
    <div>
      <h3>一、项目名称&分支</h3>
      <h3>二、应用服务</h3>
      <Checkbox>全部项目</Checkbox>
      <Checkbox.Group options={uniq(serverData?.map((it) => it.applicant))} />
      <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 8 }}>
        <AgGridReact
          columnDefs={preServerColumn}
          rowData={serverData}
          defaultColDef={{
            resizable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridReady}
          suppressRowTransform={true}
          frameworkComponents={{
            link: (p: CellClickedEvent) => {
              return (
                <div
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => {
                    history.push(`/onlineSystem/prePublish/${p.data.release_num}`);
                  }}
                >
                  {p.value}
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
};
export default ProcessDetail;
