import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { AgGridReact } from 'ag-grid-react';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import moment from 'moment';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button } from 'antd';
import { CalendarTwoTone, QuestionCircleTwoTone, ScheduleTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
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
  const [data, setData] = useState<any[]>([]);
  const [columns, setColums] = useState<any[]>([]);
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const mock = [
    {
      range: {
        start: '2022-09-01',
        end: '2022-09-30',
      },
      datas: [],
    },
    {
      range: {
        start: '2022-08-01',
        end: '2022-08-31',
      },
      datas: [
        {
          date: '2022-08-25',
          storyNum: 1,
          recordNum: 2524,
        },
      ],
    },
    {
      range: {
        start: '2022-07-01',
        end: '2022-07-31',
      },
      datas: [
        {
          date: '2022-07-22',
          storyNum: 2,
          recordNum: 2865,
        },
        {
          date: '2022-07-14',
          storyNum: 3,
          recordNum: 2986,
        },
      ],
    },
  ];

  const rowData = mock.map((it) =>
    it.datas.map((child) => ({
      date: child.date,
      [child.date]: (child.storyNum ?? 0 / child.recordNum ?? 0) * 100,
    })),
  );

  const formatColumn = (data: any) => {
    // 最近两个季度
    if (catagory == 'quarter') {
      return data.map((it) => ({
        headerName: `${moment(it.range.start).format('YYYY')}Q${moment(it.range.start).quarter()}`,
        children: it.datas.map((child: any, index: number) => ({
          columnGroupShow: index == 0 ? 'closed' : 'open',
          field: child.date,
          headerName: moment(child.date).format('YYYYMMDD'),
        })),
      }));
    }
    return data.map((it) => ({
      headerName: moment(it.range.start).format('YYYY年MM月'),
      children: it.datas?.map((child: any, index: number) => ({
        // columnGroupShow: index == 0 ? 'closed' : 'open',
        field: child.date,
        headerName: moment(child.date).format('YYYYMMDD'),
        filter: 'agNumberColumnFilter',
      })),
    }));
  };

  const getTableSource = async () => {
    const ends = catagory == 'month' ? getTwelveMonthTime(3) : getFourQuarterTime(false, 6);
    const { loading, data } = await StatisticServices.onlineEmergency({
      client,
      params: {
        kind: catagory == 'month' ? 2 : 1,
        ends: JSON.stringify(ends?.map((it) => it.end)),
      },
    });
    setColums(formatColumn(data));
    setData(
      data
        ?.map((it: any) =>
          it.datas.map((child: any) => ({
            date: child.date,
            [child.date]: (child.storyNum ?? 0 / child.recordNum ?? 0) * 100,
          })),
        )
        .flat(),
    );
  };

  useEffect(() => {
    getTableSource();
  }, [catagory]);

  return (
    <PageContainer>
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
      <div className={'ag-theme-alpine'} style={{ width: '100%', height: 500 }}>
        <AgGridReact
          columnDefs={columns}
          rowData={data}
          defaultColDef={{ sortable: true, resizable: true, filter: true }}
          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
        />
      </div>
    </PageContainer>
  );
};

export default ProductOnlineEmergencyRate;
