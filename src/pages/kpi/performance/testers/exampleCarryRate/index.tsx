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
import {converseFormatForAgGrid} from "../testMethod/deptDataAnalyze";

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
      cellRenderer: colorRender,
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
      cellRenderer: colorRender,
      minWidth: 100
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

const queryExampleCarryRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
        caseRunDept(kind: "${condition.typeFlag}", ends: ${condition.ends}){
          total {
            dept
            deptName
            kpi
          }
          range {
            start
            end
          }
          datas {
            dept
            deptName
            kpi
            parent {
              dept
              deptName
            }
            users {
              userId
              userName
              kpi
            }
          }
        }
      }
  `);

  const datas = converseFormatForAgGrid(data?.caseRunDept);
  return datas;
};

/* endregion */

const BugReturnTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryExampleCarryRate(gqlClient, 'quarter'),
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
    /* 八周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryExampleCarryRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryExampleCarryRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryExampleCarryRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryExampleCarryRate(gqlClient, 'year');
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
          <p><strong>1.统计周期</strong></p>
          <p>1.1 指派时间周期 </p>
          <p style={cssIndent}>按周统计：用例指派日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：用例指派日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：用例指派日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>
          <p>1.2 执行时间周期</p>
          <p style={cssIndent}>按周统计：用例执行日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：用例执行日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：用例执行日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>

          <p><strong>2.统计人员</strong></p>
          <p style={cssIndent}>执行人为测试，且该条case 的rd_zt_testrun表的assignedTo = lastRunner 则将该用例的测试人员记录为 lastRunner的值</p>

          <p style={{color: "#1890FF"}}><strong>3.计算公式说明（允许某周的用例执行率 &gt;100%）</strong></p>
          <p><strong>3.1 按人统计</strong></p>
          <p style={cssIndent}>周报：当周实际执行用例数/当周指派给其应执行的用例数；</p>
          <p style={cssIndent}>月报：当月该测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>季报：当季该测试人员所有关闭bug时长排序，取中位数；</p>
          <p><strong>3.2 按组统计</strong></p>
          <p style={cssIndent}>周报：该组当周实际执行用例数/该组当周指派给其应执行的用例数；</p>
          <p style={cssIndent}>月报：该组当月实际执行用例数/该组当月指派给其应执行的用例数；</p>
          <p style={cssIndent}>季报：该组当季实际执行用例数/该组当季指派给其应执行的用例数；</p>
          <p><strong>3.3 按部门统计</strong></p>
          <p style={cssIndent}>周报：该部门当周实际执行用例数/该部门当周指派给其应执行的用例数；</p>
          <p style={cssIndent}>月报：该部门当月实际执行用例数/该部门当月指派给其应执行的用例数；</p>
          <p style={cssIndent}>季报：该部门当季实际执行用例数/该部门当季指派给其应执行的用例数；</p>
          <p><strong>3.4 按中心统计</strong></p>
          <p style={cssIndent}>周报：该中心当周实际执行用例数/该中心当周指派给其应执行的用例数；</p>
          <p style={cssIndent}>月报：该中心当月实际执行用例数/该中心当月指派给其应执行的用例数；</p>
          <p style={cssIndent}>季报：该中心当季实际执行用例数/该中心当季指派给其应执行的用例数；</p>

        </Drawer>
      </div>
    </PageContainer>
  );
};

export default BugReturnTableList;
