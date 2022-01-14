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
import {customRound, getHeight} from "@/publicMethods/pageSet";
import {converseFormatForAgGrid} from "../devMethod/deptDataAnalyze";

// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime(true);

/* region 列的定义和渲染 */

function colorRender(params: any) {
  if (params.value === null || params.value === undefined || params.value === "" || params.value === "null") {
    return "100";
  }

  if (params.value === 0) {
    return ` <span style="color: #1890ff"> 0 </span> `;
  }

  const node = params.data;

  if (params.value === 100) {
    return ` <span> ${100} </span> `;
  }

  if (node && node.isDept === true) {
    return ` <span style="font-weight: bold"> ${customRound((Number(params.value) * 100), 2)} </span> `;
  }

  if ((Number(params.value) * 100) < 100) {
    return ` <span style="color: #1890ff"> ${customRound((Number(params.value) * 100), 2)} </span> `;
  }

  if (Number.isNaN(Number(params.value)) === false) {
    if (Number(params.value) * 100 === 100) {
      return "100";
    }
    return customRound((Number(params.value) * 100), 2);
  }

  return params.value;
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

const queryBugRepaireRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params, true);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
         bugRepairRateDept(kind:"${condition.typeFlag}",ends:${condition.ends}){
          total{
            deptName
            kpi
          }
          range{
            start
            end
          }
          side{
            front
            backend
          }
          datas{
            dept
            deptName
            parent{
              deptName
            }
            side{
              front
              backend
            }
            kpi
            users{
              userId
              userName
              kpi
              tech
            }
          }
        }
      }
  `);

  const datas = converseFormatForAgGrid(data?.bugRepairRateDept);
  return datas;
};

/* endregion */

const BugReopenTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryBugRepaireRate(gqlClient, 'quarter'),
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
    const datas: any = await queryBugRepaireRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryBugRepaireRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryBugRepaireRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearsColums = columsForYears();
    gridApi.current?.setColumnDefs(yearsColums);
    const datas: any = await queryBugRepaireRate(gqlClient, 'year');
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
          <p><strong>一.统计周期</strong></p>
          <p><strong>1.分子统计</strong></p>
          <p style={cssIndent}>按周统计：bug解决日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug解决日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：bug解决日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>

          <p><strong>2.分母统计</strong></p>
          <p style={cssIndent}>含上面1中的分子统计，并且还需要包含当前状态为“激活”且指派给开发的bug，截止当前日期还激活的指派给开发的； </p>
          <p style={cssIndent}>截止统计日期，开发解决了多少个有效bug，还剩多少个激活bug ；bug修复率=解决有效bug数/（截止当前激活bug数+解决有效bug数）*100； </p>

          <p><strong>二.统计范围</strong></p>
          <p style={cssIndent}>分子统计bug当前状态为“已解决 或 已关闭” ，且解决者为开发的；</p>
          <p style={cssIndent}>分母统计bug含上面第1条中的bug，还需包含当前状态为激活且指派给开发的；</p>
          <p style={cssIndent}>统计解决方案为有效的“已解决、后续版本、延期处理、代码未合并”；</p>


          <p style={{color: "#1890FF"}}><strong>三.计算公式</strong></p>
          <p style={cssIndent}>周报：当周解决后重新激活的bug数/当周解决的bug数；</p>
          <p style={cssIndent}>月报：当月解决后重新激活的bug数/当月解决的bug数；</p>
          <p style={cssIndent}>季报：当季解决后重新激活的bug数/当季解决的bug数；</p>

          <p><strong>1.按人统计</strong></p>
          <p style={cssIndent}>周报：该开发当周解决的有效bug数/截止当周指派给开发所有的有效bug总数*100
            （举例分母说明：截止当周星期天23:59:59前，指派给该开发还是激活的bug+当周该开发解决的所有有效bug数）；</p>
          <p style={cssIndent}>月报：该开发当月解决的有效bug数/截止当月指派给开发所有的有效bug总数*100 ；</p>
          <p style={cssIndent}>季报：该开发当季解决的有效bug数/截止当季指派给开发所有的有效bug总数*100 ；</p>
          <p><strong>2.按端统计</strong></p>
          <p style={cssIndent}>周报：该端所有开发当周解决的有效bug数/截止当周指派给该端所有开发的所有有效bug总数*100
            （分母说明：截止当周星期天23:59:59前，指派给该端所有开发还是激活的bug+当周该端开发解决的所有有效bug数）；</p>
          <p style={cssIndent}>月报：该端所有开发当月解决的有效bug数/截止当月指派给该端所有开发的所有有效bug总数*100；</p>
          <p style={cssIndent}>季报：该端所有开发当季解决的有效bug数/截止当季指派给该端所有开发的所有有效bug总数*100；</p>
          <p><strong>3.按组统计</strong></p>
          <p style={cssIndent}>周报：该组所有开发当周解决的有效bug数/截止当周指派给该组所有开发的所有有效bug总数*100
            （分母说明：截止当周星期天23:59:59前，指派给该组所有开发还是激活的bug+当周该组开发解决的所有有效bug数）；</p>
          <p style={cssIndent}>月报：该组所有开发当月解决的有效bug数/截止当月指派给该组所有开发的所有有效bug总数*100 ；</p>
          <p style={cssIndent}>季报：该组所有开发当季解决的有效bug数/截止当季指派给该组所有开发的所有有效bug总数*100 ；</p>
          <p><strong>4.按部门统计</strong></p>
          <p style={cssIndent}>周报：该部门所有开发当周解决的有效bug数/截止当周指派给该部门所有开发的所有有效bug总数*100
            （分母说明：截止当周星期天23:59:59前，指派给该部门所有开发还是激活的bug+当周该部门开发解决的所有有效bug数）；</p>
          <p style={cssIndent}>月报：该部门所有开发当月解决的有效bug数/截止当月指派给该部门所有开发的所有有效bug总数*100 ；</p>
          <p style={cssIndent}>季报：该部门所有开发当季解决的有效bug数/截止当季指派给该部门所有开发的所有有效bug总数*100；</p>
          <p><strong>5.按中心统计</strong></p>
          <p style={cssIndent}>周报：该中心所有开发当周解决的有效bug数/截止当周指派给该中心所有开发的所有有效bug总数*100
            （分母说明：截止当周星期天23:59:59前，指派给该中心所有开发还是激活的bug+当周该中心开发解决的所有有效bug数）；</p>
          <p style={cssIndent}>月报：该中心所有开发当月解决的有效bug数/截止当月指派给该中心所有开发的所有有效bug总数*100 ；</p>
          <p style={cssIndent}>季报：该中心所有开发当季解决的有效bug数/截止当季指派给该中心所有开发的所有有效bug总数*100 ；</p>


        </Drawer>
      </div>

    </PageContainer>
  );
};

export default BugReopenTableList;
