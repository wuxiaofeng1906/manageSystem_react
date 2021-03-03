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
import {FolderAddTwoTone,} from "@ant-design/icons";

// 获取近四周的时间范围
const weekRanges = getWeeksRange(8);

const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '所属部门',
      field: 'dept',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: '组名',
      field: 'group',
      rowGroup: true,
      hide: true,

    },
    {
      headerName: '姓名',
      field: 'username',
    },
  );

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

        },
        {
          headerName: '分支覆盖率',
          field: `branCove${endtime.toString()}`,
        },
      ],
    });
  }
  return component;
};

const queryDevelopViews = async (client: GqlClient<object>) => {

  const timeRange = new Array();
  for (let index = 0; index < weekRanges.length; index += 1) {
    timeRange.push(`"${weekRanges[index].to}"`);
  }
  // 求出开始时间和结束时间
  const start = `"${weekRanges[0].from}"`;
  const ends = `[${timeRange.join(",")}]`;

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

  console.log(data);
  return [];
};


const CodeReviewTableList: React.FC<any> = () => {

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() =>
    queryDevelopViews(gqlClient),
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

  const monthRange = getTwelveMonthTime();

  const quarterTime = getFourQuarterTime();
  // 按周统计
  const statisticsByWeeks = () => {
    /* 八周 */

  };


  // 按月统计
  const statisticsByMonths = () => {
    /* 12月 */
  };

  // 按季度统计
  const statisticsByQuarters = () => {
    /* 4季 */
  };

  return (
    <PageContainer>
      <div style={{background: 'white'}}>
        <Button type="text" style={{color: 'black'}} icon={<FolderAddTwoTone/>} size={'large'}
                onClick={statisticsByWeeks}>按周统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<FolderAddTwoTone/>} size={'large'}
                onClick={statisticsByMonths}>按月统计</Button>
        <Button type="text" style={{color: 'black'}} icon={<FolderAddTwoTone/>} size={'large'}
                onClick={statisticsByQuarters}>按季统计</Button>
      </div>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
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
