import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {Tabs} from 'antd';
import {FundTwoTone, DatabaseTwoTone} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
// 引入 ECharts 主模块
import * as echarts from 'echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const {TabPane} = Tabs;

/* region 分析报告页面 */

/* endregion */

/* region 源数据页面 */
const compColums = [
  {
    headerName: '研发中心',
    field: 'devCenter',
    rowGroup: true,
    hide: true,
  },
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
    headerName: '所属端',
    field: 'module',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '姓名',
    field: 'username',
  },
];

const queryBugResolutionCount = async (client: GqlClient<object>, params: string) => {

  // const { data } = await client.query(`
  //     {
  //
  //
  //     }
  // `);

  return [];
};
/* endregion */

const CodeTableList: React.FC<any> = () => {
  /* region 分析报告页面 */
  const showTestChart=()=>{
    const bom = document.getElementById('main');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(bom);
      console.log("myChart", myChart)
      // 绘制图表
      myChart.setOption({
        title : {
          text: '未来一周气温变化',
          subtext: '纯属虚构'
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['最高气温','最低气温']
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        calculable : true,
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
          }
        ],
        yAxis : [
          {
            type : 'value',
            axisLabel : {
              formatter: '{value} °C'
            }
          }
        ],
        series : [
          {
            name:'最高气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name: '平均值'}
              ]
            }
          },
          {
            name:'最低气温',
            type:'line',
            data:[1, -2, 2, 5, 3, 2, 0],
            markPoint : {
              data : [
                {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name : '平均值'}
              ]
            }
          }
        ]
      });
    }
  }

  /* endregion */


  /* region 源数据页面 */

  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryBugResolutionCount(gqlClient, 'quarter'));
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

  /* endregion */


  const callback = (clickTab: any) => {
    console.log(clickTab);
    if(clickTab === "sourceData"){

    }else{
      showTestChart();
    }
  }

  useEffect(()=>{
    // showTestChart();
  },[]);


  return (
    <PageContainer>
      <div style={{marginTop: "-35px"}}>
        <Tabs defaultActiveKey="sourceData" onChange={callback} size={"large"}>

          <TabPane tab={<span> <FundTwoTone/>分析报告</span>} key="analysisReport">

            <div id="main" style={{marginTop:30, height:500}}>

            </div>
          </TabPane>

          <TabPane tab={<span> <DatabaseTwoTone/>源数据</span>} key="sourceData">
            <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
              <AgGridReact
                columnDefs={compColums} // 定义列
                rowData={data} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  flex: 1,
                  cellStyle: {'margin-top': '-5px'},
                }}
                autoGroupColumnDef={{
                  minWidth: 250,
                  // sort: 'asc'
                }}
                groupDefaultExpanded={9} // 展开分组
                suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
                rowHeight={32}
                headerHeight={35}
                onGridReady={onGridReady}
                suppressScrollOnNewData={false}
              >

              </AgGridReact>
            </div>

          </TabPane>

        </Tabs>
      </div>


    </PageContainer>
  );
};

export default CodeTableList;
