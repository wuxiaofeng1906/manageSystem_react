import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { AgGridReact } from 'ag-grid-react';
import { getFourQuarterTime, getTwelveMonthTime, getYearsTime } from '@/publicMethods/timeMethods';
import moment from 'moment';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Spin } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { ConditionHeader, IDrawer } from '@/components/IStaticPerformance';
import { isEmpty } from 'lodash';
import { aggFunc } from '@/utils/utils';

const ruleData: IRuleData[] = [
  {
    title: '发布日期统计',
    child: [
      '从发布过程获取正式发布的发布日期，排除掉只涉及emergency或stage-patch的项目（如果是sprint+特性项目+stage-patch，不要排除）',
    ],
  },
  {
    title: '分子统计范围（上线后2个工作日客服顾问反馈问题）',
    child: [
      'bug创建日期在发布日期后2个工作日内(若发布当天为工作日，要含发布当天），举例：发布日期为2022-08-11，则取需求创建日期为2022-08-11至2022-08-12的',
      'bug创建人为顾问/客服',
      'bug的解决方案排除‘不是问题’',
    ],
  },
  {
    title: '分母统计范围（上线前1个月客服顾问反馈问题）',
    child: ['从客户服务记录表获取数据customer_service', 'SUM(发布日期前1个月的数据)'],
  },
  {
    title: '计算规则',
    child: [
      '产品上线后emergency占比 = 上线后2个工作日客服顾问反馈BUG / (AVG(上线前1个月客服顾问反馈问题)*2)*100%',
    ],
  },
];

const ProductOnlineEmergencyRate: React.FC = () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [catagory, setCatagory] = useState<'month' | 'quarter' | 'year'>('month');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getDate = () => {
    const ends =
      catagory == 'month'
        ? getTwelveMonthTime(3)
        : catagory == 'year'
        ? getYearsTime()
        : getFourQuarterTime(false, 6);
    return JSON.stringify(ends?.map((it) => it.end));
  };

  const getTableSource = async () => {
    setLoading(true);
    try {
      const ends = getDate();
      const { data } = await StatisticServices.onlineEmergency({
        client,
        params: {
          kind: catagory == 'month' ? 2 : catagory == 'quarter' ? 3 : 4,
          ends,
        },
      });
      setData(
        data
          ?.map((it: any) => {
            const title =
              catagory == 'quarter'
                ? `${moment(it.range.start).format('YYYY')}年Q${moment(it.range.start).quarter()}`
                : catagory == 'year'
                ? moment(it.range.start).format('YYYY年')
                : moment(it.range.start).format('MM月YYYY年');

            if (isEmpty(it.datas)) return { title: title, total: 0 };

            return it.datas.map((child: any) => ({
              subTitle: moment(child.date).format('YYYYMMDD'),
              title: title,
              total: child.kpi * 100,
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

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{ background: 'white' }}>
          <ConditionHeader
            initFilter={['month', 'quarter', 'year']}
            onChange={(v) => setCatagory(v)}
          />
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
            onGridReady={onGridReady}
            pivotMode={true}
            rowData={data}
            suppressAggFuncInHeader={true}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              flex: 1,
              minWidth: 80,
            }}
            columnDefs={[
              {
                field: 'total',
                headerName: 'emergency占比',
                aggFunc: (data) => aggFunc(data, 2, true),
              },
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

export default ProductOnlineEmergencyRate;
