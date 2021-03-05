import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {getWeeksRange, getMonthWeek, getTwelveMonthTime, getFourQuarterTime} from '@/publicMethods/timeMethods';
import {Button} from "antd";
import {ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone} from "@ant-design/icons";

// 获取近四周的时间范围
const weekRanges = getWeeksRange(4);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();
const InstGroupValues: any[] = [];
const branGroupValues: any[] = [];

/* region 表格渲染 */

// 合并结构列渲染
function instCoveRender(values: any) {
  // console.log("values", values);
  for (let i = 0; i < InstGroupValues.length; i += 1) {
    const datas = InstGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      // return datas.values;
      break;
    }
  }
  return "";
}

// 合并分支列渲染
function branCoveRender(values: any) {
  for (let i = 0; i < branGroupValues.length; i += 1) {
    const datas = branGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
      // return datas.values;
      break;
    }
  }
  return "";
}

// 表格代码渲染
function coverageCellRenderer(params: any) {
  // 判断是否包含属性
  if (params.hasOwnProperty("value")) {
    if (params.value === "0.00") {
      return ` <span style="color: dodgerblue">  ${0} </span> `;
    }
    return params.value;
  }
  return ` <span style="color: dodgerblue">  ${0} </span> `;
}

/* endregion */

/* region 动态定义列 */
const compColums = [
  {
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
  },];

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
          aggFunc: instCoveRender,
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
          aggFunc: branCoveRender,
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }
  return compColums.concat(component);
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      field: monthRanges[index].title,
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
      field: quarterTime[index].title,

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
function addGroupAndDept(oraDatas: any) {
  const objectDataArray: string | any[] = [];
  for (let index = 0; index < oraDatas.length; index += 1) {

    if (oraDatas[index] !== null) {
      const weekDatas = oraDatas[index].datas;
      if (weekDatas !== null) {
        for (let i = 0; i < weekDatas.length; i += 1) {
          const userInfo = weekDatas[i].users;
          const orderTime = weekDatas[i].order.end;
          let deptInfo = "";
          if (weekDatas[i].parent !== null) {
            deptInfo = weekDatas[i].parent.name;
          }
          let groupInfo = weekDatas[i].name;

          if (deptInfo === "成都研发中心") {
            deptInfo = "前端平台研发部";
            groupInfo = "前端平台研发";

            InstGroupValues.push({
              time: `instCove${orderTime}`,
              group: "前端平台研发部",
              values: weekDatas[i].instCove
            });

            branGroupValues.push({
              time: `branCove${orderTime}`,
              group: "前端平台研发部",
              values: weekDatas[i].branCove
            });
          }
          // 此代码处理组的覆盖率,将组的单元测试覆盖率存到全局变量

          // 特殊处理产品研发部的数据
          if (deptInfo === "产品研发部") {
            InstGroupValues.push({
              time: `instCove${orderTime}`,
              group: "产品研发部",
              values: weekDatas[i].parent.instCove
            });

            branGroupValues.push({
              time: `branCove${orderTime}`,
              group: "产品研发部",
              values: weekDatas[i].parent.branCove
            });
          }

          // 添加所有部门和组的信息
          InstGroupValues.push({
            time: `instCove${orderTime}`,
            group: groupInfo,
            values: weekDatas[i].instCove
          });

          branGroupValues.push({
            time: `branCove${orderTime}`,
            group: groupInfo,
            values: weekDatas[i].branCove
          });


          let index2;
          // 此循环用于处理个人的覆盖率
          for (index2 = 0; index2 < userInfo.length; index2 += 1) {
            if (userInfo[index2].name !== "王润燕" && userInfo[index2].name !== "宋永强") {
              objectDataArray.push({
                group: groupInfo,
                dept: deptInfo,
                username: userInfo[index2].name,
                [`instCove${orderTime}`]: userInfo[index2].instCove,
                [`branCove${orderTime}`]: userInfo[index2].branCove
              });
            }
          }
        }
      }
    }
  }
  debugger;
  return objectDataArray;
};

function dealData(tempDataArray: any) {
  const resultDataArray: string | any[] = [];

  // 首先需要获取所有已有的人名。
  let userNames = new Array();
  for (let i = 0; i < tempDataArray.length; i += 1) {
    userNames.push(tempDataArray[i].username);
  }
  userNames = Array.from(new Set(userNames));

  // 将相同人名的属性放到一起
  for (let userIndex = 0; userIndex < userNames.length; userIndex += 1) {
    // 声明一个对象
    const objectStr = {};
    for (let i = 0; i < tempDataArray.length; i += 1) {
      // 当姓名相等，则把属性放到一起
      if (userNames[userIndex] === tempDataArray[i].username) {
        // 遍历属性
        Object.keys(tempDataArray[i]).forEach((key) => {
          objectStr[key] = tempDataArray[i][key];
        });
      }
    }
    // 再把最终的对象放到数组中
    resultDataArray.push(objectStr);
  }
  console.log('resultDataArray', resultDataArray);
  return resultDataArray;
}

const queryFrontCoverage = async (client: GqlClient<object>, params: string) => {
  let start = "";
  let ends = "";
  if (params === 'week') {
    const timeRange = new Array();
    for (let index = 0; index < weekRanges.length; index += 1) {
      timeRange.push(`"${weekRanges[index].to}"`);
    }
    // 求出开始时间和结束时间
    start = `"${weekRanges[0].from}"`;
    ends = `[${timeRange.join(",")}]`;
  } else if (params === 'month') {

    console.log("按月");
    return [];
  } else if (params === 'quarter') {
    console.log("按季度");
    return [];
  } else {
    return [];
  }

  const {data} = await client.query(`
       {
        detailCover(side:FRONT,start:${start},ends:${ends}){
          datas{
            id
            side
            name
            parent{
            name
            instCove
            branCove
            }
            instCove
            branCove
            order{
              start
              end
            }
            users{
              name
              instCove
              branCove
            }
          }
        }

      }
    `);
  const objectValues = addGroupAndDept(data?.detailCover);
  return dealData(objectValues);
};

/* endregion */

const CodeReviewTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryFrontCoverage(gqlClient, 'week'),
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

  /* region 按钮点击事件 */
  // 按周统计
  const statisticsByWeeks = async () => {
    /* 4周 */
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

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
            cellStyle: {"margin-top": "-5px"}
          }}
          autoGroupColumnDef={{
            maxWidth: 300,
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
    </PageContainer>
  );
};

export default CodeReviewTableList;
