import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {Button, Drawer} from "antd";
import {
  ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone, AppstoreTwoTone
} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";
import {columsForWeeks, columsForMonths, columsForQuarters, columsForYears} from "./gridConfigure/columns";
import {queryDevDefectExcRate} from "./gridConfigure/data";

const BugRateTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDevDefectExcRate(gqlClient, 'quarter'),
  );
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    // console.log("新高度：", getHeight());
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion */

  /* region 按钮事件 */
  // 按周统计
  const statisticsByWeeks = async () => {
    /* 八周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryDevDefectExcRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryDevDefectExcRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryDevDefectExcRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearsColums = columsForYears();
    gridApi.current?.setColumnDefs(yearsColums);
    const datas: any = await queryDevDefectExcRate(gqlClient, 'year');
    gridApi.current?.setRowData(datas);
  };

  /* endregion */

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
        <Button type="text" style={{color: 'black'}} icon={<ProfileTwoTone/>} size={'large'}
                onClick={statisticsByWeeks}>按周统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<CalendarTwoTone/>} size={'large'}
                onClick={statisticsByMonths}>按月统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<ScheduleTwoTone/>} size={'large'}
                onClick={statisticsByQuarters}>按季统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<AppstoreTwoTone/>} size={'large'}
                onClick={statisticsByYear}>按年统计</Button>
        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<QuestionCircleTwoTone/>}
                size={'large'} onClick={showRules}>计算规则</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columsForQuarters()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            suppressMenu: true
          }}
          autoGroupColumnDef={{
            minWidth: 280,
            headerName: '部门-人员',
            cellRendererParams: {suppressCount: true},
            pinned: 'left',
            suppressMenu: false
          }}

          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
          treeData={true}
          animateRows={true}
          groupDefaultExpanded={-1}
          getDataPath={(source: any) => {
            return source.Group;
          }}
        >
        </AgGridReact>
      </div>

      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>一、统计周期</strong></p>
          <p style={cssIndent}>按周、按月、按季、按年统计（查bug创建日期，落在对应区间的；周/月/季/年的规则参考2021年度量指标的规则）；</p>

          <p style={{color: "#1890FF"}}><strong>二、计算公式说明</strong></p>
          <p style={cssIndent}> 开发缺陷排除率 = 开发自测加权bug数/（开发自测加权bug数 + 测试发现加权bug数）；</p>
          <p> 1.分子：开发自测加权bug数的bug范围。 </p>
          <p style={cssIndent}>（1）bug创建人是开发；</p>
          <p style={cssIndent}>（2）bug来源是'概设评审、详设评审、CodeReview、开发自测、开发联调、内部演示、外部演示’；</p>
          <p style={cssIndent}>（3）解决方案为“空”“已解决”“延期处理”“后续版本”“转为需求”的；</p>
          <p style={cssIndent}>（4）且线上bug类型为‘空’；</p>
          <p style={cssIndent}>（5）bug加权取bug严重程度 = 1*5+2*2+3*1+4*0.1；</p>

          <p> 2.分母：开发自测加权bug数取上面分子的结果，测试发现加权bug数的bug范围。 </p>
          <p style={cssIndent}>（1）bug创建人是测试；</p>
          <p style={cssIndent}>（2）bug来源是'系统测试、提测演示、测试环境自动化发现'；</p>
          <p style={cssIndent}>（3）解决方案为“空”“已解决”“延期处理”“后续版本”“转为需求”“代码未合并”的；</p>
          <p style={cssIndent}>（4）且线上bug类型为‘空’；</p>
          <p style={cssIndent}>（5）bug加权取bug严重程度 = 1*5+2*2+3*1+4*0.1；</p>

        </Drawer>
      </div>
    </PageContainer>
  );
};

export default BugRateTableList;
