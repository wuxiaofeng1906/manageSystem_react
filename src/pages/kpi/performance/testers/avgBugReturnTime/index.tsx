import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { GqlClient, useGqlClient } from '@/hooks';
import {
  getWeeksRange,
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getParamsByType,
  getYearsTime,
} from '@/publicMethods/timeMethods';
import { Button, Drawer } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
} from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';
import { converseFormatForAgGrid } from '../testMethod/deptDataAnalyze';

// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 列的定义和渲染 */
function colorRender(params: any) {
  const node = params.data;

  if (params.value) {
    const result = Number(params.value).toFixed(2);
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
      cellRenderer: colorRender,
      minWidth: 100,
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
      minWidth: 110,
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
      cellRenderer: colorRender,
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
      cellRenderer: colorRender,
    });
  }
  return component;
};

/* endregion */

/* region 数据获取和解析 */

const queryBugReturnTime = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const { data } = await client.query(`
      {
          bugFlybackDept(kind: "${condition.typeFlag}", ends: ${condition.ends}){
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

  const datas = converseFormatForAgGrid(data?.bugFlybackDept);
  return datas;
};

/* endregion */

const BugReturnTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryBugReturnTime(gqlClient, 'quarter'));
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
    const datas: any = await queryBugReturnTime(gqlClient, 'week');
    gridApi.current?.setRowData(datas);
  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryBugReturnTime(gqlClient, 'month');
    gridApi.current?.setRowData(datas);
  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryBugReturnTime(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryBugReturnTime(gqlClient, 'year');
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

  const cssIndent = { textIndent: '2em' };
  /* endregion */

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ProfileTwoTone />}
          size={'large'}
          onClick={statisticsByWeeks}
        >
          按周统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<CalendarTwoTone />}
          size={'large'}
          onClick={statisticsByMonths}
        >
          按月统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ScheduleTwoTone />}
          size={'large'}
          onClick={statisticsByQuarters}
        >
          按季统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<AppstoreTwoTone />}
          size={'large'}
          onClick={statisticsByYear}
        >
          按年统计
        </Button>
        <label style={{ fontWeight: 'bold' }}>(统计单位：H)</label>
        <Button
          type="text"
          style={{ color: '#1890FF', float: 'right' }}
          icon={<QuestionCircleTwoTone />}
          size={'large'}
          onClick={showRules}
        >
          计算规则
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        <AgGridReact
          columnDefs={columsForQuarters()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
          }}
          autoGroupColumnDef={{
            minWidth: 240,
            headerName: '部门-人员',
            cellRendererParams: { suppressCount: true },
            pinned: 'left',
            suppressMenu: false,
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
        ></AgGridReact>
      </div>

      <div>
        <Drawer
          title={<label style={{ fontWeight: 'bold', fontSize: 20 }}>计算规则</label>}
          placement="right"
          width={300}
          closable={false}
          onClose={onClose}
          visible={messageVisible}
        >
          <p>
            <strong>1.统计周期</strong>
          </p>
          <p style={cssIndent}>按周统计：bug关闭日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug关闭日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>
            按季统计：bug关闭日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；
          </p>
          <p> 特殊说明：bug解决日期 &gt;=2021-01-01 ;</p>

          <p>
            <strong>2.其他说明</strong>
          </p>
          <p style={cssIndent}>
            测试每次回归时长 = 测试关闭bug时间 - 打解决后指派给测试的时间 -
            法定节假日时长（若打解决后，没有指派给测试的记录时间，则默认取打解决的时间）{' '}
          </p>
          <p style={cssIndent}>
            特殊情况补充：在action表中查bug的历史信息，查曾经打解决的有几次，只有1次打解决且当前bug状态为关闭且关闭人是测试人员的，则直接使用测试每次回归时长的公式；当有多次打解决时：a.若为多次打解决，且指派给的测试都是同一人，
            则分段计算每次打解决后的指派时间和测试激活时间差，然后把各测试回归的时段求和；b.当一个bug被多次打解决，指派给的测试
            不是同一人时，分别分段计算各测试在该bug的回归时长，然后按测试人员进行回归的时长求和（举个栗子：某bug
            被解决了3次，
            其中第一次和第二次指派给测试张三，张三回归时长分别是2H和5H，第三次解决指派的测试李四，回归时长6H，那张三在该bug的回归时长就等于2+5=7H，李四则为6H）；{' '}
          </p>
          <p style={cssIndent}>
            {' '}
            特别说明：注意在按人统计bug数的时候，1个bug有可能会被多人作为分母，但按组、按部门、按中心时，1个bug只能作为分母中的1个bug；{' '}
          </p>

          <p>
            <strong>3.时长说明</strong>
          </p>
          <p style={cssIndent}>
            计算时长单位为H，只计算工作日时长（不算周末和法定节假日）；关闭者为测试的
          </p>

          <p style={{ color: '#1890FF' }}>
            <strong>4.计算公式说明</strong>
          </p>
          <p>
            <strong>4.1 按人统计</strong>
          </p>
          <p style={cssIndent}>周报：当周该测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>月报：当月该测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>季报：当季该测试人员所有关闭bug时长排序，取中位数；</p>
          <p>
            <strong>4.2 按组统计</strong>
          </p>
          <p style={cssIndent}>周报：当周该组测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>月报：当月该组测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>季报：当季该组测试人员所有关闭bug时长排序，取中位数；</p>
          <p>
            <strong>4.3 按部门统计</strong>
          </p>
          <p style={cssIndent}>周报：当周该部门测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>月报：当月该部门测试人员所有关闭bug时长排序，取中位数；</p>
          <p style={cssIndent}>季报：当季该部门测试人员所有关闭bug时长排序，取中位数；</p>
          <p>
            <strong>4.4 按中心统计</strong>
          </p>
          <p style={cssIndent}>周报：同部门数据；</p>
          <p style={cssIndent}>月报：同部门数据；</p>
          <p style={cssIndent}>季报：同部门数据；</p>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default BugReturnTableList;
