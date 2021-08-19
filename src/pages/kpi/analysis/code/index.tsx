import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {Button, Checkbox, Col, DatePicker, Form, message, Modal, Row, Tabs, Table} from 'antd';
import {FundTwoTone, DatabaseTwoTone, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import * as echarts from 'echarts';// 引入 ECharts 主模块
import 'echarts/lib/chart/bar';// 引入柱状图
import 'echarts/lib/component/tooltip';// 引入提示框和标题组件
import 'echarts/lib/component/title';
import {
  moduleChange,
  areaRender,
  groupRender
} from "@/publicMethods/cellRenderer";
import {getWeeksRange} from "@/publicMethods/timeMethods";
import moment from "moment";
import axios from "axios";


const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

/* region 分析报告页面 */

/* endregion */

/* region 源数据页面 */

// 出勤状态
const attendanceMappings = {
  "": "",
  normal: '正常',
  vacation: '休假',
  leave: '离职',
};

const attStageRender = () => {
  return Object.keys(attendanceMappings);
};

// 项目阶段
const prjStageMappings = {
  "": "",
  story: '需求',
  design: '设计',
  developing: "开发",
  submit: "提测",
  testing: "测试",
  released: "发布",
  learning: "学习",
};

const prjStageRender = () => {
  return Object.keys(prjStageMappings);
};


// 定义列名
const getSourceColums = () => {

  // 获取缓存的字段
  const fields = localStorage.getItem("data_alaysis_code_Source");
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
      field: 'position',
      minWidth: 95,
    },
    {
      headerName: '岗位类型',
      field: 'job',
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
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: attStageRender()},
      filterParams: {
        valueFormatter: (params: any) => {
          return attendanceMappings[params.value];
        },
      },
      valueFormatter: (params: any) => {
        return attendanceMappings[params.value];
      },
    },
    {
      headerName: '项目阶段',
      field: 'stage',
      minWidth: 110,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {values: prjStageRender()},
      filterParams: {
        valueFormatter: (params: any) => {
          return prjStageMappings[params.value];
        },
      },
      valueFormatter: (params: any) => {
        return prjStageMappings[params.value];
      },
    }
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

  return component;
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
  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;
  // 公共定义
  const gqlClient = useGqlClient();

  /* region 分析报告页面 */

  /* region 条件查询 */
  const [choicedConditionForChart, setQueryConditionForChart] = useState({
    start: "",
    end: ""
  });

  // 时间选择事件
  const onChartTimeSelected = async (params: any, dateString: any) => {
    setQueryConditionForChart({
      start: dateString[0],
      end: dateString[1]
    });

    const range = {
      start: dateString[0],
      end: dateString[1]
    };
    const datas: any = await querySourceData(gqlClient, range);
    console.log(datas);

  };


  // 初始化显示和显示默认数据
  const showChartDefaultData = async () => {
    const weekRanges = getWeeksRange(8);
    setQueryConditionForChart({
      start: weekRanges[0].from,
      end: weekRanges[7].to
    });

    const range = {
      start: weekRanges[0].from,
      end: weekRanges[7].to
    };
    const datas: any = await querySourceData(gqlClient, range);
    console.log(datas);
  };

  /* endregion */

  /* region 第一行图表：只显示查询日期中最近的一周数据：比如查询的是最近8周，那么，这边就显示本周的数据（最近一周） */

  // 定义总计表列名
  const getTotalColums = [
    {
      headerName: '阶段/领域',
      field: 'userName',
      pinned: 'left',
      minWidth: 80,

    },
    {
      headerName: '出勤状态',
      field: 'maxLines',
      minWidth: 80,
    },
    {
      headerName: '统计项',
      field: 'avgLines',
      minWidth: 80,
    },
    {
      headerName: '正式开发',
      field: 'minLines',
      minWidth: 80,

    },
    {
      headerName: '试用开发',
      field: 'deptName',
      minWidth: 80,
    },
    {
      headerName: '技术管理',
      field: 'groupName',
      minWidth: 80,
    },
  ];

  // 图表
  const showTestChart = () => {
    const bom = document.getElementById('main');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(bom);
       // 绘制图表
      myChart.setOption({
        grid:{
         x:0,
          top: '5% '
        },
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'right',
        // },
        legend: {
          x: '80%',
          y: '10px',
          orient: 'Vertical',

        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            label: {
              normal: {
                show: false,
              },
            },
            data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
              {value: 300, name: '视频广告'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  }

  /* endregion */


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

  const [choicedConditionForSource, setQueryConditionForSource] = useState({
    start: "",
    end: ""
  });

  // 初始化显示和显示默认数据
  const showSourceDefaultData = async () => {
    const weekRanges = getWeeksRange(8);
    setQueryConditionForSource({
      start: weekRanges[0].from,
      end: weekRanges[7].to
    });

    const range = {
      start: weekRanges[0].from,
      end: weekRanges[7].to
    };
    const datas: any = await querySourceData(gqlClient, range);
    gridApiForSource.current?.setRowData(datas);
  };

  // 时间选择事件
  const onSourceTimeSelected = async (params: any, dateString: any) => {
    setQueryConditionForSource({
      start: dateString[0],
      end: dateString[1]
    });

    const range = {
      start: dateString[0],
      end: dateString[1]
    };
    const datas: any = await querySourceData(gqlClient, range);
    gridApiForSource.current?.setRowData(datas);

  };

  const updateStage = (values: any) => {
    axios.post('/api/kpi/analysis/code', values)
      .then(function (res) {
        if (res.data.ok === true) {

          message.info({
            content: "数据保存成功！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else if (Number(res.data.code) === 403) {
          message.info({
            content: "您无权修改数据！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `${res.data.message}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      })
      .catch(function (error) {
        if (error.toString().includes("403")) {
          message.info({
            content: "您无权修改数据！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `异常信息：${error.toString()}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }

      });
  };

  /* region 单元格编辑事件 */
  const onSourceCellEdited = (event: any) => {

    const values: any = {
      userId: event.data.userId
    };

    // 如果修改字段为出勤状态 并且新旧值不相等
    if (event.colDef.field === "attendance" && event.oldValue !== event.newValue) {
      values.attendance = event.newValue;
      updateStage(values);
    }

    // 如果修改字段为项目阶段 并且新旧值不相等
    if (event.colDef.field === "stage" && event.oldValue !== event.newValue) {
      values.stage = event.newValue;
      updateStage(values);
    }

  };

  /* endregion */


  /* region 显示自定义字段 */
  const [isFieldModalVisible, setFieldModalVisible] = useState(false);
  const [selectedFiled, setSelectedFiled] = useState(['']);
  const nessField = ['NO.', '姓名'];
  const unNessField = ['最大值', '平均值', '最小值', '部门', '组', '端', '地域', '职务', '岗位类型', '类型',
    '出勤状态', '项目阶段'];

  // 弹出字段显示层
  const showFieldsModal = () => {
    const fields = localStorage.getItem("data_alaysis_code_Source");
    if (fields === null) {
      setSelectedFiled(nessField.concat(unNessField));
    } else {
      setSelectedFiled(JSON.parse(fields));
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
    localStorage.setItem("data_alaysis_code_Source", JSON.stringify(selectedFiled));
    setFieldModalVisible(false);
    // 首先需要清空原有列，否则会导致列混乱
    gridApiForSource.current?.setColumnDefs([]);

    message.info({
      content: "保存成功！",
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

  /* endregion */


  // tab 切换事件
  const callback = (clickTab: any) => {

    if (clickTab === "sourceData") {
      showSourceDefaultData();
    } else {
      showTestChart();
    }
  }

  useEffect(() => {
    showTestChart();
  }, []);


  // @ts-ignore
  return (
    <PageContainer>
      <div style={{marginTop: "-35px"}}>
        <Tabs defaultActiveKey="analysisReport" onChange={callback} size={"large"}>
          {/* 分析页面 */}
          <TabPane tab={<span> <FundTwoTone/>分析报告</span>} key="analysisReport">

            <div style={{marginTop: -10}}>
              {/* 查询条件 */}
              <Row>

                <div style={{width: '100%', height: 45, marginTop: 15, border: "solid 2px white"}}>
                  <Form.Item>

                    <label style={{marginLeft: "10px", marginTop: 7}}>查询周期：</label>
                    <RangePicker
                      style={{width: '30%', marginTop: 7}} onChange={onChartTimeSelected}
                      value={[choicedConditionForChart.start === "" ? null : moment(choicedConditionForChart.start),
                        choicedConditionForChart.end === "" ? null : moment(choicedConditionForChart.end)]}
                    />

                    <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                            icon={<LogoutOutlined/>} size={'small'} onClick={showChartDefaultData}>
                      默认：</Button>
                    <label style={{marginLeft: "-10px", color: 'black'}}> 默认8周</label>

                  </Form.Item>
                </div>
              </Row>

              {/* 第一行图表页面 */}
              <Row style={{backgroundColor: "white"}}>
                <Col span={12}>
                  <div className="ag-theme-alpine" style={{height: 300, width: '100%', marginTop: 5}}>
                    <AgGridReact
                      columnDefs={getTotalColums} // 定义列
                      rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true,
                        flex: 1,
                        suppressMenu: true,
                        cellStyle: {"line-height": "28px"},
                      }}
                      autoGroupColumnDef={{
                        minWidth: 250,
                      }}
                      groupDefaultExpanded={9} // 展开分组
                      suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
                      rowHeight={28}
                      headerHeight={33}

                      onGridReady={onSourceGridReady}
                      suppressScrollOnNewData={false}
                      onCellEditingStopped={onSourceCellEdited}
                    >

                    </AgGridReact>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{marginLeft: 20}}>
                    <table border={1}  style={{width: '100%', height: 300}}>
                      <tr style={{backgroundColor:"#FF9495"}}>
                        <td width={'20%'}>本周重点关注人员</td>
                        <td colSpan={2}>XXXXXXXXXXXXXXXXXXXX</td>
                      </tr>
                      <tr>
                        <td>开发人数</td>
                        <td align={"center"}> 69</td>
                        <td rowSpan={3} width={'70%'}></td>
                      </tr>
                      <tr>
                        <td>架构人数</td>
                        <td align={"center"}> 44</td>
                      </tr>
                      <tr>
                        <td>技术管理人数</td>
                        <td align={"center"}> 69</td>
                      </tr>
                      <tr>
                        <td>出勤人数</td>
                        <td align={"center"}> 69</td>
                        <td rowSpan={2}>
                          {/* <div id="main" style={{marginTop: 30, height: 300}}> </div> */}
                        </td>
                      </tr>
                      <tr>
                        <td>请假人数</td>
                        <td align={"center"}> 69</td>
                      </tr>
                    </table>
                  </div>



                </Col>
              </Row>
            </div>

          </TabPane>

          {/* 数据源页面 */}
          <TabPane tab={<span> <DatabaseTwoTone/>源数据</span>} key="sourceData"
                   style={{marginTop: -10, backgroundColor: "default"}}>

            {/* 查询条件 */}
            <div style={{width: '100%', height: 45, marginTop: 15, backgroundColor: "white"}}>
              <Form.Item>

                <label style={{marginLeft: "10px", marginTop: 7}}>查询周期：</label>
                <RangePicker
                  style={{width: '30%', marginTop: 7}} onChange={onSourceTimeSelected}
                  value={[choicedConditionForSource.start === "" ? null : moment(choicedConditionForSource.start),
                    choicedConditionForSource.end === "" ? null : moment(choicedConditionForSource.end)]}
                />

                <Button type="text" style={{marginLeft: "20px", color: 'black'}}
                        icon={<LogoutOutlined/>} size={'small'} onClick={showSourceDefaultData}>
                  默认：</Button>
                <label style={{marginLeft: "-10px", color: 'black'}}> 默认8周</label>

                <Button type="text" icon={<SettingOutlined/>} size={'large'} onClick={showFieldsModal}
                        style={{float: "right", marginTop: 5}}> </Button>

              </Form.Item>

            </div>

            {/* 数据表格 */}
            <div className="ag-theme-alpine" style={{height: sourceGridHeight, width: '100%', marginTop: 10}}>
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
                onCellEditingStopped={onSourceCellEdited}
              >

              </AgGridReact>
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
                  <Checkbox.Group style={{width: '100%'}} value={selectedFiled} onChange={onSetFieldsChange}>
                    <Row>
                      <Col span={4}>
                        <Checkbox defaultChecked disabled value="NO.">NO.</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox defaultChecked disabled value="姓名">姓名</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="最大值">最大值</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="平均值">平均值</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="最小值">最小值</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="部门">部门</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="组">组</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="端">端</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="地域">地域</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="职务">职务</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="岗位类型">岗位类型</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="类型">类型</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="出勤状态">出勤状态</Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox value="项目阶段">项目阶段</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>,
                </div>

                <div>
                  <Checkbox onChange={selectAllField}>全选</Checkbox>

                  <Button type="primary" style={{marginLeft: '300px'}} onClick={commitField}>
                    确定</Button>
                  <Button type="primary" style={{marginLeft: '20px'}} onClick={fieldCancel}>
                    取消</Button>
                </div>

              </Form>
            </Modal>

          </TabPane>

        </Tabs>


      </div>


    </PageContainer>
  );
};

export default CodeTableList;
