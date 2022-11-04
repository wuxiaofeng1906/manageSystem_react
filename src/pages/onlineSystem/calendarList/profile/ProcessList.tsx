import React, { useRef } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { preProcessColumn } from '@/pages/onlineSystem/common/column';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { history } from 'umi';

const ProcessList = () => {
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  return (
    <div>
      <Button>新增发布过程</Button>
      <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 8 }}>
        <AgGridReact
          columnDefs={preProcessColumn}
          rowData={[{ name: '202209190001灰度发布', release_num: '202209190001' }]}
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
export default ProcessList;
