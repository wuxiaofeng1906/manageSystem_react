/*
 * @Description: 通用常量
 * @Author: jieTan
 * @Date: 2021-11-23 15:51:13
 * @LastEditTime: 2022-03-16 03:13:42
 * @LastEditors: jieTan
 * @LastModify:
 */

/* Table */
// 百分比
export const PERCENTAGE = {
  value: 100,
  unit: '%',
  zh: '百分之',
};
// 默认列宽
export const COLUMN_W = 64;
// 相对于“秒”的时间 => H
export const HOUR = {
  value: 3600,
  unit: 'H',
  zh: '小时',
};
// 手动录入单元的默认属性
export const MANUAL_CELL = {
  text: '手工录入', //提示文本
  numberColor: '#ff0000', // 数字文本颜色
  color: '#bfbfbf', // 默认文本颜色
  fontStyle: 'italic', //斜体
};
// 相对于“秒”的时间 => D
export const DAY = {
  value: 86400,
  unit: 'D',
  zh: '天',
};

/* zentao */
export const PROJ_STATUS = {
  wait: { en: 'wait', zh: '未开始' },
  doing: { en: 'doing', zh: '进行中' },
  suspended: { en: 'suspended', zh: '已挂起' },
  closed: { en: 'closed', zh: '已关闭' },
};

/* 项目度量指标 */
// scaleProductivity # 生产率 + 规模
export const PROJ_METRIC = {
  project: { en: 'project', zh: '项目信息', show: false },
  progressDeviation: { en: 'progressDeviation', zh: '进度延期率' },
  storyStable: { en: 'storyStable', zh: '需求稳定性' },
  stageWorkload: { en: 'stageWorkload', zh: '阶段工作量' },
  scaleProductivity: { en: 'scaleProductivity', zh: '生产率&规模' },
  reviewDefect: { en: 'reviewDefect', zh: '缺陷密度/问题率' },
  processQuality: { en: 'processQuality', zh: '过程质量' },
  serviceAbout: { en: 'serviceAbout', zh: '服务' },
};
// 项目度量指标 - 修改接口路径
export const PK_PATH = '/api/project/kpi';
// 默认项目查询的时间范围
export const PK_SEARCH_INTERVAL = {
  unit: 'months',
  value: 3,
};
// 默认要显示的属性部门id列表
export const PK_TREE_DEPTS = [130, 66, 82, 114, 81];
// 禅道执行的设置页
export const ztExectionUrl = (eId: number) =>
  `http://zentao.77hub.com/zentao/execution-view-${eId}.html`;
// 筛选是否显示默认时间
export const PK_SHOW_DEFAULT_DATE = true;
// 预演路径名称
export const PK_EXCLUDE_DEMO_NAME = 'notDemo';

/*  */
// 分母默认值
export const DEFAULT_DENOMINATOR = 1;
// 默认占位符
export const DEFAULT_PLACEHOLDER = '-';
// float默认保留的小数位
export const DEFAULT_DECIMAL_PLACES = 2;
// Moment日期格式化
export const MOMENT_FORMAT = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
};
