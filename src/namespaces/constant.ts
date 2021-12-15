/*
 * @Description: 通用常量
 * @Author: jieTan
 * @Date: 2021-11-23 15:51:13
 * @LastEditTime: 2021-12-15 03:22:34
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
  processQuality: { en: 'processQuality', zh: '过程质量' },
  progressDeviation: { en: 'progressDeviation', zh: '进度偏差率' },
  stageWorkload: { en: 'stageWorkload', zh: '阶段工作量' },
  scaleProductivity: { en: 'scaleProductivity', zh: '生产率&规模' },
};

/*  */
// 分母默认值
export const DEFAULT_DENOMINATOR = 1;
// 默认占位符
export const DEFAULT_PLACEHOLDER = '-';
// float默认保留的小数位
export const DEFAULT_DECIMAL_PLACES = 2;
