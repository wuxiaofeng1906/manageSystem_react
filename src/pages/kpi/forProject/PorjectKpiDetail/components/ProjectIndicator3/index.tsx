import React, {useEffect, useRef} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "../gridStyle.less";
import {milestoneColums, storyStabilityColums} from "./gridMethod/gridColumn";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {useRequest} from "ahooks";
import {queryProcessData, queryStoryStability} from "./gridData/index";
import {useGqlClient} from "@/hooks";
import {setProcessCellStyle, setStoryStabilityCellStyle} from "./gridMethod/cellColor";
import {CustomTooltip} from "@/publicMethods/agGrid/customizeTooltip";
import {processCellEdited, storyStabilityCellEdited} from "./gridData/gridEdit";
import {DatePicker} from "antd";
import * as moment from "moment";

const ProjectIndicator3: React.FC<any> = (currentProject: any) => {
  const {
    browserHeight, milesProcessData, setMilesProcessData, pivotalTimeData, setPivotalTimeData,
    storyStabilityData, setStoryStabilityData, bugPercentPData, setBugPercentPData
  } = useModel('projectIndex.index');
  const projectId = currentProject.id;
  const gqlClient = useGqlClient();

  /* region 数据查询 */

  // 里程碑进度
  const milestoneGridApi = useRef<GridApi>();
  const milestoneDt: any = useRequest(() => queryProcessData(gqlClient, projectId)).data;

  // 关键活动时间点
  const prvTimeGridApi = useRef<GridApi>();
  const prvTimDt: any = useRequest(() => queryProcessData(gqlClient, projectId)).data;

  // 需求稳定性
  const storyStbiGridApi = useRef<GridApi>();
  const storyStbiDt: any = useRequest(() => queryStoryStability(gqlClient, projectId)).data;

  // Bug模块占比
  const bugPercentDt: any = useRequest(() => queryStoryStability(gqlClient, projectId)).data;

  useEffect(() => {
    // 里程碑
    setMilesProcessData({
      ...milesProcessData,
      data: milestoneDt,
      height: milestoneDt?.length * 32 + milesProcessData.basicHeight
    });

    // 关键活动时间点
    setPivotalTimeData({
      ...pivotalTimeData,
      data: prvTimDt,
      height: prvTimDt?.length * 32 + pivotalTimeData.basicHeight
    });

    // 需求稳定性
    setStoryStabilityData({
      ...storyStabilityData,
      data: storyStbiDt,
      height: storyStbiDt?.length * 32 + storyStabilityData.basicHeight
    });

    // Bug模块占比
    setBugPercentPData({
      data: bugPercentDt
    })
  }, [milestoneDt, prvTimDt, storyStbiDt]);

  /* endregion 数据查询 */

  /* region 数据修改 */

  // 里程碑进度
  const milestoneProcessEdited = async (params: any) => {
    await processCellEdited(params, projectId);
    const mileProcessDt: any = await queryProcessData(gqlClient, projectId);
    setMilesProcessData({
      ...milesProcessData,
      data: mileProcessDt,
      height: mileProcessDt?.length * 32 + mileProcessDt.basicHeight
    });
  }
  /* endregion 数据修改 */
  return (
    <div className="girdDiv" style={{height: browserHeight - 40}}>

      {/* region 里程碑进度 */}
      <div className="ag-theme-alpine" style={{height: milesProcessData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={milestoneColums}
          rowData={milesProcessData.data}
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setProcessCellStyle,
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          tooltipShowDelay={100}  // 鼠标放上去多久显示提示信息
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            milestoneGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => milestoneGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={milestoneProcessEdited}
          frameworkComponents={{
            cellTimeRenderer: (props: any) => {
              if (props.data?.milestone === "项目计划") {
                let defTime: any;
                if (props.value && props.value !== "0000-00-00") {
                  defTime = moment(props.value);
                }
                return (
                  <DatePicker size={'small'} bordered={false} style={{width: '90%', marginLeft: 20}}
                              placeholder={""} suffixIcon={null} allowClear={false} defaultValue={defTime}
                              onChange={(params: any, newTime: string) => {
                                console.log(newTime);
                                // 修改功能暂未开放
                                // milestoneProcessEdited({
                                //   newValue: newTime,
                                //   kind: props.data?.milestone
                                // });

                              }}/>
                );
              }
              return props.value === "0000-00-00" ? "" : props.value;
            },
          }}
        >

        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 关键活动时间点 */}
      <div className="ag-theme-alpine" style={{height: pivotalTimeData.height, width: '100%', display: "none"}}>
        <AgGridReact
          columnDefs={[]} // 定义列
          rowData={pivotalTimeData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            // minWidth: MAIN_LENGTH,
            // maxWidth: MAX_LENGTH,
            cellStyle: {}
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          onGridReady={(params: GridReadyEvent) => {
            prvTimeGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => prvTimeGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            console.log(params);
          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 需求稳定性 */}
      <div className="ag-theme-alpine" style={{height: storyStabilityData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={storyStabilityColums} // 定义列
          rowData={storyStabilityData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            // minWidth: MAIN_LENGTH,
            // maxWidth: MAX_LENGTH,
            cellStyle: setStoryStabilityCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          components={{customTooltip: CustomTooltip}}
          onGridReady={(params: GridReadyEvent) => {
            storyStbiGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => storyStbiGridApi.current?.sizeColumnsToFit()}
          onCellEditingStopped={async (params: any) => {
            await storyStabilityCellEdited(params, projectId);
            const stbDt = await queryStoryStability(gqlClient, projectId);
            setStoryStabilityData({
              ...storyStabilityData,
              data: stbDt,
              height: stbDt?.length * 32 + storyStabilityData.basicHeight
            });
          }}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

    </div>
  );
};

export default ProjectIndicator3;
