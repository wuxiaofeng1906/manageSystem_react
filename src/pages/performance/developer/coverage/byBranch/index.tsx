import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import * as dayjs from 'dayjs';
import {Button, Drawer} from "antd";
import {QuestionCircleTwoTone} from "@ant-design/icons";

const queryBranchViews = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
    {
      fileCovers
      {
          side
          branch
          reportDate
          project
          instCove
          branCove
          createAt
      }
    }
    `);
  return data?.fileCovers;
};

// 日期渲染（加上latest）
function dateCellRenderer(params: any) {
  const times: any = params.value;
  const currentTime: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  if (times <= currentTime) {
    return ` <span><span>  ${times} </span> <span style='color: darkorange'> (latest) </span></span>`;
  }
  return ` <span>  ${times} </span>`;
}

// 区分前端或者后端
function sideCellRenderer(params: any) {
  const module = params.value;
  let cModule = '';
  if (module === 'BACKEND') {
    cModule = '后端';
  }
  if (module === 'FRONT') {
    cModule = '前端';
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

const BranchTableList: React.FC<any> = () => {

  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryBranchViews(gqlClient));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* region 提示规则显示 */
  const [messageVisible, setVisible] = useState(false);
  const showRules = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const cssIndent = {textIndent: '2em'};
  /* endregion */

  return (
    <PageContainer>
      <div style={{background: 'white'}}>
        <Button type="text" style={{color: 'black'}} size={'large'}></Button>
        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<QuestionCircleTwoTone/>}
                size={'large'} onClick={showRules}>计算规则</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: 570, width: '100%'}}>
        <AgGridReact
          rowData={data}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
            cellStyle: {"margin-top": "-5px"}
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          rowHeight={32}
          headerHeight={35}
          suppressDragLeaveHidesColumns
          suppressMakeColumnVisibleAfterUnGroup
          // rowGroupPanelShow="always"
          onGridReady={onGridReady}
        >
          <AgGridColumn
            field="side"
            headerName="技术侧"
            maxWidth={100}
            enableRowGroup
            cellRenderer={sideCellRenderer}
          />
          <AgGridColumn field="branch" headerName="分支名" width={200}/>
          <AgGridColumn field="reportDate" headerName="日期" cellRenderer={dateCellRenderer}/>
          <AgGridColumn
            field="instCove"
            headerName="结构覆盖率"
            // type="numericColumn"
            cellRenderer={coverageCellRenderer}
          />
          <AgGridColumn
            field="branCove"
            headerName="分支覆盖率"
            // type="numericColumn"
            cellRenderer={coverageCellRenderer}
          />
          <AgGridColumn
            field="createAt"
            headerName="扫描时间"
          />

        </AgGridReact>
      </div>

      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：覆盖率为当周最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按月统计：覆盖率为当月最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按季统计：覆盖率为当季度最新的覆盖率(累计)；</p>
          <p><strong>2.统计公式说明</strong></p>
          <p style={cssIndent}>结构覆盖率 = 所拥有文件结构覆盖数之和/所有拥有文件总结构数之和； </p>
          <p style={cssIndent}>分支覆盖率 = 所拥有文件分支覆盖数之和/所有拥有文件总分支数之和； </p>
          <p><strong>3.取值方式</strong></p>
          <p style={cssIndent}>前端：结构数：Statements 分支数：Branches；</p>
          <p style={cssIndent}>后端：结构数：Instructions Cov 分支数：Branches；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default BranchTableList;
