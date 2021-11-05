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
  getYearsTime
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
import {colorRender, moduleChange} from "@/publicMethods/cellRenderer";

// 获取近四周的时间范围
const weekRanges = getWeeksRange(4);
const monthRanges = getTwelveMonthTime(6);
const quarterTime = getFourQuarterTime();
const InstGroupValues: any[] = [];
const branGroupValues: any[] = [];
const instModuleValues: any[] = [];
const branModuleValues: any[] = [];


/* region 表格渲染 */

// 合并结构列渲染
function instCoveRender(values: any) {

  const rowName = values.rowNode.key;
  if (rowName === "前端" || rowName === "后端") {
    for (let i = 0; i < instModuleValues.length; i += 1) {
      const moduleInfo = instModuleValues[i];
      if (values.colDef.field === moduleInfo.time && rowName === moduleInfo.module && values.rowNode.parent.key === moduleInfo.parent) {
        if (moduleInfo.values === "" || moduleInfo.values === null || moduleInfo.values === undefined || Number(moduleInfo.values) === 0) {
          return ` <span style="color: Silver  ">  ${0} </span> `;
        }
        return ` <span style="font-weight: bold">  ${customRound(Number(moduleInfo.values), 2)} </span> `;
      }
    }
  }

  for (let i = 0; i < InstGroupValues.length; i += 1) {
    const datas = InstGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      if (Number(datas.values) === 0) {
        return ` <span style="color: Silver ">  0</span> `;
      }
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
    }
  }
  return "";
}

// 合并分支列渲染
function branCoveRender(values: any) {

  const rowName = values.rowNode.key;
  if (rowName === "前端" || rowName === "后端") {
    for (let i = 0; i < branModuleValues.length; i += 1) {
      const moduleInfo = branModuleValues[i];
      if (values.colDef.field === moduleInfo.time && rowName === moduleInfo.module && values.rowNode.parent.key === moduleInfo.parent) {
        if (moduleInfo.values === "" || moduleInfo.values === null || moduleInfo.values === undefined || Number(moduleInfo.values) === 0) {
          return ` <span style="color: Silver  ">  ${0} </span> `;
        }
        return ` <span style="font-weight: bold">  ${customRound(Number(moduleInfo.values), 2)} </span> `;
      }
    }
  }

  for (let i = 0; i < branGroupValues.length; i += 1) {
    const datas = branGroupValues[i];
    if (values.colDef.field === datas.time && values.rowNode.key === datas.group) {
      if (Number(datas.values) === 0) {
        return ` <span style="color: Silver ">  0</span> `;
      }
      return ` <span style="font-weight: bold">  ${datas.values} </span> `;
    }

  }
  return '';
}

// 表格代码渲染
function coverageCellRenderer(params: any) {
  // 判断是否包含属性
  if (params.hasOwnProperty("value")) {
    if (params.value === "0.00") {
      return ` <span style="color: Silver  ">  ${0} </span> `;   // Silver
    }
    return params.value;
  }
  return ` <span style="color: Silver  ">  ${0} </span> `;
}

/* endregion */

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
    const endtime = monthRanges[index].end;
    component.push({
      headerName: monthRanges[index].title,
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

const columsForQuarters = () => {

  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    const endtime = quarterTime[index].end;
    component.push({
      headerName: quarterTime[index].title,
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

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    const endtime = yearsTime[index].end;
    component.push({
      headerName: yearsTime[index].title,
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

/* endregion */

/* region 数据处理 */
function addGroupAndDept(oraDatas: any) {
  instModuleValues.length = 0;
  branModuleValues.length = 0;
  InstGroupValues.length = 0;
  branGroupValues.length = 0;
  const objectDataArray: string | any[] = [];
  for (let index = 0; index < oraDatas.length; index += 1) {
    if (oraDatas[index] !== null) {
      const orderTime = oraDatas[index].range.end;
      // 研发中心数据
      objectDataArray.push({
        devCenter: "研发中心",
        "username": "前端",
        [`instCove${orderTime}`]: customRound(Number(oraDatas[index].side.front.instCove * 100), 2),
        [`branCove${orderTime}`]: customRound(Number(oraDatas[index].side.front.branCove * 100), 2)
      });

      objectDataArray.push({
        devCenter: "研发中心",
        "username": "后端",
        [`instCove${orderTime}`]: customRound(Number(oraDatas[index].side.backend.instCove * 100), 2),
        [`branCove${orderTime}`]: customRound(Number(oraDatas[index].side.backend.branCove * 100), 2)
      });
      InstGroupValues.push({
        time: `instCove${orderTime}`,
        group: "研发中心",
        values: customRound(Number(oraDatas[index].total.instCove * 100), 2),

      });

      branGroupValues.push({
        time: `branCove${orderTime}`,
        group: "研发中心",
        values: customRound(Number(oraDatas[index].total.branCove * 100), 2),

      });


      const weekDatas = oraDatas[index].datas;
      if (weekDatas !== null) {
        for (let i = 0; i < weekDatas.length; i += 1) {
          const userInfo = weekDatas[i].users;
          let deptInfo = "";
          if (weekDatas[i].parent !== null) {
            deptInfo = weekDatas[i].parent.deptName;
          }
          let groupInfo = weekDatas[i].deptName;


          if (groupInfo === "前端平台研发部") {
            deptInfo = "前端平台研发部";
            groupInfo = "前端平台研发";
            InstGroupValues.push({
              time: `instCove${orderTime}`,
              group: "前端平台研发部",
              values: customRound(Number(weekDatas[i].instCove * 100), 2),
            });

            branGroupValues.push({
              time: `branCove${orderTime}`,
              group: "前端平台研发部",
              values: customRound(Number(weekDatas[i].branCove * 100), 2),
            });
          }

          // 特殊处理产品研发部的数据
          if (deptInfo === "产品研发部") {
            InstGroupValues.push({
              time: `instCove${orderTime}`,
              group: "产品研发部",
              values: customRound(Number(weekDatas[i].parent.instCove * 100), 2),

            });

            branGroupValues.push({
              time: `branCove${orderTime}`,
              group: "产品研发部",
              values: customRound(Number(weekDatas[i].parent.branCove * 100), 2),

            });
          }

          // 添加所有部门和组的信息
          InstGroupValues.push({
            time: `instCove${orderTime}`,
            group: groupInfo,
            values: customRound(Number(weekDatas[i].instCove * 100), 2),

          });

          branGroupValues.push({
            time: `branCove${orderTime}`,
            group: groupInfo,
            values: customRound(Number(weekDatas[i].branCove * 100), 2),
          });

          instModuleValues.push({
            time: `instCove${orderTime}`,
            module: "前端",
            parent: weekDatas[i].deptName,
            values: weekDatas[i].side === null ? "" : customRound(Number(weekDatas[i].side.front.instCove) * 100, 2),
          }, {
            time: `instCove${orderTime}`,
            module: "后端",
            parent: weekDatas[i].deptName,
            values: weekDatas[i].side === null ? "" : customRound(Number(weekDatas[i].side.backend.instCove) * 100, 2),
          });

          branModuleValues.push({
            time: `branCove${orderTime}`,
            module: "前端",
            parent: weekDatas[i].deptName,
            values: weekDatas[i].side === null ? "" : customRound(Number(weekDatas[i].side.front.branCove) * 100, 2),
          }, {
            time: `branCove${orderTime}`,
            module: "后端",
            parent: weekDatas[i].deptName,
            values: weekDatas[i].side === null ? "" : customRound(Number(weekDatas[i].side.backend.branCove) * 100, 2),
          });

          // 此循环用于处理个人的覆盖率
          for (let index2 = 0; index2 < userInfo.length; index2 += 1) {
            if (userInfo[index2].userName !== "王润燕" && userInfo[index2].userName !== "宋永强") {
              if (weekDatas[i].parent === null || weekDatas[i].parent.deptName === "北京研发中心" || weekDatas[i].parent.deptName === "成都研发中心") {  // 如果是（北京或成都）研发中心，去掉部门的显示
                if (weekDatas[i].parent.deptName !== "研发中心") {
                  objectDataArray.push({
                      devCenter: "研发中心",
                      group: weekDatas[i].deptName,
                      module: moduleChange(userInfo[index2].tech),
                      "username": userInfo[index2].userName,
                      [`instCove${orderTime}`]: customRound(Number(userInfo[index2].instCove * 100), 2),
                      [`branCove${orderTime}`]: customRound(Number(userInfo[index2].branCove * 100), 2)
                    }
                  );
                }

              } else if (groupInfo !== "北京研发中心" && deptInfo !== "研发中心") {
                objectDataArray.push({
                  devCenter: "研发中心",
                  group: groupInfo,
                  module: moduleChange(userInfo[index2].tech),
                  dept: deptInfo,
                  username: userInfo[index2].userName,
                  [`instCove${orderTime}`]: customRound(Number(userInfo[index2].instCove * 100), 2),
                  [`branCove${orderTime}`]: customRound(Number(userInfo[index2].branCove * 100), 2)
                });
              }

            }
          }
        }
      }
    }
  }

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
  let ends = "";
  let typeFlag = 0;
  if (params === 'week') {
    const timeRange = new Array();
    for (let index = 0; index < weekRanges.length; index += 1) {
      timeRange.push(`"${weekRanges[index].to}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 0;
  } else if (params === 'month') {
    const timeRange = new Array();
    for (let index = 0; index < monthRanges.length; index += 1) {
      timeRange.push(`"${monthRanges[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 2;
  } else if (params === 'quarter') {
    const timeRange = new Array();
    for (let index = 0; index < quarterTime.length; index += 1) {
      timeRange.push(`"${quarterTime[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 3;
  } else if (params === 'year') {
    const timeRange = new Array();
    const yearsTime = getYearsTime();
    for (let index = 0; index < yearsTime.length; index += 1) {
      timeRange.push(`"${yearsTime[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 4;
  } else {
    return [];
  }

  //  fileCoverageDept(kind:"${typeFlag}",ends:${ends}){
  //   fileCoverageDept(kind: "4", ends: ["2021-12-31","2020-12-31","2019-12-31"]){
  //    fileCoverageDept(kind:"4",ends:["2021-12-31"]){
  const {data} = await client.query(`
       {
        fileCoverageDept(kind:"${typeFlag}",ends:${ends}){
            total{
              dept
              deptName
              instCove
              branCove
            }
            side{
              front{
                instCove
                branCove
              }
              backend{
                instCove
                branCove
              }
            }
            range{
              start
              end
            }
            datas{
              dept
              deptName
              instCove
              branCove
              parent{
                deptName
               }
              side{
                front{
                  instCove
                  branCove
                }
                backend{
                  instCove
                  branCove
                }
              }
              users{
                userId
                userName
                instCove
                branCove
                tech
              }
            }
          }

      }
    `);

  debugger;
  const objectValues = addGroupAndDept(data?.fileCoverageDept);
  return dealData(objectValues);
};

/* endregion */

const CodeReviewTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryFrontCoverage(gqlClient, 'quarter'),
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
    /* 4周 */
    gridApi.current?.setColumnDefs([]);
    const weekColums = columsForWeeks();
    gridApi.current?.setColumnDefs(weekColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'quarter');
    gridApi.current?.setRowData(datas);
  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForYears();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryFrontCoverage(gqlClient, 'year');
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
            cellStyle: {"margin-top": "-5px"}
          }}
          autoGroupColumnDef={{
            minWidth: 250,
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressAggFuncInHeader={true}   // 不显示标题聚合函数的标识
          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>
          <p><strong>1.统计周期</strong></p>

          <p style={cssIndent}>按周统计：覆盖率为当周最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按月统计：覆盖率为当月最新的覆盖率(累计)；</p>
          <p style={cssIndent}>按季统计：覆盖率为当季度最新的覆盖率(累计)；</p>

          <p style={{color: "#1890FF"}}><strong>2.计算公式</strong></p>
          <p style={cssIndent}>结构覆盖率 = 所拥有文件结构覆盖数之和/所有拥有文件总结构数之和；</p>
          <p style={cssIndent}>分支覆盖率 = 所拥有文件分支覆盖数之和/所有拥有文件总分支数之和；</p>

          <p><strong>3.取值</strong></p>
          <p style={cssIndent}>前端取值：结构数：Statements；支数：Branches；</p>
          <p style={cssIndent}>后端取值：结构数：Instructions Cov；分支数：Branches；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default CodeReviewTableList;
