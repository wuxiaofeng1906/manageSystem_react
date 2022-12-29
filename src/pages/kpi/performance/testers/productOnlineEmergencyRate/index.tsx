import React, { useEffect, useRef, useState } from 'react';
import type { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { AgGridReact } from 'ag-grid-react';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Spin } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { ConditionHeader, IDrawer } from '@/components/IStaticPerformance';
import { aggFunc } from '@/utils/statistic';

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
  const [data, setData] = useState<any[]>();
  const [gridHeight, setGridHeight] = useState(window.innerHeight - 250);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setGridHeight(window.innerHeight - 250);
    gridRef.current?.sizeColumnsToFit();
  };

  const getDate = () => {
    const ends = catagory == 'month' ? getTwelveMonthTime(3) : getFourQuarterTime(false, 6);
    return JSON.stringify(ends?.map((it) => it.end));
  };

  const getTableSource = async () => {
    setLoading(true);
    try {
      const ends = getDate();
      const { data } = await StatisticServices.onlineTestOnlineEmergency({
        client,
        params: {
          kind: catagory == 'month' ? 2 : 3,
          ends,
        },
        identity: 'TESTER',
      });
      setData(data);
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
          <ConditionHeader initFilter={['month', 'quarter']} onChange={(v) => setCatagory(v)} />
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
        <div className={'ag-theme-alpine'} style={{ width: '100%', height: gridHeight }}>
          <AgGridReact
            rowHeight={32}
            headerHeight={35}
            onGridReady={onGridReady}
            pivotMode={true}
            rowData={data ?? []}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
            }}
            autoGroupColumnDef={{
              minWidth: 150,
              maxWidth: 180,
              headerName: '部门-人员',
              cellRendererParams: { suppressCount: true },
              pinned: 'left',
              suppressMenu: false,
            }}
            suppressAggFuncInHeader={true}
            columnDefs={[
              { field: 'Group', rowGroup: true },
              { field: 'total', headerName: 'emergency占比', aggFunc: (data) => aggFunc(data, 2) },
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
