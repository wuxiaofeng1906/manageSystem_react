import React, {useRef} from 'react';
import {useModel} from '@@/plugin-model/useModel';
import {AgGridReact} from "ag-grid-react";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {getWorkOrderColumns} from "./grid/columns";

const CorrespondingWorkOrder: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {correspOrder} = useModel('releaseProcess');

  const listGridApi = useRef<GridApi>();
  const onListGridReady = (params: GridReadyEvent) => {
    listGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  return (
    <div>
      {/* 对应工单 */}
      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step5 对应工单
            <label style={{color: "Gray"}}> (值班测试：在运维平台填写工单时，需要关联发布批次号)</label>
          </legend>
          <div>
            <div>
              {/* ag-grid 表格 */}
              <div>
                <div
                  className="ag-theme-alpine"
                  style={{height: correspOrder.gridHight, width: '100%', marginTop: -12}}
                >
                  <AgGridReact
                    columnDefs={getWorkOrderColumns()} // 定义列
                    rowData={correspOrder.gridData} // 数据绑定
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      suppressMenu: true,
                      cellStyle: {'line-height': '25px'},
                      minWidth: 90,
                    }}
                    headerHeight={25}
                    rowHeight={25}
                    onGridReady={onListGridReady}
                    onGridSizeChanged={onListGridReady}
                    onColumnEverythingChanged={onListGridReady}
                  >
                  </AgGridReact>
                </div>
              </div>
            </div>
          </div>
          <div style={{fontSize: 'smaller', marginTop: 10}}>
            注：根据预发布批次号每隔2分钟定时从运维平台同步一次相关工单信息
          </div>
        </fieldset>
      </div>

    </div>
  );
};

export default CorrespondingWorkOrder;
