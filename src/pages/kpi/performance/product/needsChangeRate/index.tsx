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
      return ` <span style="font-weight: bold">  ${(Number(datas.values) * 100).toFixed(2)} </span> `;
    }
  }

  return ` <span style="color: Silver  ">  ${0} </span> `;
}

function colorRender(params: any) {

  if (params.value === "" || params.value === undefined || Number(params.value) === 0 || Number(params.value) === 0.00) {
    return ` <span style="color: Silver  ">  ${0} </span> `;
  }

  if (Number.isNaN(Number(params.value)) === false) {

    return (Number(params.value) * 100).toFixed(2);
  }

  return params.value;  // 为了将聚合函数实现格式化
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

    groupValues.push({
      time: starttime,
      group: "研发中心",
      // values: oraDatas[index].total.kpi
      values: oraDatas[index].datas[0].kpi   // 对研发中心的值进行特殊处理等于部门的值

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
          if (username !== "薛峰") {
            arrays.push({
              devCenter: "研发中心",
              group: data[i].deptName,
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
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
        proChangeApply(kind: "${condition.typeFlag}", ends: ${condition.ends}){
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

  const datas = converseFormatForAgGrid(data?.proChangeApply);
  return converseArrayToOne(datas);
};

/* endregion */

const NeedsChangeRate: React.FC<any> = () => {

  /* region ag-grid */
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryBugResolutionCount(gqlClient, 'quarter'),
  );


  const gridApi = useRef<GridApi>();
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
        <label style={{fontWeight: "bold"}}>(统计单位：%)</label>

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
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>

      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={300} closable={false} onClose={onClose} visible={messageVisible}>


          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：企业微信变更申请提交日期为周一00:00:00--周日23:59:59；</p>
          <p style={cssIndent}>按月统计：企业微信变更申请提交日期为每月1号00:00:00--每月最后1天23:59:59；</p>
          <p style={cssIndent}>按季统计：企业微信变更申请提交日期为每季第一个月1号00:00:00--每季第三个月最后1天23:59:59；</p>

          <p style={cssIndent}> 2.按产品经理统计</p>
          <p style={cssIndent}> 3.变更工作量=开发工作量+测试工作量+其他</p>
          <p style={cssIndent}> 4.原始工作量=设计完成后开发定详细开发计划评估的工作量+测试评估工作量+其他</p>

          <p style={{color: "#1890FF"}}><strong>5.计算公式说明</strong></p>
          <p style={cssIndent}>特别注意：当计算分母的时候，需要先判断项目名称是否一致，若项目名称一致时需判断提交人是否一致，
            若多次变更的项目名称和提交人都一致的时候（审批编号不一致），则分母只计算1次的project_cost_hour值，不要把多次求和，否则都一律分母按规则求和。</p>
          <p><strong>按人员统计</strong></p>
          <p style={cssIndent}>周报：（当周有变更项目的需求变更工作量/该项目原始工作量 求和）/当周变更项目数；
            （该产品经理该周的change_cost_hour字段和 除以 该产品经理该周的project_cost_hour字段和）</p>
          <p style={cssIndent}>月报：（当月有变更项目的需求变更工作量/该项目原始工作量 求和）/当月变更项目数；
            （该产品经理该月的change_cost_hour字段和 除以 该产品经理该月的project_cost_hour字段和）</p>
          <p style={cssIndent}>季报：（当季有变更项目的需求变更工作量/该项目原始工作量 求和）/当季变更项目数；
            （该产品经理该季度的change_cost_hour字段和 除以 该产品经理该季度的project_cost_hour字段和）</p>
          <p><strong>按部门/按中心统计</strong></p>
          <p style={cssIndent}>周报：（当周有变更项目的需求变更工作量/该项目原始工作量 求和）/当周变更项目数；
            （产品管理部门该周的change_cost_hour字段和 除以 产品管理部门该周的project_cost_hour字段和）</p>
          <p style={cssIndent}>月报：（当月有变更项目的需求变更工作量/该项目原始工作量 求和）/当月变更项目数；
            （产品管理部门该月的change_cost_hour字段和 除以 产品管理部门该月的project_cost_hour字段和）</p>
          <p style={cssIndent}>季报：（当季有变更项目的需求变更工作量/该项目原始工作量 求和）/当季变更项目数；
            （产品管理部门该季度的change_cost_hour字段和 除以 产品管理部门的project_cost_hour字段和）</p>

        </Drawer>
      </div>
    </PageContainer>
  );
};

export default NeedsChangeRate;
