import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {
  getWeeksRange, getMonthWeek, getTwelveMonthTime, getFourQuarterTime, getParamsByType, getYearsTime
} from '@/publicMethods/timeMethods';

import {Button, Drawer} from "antd";
import {
  ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone, AppstoreTwoTone
} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";
import {converseFormatForAgGrid} from "../devMethod/deptDataAnalyze";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 列的定义和渲染 */

function colorRender(params: any) {

  const node = params.data;

  if (params.value) {
    const result = (Number(params.value) * 100).toFixed(2);
    if (node.isDept === true) {
      return `<span style="font-weight: bold"> ${result}</span>`;
    }

    return `<span> ${result}</span>`;
  }

  if (node.isDept === true) {
    return `<span style="font-weight: bold"> ${0}</span>`;
  }

  return `<span style="color: silver"> ${0}</span>`;

}

const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      field: starttime.toString(),
      cellRenderer: colorRender
    });

  }
  return component;
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      field: monthRanges[index].start,
      cellRenderer: colorRender
    });

  }
  return component;
};

const columsForQuarters = () => {
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      field: quarterTime[index].start,
      cellRenderer: colorRender
    });

  }
  return component;
};

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    component.push({
      headerName: yearsTime[index].title,
      field: yearsTime[index].start,
      cellRenderer: colorRender
    });

  }
  return component;
};
/* endregion */

/* region 数据获取和解析 */

const queryBugReopenRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
        bugReopenDept(kind:"${condition.typeFlag}",ends:${condition.ends}){
        total {
              dept
              deptName
              kpi
            }
            range {
              start
              end
            }
            side{
              both
              front
              backend
            }
            datas {
              dept
              deptName
              kpi
              parent {
                dept
                deptName
              }
              side{
                both
                front
                backend
              }
              users {
                userId
                userName
                kpi
                tech
              }
            }
          }


      }
  `);

  const datas = converseFormatForAgGrid(data?.bugReopenDept);
  return datas;
};

/* endregion */

const BugReopenTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryBugReopenRate(gqlClient, 'quarter'),
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
    const datas: any = await queryBugReopenRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryBugReopenRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryBugReopenRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearsColums = columsForYears();
    gridApi.current?.setColumnDefs(yearsColums);
    const datas: any = await queryBugReopenRate(gqlClient, 'year');
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
          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：bug解决日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug解决日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：bug解决日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>

          <p><strong>2.分子值获取</strong></p>
          <p style={cssIndent}> 分子为重新激活的bug：由谁解决为开发的，且激活次数&gt;=1，且（当前bug状态为激活的，曾经的解决方案有1次以上是fixed的；
            或bug当前状态为已解决/已关闭的，曾经的解决方案有2次以上是fixed的） </p>
          <p style={cssIndent}> 特殊情况补充：当该bug有多次解决，取最早解决方案为“已解决”的开发解决者记录1次reopen（不要取最后的解决者记录）； </p>

          <p><strong>3.分母值获取</strong></p>
          <p style={cssIndent}>分母解决bug：每周或每月或每季由谁解决为开发的bug； </p>

          <p style={{color: "#1890FF"}}><strong>4.计算公式说明</strong></p>
          <p style={cssIndent}>周报：当周解决后重新激活的bug数/当周解决的bug数；</p>
          <p style={cssIndent}>月报：当月解决后重新激活的bug数/当月解决的bug数；</p>
          <p style={cssIndent}>季报：当季解决后重新激活的bug数/当季解决的bug数；</p>

          <p><strong>4.按组、按端、按部门、按研发中心的计算</strong></p>
          <p style={cssIndent}>按组：该组下所有开发员工在当周或当月或当季 所有的reopen次数求和除以该组下所有开发员工在当周或当月或当季所有的解决bug数求和；；</p>
          <p style={cssIndent}>按端：该组该端下所有开发员工在当周或当月或当季 所有的reopen次数求和除以按组该端下所有开发员工在当周或当月或当季所有的解决bug数求和；</p>
          <p style={cssIndent}>按部门：该部门下所有开发员工在当周或当月或当季 所有的reopen次数求和除以该部门下所有开发员工在当周或当月或当季所有的解决bug数求和；</p>
          <p style={cssIndent}>按研发中心：该中心下所有开发员工在当周或当月或当季 所有的reopen次数求和除以该中心下所有开发员工在当周或当月或当季所有的解决bug数求和；</p>
          <p style={cssIndent}>按研发中心按端：该中心下该端所有开发员工在当周或当月或当季 所有的reopen次数求和除以该中心下该端所有开发员工在当周或当月或当季所有的解决bug数求和；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default BugReopenTableList;
