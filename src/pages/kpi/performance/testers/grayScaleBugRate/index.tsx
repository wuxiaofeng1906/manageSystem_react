import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import { IDrawer } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { Button, Spin } from 'antd';
import { CalendarTwoTone, QuestionCircleTwoTone, ScheduleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import moment from 'moment';
import { isEmpty } from 'lodash';
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
const GrayScaleBugRate: React.FC = () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [catagory, setCatagory] = useState<'month' | 'quarter'>('month');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getDate = () => {
    const ends = catagory == 'month' ? getTwelveMonthTime(3) : getFourQuarterTime(false, 6);
    return JSON.stringify(ends?.map((it) => it.end));
  };

  const getTableSource = async () => {
    setLoading(true);
    try {
      const ends = getDate();
      const { data } = await StatisticServices.grayThousBugRate({
        client,
        params: {
          kind: catagory == 'month' ? 2 : 3,
          ends,
        },
      });
      setData(
        data
          ?.map((it: any) => {
            const title =
              catagory == 'quarter'
                ? `Q${moment(it.range.start).quarter()}${moment(it.range.start).format('YYYY')}年`
                : moment(it.range.start).format('MM月YYYY年');

            if (isEmpty(it.datas)) return { title: title, total: 0 };

            return it.datas.map((child: any) => ({
              subTitle: moment(child.date).format('YYYYMMDD'),
              title: title,
              numerator: child.numerator,
              denominator: child.denominator,
              total: (child.numerator / child.denominator) * 100,
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
  }, [catagory]);

  const aggFunc = (data: any, number = 0) => {
    let sum = 0;
    data?.forEach(function (value: any) {
      if (value) {
        sum = sum + parseFloat(value);
      }
    });
    if (!sum) return 0;
    return number > 0 ? sum.toFixed(number) : sum;
  };

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{ background: 'white' }}>
          <Button
            type="text"
            style={{ color: 'black' }}
            icon={<CalendarTwoTone />}
            size={'large'}
            onClick={() => setCatagory('month')}
          >
            按月统计
          </Button>
          <Button
            type="text"
            style={{ color: 'black' }}
            icon={<ScheduleTwoTone />}
            size={'large'}
            onClick={() => setCatagory('quarter')}
          >
            按季统计
          </Button>
          <label style={{ fontWeight: 'bold' }}>(统计单位：%)</label>
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
            rowHeight={32}
            headerHeight={35}
            pivotMode={true}
            rowData={data}
            onGridReady={onGridReady}
            suppressAggFuncInHeader={true}
            columnDefs={[
              { field: 'total', headerName: 'bug率', aggFunc: (data) => aggFunc(data, 5) },
              { field: 'numerator', headerName: '加权数', aggFunc: aggFunc },
              { field: 'denominator', headerName: '代码量', aggFunc: aggFunc },
              { field: 'title', pivot: true, pivotComparator: () => 1 },
              { field: 'subTitle', pivot: true },
            ]}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              flex: 1,
              minWidth: 80,
            }}
          />
        </div>
        <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
      </Spin>
    </PageContainer>
  );
};

export default GrayScaleBugRate;
