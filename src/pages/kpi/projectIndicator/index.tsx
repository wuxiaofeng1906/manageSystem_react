import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {getProcessColumns, getStoryStabilityColumns} from './columns';
import {queryDatas} from './dataOperate';
import {setProcessCellStyle, setStoryStabilityCellStyle} from './gridStyles';
import './styles.css';

const WeekCodeTableList: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDatas(gqlClient, "729"),
  );

  /* region  进度指标 */
  const processGridApi = useRef<GridApi>();

  const onProcessGridReady = (params: GridReadyEvent) => {
    processGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (processGridApi.current) {
    if (loading) processGridApi.current.showLoadingOverlay();
    else processGridApi.current.hideOverlay();
  }

  const processCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  /* region  需求稳定性 */
  const storyStabilityGridApi = useRef<GridApi>();

  const onStoryStabilityGridReady = (params: GridReadyEvent) => {
    storyStabilityGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (storyStabilityGridApi.current) {
    if (loading) storyStabilityGridApi.current.showLoadingOverlay();
    else storyStabilityGridApi.current.hideOverlay();
  }

  const storyStabilityCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  window.onresize = function () {
    processGridApi.current?.sizeColumnsToFit();
    storyStabilityGridApi.current?.sizeColumnsToFit();
  };

  return (
    <PageContainer style={{height: "100%"}}>
      <div>
        {/* 1.进度 */}
        <div className="ag-theme-alpine" style={{height: 250, width: '100%'}}>
          <AgGridReact
            columnDefs={getProcessColumns()} // 定义列
            rowData={data?.process} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setProcessCellStyle,
              // headerComponentParams: () => {
              //
              //   return {
              //     template:
              //       `
              //       <div ref="eLabel" class="ag-header-cell-label" role="presentation"  style="margin-left:50%">
              //           <span  ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
              //             <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
              //           <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
              //       </div>
              //   </div>`
              //   }
              // }
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onProcessGridReady}
            onCellEditingStopped={processCellEdited}
          >
          </AgGridReact>
        </div>

        {/* 2. 需求稳定性 */}
        <div className="ag-theme-alpine" style={{height: 190, width: '100%'}}>
          <AgGridReact
            columnDefs={getStoryStabilityColumns()} // 定义列
            rowData={data?.storyStability} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setStoryStabilityCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onStoryStabilityGridReady}
            onCellEditingStopped={storyStabilityCellEdited}
          >
          </AgGridReact>
        </div>
      </div>


    </PageContainer>
  );
};


export default WeekCodeTableList;
