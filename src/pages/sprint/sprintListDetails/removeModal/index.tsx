import React, { forwardRef, MutableRefObject, useImperativeHandle, useMemo } from 'react';
import { Modal, Select } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { removeColumns } from '@/pages/sprint/sprintListDetails/grid';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';

const list = [
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' },
];
const RemoveModal = (
  props: { gridRef: MutableRefObject<GridApi | undefined> } & ModalFuncProps,
) => {
  const onGridReady = (params: GridReadyEvent) => {
    props.gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const rowData = useMemo(
    () => props.gridRef.current?.getSelectedRows(),
    [props.gridRef.current?.getSelectedRows()],
  );

  return (
    <Modal title={'移除操作'} {...props}>
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
          frameworkComponents={{
            test: (params: CellClickedEvent) => {
              return <Select options={list} />;
            },
            testCheck: (params: CellClickedEvent) => {
              return <Select options={list} />;
            },
            commit: (params: CellClickedEvent) => {
              return <Select options={list} />;
            },
            revert: (params: CellClickedEvent) => {
              return <Select options={list} />;
            },
            reason: (params: CellClickedEvent) => {
              return <Select options={list} />;
            },
          }}
        />
      </div>
    </Modal>
  );
};
export default forwardRef(RemoveModal);
