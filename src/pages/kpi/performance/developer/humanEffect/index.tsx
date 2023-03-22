import React from 'react';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';

const ruleData: IRuleData[] = [
  {
    title: '统计范围',
    child: ['任务完成/关闭/指派给为开发', '按周期统计该周期工作日天数'],
  },
  {
    title: '计算公式',
    child: [
      '按个人：该周期个人生产规模/该周期工作日天数',
      <p style={{textIndent: '3em', margin: '5px 0'}}>
        若该员工在该周期中途入职，工作日天数从入职当天开始算，在该周期的实际工作日天数；如果员工在该周期离职，工作日仅算到离职日期截止。;
      </p>,
      '按部门：SUM(该周期研发部门生产规模) / SUM（该研发部门该周期的开发人员*该周期工作日天数）',
      <p style={{textIndent: '3em', margin: '5px 0'}}>分子按部门取该周期‘开发-生产规模‘数据;</p>,
      '按中心：SUM（该周期该中心生产规模）/ SUM（该中心该周期的开发人员*该周期工作日天数',
      <p style={{textIndent: '3em', margin: '5px 0'}}>
        分母举例：（分母计算=1*22+1*15+1*18=45人天）;
      </p>,
      <table></table>
    ],
    table: {
      column: [
        {dataIndex: 'dept', title: '部门'},
        {dataIndex: 'name', title: '姓名'},
        {dataIndex: 'power', title: '人力'},
        {dataIndex: 'days', title: 'Q2工作日（天）'},
        {
          dataIndex: 'remark', title: '备注',
          onCell: () => {
            return {rowSpan: 3}
          }
          ,
        }
      ],
      dataSource: [
        {
          dept: 'A研发部',
          name: '张三',
          power: "1",
          days: "22",
          remark: "1.如果员工在该周期入职，从入职开始算工作日，\n2.如果员工在该周期离职，工作日仅算到离职日期截止"
        },
        {
          dept: 'A研发部',
          name: '李四',
          power: "1",
          days: "15",
          remark: ""
        },
        {
          dept: 'A研发部',
          name: '王五',
          power: "1",
          days: "18",
          remark: ""
        },

      ],
    },
  },
];
const HumanEffect: React.FC = () => {
  return (
    <IStaticAgTable
      ruleData={ruleData}
      request={StatisticServices.humanEffect}
      identity={'DEVELOPER'}
      showDenominator={true}
      unit={'FP/人天'}
      len={4}
    />
  );
};

export default HumanEffect;
