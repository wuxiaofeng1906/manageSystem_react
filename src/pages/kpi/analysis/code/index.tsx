import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {Button, Col, DatePicker, Form, Tabs} from 'antd';
import {FundTwoTone, DatabaseTwoTone, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import * as echarts from 'echarts';// 引入 ECharts 主模块
import 'echarts/lib/chart/bar';// 引入柱状图
import 'echarts/lib/component/tooltip';// 引入提示框和标题组件
import 'echarts/lib/component/title';
import {moduleChange, areaRender, groupRender} from "@/publicMethods/cellRenderer";
import {getWeeksRange} from "@/publicMethods/timeMethods";


const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

/* region 分析报告页面 */

/* endregion */

/* region 源数据页面 */

// 定义列名
const getSourceColums = () => {

  // 获取缓存的字段
  const fields = localStorage.getItem("sp_details_filed");
  const oraFields: any = [
    // {
    //   headerName: '选择',
    //   pinned: 'left',
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    //   maxWidth: 35,
    // },
    {
      headerName: 'NO.',
      minWidth: 60,
      maxWidth: 80,
      filter: false,
      pinned: 'left',
      suppressMenu: true,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '姓名',
      field: 'userName',
      pinned: 'left',
      minWidth: 80,
    },
    {
      headerName: '最大值',
      field: 'maxLines',
      minWidth: 80,
      suppressMenu: true,
    },
    {
      headerName: '平均值',
      field: 'avgLines',
      minWidth: 80,
      suppressMenu: true,

    },
    {
      headerName: '最小值',
      field: 'minLines',
      minWidth: 80,
      suppressMenu: true,
    },
    {
      headerName: '部门',
      field: 'deptName',
      minWidth: 135,
    },
    {
      headerName: '组',
      field: 'groupName',
      minWidth: 135,
      cellRenderer: groupRender,
      // filterParams: {cellRenderer:groupRender}
    },
    {
      headerName: '端',
      field: 'tech',
      minWidth: 70,
      cellRenderer: (params: any) => {
        return moduleChange(params.value);
      },
      filterParams: {
        cellRenderer: (params: any) => {
          return moduleChange(params.value);
        }
      }
    },
    {
      headerName: '地域',
      field: 'area',
      minWidth: 80,
      cellRenderer: areaRender,
      filterParams: {cellRenderer: areaRender}
    }, {
      headerName: '职务',
      field: 'job',
      minWidth: 95,
    },
    {
      headerName: '岗位类型',
      field: 'position',
      minWidth: 135,
    },
    {
      headerName: '类型',
      field: 'labour',
      minWidth: 80,
    },
    {
      headerName: '出勤状态',
      field: 'attendance',
      minWidth: 110,
    },
    {
      headerName: '项目阶段',
      field: 'stage',
      minWidth: 110,
    },
  ];
  if (fields === null) {
    return oraFields;
  }
  const myFields = JSON.parse(fields);
  const component = new Array();

  oraFields.forEach((ele: any) => {
    const newElement = ele;
    if (myFields.includes(ele.headerName)) {
      newElement.hide = false;
    } else {
      newElement.hide = true;
    }
    component.push(newElement);
  });

  return oraFields;
};


const querySourceData = async (client: GqlClient<object>, params: any) => {

  const {data} = await client.query(`
      {
        avgCodeAnalysis(start:"${params.start}",end:"${params.end}"){
        userId
        userName
        maxLines
        avgLines
        minLines
        deptName
        groupName
        tech
        area
        position
        job
        labour
        attendance
        stage
      }

      }
  `);

  return data?.avgCodeAnalysis;
};

/* endregion */

const CodeTableList: React.FC<any> = () => {
  // 公共定义
  const gqlClient = useGqlClient();

  /* region 分析报告页面 */
  const showTestChart = () => {
    const bom = document.getElementById('main');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(bom);
      console.log("myChart", myChart)
      // 绘制图表
      myChart.setOption({
        title: {
          text: '未来一周气温变化',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高气温', '最低气温']
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          },
          {
            name: '最低气温',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
              ]
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            }
          }
        ]
      });
    }
  }

  /* endregion */


  /* region 源数据页面 */

  const gridApiForSource = useRef<GridApi>();
  const onSourceGridReady = (params: GridReadyEvent) => {
    gridApiForSource.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 表格的屏幕大小自适应
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()) - 64);
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 64);
    gridApiForSource.current?.sizeColumnsToFit();
  };


  // 初始化显示和显示默认数据
  const showSourceData = async () => {
    const weekRanges = getWeeksRange(8);
    const range = {
      start: weekRanges[0].from,
      end: weekRanges[7].to
    };
    const datas: any = await querySourceData(gqlClient, range);
    gridApiForSource.current?.setRowData(datas);
  };

  // 时间选择事件
  const onDataTimeSelected = async (params: any, dateString: any) => {

    const range = {
      start: dateString[0],
      end: dateString[1]
    };
    const datas: any = await querySourceData(gqlClient, range);
    gridApiForSource.current?.setRowData(datas);

  };


// 显示自定义字段
  const showFieldsModal = () => {

  };
  /* endregion */


  // tab 切换事件
  const callback = (clickTab: any) => {

    if (clickTab === "sourceData") {
      showSourceData();
    } else {
      showTestChart();
    }
  }

  useEffect(() => {
    // showTestChart();
  }, []);


  return (
    <PageContainer>
      <div style={{marginTop: "-35px"}}>
        <Tabs defaultActiveKey="analysisReport" onChange={callback} size={"large"}>
          {/* 分析页面 */}
          <TabPane tab={<span> <FundTwoTone/>分析报告</span>} key="analysisReport">

            <div id="main" style={{marginTop: 30, height: 500}}>

            </div>
          </TabPane>

          {/* 数据源页面 */}
          <TabPane tab={<span> <DatabaseTwoTone/>源数据</span>} key="sourceData">
            <div style={{width: '100%', overflow: 'auto', whiteSpace: 'nowrap'}}>
              <Form.Item>

                <label style={{marginLeft: "10px"}}>时间：</label>
                <RangePicker
                  style={{width: '30%'}} onChange={onDataTimeSelected}
                />

                <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                        icon={<LogoutOutlined/>} size={'small'} onClick={showSourceData}>
                  默认：</Button>
                <label style={{marginLeft: "-10px", color: 'black'}}> 默认8周</label>

                <Button type="text" icon={<SettingOutlined/>} size={'large'} onClick={showFieldsModal}
                        style={{float: "right"}}> </Button>

              </Form.Item>

            </div>

            <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: -10}}>
              <AgGridReact
                columnDefs={getSourceColums()} // 定义列
                rowData={[]} // 数据绑定
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  flex: 1,
                  cellStyle: {"line-height": "28px"},
                }}
                autoGroupColumnDef={{
                  minWidth: 250,
                  // sort: 'asc'
                }}
                groupDefaultExpanded={9} // 展开分组
                suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
                rowHeight={30}
                headerHeight={35}
                onGridReady={onSourceGridReady}
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
