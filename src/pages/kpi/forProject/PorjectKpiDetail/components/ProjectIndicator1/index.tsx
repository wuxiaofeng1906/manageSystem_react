import React, {useEffect, useRef} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "../gridStyle.less";
import {cellBorderStyle} from "@/publicMethods/agGrid/cellRenderer";
import {prjQualityColumn, testDataColumn, devUserColumn, testUserColumn} from "./gridMethod/gridColumn";
import {MAIN_LENGTH, MAX_LENGTH} from "../constant";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {Button, Popover, Avatar, Comment} from "antd";
import moment from 'moment';
import {queryProjectQualityload} from "./gridData";
import {useRequest} from "ahooks";
import {useGqlClient} from "@/hooks";
import {processQualityCellEdited} from "./gridData/gridEdit";
import {setProjectQualityCellStyle} from "./gridMethod/cellColor";

const ProjectIndicator1: React.FC<any> = (currentProject: any) => {
  const {
    browserHeight, prjQualityData, setPrjQualityData, testData,
    settestData, devUserData, setDevUserData, testUserData, setTestUserData,
  } = useModel('projectIndex.index');

  const projectId = currentProject.id;
  const gqlClient = useGqlClient();


  /* region 数据查询 */

  // 项目质量数据
  const projectQuaGridApi = useRef<GridApi>();
  const projectQualityDt: any = useRequest(() => queryProjectQualityload(gqlClient, projectId)).data;
  const testDataGridApi = useRef<GridApi>();
  const devUserGridApi = useRef<GridApi>();
  const testUserGridApi = useRef<GridApi>();

  useEffect(() => {

    if (projectQualityDt) {
      setPrjQualityData({
        ...prjQualityData,
        data: projectQualityDt,
        height: projectQualityDt.length * 32 + prjQualityData.basicHeight
      });
    }

    // settestData({
    //   ...testData,
    //   data: testDataData,
    //   height: testDataData.length * 32 + testData.basicHeight
    // });
    // setDevUserData({
    //   ...devUserData,
    //   data: devUserDataData,
    //   height: devUserDataData.length * 32 + devUserData.basicHeight
    // });
    // setTestUserData({
    //   ...testUserData,
    //   data: testUserDataData,
    //   height: testUserDataData.length * 32 + testUserData.basicHeight
    // });
  }, [projectQualityDt]);
  /* endregion 数据查询 */


  /* region 数据修改 */
  // 项目质量单元格修改
  const projectQuanlityEdtied = async (params: any) => {

    await processQualityCellEdited(params, projectId);
    // 刷新表格
    const prjQaliDt: any = await queryProjectQualityload(gqlClient, projectId);
    setPrjQualityData({
      ...prjQualityData,
      data: prjQaliDt,
      height: prjQaliDt.length * 32 + prjQualityData.basicHeight
    });
  };
  /* endregion 数据修改 */


  const content = (
    <Comment
      author="吴晓凤"
      avatar={<Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" alt="吴晓凤"/>}
      content={
        <div>
          <p>用:XXX</p>
          <p>替换了:XXX</p>
        </div>
      }
      datetime={
        <span>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    />
  );
  return (
    <div className="girdDiv" style={{height: browserHeight - 40}}>
      {/* region 项目质量 */}
      <div className="ag-theme-alpine" style={{height: prjQualityData.height, width: '100%'}}>
        <AgGridReact
          columnDefs={prjQualityColumn} // 定义列
          rowData={prjQualityData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setProjectQualityCellStyle
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          onGridReady={(params: GridReadyEvent) => {
            projectQuaGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => projectQuaGridApi.current?.sizeColumnsToFit()}
          onDisplayedColumnsChanged={() => projectQuaGridApi.current?.sizeColumnsToFit()}
          frameworkComponents={{
            codeRenderer: (props: any) => {
              if (props.data?.code_changed) {
                return (
                  <Popover content={content} title="修改记录" trigger="click" placement="right">
                    <Button type="link" style={{color: "orange"}}>{props.value}</Button>
                  </Popover>
                );
              }
              return props.value;
            },
          }}
          onCellEditingStopped={projectQuanlityEdtied}
          stopEditingWhenCellsLoseFocus={true}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 测试数据 */}
      <div className="ag-theme-alpine" style={{height: testData.height, width: '100%', display: "none"}}>
        <AgGridReact
          columnDefs={testDataColumn} // 定义列
          rowData={testData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: (params: any) => {
              const style = {
                ...cellBorderStyle,
                "line-height": "32px",
                "text-align": "center",
                "background-color": '#F8F8F8'
              }
              if (params.column?.colId === "description") {
                style["background-color"] = 'white';
                style["text-align"] = "left";
              }
              return style;
            }
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          onGridReady={(params: GridReadyEvent) => {
            testDataGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => testDataGridApi.current?.sizeColumnsToFit()}
          onDisplayedColumnsChanged={() => testDataGridApi.current?.sizeColumnsToFit()}

        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 开发人员数据 */}
      <div className="ag-theme-alpine" style={{height: devUserData.height, width: '100%', display: "none"}}>
        <AgGridReact
          columnDefs={devUserColumn} // 定义列
          rowData={devUserData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            minWidth: MAIN_LENGTH,
            maxWidth: MAX_LENGTH,
            cellStyle: (params: any) => {
              const style = {
                ...cellBorderStyle,
                "line-height": "32px",
                "text-align": "center",
                "background-color": '#F8F8F8'
              }
              if (params.column?.colId === "description" || params.column?.colId === "code") {
                style["background-color"] = 'white';
              }
              return style;
            }
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          onGridReady={(params: GridReadyEvent) => {
            devUserGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => devUserGridApi.current?.sizeColumnsToFit()}
          pagination={true}
          paginationPageSize={10}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

      {/* region 测试人员数据 */}
      <div className="ag-theme-alpine" style={{height: testUserData.height, width: '100%', display: "none"}}>
        <AgGridReact
          columnDefs={testUserColumn} // 定义列
          rowData={testUserData.data} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            minWidth: MAIN_LENGTH,
            maxWidth: MAX_LENGTH,
            cellStyle: (params: any) => {
              const style = {
                ...cellBorderStyle,
                "line-height": "32px",
                "text-align": "center",
                "background-color": '#F8F8F8'
              }
              if (params.column?.colId === "description") {
                style["background-color"] = 'white';
              }
              return style;
            }
          }}
          rowHeight={32}
          headerHeight={35}
          suppressRowTransform={true}
          onGridReady={(params: GridReadyEvent) => {
            testUserGridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={() => testUserGridApi.current?.sizeColumnsToFit()}
          pagination={true}
          paginationPageSize={10}
        >
        </AgGridReact>
      </div>
      {/* endregion */}

    </div>
  );
};


export default ProjectIndicator1;
