import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import type {GqlClient} from '@/hooks';
import {useGqlClient} from '@/hooks';
import {Button, Checkbox, Col, DatePicker, Form, message, Modal, Row, Tabs} from 'antd';
import {FundTwoTone, DatabaseTwoTone, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import * as echarts from 'echarts';// 引入 ECharts 主模块
import 'echarts/lib/chart/bar';// 引入柱状图
import 'echarts/lib/component/tooltip';// 引入提示框和标题组件
import 'echarts/lib/component/title';
import {
  moduleChange,
  areaRender,
  groupRender,
} from "@/publicMethods/cellRenderer";
import {getMonthWeek, getWeeksRange, getWeekStartAndEndTime} from "@/publicMethods/timeMethods";
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
  abnormal: "异常"
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


/* endregion */

// 公共查询方法
const querySourceData = async (client: GqlClient<object>, params: any, queryCount: number) => {

  // module =》All：查询所在时间内的所有数据，
  let conditon = `start:"${params.start}",end:"${params.end}"`;

  if (queryCount !== 0) {
    conditon = `${conditon},threshold:${queryCount}`;
  }

  const {data} = await client.query(`
      {
        avgCodeAnalysis(${conditon}){
        userId
        userName
        maxLines
        avgLines
        minLines
        weekLines
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

  // const te = data?.avgCodeAnalysis;
  return data?.avgCodeAnalysis;
};

const CodeTableList: React.FC<any> = () => {
  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;
  // 公共定义
  const gqlClient = useGqlClient();

  /* region 分析报告页面 */


  /* region 第一行图表：只显示查询日期中最近的一周数据：比如查询的是最近8周，那么，这边就显示本周的数据（最近一周） */

  const thisWeekTime = getWeeksRange(1);

  const gridApiForTotal = useRef<GridApi>();
  const onTotalGridReady = (params: GridReadyEvent) => {
    gridApiForTotal.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const test = (params: any) => {
    if (params.data.stage === "需求阶段") {
      return 3;
    }
    return 1;
  };


  /* region 表格总数据展示 */

  // 格式化单元格内容
  const cellFormat = (params: any) => {
    if (Number(params.value)) {
      return Number(params.value).toFixed(2);
    }

    return params.value;
  };
  const getTotalColums = [
    {
      headerName: '阶段/领域',
      field: 'stage',
      minWidth: 80,
      rowSpan: test,
      cellClassRules: {backgroundColor: "red"}

    },
    {
      headerName: '出勤状态',
      field: 'attendance',
      minWidth: 80,
    },
    {
      headerName: '统计项',
      field: 'item',
      minWidth: 80,
    },
    {
      headerName: '正式开发',
      field: 'formalDev',
      minWidth: 80,
      valueFormatter: cellFormat

    },
    {
      headerName: '试用开发',
      field: 'tryDev',
      minWidth: 80,
      valueFormatter: cellFormat
    },
    {
      headerName: '技术管理',
      field: 'techManager',
      minWidth: 80,
      valueFormatter: cellFormat
    },
  ];

  // 获取和解析数据
  const pushArrays = (title: string, itemData: any) => {
    const array = [];
    if (title === "需求阶段" || title === "设计阶段" || title === "开发阶段" || title === "测试阶段") {

      array.push({
        stage: title,
        attendance: "正常",
        item: "人数",
        formalDev: itemData.offical === null ? 0 : itemData.offical.personNums,
        tryDev: itemData.trial.personNums,
        techManager: "-"
      }, {
        stage: title,
        attendance: "正常",
        item: "代码总行数",
        formalDev: itemData.offical === null ? 0 : itemData.offical.sumLines,
        tryDev: itemData.trial.sumLines,
        techManager: "-"
      }, {
        stage: title,
        attendance: "正常",
        item: "代码人均行数",
        formalDev: itemData.offical === null ? 0 : itemData.offical.avgLines,
        tryDev: itemData.trial.avgLines,
        techManager: "-"
      });
    } else if (title === "技术管理") {
      array.push({
        stage: title,
        attendance: "正常",
        item: "人数",
        formalDev: "-",
        tryDev: "-",
        techManager: itemData.personNums
      }, {
        stage: title,
        attendance: "正常",
        item: "代码总行数",
        formalDev: "-",
        tryDev: "-",
        techManager: itemData.sumLines
      }, {
        stage: title,
        attendance: "正常",
        item: "代码人均行数",
        formalDev: "-",
        tryDev: "-",
        techManager: itemData.avgLines,
      });
    } else if (title === "_开发阶段") {

      array.push({
        stage: "开发阶段",
        attendance: "正常",
        item: "最高贡献者",
        formalDev: itemData === null ? 0 : itemData.offical.highest[0],
        tryDev: itemData === null ? 0 : itemData.trial.highest[0],
        techManager: "-"
      }, {
        stage: "开发阶段",
        attendance: "正常",
        item: "最高贡献代码量",
        formalDev: itemData === null ? 0 : itemData.offical.highest[1],
        tryDev: itemData === null ? 0 : itemData.trial.highest[1],
        techManager: "-"
      }, {
        stage: "开发阶段",
        attendance: "正常",
        item: "最低贡献者",
        formalDev: itemData === null ? 0 : itemData.offical.lowest[0],
        tryDev: itemData === null ? 0 : itemData.trial.lowest[0],
        techManager: "-"
      }, {
        stage: "开发阶段",
        attendance: "正常",
        item: "最低贡献代码量",
        formalDev: itemData === null ? 0 : itemData.offical.lowest[1],
        tryDev: itemData === null ? 0 : itemData.trial.lowest[1],
        techManager: "-"
      });
    }

    return array;

  };
  const ClassifiTotal = (data: any) => {
    let array: any = [];

    Object.keys(data).forEach((items: any) => {

      switch (items) {
        case "story":
          array = array.concat(pushArrays("需求阶段", data.story));
          break;
        case "design":
          array = array.concat(pushArrays("设计阶段", data.design));
          break;
        case "developing":
          array = array.concat(pushArrays("开发阶段", data.developing));
          break;
        case "testing":
          array = array.concat(pushArrays("测试阶段", data.testing));
          break;
        case "manager":
          array = array.concat(pushArrays("技术管理", data.manager));
          break;
        case "_developing":
          array = array.concat(pushArrays("_开发阶段", data["_developing"]));
          break;

        default:
          break;
      }

    });

    return array;
  };
  const getTotalData = (params: any) => {

    const url = `/api/kpi/analysis/statistic?start=${params.start}&end=${params.end}`;
    axios.get(url, {})
      .then(function (res) {
        if (res.status === 200) {

          const datas = ClassifiTotal(res.data);
          gridApiForTotal.current?.setRowData(datas);
        } else {
          message.error({
            content: `${res.data.message}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }


      })
      .catch(function (error) {
        if (error.toString().includes("403")) {
          message.error({
            content: "您无权查询权限！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `异常信息:${error.toString()}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      });
  };
  /* endregion 表格总数据展示 */


  // 图表
  const [chartDataForTotal, setChartDataForTotal] = useState({
    payAttention: "",  // 关注人员
    Development: 0,  // 开发
    Architecture: 0,// 架构
    Technology: 0,// 技术管理
    Attendance: 0,// 出勤
    Vacation: 0// 请假

  });
  const showTotalPieChart = (params: any) => {
    const totalChartData: any = [
      {value: params.Development, name: '开发人数'},
      {value: params.Architecture, name: '架构师人数'},
      {value: params.Technology, name: '技术管理人数'}
    ];
    const bom = document.getElementById('totalPieChart');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(bom);
      // 绘制图表
      myChart.setOption({

        tooltip: {
          trigger: 'item'
        },
        legend: {
          x: '70%',
          y: '10px',
          orient: 'Vertical',
          //   left: 'right',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            label: {
              normal: {
                show: false,  // 不显示每个扇形支出来的说明文字
              },
            },
            data: totalChartData,
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
  };

  const showTotalHistogramChart = (weekName: string, params: any) => {
    const chartDom = document.getElementById('totalHistogramChart');
    if (chartDom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(chartDom);
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {

          x: '65%',
          // y: '10px',
          // data: ['出勤', '请假']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: [weekName]
        },
        series: [

          {
            name: '出勤',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [params.Attendance]
            // data: [67],
          },
          {
            name: '请假',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [params.Vacation],
          }
        ]
      });
    }

  };

  const getTotalChartData = (params: any) => {
    const weekName = getMonthWeek(params.start);
    const url = `/api/kpi/analysis/overview?start=${params.start}&end=${params.end}`;
    axios.get(url, {})
      .then(function (res) {
        if (res.status === 200) {
          const {data} = res;

          let payAttMan = "";
          const arrays = data["关注"];
          if (arrays !== null) {
            arrays.forEach((ele: string) => {
              payAttMan = payAttMan === "" ? ele : `${payAttMan}、${ele}`;
            });
          }

          setChartDataForTotal({
            payAttention: payAttMan,
            Development: data["开发"],
            Architecture: data["架构"],
            Technology: data["技术管理"],
            Attendance: data["出勤"],
            Vacation: data["请假"]
          });

          showTotalPieChart({
            Development: data["开发"],
            Architecture: data["架构"],
            Technology: data["技术管理"]

          });

          showTotalHistogramChart(weekName, {
              Attendance: data["出勤"],
              Vacation: data["请假"]
            }
          );

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
          message.error({
            content: "您无权查询权限！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `异常信息:${error.toString()}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      });

  };


  /* endregion */

  /* region 第二行：近八周持续高贡献者数据 */
  const dataAlaysis = (source: any) => {
    const legendName: any = [];  // 图例  -- 人名
    const x_time: any = [];  // X轴数据：时间，几月第几周
    const seriesArray: any = [];  // 时间
    source.forEach((ele: any, index: number) => {
      legendName.push(ele.userId);
      const {weekLines} = ele;
      const weekArray: any = []; // 用于接收每个人每周的数据
      weekLines.forEach((t_data: any) => {
        // 只循环一次，用于获取X轴的时间
        if (index === 0) {
          const start = getMonthWeek(t_data.startAt);
          x_time.push(start);
        }
        weekArray.push(Number(t_data.lines));
      });
      seriesArray.push({
        name: ele.userId,
        type: 'line',
        data: weekArray
      });
    });

    return {"legendName": legendName, "x_time": x_time, "seriesArray": seriesArray};
  };

  const showCodesChart = (source: any, domName: any) => {

    const chartDom = document.getElementById(domName);
    if (chartDom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(chartDom);
      myChart.clear();
      // 绘制图表
      myChart.setOption({

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: source.legendName  // 人名
        },
        xAxis: {
          type: 'category',
          data: source.x_time // 几月第几周
          // data: source.week  // 几月第几周
        },
        yAxis: {
          type: 'value',
        },
        series: source.seriesArray
        // [
        // {
        //   name: '最高气温',
        //   type: 'line',
        //   data: [10, 11, 13, 11, 12, 12, 9],
        // },
        //   {
        //     name: '最低气温',
        //     type: 'line',
        //     data: [1, -2, 2, 5, 3, 2, 0],
        //   }
        // ]
      });
    }
  };

  const gridApiForHightestCode = useRef<GridApi>();
  const onToHightestCodeGridReady = (params: GridReadyEvent) => {
    gridApiForHightestCode.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getHighesCodeColums = [
    {
      headerName: '姓名',
      field: 'userName',
      minWidth: 80,
    },
    {
      headerName: '平均代码量',
      field: 'avgLines',
      minWidth: 80,
    },
    {
      headerName: '最高代码量',
      field: 'maxLines',
      minWidth: 80,
    },
    {
      headerName: '本周代码量',
      field: 'weekLines',
      minWidth: 80,
    }
  ];

  const queryPersonCode = async (client: GqlClient<object>, params: any, usersId: string) => {

    const {data} = await client.query(`
      {
         userWeekLines(start:"${params.start}", end:"${params.end}",userIds:[${usersId}]){
          userId
          weekLines{
            lines
            startAt
            endAt
          }
        }
      }
  `);


    return data?.userWeekLines;
  };

  const getHightestCodeData = async (Range: any) => {

    const datas = await querySourceData(gqlClient, Range, 1500);
    gridApiForHightestCode.current?.setRowData(datas);

    if (datas.length > 0) {
      // 通过datas 里面的userid 获取八周的数据
      // 获取userid 数组
      let useridStr = "";
      datas.forEach((dts: any) => {
        useridStr = useridStr === "" ? `"${dts.userId}"` : `${useridStr},"${dts.userId}"`;
      });

      const codeDetails = await queryPersonCode(gqlClient, Range, useridStr.toString());
      const alayResult = dataAlaysis(codeDetails);
      showCodesChart(alayResult, "_8WeeksHighestNumChart");

    }

  };


  /* endregion */

  /* region 条件查询 */
  const [choicedConditionForChart, setQueryConditionForChart] = useState({
    start: thisWeekTime[0].from,
    end: thisWeekTime[0].to
  });

  // 时间选择事件
  const onChartTimeSelected = async (params: any, dateString: any) => {
    setQueryConditionForChart({
      start: dateString[0],
      end: dateString[1]
    });
    debugger;
    const range = getWeekStartAndEndTime(dateString[0], dateString[1]);
    // 汇总表格数据显示
    getTotalData(range);
    // 汇总图表显示
    getTotalChartData(range);

    // 连续八周最高贡献者数据显示
    getHightestCodeData(range);

  };

  // 初始化显示和显示默认数据
  const showChartDefaultData = async () => {
    const weekRanges = getWeeksRange(1);
    setQueryConditionForChart({
      start: weekRanges[0].from,
      end: weekRanges[0].to
    });

    const range = {
      start: weekRanges[0].from,
      end: weekRanges[0].to
    };

    // 汇总表格数据显示
    getTotalData(range);

    // 汇总图-饼图
    getTotalChartData(range);

    // 连续八周最高贡献者数据显示
    getHightestCodeData(range);

  };

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
    const weekRanges = getWeeksRange(1);
    setQueryConditionForSource({
      start: weekRanges[0].from,
      end: weekRanges[0].to
    });

    const range = {
      start: weekRanges[0].from,
      end: weekRanges[0].to
    };
    const datas: any = await querySourceData(gqlClient, range, 0);
    gridApiForSource.current?.setRowData(datas);
  };

  // 时间选择事件
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      start: dateString[0],
      end: dateString[1]
    });

    const range = getWeekStartAndEndTime(dateString[0], dateString[1]);
    // const range = {
    //   start: dateString[0],
    //   end: dateString[1]
    // };
    const datas: any = await querySourceData(gqlClient, range, 0);
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
    }
  };

  useEffect(() => {

    // 第一行 ：统计页面
    getTotalData({start: thisWeekTime[0].from, end: thisWeekTime[0].to});
    getTotalChartData({start: thisWeekTime[0].from, end: thisWeekTime[0].to});

    // 第二行：持续最高贡献者数据
    getHightestCodeData({start: thisWeekTime[0].from, end: thisWeekTime[0].to});

  }, []);


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
              <Row>
                <Col span={15}>
                  <div className="ag-theme-alpine" style={{height: 520, width: '100%', marginTop: 5}}>
                    <AgGridReact
                      columnDefs={getTotalColums} // 定义列
                      rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}

                      suppressRowTransform={true}
                      rowHeight={25}
                      headerHeight={30}
                      onGridReady={onTotalGridReady}
                    >

                    </AgGridReact>
                  </div>
                </Col>
                <Col span={9}>
                  <div style={{marginLeft: 20}}>
                    <table border={1}
                           style={{width: '100%', height: 520, backgroundColor: "white", overflow: "scroll"}}>
                      <tr style={{backgroundColor: "#FF9495"}}>
                        <td width={'20%'}>本周重点关注人员</td>
                        <td colSpan={2}> {chartDataForTotal.payAttention}</td>
                      </tr>
                      <tr>
                        <td>开发人数</td>
                        <td align={"center"}> {chartDataForTotal.Development}</td>
                        <td rowSpan={3} width={'70%'} align={"left"} valign={"bottom"}>
                          <div id="totalPieChart" style={{height: 300, width: 400, backgroundColor: "white"}}>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>架构人数</td>
                        <td align={"center"}>  {chartDataForTotal.Architecture}</td>
                      </tr>
                      <tr>
                        <td>技术管理人数</td>
                        <td align={"center"}>  {chartDataForTotal.Technology}</td>
                      </tr>
                      <tr>
                        <td>出勤人数</td>
                        <td align={"center"}>  {chartDataForTotal.Attendance}</td>
                        <td rowSpan={2}>
                          <div id="totalHistogramChart" style={{width: 450, height: 100, backgroundColor: "white"}}>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>请假人数</td>
                        <td align={"center"}>  {chartDataForTotal.Vacation}</td>
                      </tr>
                    </table>
                  </div>


                </Col>
              </Row>

              {/* 第二行 近八周持续高贡献者数据 */}
              <Row>
                <Col span={8}>
                  <div className="ag-theme-alpine" style={{height: 200, width: '100%', marginTop: 5}}>
                    <AgGridReact
                      columnDefs={getHighesCodeColums} // 定义列
                      rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}
                      suppressRowTransform={true}
                      rowHeight={25}
                      headerHeight={30}
                      onGridReady={onToHightestCodeGridReady}
                    >

                    </AgGridReact>
                  </div>
                </Col>
                <Col span={16}>
                  <div id="_8WeeksHighestNumChart" style={{width: '100%', height: 200, backgroundColor: "white"}}>
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
