import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {getHeight} from "@/publicMethods/pageSet";
import {getColumns} from "./grid/columns";

const GridList: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight());
  const gridApi = useRef<GridApi>();
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion 表格事件 */

  return (
    <div>
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={getColumns()} // 定义列
          rowData={[]} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </div>
  );
};


export default GridList;
