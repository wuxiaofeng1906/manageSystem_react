// 自动化单元测试覆盖率
import React, { useEffect, useRef, useState } from 'react';
import { Button, Spin } from 'antd';
import { ConditionHeader, IDrawer, IRuleData } from '@/components/IStaticPerformance';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { aggFunc } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { getFourQuarterTime, getTwelveMonthTime } from '@/publicMethods/timeMethods';
import StatisticServices from '@/services/statistic';
import { IStaticBy } from '@/hooks/statistic';
import { isEmpty, isNumber } from 'lodash';

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

export default () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<IStaticBy>('week');
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

  const getTableSource = async () => {
    setLoading(true);
    try {
      const { data } = await StatisticServices.autoTestCoverageUnit({ client, params: category });

      gridRef.current?.setColumnDefs(data.column);
      gridRef.current?.setRowData(data?.rowData);
      setData([]);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTableSource();
  }, [category]);

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{ background: 'white' }}>
          <ConditionHeader onChange={(v) => setCategory(v)} />
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
            // rowData={data ?? []}
            suppressAggFuncInHeader={true}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
            }}
            onRowGroupOpened={(e) => {
              console.log(e);
            }}
            autoGroupColumnDef={{
              minWidth: 260,
              maxWidth: 280,
              headerName: '部门-项目',
              cellRendererParams: { suppressCount: true },
              pinned: 'left',
              suppressMenu: false,
            }}
            treeData={true}
            groupDefaultExpanded={-1}
            getDataPath={(source: any) => source.Group}
            columnDefs={[]}
          />
        </div>
        <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
      </Spin>
    </PageContainer>
  );
};
