import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {
  getWeeksRange,
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getYearsTime
} from '@/publicMethods/timeMethods';
import {Button, Drawer, message} from "antd";
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone
} from "@ant-design/icons";
import {getHeight} from "@/publicMethods/pageSet";
import axios from "axios";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime(true);
const groupValues: any[] = [];

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
      return ` <span style="font-weight: bold">  ${(Number(datas.values) * 100).toFixed(5)} </span> `;
    }
  }

  return ` <span style="color: Silver  ">  ${0} </span> `;
}

function colorRender(params: any) {

  if (params.value === "" || params.value === undefined || Number(params.value) === 0 || Number(params.value) === 0.00) {
    return ` <span style="color: Silver  ">  ${0} </span> `;
  }

  if (Number.isNaN(Number(params.value)) === false) {

    return (Number(params.value) * 100).toFixed(5);
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

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    component.push({
      headerName: yearsTime[index].title,
      field: yearsTime[index].start,
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

  const arrays: any[] = [];
  if (oraDatas === null) {
    return arrays;
  }

  for (let index = 0; index < oraDatas.length; index += 1) {
    const dt_data = oraDatas[index];
    const deptData = dt_data.change_rate;
    const username = dt_data.user;
    if (username === "dept") {

      deptData.forEach((ele: any) => {
        const starttime = (ele.time_interval)[0];
        groupValues.push({
          time: starttime,
          group: "研发中心",
          values: ele.change_rate
        }, {
          time: starttime,
          group: "产品管理部",
          values: ele.change_rate
        });
      });
    } else {
      const dataObject = {
        devCenter: "研发中心",
        group: "产品管理部",
        "username": username
      };

      deptData.forEach((ele: any) => {
        const starttime = (ele.time_interval)[0];
        dataObject[starttime] = ele.change_rate;
      });

      arrays.push(dataObject);
    }
  }

  return arrays;
};


const queryStoryChangeRate = async (timeFlag: string) => {

  let datas: any = [];
  const paramData = {interval: timeFlag, person_or_project: "person"};
  await axios.get('/api/verify/apply/change_rate', {params: paramData})
    .then(function (res) {

      if (res.data.code === 200) {

        datas = converseFormatForAgGrid(res.data.data);

      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1, // 1S 后自动关闭
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });

  return datas;
};

/* endregion */

const NeedsChangeRate: React.FC<any> = () => {

  /* region ag-grid */
  const {data, loading} = useRequest(() =>
    queryStoryChangeRate('quarter'),
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
    const datas: any = await queryStoryChangeRate('week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryStoryChangeRate('month');
    gridApi.current?.setRowData(datas);


  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();

    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryStoryChangeRate('quarter');
    gridApi.current?.setRowData(datas);

  };

  // 按年统计
  const statisticsByYear = async () => {
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForYears();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryStoryChangeRate('year');
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
