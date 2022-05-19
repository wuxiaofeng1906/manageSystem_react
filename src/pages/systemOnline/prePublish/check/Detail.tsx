import React, { useRef, useState } from 'react';
import { checkDetailColumn } from '../../column';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { initColDef } from '@/pages/systemOnline/constants';
import cls from 'classnames';

const Detail = () => {
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件

  const [data, setData] = useState({});
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  return (
    <div className={'AgGridReactTable'}>
      <AgGridReact
        className={cls('ag-theme-alpine', 'ag-initialize-theme')}
        columnDefs={checkDetailColumn}
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
  );
};
export default Detail;
