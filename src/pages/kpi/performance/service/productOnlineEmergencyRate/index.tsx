import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { AgGridReact } from 'ag-grid-react';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import moment from 'moment';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Spin } from 'antd';
import { CalendarTwoTone, QuestionCircleTwoTone, ScheduleTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { IDrawer } from '@/components/IStaticPerformance';
import { isEmpty } from 'lodash';

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
      '需求创建日期在发布日期后2个工作日内(若发布当天为工作日，要含发布当天），举例：发布日期为2022-08-11，则取需求创建日期为2022-08-11至2022-08-12的',
      '且需求所属执行类型为emergency的',
      '且(需求创建人为顾问/客服 或 bug转需求的查bug的创建人是顾问/客服）',
    ],
  },
  {
    title: '分母统计范围（上线前1个月客服顾问反馈问题）',
    child: ['从客户服务记录表获取数据customer_service', 'SUM(发布日期前1个月的数据)'],
  },
  {
    title: '计算规则',
    child: [
      '产品上线后emergency占比 = 上线后2个工作日客服顾问反馈问题 / 上线前1个月客服顾问反馈问题',
    ],
  },
];

const ProductOnlineEmergencyRate: React.FC = () => {
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
      const { data } = await StatisticServices.onlineEmergency({
        client,
        params: {
          kind: catagory == 'month' ? 2 : 3,
          ends,
        },
      });
      setData(
        data
          ?.map((it: any) => {
            // const title =
            //   catagory == 'quarter'
            //     ? `${moment(it.range.start).format('YYYY')}年Q${moment(it.range.start).quarter()}`
            //     : moment(it.range.start).format('YYYY年MM月');
            const title =
              catagory == 'quarter'
                ? `Q${moment(it.range.start).quarter()}${moment(it.range.start).format('YYYY')}年`
                : moment(it.range.start).format('MM月YYYY年');

            if (isEmpty(it.datas)) return { title: title, total: 0 };

            return it.datas.map((child: any) => ({
              subTitle: moment(child.date).format('YYYYMMDD'),
              title: title,
              total: +((child.storyNum / child.recordNum) * 100),
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
                aggFunc: (data: any) => {
                  let sum = 0;
                  data?.forEach(function (value: any) {
                    if (value) {
                      sum = sum + parseFloat(value);
                    }
                  });
                  if (!sum) return 0;
                  return sum.toFixed(2);
                },
              },
              { field: 'title', enablePivot: true, pivot: true },
              { field: 'subTitle', enablePivot: true, pivot: true },
            ]}
          />
        </div>
        <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
      </Spin>
    </PageContainer>
  );
};

export default ProductOnlineEmergencyRate;
