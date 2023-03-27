import React, {useEffect, useRef, useState} from 'react';
import type {IRuleData} from '@/components/IStaticAgTable';
import {ConditionHeader, IDrawer} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
import {useGqlClient} from '@/hooks';
import {GridApi} from 'ag-grid-community';
import {
  getFourQuarterTime, getHalfYearTime, getMonthWeek,
  getTwelveMonthTime, getWeeksRange, getYearsTime,
} from '@/publicMethods/timeMethods';
import moment from 'moment';
import {isEmpty} from 'lodash';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Spin} from 'antd';
import {QuestionCircleTwoTone} from '@ant-design/icons';
import {AgGridReact} from 'ag-grid-react';
import {aggFunc} from '@/utils/statistic';
import {initGridTable} from '@/utils/utils';

// 服务-交付吞吐量： 需求链接：https://shimo.im/docs/XKq4MJdn7RfmpBkN#anchor-sbAz 《研发过程数据统计2022-2023年》
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周、按月、按季、按半年、按年'],
  },
  {
    title: '统计范围',
    child: [
      '取执行的上线日期落在该周期的（发布过程取正式发布且线上集群均已上完的执行名称及执行id',
    ],
  },
  {
    title: '计算规则',
    child: ['取已上线执行的规模字段求和', '交付吞吐量 = SUM(已上线执行的规模) '],
  },
];
const DeliveryThroughput: React.FC = () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const getDate = () => {
    const typeMap = {
      year: getYearsTime,
      halfYear: getHalfYearTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };
    const isWeek = category == 'week';
    const ranges = typeMap[category]?.(
      category == 'month' ? 3 : category == 'quarter' ? 6 : undefined,
    );
    const weekRanges = isWeek ? getWeeksRange(8) : [];
    const data = isWeek ? weekRanges?.reverse() : ranges;
    return JSON.stringify(data?.map((it: any) => (isWeek ? it.to : it.end)));
  };

  const getTableSource = async () => {
    const kind = {
      week: 1,
      month: 2,
      quarter: 3,
      year: 4,
    };
    setLoading(true);
    try {
      const ends = getDate();
      const {data} = await StatisticServices.deliverThroughput({
        client,
        params: {kind: kind[category], ends},
      });
      setData(
        data
          ?.map((it: any) => {
            const title = {
              quarter: `${moment(it.range.start).format('YYYY')}年Q${moment(
                it.range.start,
              ).quarter()}`,
              week: getMonthWeek(it.range.start),
              month: moment(it.range.start).format('MM月YYYY年'),
              year: moment(it.range.start).format('YYYY年'),
            };
            if (isEmpty(it.datas)) return {title: title[category], total: 0};

            return it.datas.map((child: any) => ({
              subTitle: moment(child.date).format('YYYYMMDD'),
              title: title[category],
              total: child.kpi ?? 0,
            }));
          })
          .flat(),
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableSource();
  }, [category]);

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{background: 'white'}}>
          <ConditionHeader onChange={(v) => setCategory(v)}/>
          <label style={{fontWeight: 'bold'}}>(统计单位：FP)</label>
          <Button
            type="text"
            style={{color: '#1890FF', float: 'right'}}
            icon={<QuestionCircleTwoTone/>}
            size={'large'}
            onClick={() => setVisible(true)}
          >
            计算规则
          </Button>
        </div>
        <div className={'ag-theme-alpine'} style={{width: '100%', height: 400}}>
          <AgGridReact
            {...initGridTable({ref: gridRef, height: 32})}
            pivotMode={true}
            rowData={data}
            suppressAggFuncInHeader={true}
            columnDefs={[
              {
                field: 'total',
                headerName: '吞吐量',
                aggFunc: (data) => aggFunc(data, 2),
              },
              {field: 'title', pivot: true, pivotComparator: () => 1},
              {field: 'subTitle', pivot: true},
            ]}
          />
        </div>
        <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData}/>
      </Spin>
    </PageContainer>
  );
};

export default DeliveryThroughput;
