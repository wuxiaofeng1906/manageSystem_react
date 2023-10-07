import React, {useEffect} from 'react';
import * as echarts from 'echarts'; // 引入 ECharts 主模块
import 'echarts/lib/chart/bar'; // 引入柱状图
import 'echarts/lib/component/tooltip'; // 引入提示框和标题组件
import 'echarts/lib/component/title';
import type {CountdownProps} from 'antd';
import {Col, Row, Statistic} from 'antd';

const {Countdown} = Statistic;

const Home = () => {

  const showChart = () => {
    const bom = document.getElementById('totalPieChart');
    if (bom) {
      // 基于准备好的dom，初始化echarts实例
      const pieChart = echarts.init(bom);
      // 绘制图表
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          x: '70%',
          orient: 'Vertical',
        },
        series: [
          {
            radius: '95%', // 显示在容器里100%大小，如果需要饼图小一点，就设置低于100%就ok
            type: 'pie',
            center: ['40%', '50%'], // 第一个值调整左右，第二个值调整上下，也可以设置具体数字像素值，center: [200, 300],
            label: {
              // 饼图标签相关
              normal: {
                show: true,
                position: 'inner', // 标签的位置
                textStyle: {
                  // fontWeight: 100,
                  fontSize: 13, // 文字的字体大小
                  color: 'black', // 文字颜色
                },
                formatter: '{d}%',
              },
            },
            data: [
              {
                value: 50,
                name: '开发人数',
              },
              {
                value: 5,
                name: '架构师人数',
              },
              {
                value: 10,
                name: '技术管理人数',
              },
            ],
          },
        ],
      });
      // 窗口缩放后重新调整图标尺寸
      window.onresize = function () {
        pieChart.resize();
      };
    }
  }

  useEffect(() => {
    showChart();
  }, [])

  return (
    <div>
      首页可以做一些统计数据展示
      <div id="totalPieChart"
           style={{height: 250, backgroundColor: 'white'}}
      ></div>
      <div style={{marginTop:30}}>
        <Countdown title="距离2024年倒计时" value={'2023-12-31 23:59:59'} format="D 天 H 时 m 分 s 秒"/>
      </div>


    </div>
  );
};
export default Home;
