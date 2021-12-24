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
} from './supplementFile/columns';
import {queryDatas, queryReviewDefect} from './supplementFile/dataOperate';
import {
  setProcessCellStyle,
  setStoryStabilityCellStyle,
  setStageWorkloadCellStyle,
  setProductRateCellStyle,
  setReviewDefectCellStyle,
  setProcessQualityCellStyle
} from './supplementFile/gridStyles';
import './supplementFile/styles.css';
import {Button, message} from "antd";
import {
  getProcessHeaderStyle,
  getStoryStabilityHeaderStyle,
  getStageWorkloadHeaderStyle,
  getProductRateHeaderStyle,
  getReviewDefectHeaderStyle,
  getProcessQualityHeaderStyle
} from "./supplementFile/columsTitleRenderer";

import {updateGridContent} from "./supplementFile/axiosRequest";
import {CustomTooltip} from "./supplementFile/customTooltip"

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

  const processCellEdited = async (params: any) => {

    // 有数据变化时再进行修改请求
    if (params.newValue !== params.oldValue) {
      const type = params.data?.milestone;
      const correspondingField = {
        "需求": "storyplan",
        "概设&计划": "designplan",
        "开发": "devplan",
        "测试": "testplan",
        "发布": "releaseplan",
        "项目计划": "projectplan",
      };
      const newValues = {
        "category": "progressDeviation",
        "column": "memo",
        "newValue": params.newValue,
        "projects": [projectId],
        "types": [correspondingField[type]]
      };

      const result = await updateGridContent(newValues);

      if (!result) {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }
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

  const stageWorkloadCellEdited = async (params: any) => {

    // 有数据变化时再进行修改请求
    if (params.newValue !== params.oldValue) {
      const type = params.data?.stage;
      const correspondingField = {
        "需求": "storyplan",
        "概设&计划": "designplan",
        "开发": "devplan",
        "测试": "testplan",
        "发布": "releaseplan",
        "总计": "",
      };

      const newValues = {
        "category": "stageWorkload",
        "column": params.column?.colId,
        "newValue": params.newValue,
        "projects": [projectId],
        "types": [correspondingField[type]]
      };

      const result = await updateGridContent(newValues);

      if (!result) {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }

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

  const reviewDefectCellEdited = async (params: any) => {
    const type = params.data?.kind;

    enum typeObject {
      "需求预审" = 1, "需求评审", "UE评审", "概设评审", "详设评审",
      "用例评审", "CodeReview", "提测演示", "集成测试", "系统测试",
      "发布测试"
    }

    if (params.newValue !== params.oldValue) {

      const newValues = {
        "category": "reviewDefect",
        "column": "",
        "newValue": 0,
        "projects": [projectId],
        "types": [typeObject[type]]
      };

      if (params.column?.colId === "reviewHour") {
        newValues.column = "extra";
        newValues.newValue = params.newValue;
      } else {
        newValues.column = "cut";
        newValues.newValue = params.newValue === "否" ? 0 : 1;
      }


      const result = await updateGridContent(newValues);

      if (!result) {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }

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

  const productRateCellEdited = async (params: any) => {

    if (params.newValue !== params.oldValue) {
      const newValues = {
        "category": "scaleProductivity",
        "column": params.column?.colId,
        "newValue": params.newValue,
        "projects": [projectId],
      };

      const result = await updateGridContent(newValues);

      if (!result) {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });


        // 需要更新评审和缺陷的表格

        const newDatas = await queryReviewDefect(gqlClient, projectId);

        reviewDefectGridApi.current?.setRowData(newDatas);
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }

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

  const pocessQualityCellEdited = async (params: any) => {

    const type = params.data?.kind;

    enum typeObject {
      "Bug解决时长" = 1, "Reopen率", "Bug回归时长", "加权遗留缺陷", "加权遗留缺陷密度",
      "后端单元测试覆盖率", "前端单元测试覆盖率"
    }

    if (params.newValue !== params.oldValue) {

      const newValues = {
        "category": "processQuality",
        "column": "cut",
        "newValue": params.newValue === "否" ? 0 : 1,
        "projects": [projectId],
        "types": [typeObject[type]]
      };

      const result = await updateGridContent(newValues);

      if (!result) {
        message.info({
          content: "修改成功！",
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      } else {
        message.error({
          content: result,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
    }

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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getStoryStabilityHeaderStyle
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
        <div className="ag-theme-alpine" style={{height: 280, width: '100%'}}>
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
            onCellEditingStopped={stageWorkloadCellEdited}
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
            onCellEditingStopped={productRateCellEdited}
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
              minWidth: COMMON_LENGTH,
              maxWidth: COMMON_LENGTH,
              headerComponentParams: getProcessQualityHeaderStyle
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
