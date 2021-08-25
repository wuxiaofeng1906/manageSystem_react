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

import {objectArraySortByDesc, objectArraySortByAsc} from "@/publicMethods/arrayMethod";
import "./styles.css";
import {
  getMonthWeek,
  getWeeksRange,
  getWeekStartAndEndTime,
  getWeekStartAndEndTimeByEndtime
} from "@/publicMethods/timeMethods";
import moment from "moment";
import axios from "axios";
import * as dayjs from "dayjs";

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

/* region 公共方法 */
// 格式化单元格内容
const cellFormat = (params: any) => {
  if (Number(params.value)) {
    const numbers = params.value.toString();
    if (numbers.indexOf(".") > -1) { // 判断有无小数点
      return Number(params.value).toFixed(2);
    }
    return Number(params.value);
  }
  return params.value;
};

/* endregion */

/* region 分析报告页面 */
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
/* endregion */

/* region 源数据页面 */

// 出勤状态
const attendanceMappings = {
  normal: '正常',
  vacation: '休假',
  leave: '离职',
  "": "",
};

const attStageRender = () => {
  return Object.keys(attendanceMappings);
};

// 项目阶段
const prjStageMappings = {
  story: '需求',
  design: '设计',
  developing: "开发",
  submit: "提测",
  testing: "测试",
  released: "发布",
  learning: "学习",
  abnormal: "异常",
  "": "",
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
      minWidth: 100,
      suppressMenu: true,
    },
    {
      headerName: '平均值',
      field: 'avgLines',
      minWidth: 100,
      suppressMenu: true,
      valueFormatter: cellFormat
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
      minWidth: 110,
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

const query_600_1200Data = async (client: GqlClient<object>, params: any, queryCount: number) => {

  // module =》All：查询所在时间内的所有数据，
  let conditon = `start:"${params.start}",end:"${params.end}"`;

  if (queryCount !== 0) {
    conditon = `${conditon},threshold:${queryCount}`;
  }

  const {data} = await client.query(`
      {
        codeThreshold(${conditon}){
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

  return data?.codeThreshold;
};

const CodeTableList: React.FC<any> = () => {

  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;
  // 公共定义
  const gqlClient = useGqlClient();

  /* region 分析报告页面 */

  /* region 第一行图表：只显示查询日期中最近的一周数据：比如查询的是最近8周，那么，这边就显示本周的数据（最近一周） */

  const gridApiForTotal = useRef<GridApi>();
  const onTotalGridReady = (params: GridReadyEvent) => {
    gridApiForTotal.current = params.api;
    params.api.sizeColumnsToFit();
  };
  // 窗口变化自适应屏幕大小
  window.addEventListener('resize', () => {
    gridApiForTotal.current?.sizeColumnsToFit();
  });


  /* region 表格总数据展示 */

  const rowSpans = (params: any) => {
    const stages = params.data.stage;

    if (stages === "需求阶段" || stages === "设计阶段" || stages === "测试阶段" || stages === "技术管理") {
      return 3;
    }

    if (stages === "开发阶段") {
      if (params.data.item === "最高贡献者") {
        return 4;
      }
      return 3;
    }
    return 1;
  };

  const getTotalColums = [
    {
      headerName: '阶段/领域',
      field: 'stage',
      minWidth: 100,
      rowSpan: rowSpans,
      cellClassRules: {
        'cell-span': "value !== undefined"
      }
    },
    {
      headerName: '出勤状态',
      field: 'attendance',
      minWidth: 90,
      rowSpan: rowSpans,
      cellClassRules: {
        'cell-span': "value !== undefined"
      }
    },
    {
      headerName: '统计项',
      field: 'item',
      minWidth: 135,
    },
    {
      headerName: '正式开发',
      field: 'formalDev',
      minWidth: 90,
      valueFormatter: cellFormat

    },
    {
      headerName: '试用开发',
      field: 'tryDev',
      minWidth: 90,
      valueFormatter: cellFormat
    },
    {
      headerName: '技术管理',
      field: 'techManager',
      minWidth: 90,
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
        stage: "",  // 为了进行单元格合并，需要将stage置为空
        attendance: "正常",
        item: "代码总行数",
        formalDev: itemData.offical === null ? 0 : itemData.offical.sumLines,
        tryDev: itemData.trial.sumLines,
        techManager: "-"
      }, {
        stage: "",
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
        stage: "",
        attendance: "正常",
        item: "代码总行数",
        formalDev: "-",
        tryDev: "-",
        techManager: itemData.sumLines
      }, {
        stage: "",
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
        stage: "",
        attendance: "正常",
        item: "最高贡献代码量",
        formalDev: itemData === null ? 0 : itemData.offical.highest[1],
        tryDev: itemData === null ? 0 : itemData.trial.highest[1],
        techManager: "-"
      }, {
        stage: "",
        attendance: "正常",
        item: "最低贡献者",
        formalDev: itemData === null ? 0 : itemData.offical.lowest[0],
        tryDev: itemData === null ? 0 : itemData.trial.lowest[0],
        techManager: "-"
      }, {
        stage: "",
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

  // 饼图和柱状图数据显示
  const [chartDataForTotal, setChartDataForTotal] = useState({
    payAttention: "",  // 关注人员
    Development: 0,  // 开发
    Architecture: 0,// 架构
    Technology: 0,// 技术管理
    Attendance: 0,// 出勤
    Vacation: 0// 请假

  });

  const rendererColorStyle = {
    pink: {
      normal: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

          offset: 0,
          color: '#ff6681'  // 深色
        }, {
          offset: 1,
          color: '#ffe5ea'  // 浅色
        }])
      }
    },
    blue: {
      normal: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

          offset: 0,
          color: '#3385ff'
        }, {
          offset: 1,
          color: '#cce1ff'
        }])
      }


    },
    green: {
      normal: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

          offset: 0,
          color: '#99ff99'
        }, {
          offset: 1,
          color: '#e5ffe5'
        }])
      }
    }
  };
  const showTotalPieChart = (params: any) => {
    const totalChartData: any = [
      {
        value: params.Development, name: '开发人数', itemStyle: rendererColorStyle.blue
      },
      {
        value: params.Architecture, name: '架构师人数', itemStyle: rendererColorStyle.pink
      },
      {
        value: params.Technology, name: '技术管理人数', itemStyle: rendererColorStyle.green
      }
    ];
    const bom = document.getElementById('totalPieChart');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      const pieChart = echarts.init(bom);
      // 绘制图表
      pieChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          x: "70%",
          orient: 'Vertical',
        },
        series: [
          {
            radius: "95%",  // 显示在容器里100%大小，如果需要饼图小一点，就设置低于100%就ok
            type: 'pie',
            center: ['40%', '50%'],  // 第一个值调整左右，第二个值调整上下，也可以设置具体数字像素值，center: [200, 300],
            label: {  // 饼图标签相关
              normal: {
                show: true,
                position: 'inner', // 标签的位置
                textStyle: {
                  // fontWeight: 100,
                  fontSize: 13,  // 文字的字体大小
                  color: "black"  // 文字颜色
                },
                formatter: '{d}%'
              }
            },
            data: totalChartData,
            // emphasis: {  // 阴影显示
            //   itemStyle: {
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // },

          }
        ],
      });
      // 窗口缩放后重新调整图标尺寸
      window.onresize = function () {
        pieChart.resize();
      }
    }
  };
  const showTotalHistogramChart = (weekName: string, params: any) => {
    const chartDom = document.getElementById('totalHistogramChart');
    if (chartDom) {
      // 基于准备好的dom，初始化echarts实例
      const histogramChart = echarts.init(chartDom);
      // 绘制图表
      histogramChart.setOption({

        tooltip: {
          trigger: 'axis',
        },
        legend: {

          right: "right",
          y: '10px',
        },
        grid: {
          left: "65px",
          bottom: "20px",
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
            data: [params.Attendance],
            itemStyle: rendererColorStyle.blue,
            label: {
              show: true, // 开启显示
              textStyle: {
                color: 'black',
              },
              formatter: () => {// 设置显示的数据

                if (params.Attendance === 0) {
                  return '0%';
                }
                const number = Number(params.Attendance) / (Number(params.Vacation) + Number(params.Attendance)) * 100;
                return `${number.toFixed(0).toString()}%`;
              }
            }
          },
          {
            name: '请假',
            type: 'bar',
            stack: 'total',
            barWidth: 70,
            data: [params.Vacation],
            itemStyle: rendererColorStyle.pink,
            label: {
              show: true, // 开启显示
              textStyle: {
                color: 'black',
              },
              formatter: () => { // 设置显示的数据
                if (params.Vacation === 0) {
                  return '0%';
                }
                const number = Number(params.Vacation) / (Number(params.Vacation) + Number(params.Attendance)) * 100;
                return `${number.toFixed(0).toString()}%`;
              }
            }
          }
        ]
      });

      window.addEventListener('resize', () => {
        histogramChart.resize()
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

  /* region 二、三、四行公共方法 */
  const getHighesCodeColums = (sortMethod: string) => {
    return [
      {
        headerName: '姓名',
        field: 'userName',
        minWidth: 80,
      },
      {
        headerName: '平均代码量',
        field: 'avgLines',
        minWidth: 80,
        sort: sortMethod,
        valueFormatter: cellFormat
      },
      {
        headerName: '最高代码量',
        field: 'maxLines',
        minWidth: 80,
        valueFormatter: cellFormat
      },
      {
        headerName: '本周代码量',
        field: 'weekLines',
        minWidth: 80,
        valueFormatter: cellFormat
      }
    ];
  }
  const dataAlaysis = (source: any, oraData: any) => {

    const legendName: any = [];  // 图例  -- 人名
    const x_time: any = [];  // X轴数据：时间，几月第几周
    const seriesArray: any = [];  // 时间

    source.forEach((ele: any, index: number) => {
      // 获取用户（英文对应中文，oraData 只是用于英文名字对应中文名字作用）
      let usernName = "";
      for (let i = 0; i < oraData.length; i += 1) {
        if (oraData[i].userId === ele.userId) {
          usernName = oraData[i].userName;
          break;
        }
      }

      // 加入图例数据
      legendName.push(usernName);

      // 获取每个人的周数据
      const weekLines = ele.weekLines === null ? [] : ele.weekLines;
      const weekArray: any = []; // 用于接收每个人每周的数据
      weekLines.forEach((t_data: any) => {
        // 只循环一次，用于获取X轴的时间
        if (index === 0) {
          const start = getMonthWeek(t_data.startAt);
          x_time.push(start);  // X轴标识
        }
        weekArray.push(Number(t_data.lines));
      });

      // 具体数据
      seriesArray.push({
        name: usernName,
        type: 'line',
        data: weekArray
      });
    });

    return {"legendName": legendName, "x_time": x_time, "seriesArray": seriesArray};
  };
  const showCodesChart = (source: any, domName: any, selecteddata: any) => {

    const chartDom = document.getElementById(domName);
    if (chartDom) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(chartDom);
      myChart.clear();
      // 绘制图表
      myChart.setOption({
        grid: {
          x: 50,
          y: 20,
          x2: 90,
          y2: 20,
          show: true,
          containLable: true
        },

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'vertical',
          data: source.legendName,  // 人名
          type: 'scroll',
          right: 10,
          top: 15,
          bottom: 20,
          selected: selecteddata
          //   {
          //   // 选中'系列1'
          //   // '系列1': true,
          //   // 不选中'系列2'
          //   '王濯': false
          // }
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
      });

      window.addEventListener('resize', () => {
        myChart.resize()
      });
    }
  };
  const getDetailsAndShowChart = async (datas: any, Range: any, domName: string, selecteddata: any) => {

    let useridStr = "";
    if (datas.length > 0) {
      // 通过datas 里面的userid 获取八周的数据
      // 获取userid 数组
      datas.forEach((dts: any) => {
        useridStr = useridStr === "" ? `"${dts.userId}"` : `${useridStr},"${dts.userId}"`;
      });
    }

    const codeDetails = await queryPersonCode(gqlClient, Range, useridStr.toString());
    const alayResult = dataAlaysis(codeDetails, datas);
    showCodesChart(alayResult, domName, selecteddata);
  };

  // 解析出平均值中最高(低)数据的7个人
  const selected7ItemsToShow = (source: any, Top: boolean) => {
    const selected = Object();
    if (!source) return selected;
    let sortedDts = [];
    if (Top) {  // 近8周持续高贡献者显示平均值最高的7个人
      sortedDts = source.sort(objectArraySortByDesc("avgLines"));
    } else {  // 小于600和小于1200的显示最低的7个人
      sortedDts = source.sort(objectArraySortByAsc("avgLines"));
    }
    for (let index = 0; index < sortedDts.length; index += 1) {
      const {userName} = sortedDts[index];
      if (index < 7) {  // 显示top7
        selected[userName] = true;
      } else {
        selected[userName] = false;
      }
    }

    return selected;
  };

  /* endregion */

  /* region 第二行：近八周持续高贡献者数据 */

  const gridApiForHightestCode = useRef<GridApi>();
  const onToHightestCodeGridReady = (params: GridReadyEvent) => {
    gridApiForHightestCode.current = params.api;
    params.api.sizeColumnsToFit();
  };
  // 窗口变化自适应屏幕大小
  window.addEventListener('resize', () => {
    gridApiForHightestCode.current?.sizeColumnsToFit();
  });
  const getHightestCodeData = async (Range: any) => {
    const datas = await querySourceData(gqlClient, Range, 1500);
    const selecteddata = selected7ItemsToShow(datas, true);
    gridApiForHightestCode.current?.setRowData(datas);
    await getDetailsAndShowChart(datas, Range, "_8WeeksHighestNumChart", selecteddata);
  };

  /* endregion */

  /* region  第三行，最低贡献者小于600 */
  const gridApiFor600Code = useRef<GridApi>();
  const onTo600CodeGridReady = (params: GridReadyEvent) => {
    gridApiFor600Code.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 窗口变化自适应屏幕大小
  window.addEventListener('resize', () => {
    gridApiFor600Code.current?.sizeColumnsToFit();
  });

  const get600CodeData = async (Range: any) => {
    const datas = await query_600_1200Data(gqlClient, Range, 600);
    const selecteddata = selected7ItemsToShow(datas, false);
    gridApiFor600Code.current?.setRowData(datas);
    await getDetailsAndShowChart(datas, Range, "_8Weeks600NumChart", selecteddata);
  };


  /* endregion  */

  /* region  第四行，最大贡献小于1200 */

  const gridApiFor1200Code = useRef<GridApi>();
  const onTo1200CodeGridReady = (params: GridReadyEvent) => {
    gridApiFor1200Code.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 窗口变化自适应屏幕大小
  window.addEventListener('resize', () => {
    gridApiFor1200Code.current?.sizeColumnsToFit();
  });

  const get1200CodeData = async (Range: any) => {
    const datas = await query_600_1200Data(gqlClient, Range, 1200);
    gridApiFor1200Code.current?.setRowData(datas);
    const selecteddata = selected7ItemsToShow(datas, false);
    await getDetailsAndShowChart(datas, Range, "_8Weeks1200NumChart", selecteddata);
  };
  /* endregion  */

  /* region 条件查询 */
  const [choicedConditionForChart, setQueryConditionForChart] = useState({
    start: "",
    end: ""
  });

  const [weeksNum, setWeeksNum] = useState(8);

  // 时间选择事件
  const onChartTimeSelected = async (params: any, dateString: any) => {
    setQueryConditionForChart({
      start: dateString[0],
      end: dateString[1]
    });

    const range = getWeekStartAndEndTime(dateString[0], dateString[1]);
    const timeDiff = dayjs(range.end).diff(dayjs(range.start), 'day') + 1;
    setWeeksNum(timeDiff / 7);   // 因为range里面的时间是周一到周日的完整时间，所以直接除以7就可以得出有多少周
    // 汇总表格数据显示
    getTotalData(range);

    // 汇总图表显示  -- 选择时间的最后一周的开始时间和结束时间
    getTotalChartData({start: getWeekStartAndEndTimeByEndtime(range.end).start, end: range.end});

    // 连续八周最高贡献者数据显示
    getHightestCodeData(range);

    // 持续高于1200的数据
    get1200CodeData(range);

    // 持续低于600的数据
    get600CodeData(range);

  };

  // 初始化显示和显示默认数据（近八周数据）
  const showChartDefaultData = async () => {
    const weekRanges = getWeeksRange(8);

    // 需要近八周的时间，第一周的周一时间和最后一周的周日时间
    setQueryConditionForChart({
      start: weekRanges[0].from,
      end: weekRanges[7].to
    });

    const range = {
      start: weekRanges[0].from,
      end: weekRanges[7].to
    };


    // 汇总表格数据显示
    getTotalData(range);

    // 汇总图-饼图(本周数据)-- 所以只传本周的时间
    getTotalChartData({start: weekRanges[7].from, end: weekRanges[7].to});

    // 连续八周最高贡献者数据显示
    getHightestCodeData(range);

    // 持续高于1200的数据
    get1200CodeData(range);

    // 持续低于600的数据
    get600CodeData(range);

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

  // 初始化显示和显示默认数据（默认显示近八周的数据）
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
    const datas: any = await querySourceData(gqlClient, range, 0);
    gridApiForSource.current?.setRowData(datas);
  };

  // 时间选择事件： 查询范围：选中的时间中开始时间的周一，和结束时间的周末
  const onSourceTimeSelected = async (params: any, dateString: any) => {

    setQueryConditionForSource({
      start: dateString[0],
      end: dateString[1]
    });

    // 根据开始时间获取开始时间所属周的周一；根据结束时间，获取结束时间所属周的周末
    const range = getWeekStartAndEndTime(dateString[0], dateString[1]);
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
            content: `数据保存失败！`,
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

    // 根据选中时间中的结束时间，获取到选中日期所在周的周一和周日的时间
    const weeks = getWeekStartAndEndTimeByEndtime(choicedConditionForSource.end);
    // 时间：只传选中日期的最后一周的时间
    const values: any = {
      startAt: weeks.start,
      endAt: weeks.end,
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
    showChartDefaultData();
  }, []);

  return (
    <PageContainer>
      <div style={{marginTop: "-40px"}}>
        <Tabs defaultActiveKey="analysisReport" onChange={callback} size={"large"}>
          {/* 分析页面 */}
          <TabPane tab={<span> <FundTwoTone/>分析报告</span>} key="analysisReport">

            <div style={{marginTop: -28}}>
              {/* 查询条件 */}
              <Row>

                <div style={{width: '100%', height: 45, marginTop: 15, backgroundColor: "white"}}>
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
                <Col span={12}>
                  <div className="ag-theme-alpine" style={{height: 509, width: '100%', marginTop: 5}}>
                    <AgGridReact
                      columnDefs={getTotalColums} // 定义列
                      suppressRowTransform={true}
                      rowData={[]} // 数据绑定
                      defaultColDef={{
                        resizable: true,
                        suppressMenu: true,
                        cellStyle: {"line-height": "25px"},
                      }}

                      rowHeight={25}
                      headerHeight={30}
                      onGridReady={onTotalGridReady}
                    >

                    </AgGridReact>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{marginLeft: 20}}>
                    <table border={1} style={{
                      textAlign: "center",
                      width: '100%',
                      height: 510,
                      backgroundColor: "white",
                      whiteSpace: "nowrap"
                    }}>
                      {/* 第一行：本周重点关注人员 */}
                      <tr style={{backgroundColor: "#FF9495"}}>
                        <td>
                          <div style={{marginLeft: 5, marginRight: 5}}>
                            本周重点<br/>关注人员
                          </div>
                        </td>
                        <td colSpan={2} align={"left"}> {chartDataForTotal.payAttention}</td>
                      </tr>

                      {/* 第二行：开发人数 */}
                      <tr>
                        <td>开发人数</td>
                        <td align={"center"}>
                          <div style={{width: 30}}>
                            {chartDataForTotal.Development}
                          </div>
                        </td>
                        <td rowSpan={3} style={{backgroundColor: "white"}}>
                          <div>
                            <div id="totalPieChart" style={{height: 250, backgroundColor: "white"}}>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* 第三行：架构人数 */}
                      <tr>
                        <td>架构人数</td>
                        <td align={"center"}>  {chartDataForTotal.Architecture}</td>
                      </tr>

                      {/* 第四行：技术管理人数 */}
                      <tr>
                        <td>技术管理人数</td>
                        <td align={"center"}>  {chartDataForTotal.Technology}</td>
                      </tr>

                      {/* 第五行：出勤人数 */}
                      <tr>
                        <td>出勤人数</td>
                        <td align={"center"}>  {chartDataForTotal.Attendance}</td>
                        <td rowSpan={2} align={"center"}>
                          <div style={{width: "100%", height: "100%"}}>
                            <div id="totalHistogramChart"
                                 style={{width: '400px', height: 100, backgroundColor: "white"}}>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {/* 第五行：请假人数 */}
                      <tr>
                        <td>请假人数</td>
                        <td align={"center"} width={"200px"}>  {chartDataForTotal.Vacation}</td>
                      </tr>
                    </table>
                  </div>


                </Col>
              </Row>

              {/* 第二行 近八周持续高贡献者数据 */}
              <Row>
                <Col span={8}>
                  <div style={{marginTop: "10px"}}>
                    <div style={{
                      height: "30px",
                      lineHeight: "30px",
                      verticalAlign: "middle",
                      textAlign: "center",
                      backgroundColor: "#F8F8F8",
                      fontWeight: "bold",
                      width: '100%',
                      border: "solid 1px #CCCCCC"
                    }}> 近{weeksNum}周持续高贡献者数据 &gt;=1500
                    </div>
                    <div className="ag-theme-alpine" style={{marginTop: "-5", height: 300, width: '100%'}}>
                      <AgGridReact
                        columnDefs={getHighesCodeColums("desc")} // 定义列
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
                  </div>

                </Col>
                <Col span={16}>
                  <div id="_8WeeksHighestNumChart"
                       style={{marginLeft: 10, marginTop: 10, width: '100%', height: 330, backgroundColor: "white"}}>
                  </div>
                </Col>
              </Row>

              {/* 第三行 持续低贡献者数据小于600 */}
              <Row>
                <Col span={8}>
                  <div style={{marginTop: "10px"}}>
                    <div style={{
                      height: "30px",
                      lineHeight: "30px",
                      verticalAlign: "middle",
                      textAlign: "center",
                      backgroundColor: "#F8F8F8",
                      fontWeight: "bold",
                      width: '100%',
                      border: "solid 1px #CCCCCC"
                    }}> 近{weeksNum}周持续低贡献者数据 &lt;600
                    </div>
                    <div className="ag-theme-alpine" style={{height: 300, width: '100%', marginTop: "-5"}}>
                      <AgGridReact
                        columnDefs={getHighesCodeColums("asc")} // 定义列
                        rowData={[]} // 数据绑定
                        defaultColDef={{
                          resizable: true,
                          suppressMenu: true,
                          cellStyle: {"line-height": "25px"},
                        }}
                        suppressRowTransform={true}
                        rowHeight={25}
                        headerHeight={30}
                        onGridReady={onTo600CodeGridReady}
                      >

                      </AgGridReact>
                    </div>
                  </div>

                </Col>
                <Col span={16}>
                  <div id="_8Weeks600NumChart"
                       style={{marginLeft: 10, marginTop: 10, width: '100%', height: 330, backgroundColor: "white"}}>
                  </div>
                </Col>
              </Row>

              {/* 第四行 最大贡献小于1200 */}
              <Row>
                <Col span={8}>
                  <div style={{marginTop: "10px"}}>
                    <div style={{
                      height: "30px",
                      lineHeight: "30px",
                      verticalAlign: "middle",
                      textAlign: "center",
                      backgroundColor: "#F8F8F8",
                      fontWeight: "bold",
                      width: '100%',
                      border: "solid 1px #CCCCCC"
                    }}> 近{weeksNum}周最大贡献&lt;1200
                    </div>
                    <div className="ag-theme-alpine" style={{height: 300, width: '100%', marginTop: "-5px"}}>
                      <AgGridReact
                        columnDefs={getHighesCodeColums("asc")} // 定义列
                        rowData={[]} // 数据绑定
                        defaultColDef={{
                          resizable: true,
                          suppressMenu: true,
                          cellStyle: {"line-height": "25px"},
                        }}
                        suppressRowTransform={true}
                        rowHeight={25}
                        headerHeight={30}
                        onGridReady={onTo1200CodeGridReady}
                      >

                      </AgGridReact>
                    </div>
                  </div>

                </Col>
                <Col span={16}>
                  <div id="_8Weeks1200NumChart"
                       style={{marginLeft: 10, marginTop: 10, width: '100%', height: 330, backgroundColor: "white"}}>
                  </div>
                </Col>
              </Row>


            </div>

          </TabPane>

          {/* 数据源页面 */}
          <TabPane tab={<span> <DatabaseTwoTone/>源数据</span>} key="sourceData"
                   style={{marginTop: -30, backgroundColor: "default"}}>

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
