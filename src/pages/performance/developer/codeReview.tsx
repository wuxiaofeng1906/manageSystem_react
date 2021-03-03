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
const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

const compColums = [{
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
      field: `instCove${endtime.toString()}`,
    });


    // component.push({
    //   headerName: weekName,
    //   children: [
    //     {
    //       headerName: 'review个数',
    //       field: `instCove${endtime.toString()}`,
    //     },
    //   ],
    // });
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

const queryCodeReviewCount = async (client: GqlClient<object>, params: string) => {
  if (params === 'week') {
    console.log("按周");
  } else if (params === 'month') {
    console.log("按月");
  } else if (params === 'quarter') {
    console.log("按季度");
  } else {
    return [];
  }

  const {data} = await client.query(`
      {

      }
  `);
  return data;
};


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
    // const datas: any = await queryCodeReviewCount(gqlClient, 'week');
    //gridApi.current?.setRowData(datas);

  };

  // 按月统计
  const statisticsByMonths = async () => {
    /* 12月 */
    const monthColums = columsForMonths();
    gridApi.current?.setColumnDefs(monthColums);
    //   const datas: any = await queryCodeReviewCount(gqlClient, 'month');
    // gridApi.current?.setRowData(datas);

  };

  // 按季度统计
  const statisticsByQuarters = async () => {
    /* 4季 */
    const quartersColums = columsForQuarters();
    gridApi.current?.setColumnDefs(quartersColums);
    // const datas: any = await queryCodeReviewCount(gqlClient, 'quarter');
    // gridApi.current?.setRowData(datas);
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
            allowedAggFuncs: ['sum', 'min', 'max']
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
