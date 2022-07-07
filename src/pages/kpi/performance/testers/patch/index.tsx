import React from 'react';
import IStaticPerformance from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData = [
  {
    title: '取值范围',
    child: [
      '查需求创建时间落在该周期的（按周、按月、按季、按年）',
      '查需求的所属计划包含stage-patch字样的',
      '且需求的‘发布引入版本’字段值不为空',
      '且需求关联的任务完成人/关闭人是测试，或需求关联的任务状态为未开始/进行中，查指派给为测试的',
    ],
  },
  {
    title: '计算公式',
    child: [
      '不显示按人员',
      '按部门：测试-发布引入patch数 = 指派给这个部门开发的需求数由这个部门开发完成的需求数（特殊说明‘指派给这个部门测试的需求数’：不是查需求的指派给，而是查需求关联任务的指派给；当1个需求有多个测试完成任务，给每个测试都算1个需求，若这里的多个测试都属于同一个部门时，需要对需求编号进行去重，注意区分一级部门、2级部门）',
      '按中心：测试-发布引入patch数 = 就是根据1.取值范围中查出来的所有需求数',
    ],
  },
];
const Patch: React.FC<any> = () => {
  return <IStaticPerformance ruleData={ruleData} request={StatisticServices.patchTester} />;
};

export default Patch;
