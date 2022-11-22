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

/* region 动态定义列 */

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

const queryEffectiveRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const { data } = await client.query(`
      {
        effectCaseDept(kind: "${condition.typeFlag}", ends: ${condition.ends}){
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

  const datas = converseFormatForAgGrid(data?.effectCaseDept);
  return datas;
};

/* endregion */

const BugReturnTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryEffectiveRate(gqlClient, 'quarter'));
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
    const datas: any = await queryEffectiveRate(gqlClient, 'week');
    gridApi.current?.setRowData(datas);
  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryEffectiveRate(gqlClient, 'month');
    gridApi.current?.setRowData(datas);
  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryEffectiveRate(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const yearColums = columsForYears();
    gridApi.current?.setColumnDefs(yearColums);
    const datas: any = await queryEffectiveRate(gqlClient, 'year');
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
        <label style={{ fontWeight: 'bold' }}>(统计单位：%)</label>
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
          <p>1.1 bug周期 </p>
          <p style={cssIndent}>按周统计：bug创建日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>
            按月统计：bug创建日期为每月的第一个整周的周一00:00:00--每月最后1个整周的周天23:59:59；
          </p>
          <p style={cssIndent}>
            按季统计：bug创建日期每季第一个月的第一个整周的周一00:00:00--每季第三个月的最后1个整周的周天23:59:59；
          </p>
          <p>1.2 用例周期</p>
          <p style={cssIndent}>按周统计：用例创建日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>
            按月统计：用例创建日期为每月的第一个整周的周一00:00:00--每月最后1个整周的周天23:59:59；
          </p>
          <p style={cssIndent}>
            按季统计：用例创建日期每季第一个月的第一个整周的周一00:00:00--每季第三个月的最后1个整周的周天23:59:59；
          </p>

          <p>
            <strong>2.统计范围</strong>
          </p>
          <p>2.1、bug统计：</p>
          <p style={cssIndent}> bug要求，由测试创建的，有关联用例的, zt_bug.case字段不为0;</p>
          <p style={cssIndent}>
            {' '}
            只统计有效bug,zt_bug.resolution字段值为 '空' ,'fixed','nextversion',
            'postponed','code_not_merge' ;
          </p>
          <p style={cssIndent}> bug加权系数 P0*1，P1*0.8，P2*0.5，P3*0.1;</p>
          <p>2.1、用例统计：</p>
          <p style={cssIndent}> 用例要求，已评审通过的用例，zt_case.reviewedBy字段值不为空;</p>

          <p style={{ color: '#1890FF' }}>
            <strong>3.计算公式说明</strong>
          </p>
          <p>
            <strong>3.1 按人统计</strong>
          </p>
          <p style={cssIndent}>
            周报：（当周该测试创建的有效bug/当周该测试创建的有效用例）X（
            ∑(各级bug/当周该测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            月报：（当月该测试创建的有效bug/当月该测试创建的有效用例）X
            （∑(各级bug/当月该测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            季报：（当季该测试创建的有效bug/当季该测试创建的有效用例）X
            （∑(各级bug/当季该测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p>
            <strong>3.2 按组统计</strong>
          </p>
          <p style={cssIndent}>
            周报：（当周该组所有测试创建的有效bug/当周该组所有测试创建的有效用例）X
            （∑(各级bug/当周该组所有测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            月报：（当月该组所有测试创建的有效bug/当月该组所有测试创建的有效用例）X
            （∑(各级bug/当月该组所有测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            季报：（当季该组所有测试创建的有效bug/当季该组所有测试创建的有效用例）X
            （∑(各级bug/当季该组所有测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p>
            <strong>3.3 按部门统计</strong>
          </p>
          <p style={cssIndent}>
            周报：（当周该部门所有测试创建的有效bug/当周该部门所有测试创建的有效用例）X
            （∑(各级bug/当周该部门所有测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            月报：（当月该部门所有测试创建的有效bug/当月该部门所有测试创建的有效用例）X
            （∑(各级bug/当月该部门所有测试编写用例数X100）X各级bug系数 X100）；
          </p>
          <p style={cssIndent}>
            季报：（当季该部门所有测试创建的有效bug/当季该部门所有测试创建的有效用例）X（∑(各级bug/当季该部门所有测试编写用例数X100）X各级bug系数
            X100）；
          </p>
          <p>
            <strong>3.4 按中心计算（同按部门计算）</strong>
          </p>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default BugReturnTableList;
