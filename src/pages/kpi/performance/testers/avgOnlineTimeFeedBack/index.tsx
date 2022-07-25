import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: [
      '按周统计：需求发布时间/关闭时间在周一00:00:00 至周天23:59:59的',
      '按月统计：需求发布时间/关闭时间在该月第一天00:00:00 至该月最后一天23:59:59的',
      '按季统计：需求发布时间/关闭时间在该季第一天00:00:00 至该季最后一天23:59:59的',
      '按年统计：需求发布时间/关闭时间在该年第一天00:00:00 至该年最后一天23:59:59的',
    ],
  },
  {
    title: '统计范围',
    child: [
      '需求阶段=已发布  或 需求状态=已关闭',
      '且需求创建人是顾问或客服',
      '或需求创建人是产品、UED、开发、测试的，且需求创建日期>=2021-7-16 00:00:00的，且需求所属计划或需求关联执行名称包含“emergency/hotfix/sprint/stage-patch”的，名称包含“emergency/hotfix/sprint/stage-patch”的，且frombug != 0 ',
      '或需求创建人是产品、UED的，且需求创建日期>=2021-7-16 00:00:00的，且需求所属计划或需求关联执行名称包含“emergency/hotfix/sprint/stage-patch”的，且“需求来源”的值不为bug，且条目类型字段值为线上bug（listtype = "onlinebug")',
      '且需求关联的测试任务完成人是测试的（没有完成人的取关闭人为测试的），当一个需求有多个测试人员时，每个测试人员都算1个，当多个测试人员在1个部门时需要按部门去重',
    ],
  },
  {
    title: '单个需求计算规则',
    child: [
      '需求阶段已发布：该需求关联发布的时间 减去 该需求创建时间 减去周末法定节假日',
      '需求状态已关闭（历史信息有关联发布的，比较关闭时间和发布时间，取最早的那个时间）：该需求发布 /关闭最早时间 减去 该需求创建时间 减去周末法定节假日',
      '需求状态已关闭（历史信息没有关联发布的）：该需求的关闭时间 减去 该需求创建时间 减去周末法定节假日',
    ],
  },
  {
    title: '部门统计',
    child: [
      '按部门：测试-线上反馈平均上线时长 = Average(该部门所有人员在该周期的线上需求的上线时长）',
      '按中心：测试-线上反馈平均上线时长 = Average(该中心所有人员在该周期的线上需求的上线时长）',
    ],
  },
];
const AvgOnlineTimeFeedBack: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.feedback}
      identity={'TESTER'}
      // showSplit={true}
    />
  );
};

export default AvgOnlineTimeFeedBack;
