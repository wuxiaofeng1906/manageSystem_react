import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {
  getProcessColumns, getStoryStabilityColumns, getStageWorkloadColumns,
  getProductRateColumns, getReviewDefectColumns, getProcessQualityColumns,
  getServiceColumns
} from './supplementFile/gridConfigure/columns';
import {
  processCellEdited, storyStabilityCellEdited, stageWorkloadCellEdited,
  reviewDefectCellEdited, productRateCellEdited, pocessQualityCellEdited,
  serviceCellEdited
} from './supplementFile/gridConfigure/gridEdit';
import {
  queryProcessData, queryStoryStability, queryStageWorkload,
  queryProductRateload, queryReviewDefect, queryProcessQuality,
  queryServices
} from './supplementFile/data/dataOperate';
import {
  setProcessCellStyle, setStoryStabilityCellStyle, setStageWorkloadCellStyle,
  setProductRateCellStyle, setReviewDefectCellStyle, setProcessQualityCellStyle,
  setServiceCellStyle
} from './supplementFile/style/gridStyles';
import './supplementFile/style/styles.css';
import {Button, PageHeader, Spin, Breadcrumb, message} from "antd";
import {
  getProcessHeaderStyle, getStoryStabilityHeaderStyle, getStageWorkloadHeaderStyle,
  getProductRateHeaderStyle, getReviewDefectHeaderStyle, getProcessQualityHeaderStyle,
  getServiceHeaderStyle
} from "./supplementFile/style/columsTitleRenderer";
import {CustomTooltip} from "./supplementFile/style/customTooltip";
import {ExportOutlined, ReloadOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {refreshProject} from './supplementFile/data/axiosRequest';


const WeekCodeTableList: React.FC<any> = (props: any) => {
  const projectId = props.location.query.id;
  const gqlClient = useGqlClient();
  const [loadState, setLoadState] = useState(false);

  /* region  进度指标 */
  const processData = useRequest(() => queryProcessData(gqlClient, projectId));
  const processGridApi = useRef<GridApi>();

  const onProcessGridReady = (params: GridReadyEvent) => {
    processGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (processGridApi.current) {
    if (processData.loading) processGridApi.current.showLoadingOverlay();
    else processGridApi.current.hideOverlay();
  }
  /* endregion */

  /* region  需求稳定性 */
  const storyStableData = useRequest(() => queryStoryStability(gqlClient, projectId));

  const storyStabilityGridApi = useRef<GridApi>();

  const onStoryStabilityGridReady = (params: GridReadyEvent) => {
    storyStabilityGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (storyStabilityGridApi.current) {
    if (storyStableData.loading) storyStabilityGridApi.current.showLoadingOverlay();
    else storyStabilityGridApi.current.hideOverlay();
  }

  /* endregion */

  /* region  阶段工作量 */
  const stageWorkCount = useRequest(() => queryStageWorkload(gqlClient, projectId));
  const stageWorkloadGridApi = useRef<GridApi>();

  const onStageWorkloadGridReady = (params: GridReadyEvent) => {
    stageWorkloadGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (stageWorkloadGridApi.current) {
    if (stageWorkCount.loading) stageWorkloadGridApi.current.showLoadingOverlay();
    else stageWorkloadGridApi.current.hideOverlay();
  }

  /* endregion */

  /* region  评审和缺陷 */
  const reviewDefect = useRequest(() => queryReviewDefect(gqlClient, projectId));

  const reviewDefectGridApi = useRef<GridApi>();

  const onReviewDefectGridReady = (params: GridReadyEvent) => {
    reviewDefectGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (reviewDefectGridApi.current) {
    if (reviewDefect.loading) reviewDefectGridApi.current.showLoadingOverlay();
    else reviewDefectGridApi.current.hideOverlay();
  }

  /* endregion */

  /* region  生产率 */
  const productRate = useRequest(() => queryProductRateload(gqlClient, projectId));

  const productRateGridApi = useRef<GridApi>();

  const onProductRateGridReady = (params: GridReadyEvent) => {
    productRateGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (productRateGridApi.current) {
    if (productRate.loading) productRateGridApi.current.showLoadingOverlay();
    else productRateGridApi.current.hideOverlay();
  }
  /* endregion */

  /* region  6 过程质量补充数据 */
  const processQuality = useRequest(() => queryProcessQuality(gqlClient, projectId));
  const processQualityGridApi = useRef<GridApi>();
  const onPocessQualityGridReady = (params: GridReadyEvent) => {
    processQualityGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (processQualityGridApi.current) {
    if (processQuality.loading) processQualityGridApi.current.showLoadingOverlay();
    else processQualityGridApi.current.hideOverlay();
  }
  /* endregion */

  /* region  7  服务 */
  const serviceData = useRequest(() => queryServices(gqlClient, projectId));
  const serviceGridApi = useRef<GridApi>();
  const onServiceGridReady = (params: GridReadyEvent) => {
    serviceGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (serviceGridApi.current) {
    if (serviceData.loading) serviceGridApi.current.showLoadingOverlay();
    else serviceGridApi.current.hideOverlay();
  }
  /* endregion */

  /* region 一键刷新 */
  const resetGridData = async () => {
    processGridApi.current?.setRowData(await queryProcessData(gqlClient, projectId));
    storyStabilityGridApi.current?.setRowData(await queryStoryStability(gqlClient, projectId));
    stageWorkloadGridApi.current?.setRowData(await queryStageWorkload(gqlClient, projectId));
    productRateGridApi.current?.setRowData(await queryProductRateload(gqlClient, projectId));
    reviewDefectGridApi.current?.setRowData(await queryReviewDefect(gqlClient, projectId));
    processQualityGridApi.current?.setRowData(await queryProcessQuality(gqlClient, projectId))
    serviceGridApi.current?.setRowData(await queryServices(gqlClient, projectId))
  };
  // 刷新表格
  const refreshGrid = async () => {
    setLoadState(true);
    const result = await refreshProject(projectId);
    if (result.flag) {
      await resetGridData();
    } else {
      message.error({
        content: result.errorMessage,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
    setLoadState(false);
  };
  /* endregion */

  window.onresize = function () {
    processGridApi.current?.sizeColumnsToFit();
    storyStabilityGridApi.current?.sizeColumnsToFit();
    stageWorkloadGridApi.current?.sizeColumnsToFit();
    productRateGridApi.current?.sizeColumnsToFit();
    reviewDefectGridApi.current?.sizeColumnsToFit();
    processQualityGridApi.current?.sizeColumnsToFit();
    serviceGridApi.current?.sizeColumnsToFit();
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
      serviceGridApi.current?.getSheetDataForExcel({sheetName: '服务'}),
    );

    processGridApi.current?.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: '项目指标.xlsx'
    });
  };
  // 页面顶部导航栏
  const breadcrumbItems = [
    <Breadcrumb.Item key="研发过程数据">研发过程数据</Breadcrumb.Item>,
    <Breadcrumb.Item key="研发过程数据">度量指标</Breadcrumb.Item>,
    <Breadcrumb.Item key="项目">
      <Link to="/kpi/performance/project/overview">项目</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="项目指标">项目指标</Breadcrumb.Item>];
  const COMMON_LENGTH = 130;

  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <PageHeader
        ghost={false}
        title={props.location.query.name}
        style={{height: "85px"}}
        breadcrumbRender={() => {
          return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
        }}
      />
      <Spin size="large" tip="数据加载中..." spinning={loadState}>
        <div>
          <div style={{marginTop: -35, height: 35}}>
            <Button type="text" icon={<ExportOutlined/>} onClick={exportAllExcell} size={'large'}
                    style={{float: "right"}}>导出</Button>
            <Button type="text" icon={<ReloadOutlined/>} onClick={refreshGrid} size={'large'}
                    style={{float: "right"}}>刷新</Button>
          </div>
          <div style={{marginTop: 5}}>

            {/* 1.进度 */}
            <div className="ag-theme-alpine" style={{height: 250, width: '100%'}}>
              <AgGridReact
                columnDefs={getProcessColumns()} // 定义列
                rowData={processData?.data} // 数据绑定
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
                onCellEditingStopped={async (params: any) => {
                  await processCellEdited(params, projectId);
                  processGridApi.current?.setRowData(await queryProcessData(gqlClient, projectId));
                }}
              >
              </AgGridReact>
            </div>

            {/* 2. 需求稳定性 */}
            <div className="ag-theme-alpine" style={{height: 190, width: '100%'}}>
              <AgGridReact
                columnDefs={getStoryStabilityColumns()} // 定义列
                rowData={storyStableData?.data} // 数据绑定
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
                onCellEditingStopped={async (params: any) => {
                  await storyStabilityCellEdited(params, projectId);
                  storyStabilityGridApi.current?.setRowData(await queryStoryStability(gqlClient, projectId));
                }}
              >
              </AgGridReact>
            </div>

            {/* 3.阶段工作量（单位：人天） */}
            <div className="ag-theme-alpine" style={{height: 250, width: '100%'}}>
              <AgGridReact
                columnDefs={getStageWorkloadColumns()} // 定义列
                rowData={stageWorkCount?.data} // 数据绑定
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
                onCellEditingStopped={async (params: any) => {
                  await stageWorkloadCellEdited(params, projectId);
                  stageWorkloadGridApi.current?.setRowData(await queryStageWorkload(gqlClient, projectId));
                }}
              >
              </AgGridReact>
            </div>

            {/* 4.生产率 */}
            <div className="ag-theme-alpine" style={{height: 140, width: '100%'}}>
              <AgGridReact
                columnDefs={getProductRateColumns()} // 定义列
                rowData={productRate?.data} // 数据绑定
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
                onCellEditingStopped={async (params: any) => {
                  await productRateCellEdited(params, projectId);
                  // 需要更新本表格和（评审和缺陷）的表格
                  productRateGridApi.current?.setRowData(await queryProductRateload(gqlClient, projectId));
                  reviewDefectGridApi.current?.setRowData(await queryReviewDefect(gqlClient, projectId));
                }}
              >
              </AgGridReact>
            </div>

            {/* 5.评审和缺陷 */}
            <div className="ag-theme-alpine" style={{height: 540, width: '100%'}}>
              <AgGridReact
                columnDefs={getReviewDefectColumns()} // 定义列
                rowData={reviewDefect?.data} // 数据绑定
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
                onCellEditingStopped={async (params: any) => {
                  await reviewDefectCellEdited(params, projectId);
                  reviewDefectGridApi.current?.setRowData(await queryReviewDefect(gqlClient, projectId))
                }}
              >
              </AgGridReact>
            </div>

            {/* 6 过程质量补充数据 */}
            <div className="ag-theme-alpine" style={{height: 380, width: '100%'}}>
              <AgGridReact
                columnDefs={getProcessQualityColumns()} // 定义列
                rowData={processQuality?.data} // 数据绑定
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
                getRowHeight={(params: any) => {
                  if (params.data?.cut === "一次提测通过率" || params.data?.realValue === "一次提测通过率") {
                    return 50;
                  }
                  return 32;
                }}
                headerHeight={35}
                rowHeight={32}
                suppressRowTransform={true}
                onGridReady={onPocessQualityGridReady}
                onCellEditingStopped={async (params: any) => {
                  await pocessQualityCellEdited(params, projectId);
                  processQualityGridApi.current?.setRowData(await queryProcessQuality(gqlClient, projectId))
                }}
              >
              </AgGridReact>
            </div>

            {/* 7 服务 */}
            <div className="ag-theme-alpine" style={{height: 90, width: '100%'}}>
              <AgGridReact
                columnDefs={getServiceColumns()} // 定义列
                rowData={serviceData?.data} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  suppressMenu: true,
                  cellStyle: setServiceCellStyle,
                  minWidth: COMMON_LENGTH,
                  maxWidth: COMMON_LENGTH,
                  headerComponentParams: getServiceHeaderStyle
                }}
                getRowHeight={(params: any) => {
                  if (params.data?.item === "一次发布成功率") {
                    return 50;
                  }
                  return 32;
                }}
                headerHeight={35}
                suppressRowTransform={true}
                onGridReady={onServiceGridReady}
                onCellEditingStopped={async (params: any) => {
                  await serviceCellEdited(params, projectId);
                  serviceGridApi.current?.setRowData(await queryServices(gqlClient, projectId))
                }}
              >
              </AgGridReact>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
    ;
};

export default WeekCodeTableList;
