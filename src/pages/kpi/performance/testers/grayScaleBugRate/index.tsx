import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticAgTable';
import { ConditionHeader, IDrawer } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
import { Button, Spin } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { GridApi } from 'ag-grid-community';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { aggFunc } from '@/utils/statistic';
import { initGridTable } from '@/utils/utils';

const ruleData: IRuleData[] = [
  {
    title: '需求统计范围',
    child: [
      '需求创建日期在上周四到本周三',
      '且需求所属执行为‘stage-patch’（执行类型为stagepatch）',
      '不包含同时关联了emergency的需求和项目遗留bug转的需求（需求是bug转换的，且bug的线上bug类型为‘项目遗留’）',
    ],
  },
  {
    title: 'bug统计范围',
    child: [
      'bug创建日期在上周四到本周三',
      '且bug所属执行为‘stage-patch’（执行类型为stagepatch）',
      '且bug关联了stage-patch执行中的需求',
    ],
  },
  {
    title: '代码统计范围',
    child: ['代码量 = 最新stage分支代码量 - 最新matser分支代码量'],
  },
  {
    title: '计算规则',
    child: [
      '灰度千行bug率 = SUM（stage-patch需求加权数+stage-patch加权bug数）/  代码量',
      <p style={{ textIndent: '3em', margin: '5px 0' }}>stage-patch需求加权数;</p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>
        新需求：stage-patch需求加权数 = 优先级1*5+优先级2*2+优先级3*1+优先级4*0.1
      </p>,
      <p style={{ textIndent: '4em', margin: '5px 0' }}>
        bug转需求：stage-patch需求加权数 = 取bug的P0*5+P1*2+P2*1+P3*0.1;
      </p>,
      <p style={{ textIndent: '3em', margin: '5px 0' }}>
        stage-patch加权bug数 = P0*5+P1*2+P2*1+P3*0.1;
      </p>,
    ],
  },
];
let mergeBugTotal = {};
const GrayScaleBugRate: React.FC = () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<'month' | 'quarter'>('month');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const getDate = () => {
    const ends = category == 'month' ? getTwelveMonthTime(3) : getFourQuarterTime(false, 6);
    return JSON.stringify(ends?.map((it) => it.end));
  };

  const getTableSource = async () => {
    setLoading(true);
    try {
      const ends = getDate();
      const { data } = await StatisticServices.grayThousBugRate({
        client,
        params: {
          kind: category == 'month' ? 2 : 3,
          ends,
        },
      });

      let result: any[] = [];
      data?.forEach((it: any) => {
        const title =
          category == 'quarter'
            ? `${moment(it.range.start).format('YYYY')}年Q${moment(it.range.start).quarter()}`
            : moment(it.range.start).format('MM月YYYY年');

        if (isEmpty(it.datas)) {
          result.push({ title: title, total: 0 });
          mergeBugTotal = { ...mergeBugTotal, [title]: 0 };
        } else {
          let numTotal = 0;
          let denTotal = 0;
          it.datas.forEach((child: any) => {
            numTotal += child.numerator || 0;
            denTotal += child.denominator || 0;
            result.push({
              subTitle: moment(child.date).format('YYYYMMDD'),
              title: title,
              numerator: child.numerator,
              denominator: child.denominator,
              total: (child.numerator / child.denominator) * 1000,
            });
          });
          mergeBugTotal = {
            ...mergeBugTotal,
            [title]: numTotal == 0 || denTotal == 0 ? 0 : ((numTotal / denTotal) * 1000).toFixed(2),
          };
        }
      });
      setData(result || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    mergeBugTotal = {};
    getTableSource();
  }, [category]);
  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{ background: 'white' }}>
          <ConditionHeader initFilter={['month', 'quarter']} onChange={(v) => setCategory(v)} />
          <label style={{ fontWeight: 'bold' }}>(统计单位：个/Kloc)</label>
          <Button
            type="text"
            style={{ color: '#1890FF', float: 'right' }}
            icon={<QuestionCircleTwoTone />}
            size={'large'}
            onClick={() => setVisible(true)}
          >
            计算规则
          </Button>
        </div>
        <div className={'ag-theme-alpine'} style={{ width: '100%', height: 400 }}>
          <AgGridReact
            {...initGridTable({ ref: gridRef, height: 32 })}
            pivotMode={true}
            rowData={data}
            suppressAggFuncInHeader={true}
            columnDefs={[
              {
                field: 'total',
                headerName: 'bug率',
                aggFunc: (p) => aggFunc(p, 2),
                cellRenderer: (p) => {
                  if (isEmpty(p.colDef?.pivotTotalColumnIds)) return p.value;
                  return mergeBugTotal[p.colDef?.pivotKeys?.toString()];
                },
              },
              { field: 'numerator', headerName: '加权bug数', aggFunc },
              { field: 'denominator', headerName: '代码量', aggFunc },
              { field: 'title', pivot: true, pivotComparator: () => 1 },
              { field: 'subTitle', pivot: true },
            ]}
          />
        </div>
        <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
      </Spin>
    </PageContainer>
  );
};

export default GrayScaleBugRate;
