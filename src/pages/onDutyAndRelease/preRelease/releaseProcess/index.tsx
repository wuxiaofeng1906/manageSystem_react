import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
const Index = () => {
  const gridRef = useRef<GridApi>();
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onDrag = () => {
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node, index) {
      const current = node.data;

      console.log(current);
    });
  };
  return (
    <div>
      <div>
        <Button>新增发布</Button>
        <div className="ag-theme-alpine" style={{ height: 800, width: '100%' }}>
          <AgGridReact
            columnDefs={[]} // 定义列
            rowData={[]} // 数据绑定
            defaultColDef={{
              resizable: true,
              // sortable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
            }}
            rowDragManaged={true}
            animateRows={true}
            frameworkComponents={{ myCustomCell: DragIcon }}
            onRowDragEnd={onDrag}
            onGridReady={onGridReady}
            onGridSizeChanged={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};
export default Index;
