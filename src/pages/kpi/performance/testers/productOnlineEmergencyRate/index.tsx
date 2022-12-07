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
import IStaticPerformance, { IDrawer } from '@/components/IStaticPerformance';
import { formatD } from '@/utils/utils';

const ruleData: IRuleData[] = [
  {
    title: '上线日期统计',
    child: [
      '从发布过程获取正式发布的发布日期，排除掉只涉及emergency或stage-patch的项目（如果是sprint+特性项目+stage-patch，不要排除）',
    ],
  },
  {
    title: '分子统计范围：（上线后2个工作日客服顾问反馈问题）',
    child: [
      'bug创建日期在发布日期后2个工作日内(若发布当天为工作日，要含发布当天），举例：发布日期为2022-08-11，则取需求创建日期为2022-08-11至2022-08-12的',
      'bug创建人为顾问/客服',
      'bug的解决方案排除‘不是问题’',
    ],
  },
  {
    title: '统计人员',
    child: [
      'bug转需求的，任务状态是`未开始,进行中`取任务的指派给是测试的（多个测试人员，都要分别算1个)',
      'bug未转需求的，bug状态是`激活`取指派给是测试的（因为指派给会经常变，始终要取最新的），bug状态是`已解决`的取解决人是测试的',
    ],
  },
  {
    title: '分母统计范围：（上线前1个月客服顾问反馈问题）',
    child: [
      '从客户服务记录表获取数据customer_service',
      'SUM(发布日期前1个月的数据)  ',
      '举例：发布日期为2022-08-11，则取biz_date 在2022-07-10 至 2022-08-10的数据',
    ],
  },
  {
    title: '计算规则',
    child: [
      '产品上线后emergency占比 = 上线后2个工作日客服顾问反馈给开发的需求或BUG数 / (AVG(上线前1个月客服顾问反馈问题)*2)*100%',
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
  const [row, setRow] = useState<any[]>([]);
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
      const data = await StatisticServices.onlineTestOnlineEmergency({
        client,
        params: catagory,
        identity: 'TESTER',
      });
      const format = formatD(data);
      setData(format.data);
      setRow(format.columns);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableSource();
  }, [catagory]);

  return (
    <IStaticPerformance
      ruleData={ruleData}
      columnDefs={row}
      request={StatisticServices.onlineTestOnlineEmergency}
      identity={'TESTER'}
      unit={'%'}
      len={2}
    />
  );
};

export default ProductOnlineEmergencyRate;
