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
  getWeeksRange, getMonthWeek, getTwelveMonthTime, getFourQuarterTime, getYearsTime
} from '@/publicMethods/timeMethods';
import {Button, Drawer} from "antd";
import {
  ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone, AppstoreTwoTone
} from "@ant-design/icons";
import {customRound, getHeight} from "@/publicMethods/pageSet";

import {converseCoverageFormatForAgGrid} from "../../devMethod/deptDataAnalyze";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(4);
const monthRanges = getTwelveMonthTime(6);
const quarterTime = getFourQuarterTime();

/* region 表格渲染 */


// 表格代码渲染
function coverageCellRenderer(params: any) {
  const node = params.data;

  if (params.value) {
    const result = customRound((Number(params.value) * 100), 2);
    if (node && node.isDept === true) {
      return `<span style="font-weight: bold"> ${result}</span>`;
    }

    return `<span> ${result}</span>`;
  }

  if (node && node.isDept === true) {
    return `<span style="font-weight: bold"> ${0}</span>`;
  }

  return `<span style="color: silver"> ${0}</span>`;


}

/* endregion */

/* region 动态定义列 */


const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    const endtime = weekRanges[index].to;
    component.push({
      headerName: weekName,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    const endtime = monthRanges[index].end;
    component.push({
      headerName: monthRanges[index].title,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};

const columsForQuarters = () => {

  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    const endtime = quarterTime[index].end;
    component.push({
      headerName: quarterTime[index].title,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    const endtime = yearsTime[index].end;
    component.push({
      headerName: yearsTime[index].title,
      children: [
        {
          headerName: '结构覆盖率',
          field: `instCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return component;
};

/* endregion */

/* region 数据处理 */

const queryFrontCoverage = async (client: GqlClient<object>, params: string) => {
  let ends = "";
  let typeFlag = 0;
  if (params === 'week') {
    const timeRange = new Array();
    for (let index = 0; index < weekRanges.length; index += 1) {
      timeRange.push(`"${weekRanges[index].to}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 0;
  } else if (params === 'month') {
    const timeRange = new Array();
    for (let index = 0; index < monthRanges.length; index += 1) {
      timeRange.push(`"${monthRanges[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 2;
  } else if (params === 'quarter') {
    const timeRange = new Array();
    for (let index = 0; index < quarterTime.length; index += 1) {
      timeRange.push(`"${quarterTime[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 3;
  } else if (params === 'year') {
    const timeRange = new Array();
    const yearsTime = getYearsTime();
    for (let index = 0; index < yearsTime.length; index += 1) {
      timeRange.push(`"${yearsTime[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 4;
  } else {
    return [];
  }

  //  fileCoverageDept(kind:"${typeFlag}",ends:${ends}){
  //   fileCoverageDept(kind: "4", ends: ["2021-12-31","2020-12-31","2019-12-31"]){
  //    fileCoverageDept(kind:"4",ends:["2021-12-31"]){
  const {data} = await client.query(`
       {
        fileCoverageDept(kind:"${typeFlag}",ends:${ends}){
            total{
              dept
              deptName
              instCove
              branCove
            }
            side{
              front{
                instCove
                branCove
              }
              backend{
                instCove
                branCove
              }
            }
            range{
              start
              end
            }
            datas{
              dept
              deptName
              instCove
              branCove
              parent{
                deptName
               }
              side{
                front{
                  instCove
                  branCove
                }
                backend{
                  instCove
                  branCove
                }
              }
              users{
                userId
                userName
                instCove
                branCove
                tech
              }
            }
          }

      }
    `);

  const objectValues = converseCoverageFormatForAgGrid(data?.fileCoverageDept);
  return objectValues;
};

/* endregion */

const CodeReviewTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryFrontCoverage(gqlClient, 'quarter'),
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

  /* region 按钮点击事件 */
  // 按周统计
  const statisticsByWeeks = async () => {
    /* 4周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForYears();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'year');
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

          <p style={cssIndent}>按周统计：覆盖率为当周最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按月统计：覆盖率为当月最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按季统计：覆盖率为当季度最新的覆盖率(累计)；</p>

          <p style={{color: "#1890FF"}}><strong>2.计算公式</strong></p>
          <p style={cssIndent}>结构覆盖率 = 所拥有文件结构覆盖数之和/所有拥有文件总结构数之和；</p>
          <p style={cssIndent}>分支覆盖率 = 所拥有文件分支覆盖数之和/所有拥有文件总分支数之和；</p>

          <p><strong>3.取值</strong></p>
          <p style={cssIndent}>前端取值：结构数：Statements；支数：Branches；</p>
          <p style={cssIndent}>后端取值：结构数：Instructions Cov；分支数：Branches；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default CodeReviewTableList;
