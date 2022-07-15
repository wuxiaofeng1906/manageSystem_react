import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
const ruleData: IRuleData[] = [
  {
    title: '取值范围',
    child: [
      '班车工作台每周四9:30自动对当周的班车项目（执行名称包含sprint/hotfix）详情页的需求 或 超范围的bug ，进行延期标识：（超范围bug且bug所处阶段不为‘TE测试环境验证通过’特殊说明：当前班车中超范围的bug在未关联当前班车的需求或未转需求的情况，该bug算1个延期；当超范围bug关联到当前班车某个需求后，该bug不单独算延期，还是算该需求延期，但该bug要给对应的开发算1个延期；当超范围的bug转需求且进入当前班车后，转需求后的需求算1个延期（这里的需求创建时间>当周四9:30），原始bug不出现在班车详情页且不算延期',
    ],
    table: {
      column: [
        { dataIndex: 'stage', title: '所处阶段' },
        { dataIndex: 'rule', title: '其他规则' },
        { dataIndex: 'postpone', title: '是否标识延期' },
        { dataIndex: 'deferredBy', title: '延期归属方' },
        {
          dataIndex: 'mark',
          title: '延期归属对象',
          render: (v) => <div style={{ whiteSpace: 'pre-wrap' }}>{v}</div>,
        },
      ],
      dataSource: [
        {
          stage: 'TE测试环境验证通过',
          rule: '且 需求在当前班车中关联的bug状态不等于已关闭（bug为激活/已解决）',
          postpone: '是',
          deferredBy: '开发',
          mark: '1.若该bug为激活，该需求归属给指派给的开发；\n2.若该bug为已解决，该需求归属给打解决的开发；\n3.该需求有多个未关闭bug时，该需求要算给多个开发；',
        },
        {
          stage: '开发完',
          rule: '且 是否需要测试验证的值为 "是"，且该需求没有关联bug的情况',
          postpone: '是',
          deferredBy: '开发',
          mark: '若该需求阶段扭转为’开发完毕‘的时间>当周周三9:30（需求阶段扭转为’开发完毕‘，即该需求最后1个开发类型的任务的完成时间）',
        },
        {
          stage: '开发完',
          rule: '且 是否需要测试验证 的值为 "是"，且该需求在该班车中关联的bug状态不等于已关闭（bug为激活/已解决）',
          postpone: '是',
          deferredBy: '开发',
          mark: '1.若该bug为激活，该需求归属给指派给的开发；\n2.若该bug为已解决，该需求归属给打解决的开发；\n3.该需求有多个未关闭bug时，该需求要算给多个开发；',
        },
        {
          stage: '开发完',
          rule: '且 是否需要测试验证 的值为 "否"，且需求在当前班车中关联的bug状态不等于已关闭',
          postpone: '是',
          deferredBy: '开发',
          mark: '1.若该bug为激活，该需求归属给指派给的开发；\n2.若该bug为已解决，该需求归属给打解决的开发；\n3.该需求有多个未关闭bug时，该需求要算给多个开发；',
        },
        {
          stage: '未开始  或 开发中',
          rule: '-',
          postpone: '是',
          deferredBy: '开发',
          mark: '该需求关联的开发任务状态为未开始或进行中的指派给',
        },
        {
          stage: '测试中',
          rule: '-',
          postpone: '是',
          deferredBy: '开发',
          mark: '1.没bug的情况，取开发任务完成/关闭时间最晚的那项任务的完成/关闭人；\n2.有bug的情况，激活bug取指派给的开发，激活bug指派的不是开发，取开发任务完成/关闭时间最晚的那项任务的完成/关闭人；已解决bug取bug的解决人为开发的，bug解决人不为开发，取开发任务完成/关闭时间最晚的那项任务的完成/关闭人',
        },
      ],
    },
  },
  {
    title: '',
    child: [
      '班车工作台每周四9:30后加入当周的班车项目（执行名称包含sprint/hotfix）详情页的需求 或 超范围的bug ，也需要自动进行延期标识',
    ],
  },
  {
    title: '计算公式',
    child: [
      '不显示按人员',
      '按部门：开发-班车延期需求数 = 该周期该部门开发人员对应的延期需求数求和',
      '按中心：开发-班车延期需求数 = 该周期所有标记了延期的总数',
    ],
  },
];
const ShuttleDelay: React.FC<any> = () => {
  return (
    <IStaticPerformance
      ruleData={ruleData}
      request={StatisticServices.shuttleDelay}
      identity={'DEVELOPER'}
    />
  );
};

export default ShuttleDelay;
