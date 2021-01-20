import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import * as dayjs from 'dayjs';


const queryBranchViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
    {
      fileCovers(side:ALL)
      {
          id
          side
          branch
          reportDate
          project
          instCove
          branCove
      }
    }
    `
  );
  return data?.fileCovers;
};

// 日期渲染（加上latest）
function dateCellRenderer(params: any) {
  const times: any = params.value;
  const currentTime: string = dayjs().subtract(1, 'day').format("YYYY-MM-DD");
  if (times < currentTime) {
    return ` <span><span>  ${times} </span> <span style='color: darkorange'> (latest) </span></span>`;
  }
  return ` <span>  ${times} </span>`;
}

// 区分前端或者后端
function sideCellRenderer(params: any) {
  const module = params.value;
  let cModule = "";
  if (module === "BACKEND") {
    cModule = "后端";
  }
  if (module === "FRONT") {
    cModule = "前端";
  }
  return ` <span> ${cModule}</span>`;
}

// 值为0显示为蓝色
function coverageCellRenderer(params: any) {
  let values: number = 0;
  if (params.value === '' || params.value == null) {
    values = 0;
  } else {
    values = params.value;
  }
  if (values === 0) {
    return ` <span style="color: dodgerblue">  ${values} </span> `;
  }
  return values.toString();
}

const TableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryBranchViews(gqlClient),
  );


  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  return (
    <PageContainer>
      <div className="ag-theme-alpine" style={{height: 700, width: '100%'}}>
        <AgGridReact
          rowData={data}
          defaultColDef={{
            resizable: true,
            sortable: true,
            floatingFilter: true,
            // filter: "agTextColumnFilter",
            filter: true,
            flex: 1,
            minWidth: 100,
            cellStyle: {"text-align": "left"}  //
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          // rowHeight={35}
          // headerHeight={35}
          suppressDragLeaveHidesColumns
          suppressMakeColumnVisibleAfterUnGroup
          rowGroupPanelShow="always"
          onGridReady={onGridReady}
        >
          <AgGridColumn field="side" headerName="技术侧" enableRowGroup cellRenderer={sideCellRenderer}/>
          <AgGridColumn field="branch" headerName="分支名"/>
          <AgGridColumn field="reportDate" headerName="日期" cellRenderer={dateCellRenderer}/>
          <AgGridColumn
            field="instCove"
            headerName="结构覆盖率"
            type="numericColumn"
            cellRenderer={coverageCellRenderer}
          />
          <AgGridColumn
            field="branCove"
            headerName="分支覆盖率"
            type="numericColumn"
            cellRenderer={coverageCellRenderer}
          />
        </AgGridReact>
      </div>
    </PageContainer>
  );
};

export default TableList;
