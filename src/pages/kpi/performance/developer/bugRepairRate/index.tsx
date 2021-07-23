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
import {moduleChange} from '@/publicMethods/cellRenderer';
import {Button, Drawer} from "antd";
import {ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone} from "@ant-design/icons";
import {customRound, getHeight} from "@/publicMethods/pageSet";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime(true);
const groupValues: any[] = [];
const moduleValues: any[] = [];

/* region 动态定义列 */
const compColums = [
  {
    headerName: '研发中心',
    field: 'devCenter',
    rowGroup: true,
    hide: true,
    sort: 'desc'
  }, {
    headerName: '所属部门',
    field: 'dept',
    rowGroup: true,
    hide: true,
    sort: 'desc'
  }, {
    headerName: '组名',
    field: 'group',
    rowGroup: true,
    hide: true,
    sort: 'desc'
  }, {
    headerName: '所属端',
    field: 'module',
    rowGroup: true,
    hide: true,

    sort: 'desc'

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

        if (moduleInfo.values === null || moduleInfo.values === undefined || moduleInfo.values === "" || moduleInfo.values === "null") {
          return 100;
        }
        if (moduleInfo.values === "0") {
          return 0;
        }

        if ((Number(moduleInfo.values) * 100) === 100) {
          return ` <span style="font-weight: bold">  ${100} </span> `;
        }
        return ` <span style="font-weight: bold">  ${customRound((Number(moduleInfo.values) * 100), 2)} </span> `;
      }

    }
  } else {

    for (let i = 0; i < groupValues.length; i += 1) {
      const datas = groupValues[i];
      if (values.colDef.field === datas.time && rowName === datas.group) {
        if (datas.values === null || datas.values === undefined || datas.values === "" || datas.values === "null") {
          return 100;
        }

        if ((Number(datas.values) * 100) === 100) {
          return ` <span style="font-weight: bold"> ${100} </span> `;
        }
        return ` <span style="font-weight: bold"> ${customRound((Number(datas.values) * 100), 2)} </span> `;
      }
    }
  }
  return 100;
}


function colorRender(params: any) {
  if (params.value === null || params.value === undefined || params.value === "" || params.value === "null") {
    return "100";
  }

  if (params.value === 0) {
    return ` <span style="color: #1890ff"> 0 </span> `;
  }

  if (params.value === 100) {
    return ` <span> ${100} </span> `;
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
        [starttime]: oraDatas[index].side === null ? null : oraDatas[index].side.front
      }
    );
    arrays.push({
        devCenter: "研发中心",
        "username": "后端",
        [starttime]: oraDatas[index].side === null ? null : oraDatas[index].side.backend
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
        }
        // , {
        //   time: starttime,
        //   group: data[i].parent === null ? null : data[i].parent.deptName,
        //   values: data[i].parent === null ? null : data[i].parent.kpi
        // }
      );

      moduleValues.push({
        time: starttime,
        module: "前端",
        parent: data[i].deptName,
        values: data[i].side === null ? null : data[i].side.front
      }, {
        time: starttime,
        module: "后端",
        parent: data[i].deptName,
        values: data[i].side === null ? null : data[i].side.backend
      });

      // 获取产品研发部前后端的数据
      if (data[i].deptName === "产品研发部") {
        arrays.push({
            devCenter: "研发中心",
            dept: "产品研发部",
            "username": "前端 ",
            [starttime]: data[i].side === null ? null : data[i].side.front
          }, {
            devCenter: "研发中心",
            dept: "产品研发部",
            "username": "后端 ",   // 故意空一格，以便于区分上一个前后端
            [starttime]: data[i].side === null ? null : data[i].side.backend
          }
        );
      }

      const usersData = data[i].users;
      if (usersData !== null) {
        for (let m = 0; m < usersData.length; m += 1) {
          const username = usersData[m].userName;

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
          } else {
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


const queryBugResolutionCount = async (client: GqlClient<object>, params: string) => {
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
  return converseArrayToOne(datas);
};

/* endregion */

const BugReopenTableList: React.FC<any> = () => {

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

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    // console.log("新高度：", getHeight());
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

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
            // sort: 'asc',
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
