import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import type {GqlClient} from '@/hooks';
import {useGqlClient} from '@/hooks';
import {Button, Checkbox, Col, DatePicker, Form, message, Modal, Row} from 'antd';
import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import moment from 'moment';
import {useRequest} from 'ahooks';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

// import ReactEcharts from 'echarts-for-react';

const {RangePicker} = DatePicker;

// 格式化单元格内容
const cellFormat = (params: any) => {
  if (Number(params.value)) {
    const numbers = params.value.toString();
    if (numbers.indexOf('.') > -1) {
      // 判断有无小数点
      return Number(params.value).toFixed(2);
    }
    return Number(params.value);
  }
  return 0;
};

// 定义列名

const alaysisData = (source: any, startTime: string, endTime: string) => {
  const data: any = [];
  source.forEach((dts: any) => {
    let deptname = '';
    let groupname = '';
    const dept_group = dts.deptsName;
    if (dept_group) {
      groupname = dept_group[0].toString();

      if (dept_group[1]) {
        deptname = dept_group[1].toString();
      } else {
        deptname = groupname;
      }
    }

    data.push({
      userId: dts.userId,
      userName: dts.userName,
      dept: deptname,
      group: groupname,
      finiStory: dts.finiStory,
      finiTask: dts.finiTask,
      resolvedBug: dts.resolvedBug,
      doingTask: dts.doingTask,
      codeCommit: dts.codeCommit,
      newLine: dts.newLine,
      start: startTime,
      end: endTime,
    });
  });

  return data;
};

// 公共查询方法
const queryFrontData = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`{
          dashFront(start:"${params.start}",end:"${params.end}"){
            userId
            userName
            deptsName
            finiStory
            finiTask
            resolvedBug
            doingTask
            codeCommit
            newLine
          }

      }
  `);

  return alaysisData(data?.dashFront, params.start.toString(), params.end.toString());
};

// 查询单人的燃尽图
const queryBurnChartData = async (
  client: GqlClient<object>,
  userId: string,
  start: string,
  end: string,
) => {
  const {data} = await client.query(`{
          burnoutDiagram(start:"${start}",end:"${end}",userIds:["${userId}"]){
            userId
            dates
            estimate
            consumed
            left
          }
      }
  `);

  return data?.burnoutDiagram;
};

const FrontTableList: React.FC<any> = () => {
  const g_currentMonth_range = {
    start: dayjs().startOf('month').format('YYYY-MM-DD'),
    end: dayjs().endOf('month').format('YYYY-MM-DD'),
  };

  const gqlClient = useGqlClient();

  const {data, loading} = useRequest(() => queryFrontData(gqlClient, g_currentMonth_range));
  const gridApiForFront = useRef<GridApi>();
  const onSourceGridReady = (params: GridReadyEvent) => {
    gridApiForFront.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApiForFront.current) {
    if (loading) gridApiForFront.current.showLoadingOverlay();
    else gridApiForFront.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [sourceGridHeight, setGridHeight] = useState(Number(getHeight()));
  window.onresize = function () {
    setGridHeight(Number(getHeight()));
    gridApiForFront.current?.sizeColumnsToFit();
  };

  /* region 数据条件查询 */
  const [choicedConditionForSource, setQueryConditionForSource] = useState({
    start: g_currentMonth_range.start,
    end: g_currentMonth_range.end,
  });

  //  默认显示本月数据（1号-31号）
  const showSourceDefaultData = async () => {
    setQueryConditionForSource({
      start: g_currentMonth_range.start,
      end: g_currentMonth_range.end,
    });
    const datas: any = await queryFrontData(gqlClient, g_currentMonth_range);
    gridApiForFront.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {
    setQueryConditionForSource({
      start: dateString[0],
      end: dateString[1],
    });

    const range = {
      start: dateString[0],
      end: dateString[1],
    };

    const datas: any = await queryFrontData(gqlClient, range);
    gridApiForFront.current?.setRowData(datas);
  };

  /* endregion */

  /* region 显示自定义字段 */
  const [isFieldModalVisible, setFieldModalVisible] = useState(false);
  const [selectedFiled, setSelectedFiled] = useState(['']);
  const nessField = ['NO.', '部门', '组', '姓名'];
  const unNessField = [
    'Bug解决时长(H)',
    'Bug数量',
    '任务燃尽图',
    '初始需求数',
    '初始需求完成数',
    '追加需求数',
    '追加需求完成数',
    '请求数',
    '请求平均停留时长',
    '交付需求数',
    '完成任务数',
    '修复Bug数',
    '进行中任务数',
    '代码提交次数',
    '代码新增行数',
  ];

  // 弹出字段显示层
  const showFieldsModal = () => {
    const fields = localStorage.getItem('data_front_dashboard');
    if (fields === null) {
      setSelectedFiled(nessField.concat(unNessField));
    } else {
      setSelectedFiled(JSON.parse(fields).concat(nessField)); // 无论如何，必选字段必须被勾选
    }
    setFieldModalVisible(true);
  };

  // 全选
  const selectAllField = (e: any) => {
    if (e.target.checked === true) {
      setSelectedFiled(nessField.concat(unNessField));
    } else {
      setSelectedFiled(nessField);
    }
  };

  // 保存按钮
  const commitField = () => {
    localStorage.setItem('data_front_dashboard', JSON.stringify(selectedFiled));
    setFieldModalVisible(false);
    // 首先需要清空原有列，否则会导致列混乱
    gridApiForFront.current?.setColumnDefs([]);

    message.info({
      content: '保存成功！',
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  };
  // 取消
  const fieldCancel = () => {
    setFieldModalVisible(false);
  };

  // 缓存到state
  const onSetFieldsChange = (checkedValues: any) => {
    setSelectedFiled(checkedValues);
  };
  /* endregion */

  /* region 燃尽图显示 */
  const [isShowChart, setShowChart] = useState({
    show: false,
    userName: '',
  });

  const showCodesChart = async (source: any) => {

    const chartDom = document.getElementById('burnedChart');
    if (chartDom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(chartDom);
      myChart.clear();

      if (source) {
        // 绘制图表
        myChart.setOption({
          grid: {
            x: 50,
            y: 30,
            x2: 90,
            y2: 20,
            show: true,
            containLable: true,
          },

          tooltip: {
            trigger: 'axis',
          },
          legend: {
            orient: 'vertical',
            data: ['预计工时', '总消耗', '总剩余'],
            right: -5,
            top: 15,
          },
          xAxis: {
            type: 'category',
            data: source.dates,
          },
          yAxis: {
            type: 'value',
            name: '单位：小时',
          },
          series: [
            {
              name: '预计工时',
              type: 'line',
              data: source.estimate,
              stack: 'lb',
              emphasis: {  // 鼠标放上去显示本条线所在区域
                focus: 'series'
              },
              lineStyle: {
                // 设置线条颜色等
                normal: {
                  color: '#BCF5A9', // 连线颜色:绿色
                },
              },
              itemStyle: {
                // 设置线条上点的颜色等
                normal: {
                  color: '#BCF5A9',
                },
              },
              areaStyle: {

                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#BCF5A9', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'white', // 100% 处的颜色
                    },
                  ],
                  global: false,
                },
              },
            },
            {
              name: '总消耗',
              type: 'line',
              data: source.consumed,
              stack: 'lb1',
              emphasis: {
                focus: 'series'
              },
              lineStyle: {
                normal: {
                  color: '#F5DA81', // 连线颜色：黄色
                },
              },
              itemStyle: {
                // 设置线条上点的颜色等
                normal: {
                  color: '#F5DA81',
                },
              },
              areaStyle: {

                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#F5DA81', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'white', // 100% 处的颜色
                    },
                  ],
                  global: false,
                },
              },
            },
            {
              name: '总剩余',
              type: 'line',
              data: source.left,
              stack: 'lb2',
              emphasis: {
                focus: 'series'
              },
              lineStyle: {
                normal: {
                  color: '#A9F5F2', // 连线颜色：蓝色
                },
              },
              itemStyle: {
                // 设置线条上点的颜色等
                normal: {
                  color: '#A9F5F2',
                },
              },
              areaStyle: {

                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#A9F5F2', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'white', // 100% 处的颜色
                    },
                  ],
                  global: false,
                },
              },
            },
          ],
        });

      }

      window.addEventListener('resize', () => {
        myChart.resize();
      });
    }

  };


  const getSourceColums = () => {
    // 获取缓存的字段
    const fields = localStorage.getItem('data_front_dashboard');

    // 定义的原始字段
    const oraFields: any = [
      // {
      //   headerName: '周期时间',
      //   children: [
      //     {
      //       headerName: 'Bug解决时长(H)',
      //       field: 'time',
      //       minWidth: 133,
      //     },
      //     {
      //       headerName: 'Bug数量',
      //       field: 'avgLines',
      //       minWidth: 88,
      //     },
      //   ],
      // },
      // {
      //   headerName: '速度',
      //   children: [
      //     {
      //       headerName: '初始需求数',
      //       field: 'deptName',
      //       minWidth: 105,
      //     },
      //     {
      //       headerName: '初始需求完成数',
      //       field: 'groupName',
      //       minWidth: 130,
      //     },
      //     {
      //       headerName: '追加需求数',
      //       field: 'tech',
      //       minWidth: 105,
      //     },
      //     {
      //       headerName: '追加需求完成数',
      //       field: 'area',
      //       minWidth: 130,
      //     },
      //   ],
      // },
      // {
      //   headerName: '对外请求',
      //   children: [
      //     {
      //       headerName: '请求数',
      //       field: 'position',
      //       minWidth: 85,
      //     },
      //     {
      //       headerName: '请求平均停留时长',
      //       field: 'job',
      //       minWidth: 140,
      //     },
      //   ],
      // },

      {
        headerName: '吞吐量',
        children: [
          {
            headerName: '交付需求数',
            field: 'finiStory',
            minWidth: 105,
            valueFormatter: cellFormat,
          },
          {
            headerName: '完成任务数',
            field: 'finiTask',
            minWidth: 105,
            valueFormatter: cellFormat,
          },
          {
            headerName: '修复Bug数',
            field: 'resolvedBug',
            minWidth: 105,
            valueFormatter: cellFormat,
          },
          {
            headerName: '进行中任务数',
            field: 'doingTask',
            minWidth: 115,
            valueFormatter: cellFormat,
          },
          {
            headerName: '代码提交次数',
            field: 'codeCommit',
            minWidth: 115,
            valueFormatter: cellFormat,
          },
          {
            headerName: '代码新增行数',
            field: 'newLine',
            minWidth: 115,
            valueFormatter: cellFormat,
          },
        ],
      },
      {
        headerName: '',
        children: [
          {
            headerName: '任务燃尽图',
            field: 'chart',
            minWidth: 110,
            pinned: 'right',
            // cellRenderer: renderTest,
            onCellClicked: async (params: any) => {
              if (params.data) {

                // 查询数据
                const chartDatas = await queryBurnChartData(gqlClient, params.data.userId, params.data.start, params.data.end);
                if (chartDatas) {
                  setShowChart({
                    show: true,
                    userName: `${params.data.userName}(${params.data.start}-${params.data.end})`,
                  });
                  showCodesChart(chartDatas[0]);
                }

                // else {
                //   setShowChart({
                //     show: false,
                //     userName: `${params.data.userName}(${params.data.start}-${params.data.end})`,
                //   });
                // }

              }
            },
          },
        ],
      },
    ];

    if (fields === null) {
      return oraFields;
    }

    const selected = JSON.parse(fields);

    const component: any = [];
    oraFields.forEach((parent: any) => {
      const p_details = parent.children;
      const childs: any = [];
      p_details.forEach((c_details: any) => {
        const newElement = c_details;
        if (selected.includes(c_details.headerName)) {
          newElement.hide = false;
        } else {
          newElement.hide = true;
        }
        childs.push(newElement);
      });

      component.push({
        headerName: parent.headerName,
        children: childs,
      });
    });

    const basicFiled = [
      {
        headerName: '部门',
        field: 'dept',
        minWidth: 100,
        rowGroup: true,
        hide: true,
      },
      {
        headerName: '组',
        field: 'group',
        minWidth: 100,
        rowGroup: true,
        hide: true,
      },
      {
        headerName: '姓名',
        field: 'userName',
        minWidth: 80,
        suppressMenu: false,
        pinned: 'left',
      },
    ];
    return basicFiled.concat(oraFields);
  };

  // 取消
  const chartCancel = () => {
    setShowChart({
      ...isShowChart,
      show: false,
    });
  };

  /* endregion */

  return (
    <PageContainer>
      <div>
        {/*
        <ReactEcharts
          option={{
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }]
          }}
          style={{height: '350px', width: '1000px'}}
          className='react_for_echarts'/> */}

        {/* 查询条件 */}
        <div style={{width: '100%', height: 45, marginTop: -15, backgroundColor: 'white'}}>
          <Form.Item>
            <label style={{marginLeft: '10px', marginTop: 7}}>查询周期：</label>
            <RangePicker
              style={{width: '30%', marginTop: 7}}
              onChange={onSourceTimeSelected}
              value={[
                choicedConditionForSource.start === '' ? null : moment(choicedConditionForSource.start),
                choicedConditionForSource.end === '' ? null : moment(choicedConditionForSource.end),
              ]}
            />

            <Button
              type="text"
              style={{marginLeft: '20px', color: 'black'}}
              icon={<LogoutOutlined/>}
              size={'small'}
              onClick={showSourceDefaultData}
            >
              默认：
            </Button>
            <label style={{marginLeft: '-10px', color: 'black'}}> 默认1个月</label>

            <Button
              type="text"
              icon={<SettingOutlined/>}
              size={'large'}
              onClick={showFieldsModal}
              style={{float: 'right', marginTop: 5}}
            >
              {' '}
            </Button>
          </Form.Item>
        </div>

        {/* 数据表格 */}
        <div
          className="ag-theme-alpine"
          style={{height: sourceGridHeight, width: '100%', marginTop: 10}}
        >
          <AgGridReact
            columnDefs={getSourceColums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
              cellStyle: {
                display: 'block',
                // "vertical-align": "top",
                'line-height': '28px',
                // "margin-top": "-5px",/
                // "padding-top":"-30px"
              },
            }}
            autoGroupColumnDef={{
              minWidth: 170,
              sort: 'asc',
              pinned: 'left',
            }}
            rowHeight={28}
            headerHeight={30}
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onSourceGridReady}
            onGridSizeChanged={onSourceGridReady}
          ></AgGridReact>
        </div>

        {/* 自定义字段 */}
        <Modal
          title={'自定义字段'}
          visible={isFieldModalVisible}
          onCancel={fieldCancel}
          centered={true}
          footer={null}
          width={920}
        >
          <Form>
            <div>
              <Checkbox.Group
                style={{width: '100%'}}
                value={selectedFiled}
                onChange={onSetFieldsChange}
              >
                <Row>
                  <Col span={4}>
                    <Checkbox disabled value="NO.">
                      NO.
                    </Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox disabled value="部门">
                      部门
                    </Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox disabled value="组">
                      组
                    </Checkbox>
                  </Col>

                  <Col span={4}>
                    <Checkbox disabled value="姓名">
                      姓名
                    </Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="Bug解决时长(H)">Bug解决时长</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="Bug数量">Bug数量</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="任务燃尽图">任务燃尽图</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="初始需求数">初始需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="初始需求完成数">初始需求完成数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="追加需求数">追加需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="追加需求完成数">追加需求完成数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="请求数">请求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="请求平均停留时长">请求平均停留时长</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="交付需求数">交付需求数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="完成任务数">完成任务数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="修复Bug数">修复Bug数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="进行中任务数">进行中任务数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="代码提交次数">代码提交次数</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value="代码新增行数">代码新增行数</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
              ,
            </div>

            <div>
              <Checkbox onChange={selectAllField}>全选</Checkbox>

              <Button type="primary" style={{marginLeft: '300px'}} onClick={commitField}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={fieldCancel}>
                取消
              </Button>
            </div>
          </Form>
        </Modal>

        {/* 任务燃尽图弹出 */}
        <Modal
          title={`任务燃尽图-${isShowChart.userName}`}
          visible={isShowChart.show}
          onCancel={chartCancel}
          centered={true}
          footer={null}
          width={920}
        >
          <div
            id={'burnedChart'}
            style={{marginTop: -20, backgroundColor: 'white', height: 400}}
          ></div>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default FrontTableList;
