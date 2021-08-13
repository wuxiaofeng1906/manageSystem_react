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
import {getHeight} from '@/publicMethods/pageSet';

import {Button, Drawer} from "antd";
import {ScheduleTwoTone, CalendarTwoTone, ProfileTwoTone, QuestionCircleTwoTone} from "@ant-design/icons";


// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();
const groupValues: any[] = [];

/* region 动态定义列 */
const compColums = [
  {
    headerName: '研发中心',
    field: 'devCenter',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '组名',
    field: 'group',
  }
];

function codeNumberRender(values: any) {
  const rowName = values.rowNode.key;
  if (rowName === undefined) {
    return 0;
  }

  for (let i = 0; i < groupValues.length; i += 1) {
    const datas = groupValues[i];
    if (values.colDef.field === datas.time && rowName === datas.devCenter) {
      if (datas.values === "" || datas.values === null || datas.values === undefined || Number(datas.values) === 0) {
        return 0;
      }
      return (Number(datas.values) / 86400).toFixed(2);
    }
  }

  return 0;
}


const rowrender = (params: any) => {

  if (params.value) {
    return (Number(params.value) / 86400).toFixed(2);
  }
  return 0;
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
      cellRenderer: rowrender
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
      cellRenderer: rowrender
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
      cellRenderer: rowrender
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

    const starttime = oraDatas[index].range.start;

    groupValues.push({
      devCenter: "研发中心",
      time: starttime,
      values: oraDatas[index].total.kpi   // 对研发中心的值进行特殊处理等于部门的值

    });

    const data = oraDatas[index].datas;
    for (let i = 0; i < data.length; i += 1) {

      arrays.push({
        devCenter: "研发中心",
        group: data[i].group,
        [starttime]: data[i].kpi
      });

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
      if (resultData[m].group === data[index].group) {
        repeatFlag = true;
        break;
      }
    }

    if (repeatFlag === false) {
      const tempData = {};
      for (let index2 = 0; index2 < data.length; index2 += 1) {
        tempData["group"] = data[index].group;

        if (data[index].group === data[index2].group) {
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

const queryLanchTime = async (client: GqlClient<object>, params: string) => {

  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const {data} = await client.query(`
      {
           problemAvgOnline(kind:"${condition.typeFlag}",ends:${condition.ends}){
            total{
              group
              kpi
            }
            range{
              start
              end
            }
            datas{
              group
              kpi
            }
          }
      }
  `);

  const result = converseFormatForAgGrid(data?.problemAvgOnline);
  return converseArrayToOne(result);

};

/* endregion */

const LaunchTimeTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryLanchTime(gqlClient, 'quarter'),
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
    const datas: any = await queryLanchTime(gqlClient, 'week');
    gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    gridApi.current?.setColumnDefs([]);
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    const datas: any = await queryLanchTime(gqlClient, 'month');
    gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    gridApi.current?.setColumnDefs([]);
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    const datas: any = await queryLanchTime(gqlClient, 'quarter');
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
        <label style={{fontWeight: "bold"}}>(统计单位：天)</label>
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
            minWidth: 150,
            // sort: 'asc'
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressAggFuncInHeader={true}   // 不显示标题聚合函数的标识
          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
          suppressScrollOnNewData={false}
        >
        </AgGridReact>
      </div>


      <div>
        <Drawer title={<label style={{"fontWeight": 'bold', fontSize: 20}}>计算规则</label>}
                placement="right" width={"300px"} closable={false} onClose={onClose} visible={messageVisible}>

          <p><strong>1.统计周期</strong></p>
          <p style={cssIndent}>按周统计：需求发布时间/关闭时间在周一00:00:00至周天23:59:59的；</p>
          <p style={cssIndent}>按月统计：需求发布时间/关闭时间在该月第一天00:00:00至该月最后一天23:59:59的；</p>
          <p style={cssIndent}>按季统计：需求发布时间/关闭时间在该季第一天00:00:00至该季最后一天23:59:59的；</p>

          <p><strong>2.统计范围</strong></p>
          <p style={cssIndent}>产品id=7or11；</p>
          <p style={cssIndent}>需求阶段=已发布或需求状态=已关闭；</p>
          <p style={cssIndent}>需求创建人是顾问或客服的（不限创建时间）；</p>
          <p style={cssIndent}> 需求创建人是产品、UED、测试、开发的，且需求创建日期&gt;=2021-7-16 00:00:00的
            （需求所属计划或关联项目名称包含“emergency/hotfix/sprint”的，或者“需求来源”的值为bug的，或者“条目类型”字段值为bug的）
            ，并且数据去重 </p>
          <p style={cssIndent}>做分组统计的时候，是bug转需求的，算在bug创建人所在组；</p>

          <p><strong>3.统计规则 </strong></p>
          <p style={cssIndent}>需求阶段已发布：该需求关联发布的时间减去该需求创建时间减去周末法定节假日；</p>
          <p style={cssIndent}>需求状态已关闭（历史信息有关联发布的）：该需求关联发布的时间减去该需求创建时间减去周末法定节假日；</p>
          <p style={cssIndent}>需求状态已关闭（历史信息没有关联发布的）：该需求的关闭时间减去该需求创建时间减去周末法定节假日；</p>

          <p><strong>4.统计公式（天） </strong></p>
          <p style={cssIndent}>按周统计：当周所有已发布/已关闭的需求上线时长求平均；</p>
          <p style={cssIndent}>按月统计：当月所有已发布/已关闭的需求上线时长求平均；</p>
          <p style={cssIndent}>按季统计：当季所有已发布/已关闭的需求上线时长求平均；</p>

        </Drawer>
      </div>

    </PageContainer>
  );
};

export default LaunchTimeTableList;
