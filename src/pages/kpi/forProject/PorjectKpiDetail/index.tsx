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
  getProcessColumns, getStoryStabilityColumns, getStageWorkloadColumns,
  getProductRateColumns, getReviewDefectColumns, getProcessQualityColumns
} from './supplementFile/gridConfigure/columns';
import {
  processCellEdited,
  storyStabilityCellEdited,
  stageWorkloadCellEdited,
  reviewDefectCellEdited,
  productRateCellEdited,
  pocessQualityCellEdited
} from './supplementFile/gridConfigure/gridEdit';
import {queryDatas, queryReviewDefect, queryStageWorkload} from './supplementFile/data/dataOperate';
import {
  setProcessCellStyle, setStoryStabilityCellStyle, setStageWorkloadCellStyle,
  setProductRateCellStyle, setReviewDefectCellStyle, setProcessQualityCellStyle
} from './supplementFile/style/gridStyles';
import './supplementFile/style/styles.css';
import {Button, message} from "antd";
import {
  getProcessHeaderStyle, getStoryStabilityHeaderStyle, getStageWorkloadHeaderStyle,
  getProductRateHeaderStyle, getReviewDefectHeaderStyle, getProcessQualityHeaderStyle
} from "./supplementFile/style/columsTitleRenderer";
import {updateGridContent} from "./supplementFile/data/axiosRequest";
import {CustomTooltip} from "./supplementFile/style/customTooltip"

const WeekCodeTableList: React.FC<any> = (props: any) => {
  const projectId = props.location.query.id;

  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDatas(gqlClient, projectId),);

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

  const COMMON_LENGTH = 130;

  return (
    <PageContainer style={{height: "100%", marginTop: -30}}>
      <div style={{marginTop: -55, height: 35}}>
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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getProcessHeaderStyle,
            }}
            components={{customTooltip: CustomTooltip}}
            tooltipShowDelay={100}  // 鼠标放上去多久显示提示信息
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onProcessGridReady}
            onCellEditingStopped={(params: any) => {
              return processCellEdited(params, projectId);
            }}
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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getStoryStabilityHeaderStyle
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onStoryStabilityGridReady}
            onCellEditingStopped={(params: any) => {
              return storyStabilityCellEdited(params, projectId);
            }}
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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getStageWorkloadHeaderStyle
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onStageWorkloadGridReady}
            onCellEditingStopped={(params: any) => {
              return stageWorkloadCellEdited(params, projectId);
            }}
          >
          </AgGridReact>
        </div>

        {/* 4.生产率 */}
        <div className="ag-theme-alpine" style={{height: 140, width: '100%'}}>
          <AgGridReact
            columnDefs={getProductRateColumns()} // 定义列
            rowData={data?.productRate} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setProductRateCellStyle,
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getProductRateHeaderStyle
            }}
            getRowHeight={(params: any) => {
              if (params.data?.stage === "生产率(功能点/人天）") {
                return 50;
              }
              return 32;
            }}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onProductRateGridReady}
            onCellEditingStopped={(params: any) => {
              return productRateCellEdited(params, projectId);
            }}
          >
          </AgGridReact>
        </div>

        {/* 5.评审和缺陷 */}
        <div className="ag-theme-alpine" style={{height: 440, width: '100%'}}>
          <AgGridReact
            columnDefs={getReviewDefectColumns()} // 定义列
            rowData={data?.reviewDefect} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setReviewDefectCellStyle,
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getReviewDefectHeaderStyle
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onReviewDefectGridReady}
            onCellEditingStopped={(params: any) => {
              return reviewDefectCellEdited(params, projectId);
            }}
          >
          </AgGridReact>
        </div>

        {/* 6 过程质量补充数据 */}
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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getProcessQualityHeaderStyle
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onPocessQualityGridReady}
            onCellEditingStopped={(params: any) => {
              return pocessQualityCellEdited(params, projectId);
            }}
          >
          </AgGridReact>
        </div>
      </div>


    </PageContainer>
  );
};


export default WeekCodeTableList;
