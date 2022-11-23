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
import { customRound, getHeight } from '@/publicMethods/pageSet';
import { converseFormatForAgGrid } from '../devMethod/deptDataAnalyze';

// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 列的定义和渲染 */

function colorRender(params: any) {
  const node = params.data;

  if (params.value) {
    const result = customRound(params.value, 2);
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

const queryBugRepaireTime = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const { data } = await client.query(`
      {
        bugRepairDept(kind:"${condition.typeFlag}",ends:${condition.ends}){
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

  const datas = converseFormatForAgGrid(data?.bugRepairDept);
  return datas;
};

/* endregion */

const BugResTimeTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryBugRepaireTime(gqlClient, 'quarter'));
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
    const datas: any = await queryBugRepaireTime(gqlClient, 'week');
    gridApi.current?.setRowData(datas);
  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryBugRepaireTime(gqlClient, 'month');
    gridApi.current?.setRowData(datas);
  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryBugRepaireTime(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearsColums = columsForYears();
    gridApi.current?.setColumnDefs(yearsColums);
    const datas: any = await queryBugRepaireTime(gqlClient, 'year');
    gridApi.current?.setRowData(datas);
  };

  /* endregion */

  /* region 计算规则 */
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
          <p style={cssIndent}>按周统计：bug解决日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug解决日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>
            按季统计：bug解决日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；
          </p>

          <p>
            <strong>2.时长说明</strong>
          </p>
          <p style={cssIndent}>
            开发每次解决时长 = 开发每次打解决时间 减去 打解决时间前最近一次指派给该开发的时间 减去
            法定节假日时长（用解决时间往前查激活时间，若解决和激活中间有指派给该开发（解决者），就取指派时间，若无则取前面临近的激活时间，若既没激活有没指派，往前取创建时间）；
          </p>

          <p>
            <strong>3.特殊情况补充</strong>
          </p>
          <p style={cssIndent}>
            过滤掉bug严重程度为P3的bug，在action表中查bug的历史信息，查曾经的解决人为开发的有几个：{' '}
          </p>
          <p style={cssIndent}>
            a.若为同一人多次打解决，则只计算每次打解决的时长然后求和（不计算每次打解决后指派给他人验证的时长）；
          </p>
          <p style={cssIndent}>
            b.当一个bug被多个开发打解决时，分段计算各开发在该bug的解决时长，然后按开发人员进行解决时长求和
            （举个例子：某bug被张三和李四2人解决了3次，其中张三解决了2次分别是2H和5H，李四解决时长6H，那张三在该bug的解决时长就等于2+5=7H，李四则为6H）；
          </p>

          <p>
            <strong>4.其他说明</strong>
          </p>
          <p style={cssIndent}>
            计算时长单位为H，只计算工作日时长（不算周末和法定节假日），每天时长默认24H；
          </p>

          <p style={{ color: '#1890FF' }}>
            <strong>5.计算公式说明</strong>
          </p>
          <p style={cssIndent}>周报：当周所有解决bug时长排序，取中位数；</p>
          <p style={cssIndent}>月报：当月所有解决bug时长排序，取中位数；</p>
          <p style={cssIndent}>季报：当季所有解决bug时长排序，取中位数；</p>
        </Drawer>
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
            minWidth: 280,
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
    </PageContainer>
  );
};

export default BugResTimeTableList;
