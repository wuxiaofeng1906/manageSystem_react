import React from 'react';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: [
      '按周统计：需求阶段转为’研发完毕’的时间在周一00:00:00 至周天23:59:59的',
      '按月统计：需求阶段转为’研发完毕’的时间在该月第一天00:00:00 至该月最后一天23:59:59的',
      '按季统计：需求阶段转为’研发完毕’的时间在该季第一天00:00:00 至该季最后一天23:59:59',
      '按年统计：需求阶段转为’研发完毕’的时间在该年第一天00:00:00 至该年最后一天23:59:59的',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        自动扭转：该需求下的所有开发类型任务完成（取最后一个开发任务的完成时间）
      </p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        手动编辑：人员手动选择需求所处阶段为‘研发完毕’（取人为编辑‘研发完毕’的时间）
      </p>,
    ],
  },
  {
    title: '统计范围',
    child: [
      '需求阶段 in (研发完毕,测试中,测试完毕,已验收,已发布,已关闭)',
      '且需求创建人是顾问或客服',
      '或需求创建人是产品、UED、开发、测试的，且需求创建日期>=2021-7-16 00:00:00的，且需求所属计划或需求关联执行名称包含“emergency/hotfix/sprint/stage-patch”的，且frombug != 0',
      '或需求创建人是产品、UED的，且需求创建日期>=2021-7-16 00:00:00的，且条目类型字段值为线上bug（listtype = "onlinebug")',
      '且需求关联的开发任务完成人是开发的（没有完成人的取关闭人为开发的），当一个需求有多个开发人员时，每个开发人员都算1个，当多个开发人员在1个部门时需要按部门去重',
    ],
  },
  {
    title: '单个需求计算规则',
    child: [
      '开发-线上反馈平均响应时长 = 该需求阶段转为‘研发完毕’的时间 减去 该需求创建时间 减去 周末法定节假日',
    ],
  },
  {
    title: '部门统计',
    child: [
      '按部门：开发-线上反馈平均上线时长 = Average(该部门所有人员在该周期的线上需求的响应时长）',
      '按中心：开发-线上反馈平均上线时长 = Average(该中心所有人员在该周期的线上需求的响应时长）',
    ],
  },
];
const AvgOnlineTimeFeedBack: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.feedback}
      identity={'DEVELOPER'}
      unit={'天'}
      len={2}
    />
  );
};

export default AvgOnlineTimeFeedBack;
