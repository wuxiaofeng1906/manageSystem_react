import React, {useEffect, useRef} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "../gridStyle.less";
import {
  stageWorkloadColumn, StageWorkloadColums, reviewDefectColums, processQualityColums, serviceColums
} from "./gridMethod/gridColumn";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {useRequest} from "ahooks";
import {
  queryStageWorkload, queryProductRateload, queryReviewDefect, queryProcessQuality, queryServices
} from "./gridData/index";
import {useGqlClient} from "@/hooks";
import {
  setStageWorkloadCellStyle, setProductRateCellStyle, setReviewDefectCellStyle,
  setProcessQualityCellStyle, setServiceCellStyle
} from "./gridMethod/cellColor";
import {CustomTooltip} from "@/publicMethods/agGrid/customizeTooltip";
import {
  stageWorkloadCellEdited, reviewDefectCellEdited, productRateCellEdited,
  pocessQualityCellEdited, serviceCellEdited
} from "./gridData/gridEdit";
import {Select} from "antd";

const {Option} = Select;
const ProjectIndicator2: React.FC<any> = (currentProject: any) => {
  const {
    browserHeight, stageWorkloadData, setStageWorkloadData,
    productCapacityData, setProductCapacityData, reviewDefectData, setReviewDefectData,
    processQualityData, setProcessQualityData, serviceData, setServiceData
  } = useModel('projectIndex.index');
  const projectId = currentProject.id;
  const gqlClient = useGqlClient();

  /* region 数据查询 */

  // 阶段工作量
  const stageWorkloadGridApi = useRef<GridApi>();
  const stageWorkCountDt: any = useRequest(() => queryStageWorkload(gqlClient, projectId)).data;

  // 产能
  const productCapacityGridApi = useRef<GridApi>();
  const productCapacityDt: any = useRequest(() => queryProductRateload(gqlClient, projectId)).data;

  // 评审和缺陷
  const reviewDefectGridApi = useRef<GridApi>();
  const reviewDefectDt: any = useRequest(() => queryReviewDefect(gqlClient, projectId)).data;

  // 过程质量补充数据
  const processQualityGridApi = useRef<GridApi>();
  const processQualityDt: any = useRequest(() => queryProcessQuality(gqlClient, projectId)).data;

  // 服务
  const serviceGridApi = useRef<GridApi>();
  const serviceDt: any = useRequest(() => queryServices(gqlClient, projectId)).data;


  useEffect(() => {

    setStageWorkloadData({
      ...stageWorkloadData,
      data: stageWorkCountDt,
      height: stageWorkCountDt?.length * 32 + stageWorkloadData.basicHeight
    });

    setProductCapacityData({
      ...productCapacityData,
      data: productCapacityDt,
      height: productCapacityDt?.length * 32 + productCapacityData.basicHeight
    });

    setReviewDefectData({
      ...reviewDefectData,
      data: reviewDefectDt,
      height: reviewDefectDt?.length * 32 + reviewDefectData.basicHeight
    });

    setProcessQualityData({
      ...processQualityData,
      data: processQualityDt,
      height: processQualityDt?.length * 32 + processQualityData.basicHeight
    });

    setServiceData({
      ...serviceData,
      data: serviceDt,
      height: serviceDt?.length * 32 + serviceData.basicHeight
    });

  }, [stageWorkCountDt, productCapacityDt, reviewDefectDt, processQualityDt, serviceDt]);

  /* endregion 数据查询 */

  /* region 表格数据修改 */

  // 评审缺陷问题
  const reviewDefectEdited = async (params: any, modifyField: string = "") => {

    await reviewDefectCellEdited(params, projectId, modifyField);
    // 刷新数据
    const reviewDt: any = await queryReviewDefect(gqlClient, projectId);
    setReviewDefectData({
      ...reviewDefectData,
      data: reviewDt,
      height: reviewDt?.length * 32 + reviewDefectData.basicHeight
    });
  };

  // 过程质量补充数据
  const processQqualityEdited = async (params: any, modifyField: string = "") => {
    await pocessQualityCellEdited(params, projectId,modifyField);

    // 更新数据
    const processDt: any = await queryProcessQuality(gqlClient, projectId);
    setProcessQualityData({
      ...processQualityData,
      data: processDt,
      height: processDt?.length * 32 + processQualityData.basicHeight
    });
  };
  /* endregion 表格数据修改 */

  return (
    <div className="girdDiv" style={{height: browserHeight - 40}}>

      {/* region 阶段工作量（单位：人天） */}
      <div className="ag-theme-alpine" style={{height: stageWorkloadData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={stageWorkloadColumn} // 定义列
          rowData={stageWorkloadData.data} // 数据绑定  stageWorkCountDt stageWorkloadData.data
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setStageWorkloadCellStyle,
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            stageWorkloadGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => stageWorkloadGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            await stageWorkloadCellEdited(params, projectId);
            const stage = await queryStageWorkload(gqlClient, projectId);
            setStageWorkloadData({
              ...stageWorkloadData,
              data: stage,
              height: stage.length * 32 + stageWorkloadData.basicHeight
            });
            const product: any = await queryProductRateload(gqlClient, projectId);
            // 在阶段工作量-合计的计划工作量和实际工作量产生新的值的时候，生产率可以同步进行刷新。
            setProductCapacityData({
              ...productCapacityData,
              data: product,
              height: product?.length * 32 + productCapacityData.basicHeight
            });
          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 产能 */}
      <div className="ag-theme-alpine" style={{height: productCapacityData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={StageWorkloadColums} // 定义列
          rowData={productCapacityData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setProductRateCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            productCapacityGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          getRowHeight={(params: any) => {
            if (params.data?.stage === "生产率(功能点/人天）") {
              return 50;
            }
            return 32;
          }}
          onGridSizeChanged={() => productCapacityGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            await productRateCellEdited(params, projectId);
            // 需要更新本表格和（评审和缺陷）的表格
            const pdRate: any = await queryProductRateload(gqlClient, projectId)
            setProductCapacityData({
              ...productCapacityData,
              data: pdRate,
              height: pdRate?.length * 32 + productCapacityData.basicHeight
            });
            const reviewDt: any = await queryReviewDefect(gqlClient, projectId)
            setReviewDefectData({
              ...reviewDefectData,
              data: reviewDt,
              height: reviewDt?.length * 32 + reviewDefectData.basicHeight
            });
          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 评审和缺陷 */}
      <div className="ag-theme-alpine" style={{height: reviewDefectData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={reviewDefectColums} // 定义列
          rowData={reviewDefectData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setReviewDefectCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            reviewDefectGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => reviewDefectGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            reviewDefectEdited(params);
          }}
          frameworkComponents={{
            reviewCutRenderer: (props: any) => {
              if (props.value === "是否裁剪") {
                return (<label style={{fontWeight: "bold"}}>{props.value}</label>);
              }
              const defaultValues = props.value === true ? "是" : "否";
              return (
                <Select size={'small'} defaultValue={defaultValues}
                        bordered={false} style={{width: '120%'}}
                        onChange={(values: any) => {
                          reviewDefectEdited({newValue: values, kind: props.data?.kind}, "cut")
                        }}>
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              );
            },

          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 过程质量补充数据 */}
      <div className="ag-theme-alpine" style={{height: processQualityData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={processQualityColums} // 定义列
          rowData={processQualityData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setProcessQualityCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          components={{customTooltip: CustomTooltip}}
          getRowHeight={(params: any) => {
            if (params.data?.cut === "一次提测通过率") {
              return 50;
            }
            return 32;
          }}
          onGridReady={(params: GridReadyEvent) => {
            processQualityGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => processQualityGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={processQqualityEdited}
          frameworkComponents={{
            processQuaCutRenderer: (props: any) => {
              if (props.value === "度量值") {
                return (<label style={{fontWeight: "bold"}}>{props.value}</label>);
              }
              if (props.value === "一次提测通过率") {
                return (<label>{props.value}</label>);
              }

              const defaultValues = props.value === true ? "是" : "否";
              return (
                <Select size={'small'} defaultValue={defaultValues}
                        bordered={false} style={{width: '120%'}}
                        onChange={(values: any) => {
                          processQqualityEdited({newValue: values, kind: props.data?.kind}, "cut")
                        }}>
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>
              );
            },

          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 服务 */}
      <div className="ag-theme-alpine" style={{height: serviceData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={serviceColums} // 定义列
          rowData={serviceData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setServiceCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          getRowHeight={(params: any) => {
            if (params.data?.item === "一次发布成功率") {
              return 50;
            }
            return 32;
          }}
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            serviceGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => serviceGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            await serviceCellEdited(params, projectId);
            const servicesDt: any = await queryServices(gqlClient, projectId);
            setServiceData({
              ...serviceData,
              data: servicesDt,
              height: servicesDt?.length * 32 + serviceData.basicHeight
            });
          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

    </div>
  );
};

export default ProjectIndicator2;
