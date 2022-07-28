import React, { forwardRef, MutableRefObject, useImperativeHandle, useMemo } from 'react';
import { Modal } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { removeColumns } from '@/pages/sprint/sprintListDetails/grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

const RemoveModal = ({ gridRef }: { gridRef: MutableRefObject<GridApi | undefined> }) => {
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const rowData = useMemo(
    () => gridRef.current?.getSelectedRows(),
    [gridRef.current?.getSelectedRows()],
  );
  return (
    <Modal title={'移除操作'}>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          columnDefs={removeColumns} // 定义列
          rowData={rowData} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
        />
      </div>
    </Modal>
  );
};
export default RemoveModal;
