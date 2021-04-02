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
import {moduleChange, colorRender} from '@/publicMethods/cellRenderer';
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
    headerName: '所属端',
    field: 'module',
    rowGroup: true,
    hide: true,

  }, {
    headerName: '姓名',
    field: 'username',
  }];

function codeNumberRender(values: any) {
  const rowName = values.rowNode.key;
  if (rowName === "前端" || rowName === "后端") {

    for (let i = 0; i < moduleValues.length; i += 1) {
      const moduleInfo = moduleValues[i];
      if (values.colDef.field === moduleInfo.time && rowName === moduleInfo.module && values.rowNode.parent.key === moduleInfo.parent) {
        if (moduleInfo.values === "" || moduleInfo.values === null || moduleInfo.values === undefined || Number(moduleInfo.values) === 0) {
          return ` <span style="color: Silver  ">  ${0} </span> `;
        }
        return ` <span style="font-weight: bold">  ${moduleInfo.values} </span> `;
      }
    }
  } else {
    for (let i = 0; i < groupValues.length; i += 1) {
      const datas = groupValues[i];
      if (values.colDef.field === datas.time && rowName === datas.group) {
        if (datas.values === "" || datas.values === null || datas.values === undefined || Number(datas.values) === 0) {
          return ` <span style="color: Silver  ">  ${0} </span> `;
        }
        return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      }
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
      aggFunc: codeNumberRender,
      cellRenderer: colorRender
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


// 转化为ag-grid能被显示的格式
// const converseFormatForAgGrid = (oraDatas: any) => {
//   debugger;
//   groupValues.length = 0;
//   moduleValues.length = 0;
//   const arrays: any[] = [];
//   if (oraDatas === null) {
//     return arrays;
//   }
//
//   for (let index = 0; index < oraDatas.length; index += 1) {
//     const starttime = oraDatas[index].range.start;
//     arrays.push({
//         devCenter: "研发中心",
//         "username": "前端",
//         [starttime]: oraDatas[index].side.front
//       }, {
//         devCenter: "研发中心",
//         "username": "后端",
//         [starttime]: oraDatas[index].side.backend
//       }
//     );
//
//     groupValues.push({
//       time: starttime,
//       group: "研发中心",
//       values: oraDatas[index].total.kpi
//     });
//
//     const data = oraDatas[index].datas;
//     for (let i = 0; i < data.length; i += 1) {
//
//       groupValues.push({
//         time: starttime,
//         group: data[i].deptName,
//         values: data[i].kpi
//       }, {
//         time: starttime,
//         group: data[i].parent.deptName,
//         values: data[i].parent.kpi
//       });
//
//       moduleValues.push({
//         time: starttime,
//         module: "前端",
//         parent: data[i].deptName,
//         values: data[i].side.front
//       }, {
//         time: starttime,
//         module: "后端",
//         parent: data[i].deptName,
//         values: data[i].side.backend
//       });
//
//
//       const usersData = data[i].users;
//       for (let m = 0; m < usersData.length; m += 1) {
//         const username = usersData[m].userName;
//         const counts = usersData[m].kpi;
//
//         arrays.push({
//           devCenter: "研发中心",
//           dept: data[i].parent.deptName,
//           group: data[i].deptName,
//           module: moduleChange(usersData[m].tech),
//           "username": username,
//           [starttime]: counts
//         });
//       }
//     }
//
//   }
//
//
//   return arrays;
// };

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
        devCenter: "研发中心",
        "username": "前端",
        [starttime]: Number(oraDatas[index].side.front)
      }
    );
    arrays.push({
        devCenter: "研发中心",
        "username": "后端",
        [starttime]: Number(oraDatas[index].side.backend)
      }
    );

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

      moduleValues.push({
        time: starttime,
        module: "前端",
        parent: data[i].deptName,
        values: data[i].side === null ? "" : data[i].side.front
      }, {
        time: starttime,
        module: "后端",
        parent: data[i].deptName,
        values: data[i].side === null ? "" : data[i].side.backend
      });

      const usersData = data[i].users;
      if (usersData !== null) {
        for (let m = 0; m < usersData.length; m += 1) {
          const username = usersData[m].userName;

          // 获取产品研发部前后端的数据
          if (data[i].deptName === "产品研发部") {
            arrays.push({
                devCenter: "研发中心",
                dept: "产品研发部",
                "username": "前端 ",
                [starttime]: data[i].side === null ? "" : Number(data[i].side.front)
              }, {
                devCenter: "研发中心",
                dept: "产品研发部",
                "username": "后端 ",   // 故意空一格，以便于区分上一个前后端
                [starttime]: data[i].side === null ? "" : Number(data[i].side.backend)
              }
            );
          }
          // 特殊处理宋老师和王润燕的部门和组
          if (username === "王润燕") {
            arrays.push({
              devCenter: "研发中心",
              dept: "产品研发部",
              "username": username,
              [starttime]: usersData[m].kpi
            });
          } else if (username === "宋永强") {
            arrays.push({
              devCenter: "研发中心",
              "username": username,
              [starttime]: usersData[m].kpi
            });
          } else if (data[i].parent === null || data[i].parent.deptName === "北京研发中心" || data[i].parent.deptName === "成都研发中心") {  // 如果是（北京或成都）研发中心，去掉部门的显示
            arrays.push({
                devCenter: "研发中心",
                group: data[i].deptName,
                module: moduleChange(usersData[m].tech),
                "username": username,
                [starttime]: usersData[m].kpi
              }
            );
          }
          else {
            arrays.push({
              devCenter: "研发中心",
              dept: data[i].parent.deptName,
              group: data[i].deptName,
              module: moduleChange(usersData[m].tech),
              "username": username,
              [starttime]: usersData[m].kpi
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



const queryCodeReviewCount = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
        codeReviewDept(kind:"${condition.typeFlag}",ends:${condition.ends}){
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
              tech
              kpi
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
    queryCodeReviewCount(gqlClient, 'quarter'),
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
    const datas: any = await queryCodeReviewCount(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryCodeReviewCount(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryCodeReviewCount(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  const [messageVisible, setVisible] = useState(false);
  const showRules = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const cssIndent = {textIndent: '2em'};
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
            // sort: 'asc'
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
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>} placement="right" width={300}
                closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：任务完成日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：任务完成日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：任务完成日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>
          <p><strong>2.统计项</strong></p>
          <p style={cssIndent}>任务标题含“code review”字样，大小写均可，由谁完成为开发的；</p>
        </Drawer>
      </div>

    </PageContainer>
  );
};

export default CodeReviewTableList;
