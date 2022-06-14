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
  getWeeksRange,
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getParamsByType, getYearsTime
} from '@/publicMethods/timeMethods';
import {Button, Drawer} from "antd";
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone
} from "@ant-design/icons";
import {customRound, getHeight} from "@/publicMethods/pageSet";
import {converseFormatForAgGrid} from "../testMethod/deptDataAnalyze";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 列的定义和渲染 */
// 数据渲染
const dataRender = (params: any) => {
  const node = params.data;

  if (params.value) {
    let result = customRound(params.value, 4);
    if ((node.Group)[0] === "代码量") {
      result = params.value;
    }

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

const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      field: starttime.toString(),
      cellRenderer: dataRender,
      minWidth: 100
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
      cellRenderer: dataRender,
      minWidth: 110
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
      cellRenderer: dataRender
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
      cellRenderer: dataRender
    });

  }
  return component;
};
/* endregion */

/* region 数据获取和解析 */

const queryOnlineBugRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  //
  // const {data} = await client.query(`
  //     {
  //        bugThousTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, thous: TEST) {
  //           total {
  //             dept
  //             deptName
  //             kpi
  //           }
  //           code
  //           range {
  //             start
  //             end
  //           }
  //           datas {
  //             dept
  //             deptName
  //             kpi
  //             parent {
  //               dept
  //               deptName
  //             }
  //             users {
  //               userId
  //               userName
  //               kpi
  //             }
  //           }
  //         }
  //
  //     }
  // `);
  // const datas = converseFormatForAgGrid(data?.bugThousTestDept);
  // return datas;

  return []
};

/* endregion */

const TestBugRateTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryOnlineBugRate(gqlClient, 'quarter'),
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
    const datas: any = await queryOnlineBugRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };
  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryOnlineBugRate(gqlClient, 'year');
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
            minWidth: 240,
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
          <p><strong>一.统计周期说明</strong></p>
          <p style={cssIndent}>按周、按月、按季、按年统计；</p>
          <p style={{color: "#1890FF"}}><strong>二.计算公式说明</strong></p>
          <p style={cssIndent}>1.测试-千行bug率收敛 = 测试-线上千行bug率 / 开发-千行bug率（不含线上）；</p>
          <p style={cssIndent}>2.计算时分子分母取对应周期的值，测试部门/开发部门（到部门级，不到具体人员）；</p>


        </Drawer>
      </div>
    </PageContainer>
  );
};

export default TestBugRateTableList;
