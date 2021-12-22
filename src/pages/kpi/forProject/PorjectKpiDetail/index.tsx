import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {
  getProcessColumns,
  getStoryStabilityColumns,
  getStageWorkloadColumns,
  getProductRateColumns,
  getReviewDefectColumns,
  getProcessQualityColumns
} from './columns';
import {queryDatas} from './dataOperate';
import {
  setProcessCellStyle,
  setStoryStabilityCellStyle,
  setStageWorkloadCellStyle,
  setProductRateCellStyle,
  setReviewDefectCellStyle,
  setProcessQualityCellStyle
} from './gridStyles';
import './styles.css';
import {Button} from "antd";

const WeekCodeTableList: React.FC<any> = (props: any) => {

  debugger;
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDatas(gqlClient, props.location.query.id),
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

  /* region  阶段工作量 */
  const stageWorkloadGridApi = useRef<GridApi>();

  const onStageWorkloadGridReady = (params: GridReadyEvent) => {
    stageWorkloadGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (stageWorkloadGridApi.current) {
    if (loading) stageWorkloadGridApi.current.showLoadingOverlay();
    else stageWorkloadGridApi.current.hideOverlay();
  }

  const stageWorkloadCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  /* region  生产率 */
  const productRateGridApi = useRef<GridApi>();

  const onProductRateGridReady = (params: GridReadyEvent) => {
    productRateGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (productRateGridApi.current) {
    if (loading) productRateGridApi.current.showLoadingOverlay();
    else productRateGridApi.current.hideOverlay();
  }

  const productRateCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  /* region  评审和缺陷 */
  const reviewDefectGridApi = useRef<GridApi>();

  const onReviewDefectGridReady = (params: GridReadyEvent) => {
    reviewDefectGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (reviewDefectGridApi.current) {
    if (loading) reviewDefectGridApi.current.showLoadingOverlay();
    else reviewDefectGridApi.current.hideOverlay();
  }

  const reviewDefectCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  /* region  6 过程质量补充数据和7.服务 */
  const processQualityGridApi = useRef<GridApi>();

  const onPocessQualityGridReady = (params: GridReadyEvent) => {
    processQualityGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (processQualityGridApi.current) {
    if (loading) processQualityGridApi.current.showLoadingOverlay();
    else processQualityGridApi.current.hideOverlay();
  }

  const pocessQualityCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  window.onresize = function () {
    processGridApi.current?.sizeColumnsToFit();
    storyStabilityGridApi.current?.sizeColumnsToFit();
    stageWorkloadGridApi.current?.sizeColumnsToFit();
    productRateGridApi.current?.sizeColumnsToFit();
    reviewDefectGridApi.current?.sizeColumnsToFit();
    processQualityGridApi.current?.sizeColumnsToFit();
  };

  // 导出数据
  const exportAllExcell = () => {
    const spreadsheets: any = [];

    spreadsheets.push(
      processGridApi.current?.getSheetDataForExcel({sheetName: '进度'}),
      storyStabilityGridApi.current?.getSheetDataForExcel({sheetName: '需求稳定性'}),
      stageWorkloadGridApi.current?.getSheetDataForExcel({sheetName: '阶段工作量'}),
      productRateGridApi.current?.getSheetDataForExcel({sheetName: '生产率'}),
      reviewDefectGridApi.current?.getSheetDataForExcel({sheetName: '评审和缺陷'}),
      processQualityGridApi.current?.getSheetDataForExcel({sheetName: '过程质量补充数据和服务'}),
    );

    processGridApi.current?.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: '项目指标.xlsx'
    });
  };

  return (
    <PageContainer style={{height: "100%"}}>
      <div style={{marginTop: -20, height: 35}}>
        <Button
          style={{float: "right", borderRadius: 5}}
          onClick={exportAllExcell}>导出所有表格
        </Button>
      </div>

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

        {/* 3.阶段工作量（单位：人天） */}
        <div className="ag-theme-alpine" style={{height: 250, width: '100%'}}>
          <AgGridReact
            columnDefs={getStageWorkloadColumns()} // 定义列
            rowData={data?.stageWorkload} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setStageWorkloadCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onStageWorkloadGridReady}
            onCellEditingStopped={stageWorkloadCellEdited}
          >
          </AgGridReact>
        </div>

        {/* 4.生产率 */}
        <div className="ag-theme-alpine" style={{height: 130, width: '100%'}}>
          <AgGridReact
            columnDefs={getProductRateColumns()} // 定义列
            rowData={data?.productRate} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setProductRateCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onProductRateGridReady}
            onCellEditingStopped={productRateCellEdited}
          >
          </AgGridReact>
        </div>

        {/* 5.评审和缺陷 */}
        <div className="ag-theme-alpine" style={{height: 450, width: '100%'}}>
          <AgGridReact
            columnDefs={getReviewDefectColumns()} // 定义列
            rowData={data?.reviewDefect} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setReviewDefectCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onReviewDefectGridReady}
            onCellEditingStopped={reviewDefectCellEdited}
          >
          </AgGridReact>
        </div>

        {/* 6 过程质量补充数据和7.服务 */}
        <div className="ag-theme-alpine" style={{height: 300, width: '100%'}}>
          <AgGridReact
            columnDefs={getProcessQualityColumns()} // 定义列
            rowData={data?.processQuality} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setProcessQualityCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onPocessQualityGridReady}
            onCellEditingStopped={pocessQualityCellEdited}
          >
          </AgGridReact>
        </div>
      </div>


    </PageContainer>
  );
};


export default WeekCodeTableList;
