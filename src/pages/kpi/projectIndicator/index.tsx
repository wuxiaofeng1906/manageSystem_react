import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {getProcessColumns} from './columns';
import {queryDatas} from './dataOperate';
import './styles.css';

const WeekCodeTableList: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDatas(gqlClient, "729"),
  );

  /* region  进度指标 */
  const processGridApi = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    processGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (processGridApi.current) {
    if (loading) processGridApi.current.showLoadingOverlay();
    else processGridApi.current.hideOverlay();
  }

  window.onresize = function () {
    processGridApi.current?.sizeColumnsToFit();
  };

  const processCellEdited = (params: any) => {

    console.log(params);

  };
  /* endregion */

  const setCellStyle = (params: any) => {
    if (params.column?.colId === "memo") {
      // let wordsAlign = "left";
      // if (params.value) {
      //   wordsAlign = "center"
      // }

      return {
        "line-height": "25px",
        "border-left": "1px solid lightgrey",
        // "text-align": wordsAlign,
        "background-color": 'white'
      }
    }

    // if (params.data?.milestone === "项目计划") {
    //   if (params.column?.colId !== "days" && params.column?.colId !== "ratio") {
    //     return {
    //       "line-height": "25px",
    //       "border-left": "1px solid lightgrey",
    //       "text-align": "center",
    //       "background-color": 'white'
    //     }
    //   }
    //
    // }
    return {
      "line-height": "32px",
      "border-left": "1px solid lightgrey",
      // "text-align": "center",
      "background-color": '#F8F8F8'
    }
  };

  return (
    <PageContainer style={{height: "100%"}}>
      <div style={{height: "600px", backgroundColor: "white"}}>
        <div className="ag-theme-alpine" style={{height: 250, width: '100%'}}>
          <AgGridReact
            columnDefs={getProcessColumns()} // 定义列
            rowData={data?.process} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: setCellStyle,
            }}
            rowHeight={32}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onGridReady}
            onCellEditingStopped={processCellEdited}

          >
          </AgGridReact>
        </div>
      </div>


    </PageContainer>
  )
    ;
};


export default WeekCodeTableList;
