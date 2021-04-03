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
  getParamsByType
} from '@/publicMethods/timeMethods';
import {colorRender} from '@/publicMethods/cellRenderer';
import {Button, Drawer} from "antd";
import {ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();
const groupValues: any[] = [];
const moduleValues: any[] = [];

/* region 动态定义列 */
const compColums = [
  {
    headerName: '研发中心',
    field: 'devCenter',
    rowGroup: true,
    hide: true,
  }, {
    headerName: '所属部门',
    field: 'dept',
    rowGroup: true,
    hide: true,
  }, {
    headerName: '组名',
    field: 'group',
    rowGroup: true,
    hide: true,
  }, {
    headerName: '姓名',
    field: 'username',
  }];

function codeNumberRender(values: any) {
  const rowName = values.rowNode.key;
  for (let i = 0; i < groupValues.length; i += 1) {
    const datas = groupValues[i];
    if (values.colDef.field === datas.time && rowName === datas.group) {
      if (datas.values === "" || datas.values === null || datas.values === undefined || Number(datas.values) === 0) {
        return ` <span style="color: Silver  ">  ${0} </span> `;
      }
      return ` <span style="font-weight: bold">  ${Number(datas.values).toFixed(4)} </span> `;
    }
  }

  return ` <span style="color: Silver  ">  ${0} </span> `;
}


const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      field: starttime.toString(),
      aggFunc: codeNumberRender,
      cellRenderer: colorRender
    });

  }
  return compColums.concat(component);
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      field: monthRanges[index].start,
      aggFunc: codeNumberRender,
      cellRenderer: colorRender
    });

  }
  return compColums.concat(component);
};

const columsForQuarters = () => {
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      field: quarterTime[index].start,
      aggFunc: codeNumberRender,
      cellRenderer: colorRender
    });

  }
  return compColums.concat(component);
};

/* endregion */

/* region 数据处理 */


// 转化为ag-grid能被显示的格式
const converseFormatForAgGrid = (oraDatas: any) => {

  groupValues.length = 0;
  moduleValues.length = 0;

  const arrays: any[] = [];
  if (oraDatas === null) {
    return arrays;
  }

  for (let index = 0; index < oraDatas.length; index += 1) {

    const starttime = oraDatas[index].range.start;
    arrays.push({
      "username": "代码量",
      [starttime]: oraDatas[index].code
    });
    groupValues.push({
      time: starttime,
      group: "研发中心",
      values: oraDatas[index].total.kpi
    });

    const data = oraDatas[index].datas;
    for (let i = 0; i < data.length; i += 1) {

      groupValues.push({
        time: starttime,
        group: data[i].deptName,
        values: data[i].kpi
      }, {
        time: starttime,
        group: data[i].parent === null ? "" : data[i].parent.deptName,
        values: data[i].parent === null ? "" : data[i].parent.kpi
      });


      const usersData = data[i].users;
      if (usersData !== null) {
        for (let m = 0; m < usersData.length; m += 1) {
          const username = usersData[m].userName;


          // 特殊处理宋老师和王润燕的部门和组
          if (username === "陈诺") {
            arrays.push({
              devCenter: "研发中心",
              dept: "测试部",
              "username": username,
              [starttime]: usersData[m].kpi
            });
          } else {
            arrays.push({
              devCenter: "研发中心",
              dept: data[i].parent.deptName,
              group: data[i].deptName,
              "username": username,
              [starttime]: Number(usersData[m].kpi).toFixed(4)
            });
          }

        }
      }
    }
  }

  return arrays;
};

const converseArrayToOne = (data: any) => {
  const resultData = new Array();
  for (let index = 0; index < data.length; index += 1) {
    let repeatFlag = false;
    // 判断原有数组是否包含有名字
    for (let m = 0; m < resultData.length; m += 1) {
      if (resultData[m].username === data[index].username) {
        repeatFlag = true;
        break;
      }
    }

    if (repeatFlag === false) {
      const tempData = {};
      for (let index2 = 0; index2 < data.length; index2 += 1) {
        tempData["username"] = data[index].username;

        if (data[index].username === data[index2].username) {
          const key = Object.keys(data[index2]);  // 获取所有的Key值
          key.forEach(function (item) {
            tempData[item] = data[index2][item];
          });
        }
      }
      resultData.push(tempData);
    }
  }

  return resultData;
};

const queryBugResolutionCount = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
           bugThousTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, thous: REFER) {
              total {
                dept
                deptName
                kpi
              }
              code
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

  const datas = converseFormatForAgGrid(data?.bugThousTestDept);
  return converseArrayToOne(datas);
};

/* endregion */

const TestBugRateRefTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryBugResolutionCount(gqlClient, 'quarter'),
  );
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */

  // 按周统计
  const statisticsByWeeks = async () => {
    /* 八周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryBugResolutionCount(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryBugResolutionCount(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryBugResolutionCount(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

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
        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<QuestionCircleTwoTone/>}
                size={'large'} onClick={showRules}>计算规则</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%'}}>
        <AgGridReact
          columnDefs={columsForQuarters()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            cellStyle: {"margin-top": "-5px"}
          }}
          autoGroupColumnDef={{
            minWidth: 250,
            sort: 'asc'
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressAggFuncInHeader={true}   // 不显示标题聚合函数的标识
          rowHeight={32}
          headerHeight={35}
          // pivotColumnGroupTotals={'always'}
          // groupHideOpenParents={true}  // 组和人名同一列

          // rowGroupPanelShow={'always'}  可以拖拽列到上面
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>

      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>一、测试类有效Bug统计</strong></p>
          <p>1.统计周期-bug周期 </p>
          <p style={cssIndent}>按周统计：bug创建日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：bug创建日期为每月的第一个整周的周一00:00:00--每月最后1个整周的周天23:59:59；</p>
          <p style={cssIndent}>按季统计：bug创建日期每季第一个月的第一个整周的周一00:00:00--每季第三个月的最后1个整周的周天23:59:59；</p>
          <p>2.统计周期-代码量周期（修正后的代码量） </p>
          <p style={cssIndent}>按周统计：代码commit日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：代码commit日期为每月的第一个整周的周一00:00:00--每月最后1个整周的周天23:59:59；</p>
          <p style={cssIndent}>按季统计：代码commit日期每季第一个月的第一个整周的周一00:00:00--每季第三个月的最后1个整周的周天23:59:59；</p>
          <p><strong>3.bug统计范围</strong></p>
          <p style={cssIndent}>3.1 产品为“1.0/1.0正式版--产品经理”“产品实施--实施顾问反馈”“开发自提需求”； </p>
          <p style={cssIndent}>3.2 创建者为“顾问”“产品”“客服”； </p>
          <p style={cssIndent}>3.3 线上bug统计，统计os操作系统字段值包含“线上”的字段并除去线上bug-重复bug、线上bug-需求相关、线上bug-不是问题、线上bug-自动化发现； </p>
          <p style={cssIndent}>特殊判定条件： 当dept为3且os值为空时，仅查询项目名称包含hotfix字样的bug；
            当opendBy='fuyang.li'时，需增加条件bug创建时间&gt;=2020-04-01； </p>
          <p style={cssIndent}>3.4 解决方案为“空”“已解决”“延期处理”“后续版本”“代码未合并”的； </p>
          <p style={cssIndent}>3.5 统计人员, 首先在zt_bug表中判断当前的assignedTo的值是不是测试，若是测试则该bug的用户名称则是该测试，
            若不是测试则在zt_action表中按降序挨个查id 在zt_history表中的old字段按时间倒序去查测试人员，查到的第一个测试人员则该bug的用户名
            称则是该测试,若old中仍查不到测试人员，则倒序查zt_action.actor的值，查到的第一个测试人员则将该bug的用户名称记录为该测试，若还查不到
            测试人员则名称记录为空，并且人员的zt_user.dept in （35,36,37,38,39）； </p>

          <p style={{color: "#1890FF"}}><strong>二、计算公式说明</strong></p>
          <p> 1.按人统计（以下人员都特指测试人员） </p>
          <p style={cssIndent}>周报：周一至周天测试类有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>
          <p> 2.按组统计 </p>
          <p style={cssIndent}>周报：该组所有人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该组所有人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该组所有人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>
          <p> 3.按部门统计 </p>
          <p style={cssIndent}>周报：该部门所有人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该部门所有人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该部门所有人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>
          <p> 4.按中心统计（等于测试部门的周报、月报、季报值） </p>
          <p style={cssIndent}>周报：该中心所有测试人员周一至周天测试类线上有效bug求和/(当周周一至周天研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>月报：该中心所有测试人员按月统计bug求和/(按月统计研发中心所有开发人员代码量之和/1000)；</p>
          <p style={cssIndent}>季报：该中心所有测试人员按季统计bug求和/(按季统计研发中心所有开发人员代码量之和/1000)；</p>
        </Drawer>
      </div>
    </PageContainer>
  );
};

export default TestBugRateRefTableList;
