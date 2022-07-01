import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useGqlClient} from '@/hooks';
import {Button, Drawer, Table} from "antd";
import {
  ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone, AppstoreTwoTone
} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";
import {columsForWeeks, columsForMonths, columsForQuarters, columsForYears} from "./gridConfigure/columns";
import {queryDevDefectExcRate} from "./gridConfigure/data";
import {testPlanDevRateRuleColumns, testPlanDevRateRuleDatas} from "../devCommonRules";

const ShowTestPlanDeviationRate: React.FC<any> = () => {

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
        <label style={{fontWeight: "bold"}}>(统计单位：%)</label>
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

          <p style={cssIndent}>1.周期：按周、按月、按季、按年统计（实际提测完成日期落在哪个周期，就算到对应周期）；</p>
          <p style={cssIndent}>2.只展示部门数据（不展示人员数据）；</p>
          <p style={cssIndent}>3.计算公式：提测计划偏差率 =Average（各项目的提测计划偏差率）；</p>
          <p style={cssIndent}> 单个项目的提测计划偏差率 = (实际提测完成日期 - 计划提测截止日期)/(计划提测截止日期 - 开发阶段计划开始日期）*100；</p>
          <p style={cssIndent}>4.项目取值范围：；</p>
          <Table columns={testPlanDevRateRuleColumns} dataSource={testPlanDevRateRuleDatas}
                 size={"small"} pagination={false} bordered/>
          <p style={cssIndent}>5.实际提测完成日期取值：任务类型为‘计划’，且任务名称包含'开发提测演示’，且任务状态为‘已完成 或 已关闭’
            ，取该任务的‘实际完成日期’（finishedDate）。如果有多个该类型任务，'实际完成日期'取该类任务最后的日期，Max（finishDate）；</p>
          <p style={cssIndent}>6.计划提测截止日期取值：取执行概况中的'计划提测时间‘；</p>
          <p style={cssIndent}>7.开发阶段计划开始日期取值：任务类型为‘计划’，且任务名称包含'开发阶段计划’，且任务状态为‘已完成 或 已关闭’ ，取该任务的‘预计开始日期’；</p>


        </Drawer>
      </div>
    </PageContainer>
  );
};

export default ShowTestPlanDeviationRate;
