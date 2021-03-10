import React, {useRef} from 'react';
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
import {moduleChange} from '@/publicMethods/cellRenderer';
import {Button} from "antd";
import {ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone} from "@ant-design/icons";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();
const weekGroupValues: any[] = [];

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
    headerName: '所属端',
    field: 'module',
    rowGroup: true,
    hide: true,

  }, {
    headerName: '姓名',
    field: 'username',
  }];

function codeNumberRender(values: any) {

  if (values.rowNode.key === "前端") {
    console.log("values", values);
  }
  debugger;
  for (let i = 0; i < weekGroupValues.length; i += 1) {
    const datas = weekGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      break;
    }
  }
  return '';
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
      cellRenderer: (params: any) => {
        return params.value;  // 为了将聚合函数实现格式化
      },
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
      cellRenderer: (params: any) => {
        return params.value;  // 为了将聚合函数实现格式化
      },
    });

    // component.push({
    //   headerName: monthRanges[index].title,
    //   children: [
    //     {
    //       headerName: 'review个数',
    //       field: monthRanges[index].title,
    //     },
    //   ],
    // });
  }
  return compColums.concat(component);
};

const columsForQuarters = () => {
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      field: quarterTime[index].start,
      cellRenderer: (params: any) => {
        return params.value;  // 为了将聚合函数实现格式化
      },
    });

    // component.push({
    //   headerName: quarterTime[index].title,

    //   children: [
    //     {
    //       headerName: 'review个数',
    //       field: quarterTime[index].title,
    //     },
    //   ],
    // });
  }
  return compColums.concat(component);
};

/* endregion */

/* region 数据处理 */

// const getParamsByType = (params: any) => {
//   let typeFlag = 0;
//   let ends = "";
//   if (params === 'week') {
//     const timeRange = new Array();
//     for (let index = 0; index < weekRanges.length; index += 1) {
//       timeRange.push(`"${weekRanges[index].to}"`);
//     }
//     ends = `[${timeRange.join(",")}]`;
//     typeFlag = 1;
//
//   } else if (params === 'month') {
//     const timeRange = new Array();
//     for (let index = 0; index < monthRanges.length; index += 1) {
//       timeRange.push(`"${monthRanges[index].end}"`);
//     }
//     ends = `[${timeRange.join(",")}]`;
//     typeFlag = 2;
//
//   } else if (params === 'quarter') {
//     const timeRange = new Array();
//     for (let index = 0; index < quarterTime.length; index += 1) {
//       timeRange.push(`"${quarterTime[index].end}"`);
//     }
//     ends = `[${timeRange.join(",")}]`;
//     typeFlag = 3;
//   }
//
//   return {typeFlag, ends};
// };

// 转化为ag-grid能被显示的格式
const converseFormatForAgGrid = (oraDatas: any) => {
  weekGroupValues.length = 0;
  const arrays: any[] = [];
  if (oraDatas === null) {
    return arrays;
  }

  for (let index = 0; index < oraDatas.length; index += 1) {
    const starttime = oraDatas[index].range.start;
    arrays.push({
        devCenter: "研发中心",
        "username": "前端",
        [starttime]: oraDatas[index].side.front
      }
    );
    arrays.push({
        devCenter: "研发中心",
        "username": "后端",
        [starttime]: oraDatas[index].side.backend
      }
    );

    weekGroupValues.push({
      time: starttime,
      group: "研发中心",
      values: oraDatas[index].total.count
    });

    const data = oraDatas[index].datas;
    for (let i = 0; i < data.length; i += 1) {

      weekGroupValues.push({
        time: starttime,
        group: data[i].deptName,
        values: data[i].count
      }, {
        time: starttime,
        group: data[i].parent.deptName,
        values: data[i].parent.count
      });

      const usersData = data[i].users;
      for (let m = 0; m < usersData.length; m += 1) {
        const username = usersData[m].userName;
        const counts = usersData[m].count;

        // weekGroupValues.push({
        //   time: starttime,
        //   group: "应用架构部",
        //   values: weekDatas[i].instCove
        // });

        arrays.push({
          devCenter: "研发中心",
          dept: data[i].parent.deptName,
          group: data[i].deptName,
          module: moduleChange(usersData[m].tech),
          "username": username,
          [starttime]: counts
        });
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

const queryCodeReviewCount = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
        codeReviewDept(kind:"${condition.typeFlag}",ends:${condition.ends}){
            total{
              deptName
              count
            }
            range{
              start
              end
            }
            side{
              both
              front
              backend
            }
            datas{
              dept
              deptName
              parent{
                deptName
                count
              }
              count
              side{
                both
                front
                backend
              }
              users{
                userId
                userName
                count
                tech
              }
            }
          }

      }
  `);
  const datas = converseFormatForAgGrid(data?.codeReviewDept);
  return converseArrayToOne(datas);
};

/* endregion */

const CodeReviewTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryCodeReviewCount(gqlClient, 'week'),
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
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryCodeReviewCount(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryCodeReviewCount(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    debugger;
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryCodeReviewCount(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  return (
    <PageContainer>
      <div style={{background: 'white'}}>
        <Button type="text" style={{color: 'black'}} icon={<ProfileTwoTone/>} size={'large'}
                onClick={statisticsByWeeks}>按周统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<CalendarTwoTone/>} size={'large'}
                onClick={statisticsByMonths}>按月统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<ScheduleTwoTone/>} size={'large'}
                onClick={statisticsByQuarters}>按季统计</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
        <AgGridReact
          columnDefs={columsForWeeks()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            // allowedAggFuncs: ['sum', 'min', 'max']
          }}
          autoGroupColumnDef={{
            maxWidth: 300,
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressAggFuncInHeader={true}   // 不显示标题聚合函数的标识

          // pivotColumnGroupTotals={'always'}
          // groupHideOpenParents={true}  // 组和人名同一列

          // rowGroupPanelShow={'always'}  可以拖拽列到上面
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </PageContainer>
  );
};

export default CodeReviewTableList;
