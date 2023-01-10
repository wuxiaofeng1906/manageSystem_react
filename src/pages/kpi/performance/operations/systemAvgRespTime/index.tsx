import { PageContainer } from '@ant-design/pro-layout';
import { Button, Spin } from 'antd';
import { ConditionHeader, IDrawer, IRuleData } from '@/components/IStaticAgTable';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import React, { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useGqlClient } from '@/hooks';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { IStaticBy } from '@/hooks/statistic';
import StatisticServices from '@/services/statistic';
import { omit, sortBy, groupBy } from 'lodash';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import {
  getAllDate,
  getFourQuarterTime,
  getMonthWeek,
  getTwelveMonthTime,
  getWeeksRange,
  getYearsTime,
} from '@/publicMethods/timeMethods';
import { initGridTable } from '@/utils/utils';
import WrapperKpi from '@/components/wrapperKpi';

const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按天按周月季年统计'],
  },
  {
    title: '统计范围',
    child: ['各集群，从9点到22点，p95响应时间，每天 24点同步'],
  },
  {
    title: '计算公式',
    child: ['AVG（该周期数据）'],
  },
];

const SystemAvgRespTime = () => {
  const gqlClient = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<IStaticBy>('quarter');
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState<any[]>();
  const [columns, setColumns] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [gridHeight, setGridHeight] = useState(window.innerHeight - 240);

  const getDetail = async () => {
    setLoading(true);
    try {
      const { data } = await StatisticServices.operationsAvgRespTime({
        client: gqlClient,
        params: category,
      });
      let result: any[] = [];
      let format: any[] = [];
      data?.datas?.forEach((it: any) => {
        const parent = it.total?.cluster ?? '研发中心';
        result.push({ [it.range.start]: it.total?.duration, cluster: [parent] });
        sortBy(it.datas, 'cluster')?.forEach((o) => {
          result.push({
            [it.range.start]: o.duration,
            cluster: [
              parent,
              o.cluster
                ?.replace('cn-northwest-', '集群')
                ?.replaceAll('cn-apnorthbj-', '腾讯生产集群'),
            ],
          });
        });
      });
      Object.entries(groupBy(result, 'cluster') ?? {})?.forEach(([k, v]) => {
        let date = {};
        v?.forEach((it) => {
          date = { ...date, ...omit(it, ['cluster']) };
        });
        format.push({ ...date, cluster: k?.split(',') });
      });
      setGridData(sortBy(format, ['cluster']));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    renderColumn(category);
    getDetail();
  }, [category]);

  useEffect(() => {
    window.onresize = function () {
      setGridHeight(window.innerHeight - 240);
      gridRef.current?.sizeColumnsToFit();
    };
    return () => {
      window.onresize = null;
    };
  }, []);

  const renderColumn = (type: IStaticBy) => {
    const component: (ColDef | ColGroupDef)[] = new Array();
    const typeMap = {
      year: getYearsTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };

    const ranges =
      type == 'day'
        ? getAllDate(
            dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
            dayjs().format('YYYY-MM-DD'),
          )?.reverse()
        : typeMap[type]?.();
    const weekRanges = type == 'week' ? getWeeksRange(8) : [];
    const data = type == 'week' ? weekRanges?.reverse() : ranges;
    for (let index = 0; index < data?.length; index += 1) {
      if (type == 'week') {
        const startTime = data[index].from;
        const weekName = getMonthWeek(startTime);
        component.push({
          headerName: weekName,
          field: startTime?.toString(),
          cellRenderer: 'wrapperkpi',
          minWidth: 100,
        });
      } else if (type == 'day') {
        component.push({
          headerName: dayjs(data[index]).format('MM月DD日YYYY年'),
          field: data[index],
          cellRenderer: 'wrapperkpi',
          minWidth: 100,
        });
      } else
        component.push(
          Object.assign(
            {
              cellRenderer: 'wrapperkpi',
              headerName: data[index].title,
              field: data[index].start?.toString(),
            },
            type == 'month' ? { minWidth: 110 } : {},
          ),
        );
    }
    setColumns(component);
  };

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{ background: 'white', minHeight: '530px' }}>
          <ConditionHeader
            onChange={(v) => setCategory(v)}
            initFilter={['day', 'week', 'month', 'quarter', 'year']}
          />
          <label style={{ fontWeight: 'bold' }}>(统计单位：ms)</label>
          <Button
            type="text"
            style={{ color: '#1890FF', float: 'right' }}
            icon={<QuestionCircleTwoTone />}
            size={'large'}
            onClick={() => setVisible(true)}
          >
            计算规则
          </Button>
          <div className={'ag-theme-alpine'} style={{ width: '100%', height: gridHeight }}>
            <AgGridReact
              {...initGridTable({ ref: gridRef, height: 32 })}
              rowData={gridData}
              autoGroupColumnDef={{
                minWidth: 280,
                maxWidth: 280,
                headerName: '集群',
                cellRendererParams: { suppressCount: true },
                pinned: 'left',
                suppressMenu: false,
              }}
              frameworkComponents={{
                wrapperkpi: (p: CellClickedEvent) => WrapperKpi({ params: p, len: 2 }),
              }}
              treeData={true}
              animateRows={true}
              groupDefaultExpanded={-1}
              getDataPath={(source: any) => source.cluster}
              columnDefs={columns}
            />
          </div>
          <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
        </div>
      </Spin>
    </PageContainer>
  );
};
export default SystemAvgRespTime;
