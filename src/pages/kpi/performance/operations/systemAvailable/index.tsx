import React, { useEffect, useRef, useState } from 'react';
import { ConditionHeader, IDrawer, IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Spin } from 'antd';

import { QuestionCircleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IStaticBy } from '@/hooks/statistic';
import { useGqlClient } from '@/hooks';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import {
  getFourQuarterTime,
  getHalfYearTime,
  getMonthWeek,
  getTwelveMonthTime,
  getWeeksRange,
  getYearsTime,
} from '@/publicMethods/timeMethods';
import { isEmpty, isNumber } from 'lodash';

// 运维 系统可用性
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周月季年统计，按事件开始日期归属周期（zt_feedback.realStarted)'],
  },
  {
    title: '统计范围',
    child: [
      <div>
        <strong style={{ color: '#1890ff' }}>系统可用性：</strong>
        故障持续时间取值zt_feedback.Duration
      </div>,
      <div>
        <strong style={{ color: '#1890ff' }}>系统平均可用时间：</strong>
        <span>离上次事件事件取值zt_feedback.lastfailure</span>
        <br />
        <span>周期故障数取该周期的反馈条数，且创建人是运维</span>
      </div>,
      <div>
        <strong style={{ color: '#1890ff' }}>系统平均修复时间：</strong>
        <span>故障恢复时间取值zt_feedback.Recover</span>
        <br />
        <span>周期故障数取该周期的反馈条数</span>
      </div>,
    ],
  },
  {
    title: '计算公式',
    child: [
      <div>
        <strong style={{ color: '#1890ff' }}>系统可用性：</strong>运维-系统平均可用时间 =
        1-(SUM(故障持续时间) / (24*60*统计周期自然日))*100
      </div>,
      <div>
        <strong style={{ color: '#1890ff' }}>系统平均可用时间：</strong>运维-系统平均可用时间 =
        (SUM(离上次事件时间)/60/24) / SUM(周期故障数)
      </div>,
      <div>
        <strong style={{ color: '#1890ff' }}>系统平均修复时间：</strong>运维-系统平均修复时间 =
        SUM(故障恢复时间) / SUM(周期故障数)
      </div>,
    ],
  },
];
const tabs = {
  ability: '系统可用性',
  avgusable: '系统平均可用时间',
  avgrepair: '系统平均修复时间',
};
const SystemAvailable: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [catagory, setCatagory] = useState<IStaticBy>('quarter');
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState<any[]>();
  const [columns, setColumns] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  useEffect(() => {
    renderColumn(catagory);
    getDetail();
  }, [catagory]);

  const getDetail = async () => {
    setLoading(true);
    try {
      const { data } = await StatisticServices.operationsAvgAvailable({
        client: gqlClient,
        params: catagory,
      });
      let formatData: any;
      data?.forEach((it: any) => {
        let data: any;
        it.datas?.forEach((o) => {
          data = { ...data, [o.range.start]: o.depts?.kpi };
        });
        formatData = { ...formatData, [it.category]: data };
      });
      setGridData(formatData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const cellRenderer = (params: any, showSplit = false, len?: number) => {
    const node = params.data;
    const result = params.value;
    let numerator = 0; // 分子
    let denominator = 0; // 分母
    if (showSplit) {
      const currentTime = params.column?.colId;
      numerator = node[`${currentTime}_numerator`] ?? 0; // 分子
      denominator = node[`${currentTime}_denominator`] ?? 0; // 分母
    }
    const weight = node?.isDept ? 'bold' : 'initial';
    const data = isNumber(result) && result ? (len ? result.toFixed(len) : result) : 0;
    if (isNumber(result)) {
      if (showSplit)
        return `<span>
                <label style="font-weight: ${weight}">${data}</label>
                <label style="color: gray"> (${numerator},${denominator})</label>
            </span>`;
      return `<span style="font-weight: ${weight}">${data}</span>`;
    }
    return `<span style="font-weight: ${weight};color: ${
      node?.isDept ? 'initial' : 'silver'
    }"> 0</span>`;
  };

  const renderColumn = (type: IStaticBy, showSplit = false, len?: number) => {
    const component: (ColDef | ColGroupDef)[] = new Array();
    const typeMap = {
      year: getYearsTime,
      halfYear: getHalfYearTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };
    const ranges = typeMap[type]?.();
    const weekRanges = type == 'week' ? getWeeksRange(8) : [];
    const data = type == 'week' ? weekRanges?.reverse() : ranges;
    for (let index = 0; index < data?.length; index += 1) {
      if (type == 'week') {
        const startTime = data[index].from;
        const weekName = getMonthWeek(startTime);
        component.push({
          headerName: weekName,
          field: startTime?.toString(),
          cellRenderer: (p) => cellRenderer(p, showSplit, len),
          minWidth: 100,
        });
      } else
        component.push(
          Object.assign(
            {
              cellRenderer: (p: any) => cellRenderer(p, showSplit, len),
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
          <ConditionHeader onChange={(v) => setCatagory(v)} />
          <Button
            type="text"
            style={{ color: '#1890FF', float: 'right' }}
            icon={<QuestionCircleTwoTone />}
            size={'large'}
            onClick={() => setVisible(true)}
          >
            计算规则
          </Button>
          {Object.entries(tabs).map(([k, v]) => {
            return (
              <div style={{ padding: '0 16px' }}>
                <h4 style={{ margin: '10px 0' }}>
                  {v} (统计单位：{k == 'avgusable' ? '天' : '%'})
                </h4>
                <div className={'ag-theme-alpine'} style={{ width: '100%', height: 100 }}>
                  <AgGridReact
                    rowHeight={32}
                    headerHeight={35}
                    rowData={isEmpty(gridData?.[k]) ? [] : [gridData?.[k]]}
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                      filter: true,
                      flex: 1,
                      minWidth: 80,
                    }}
                  />
                </div>
              </div>
            );
          })}
          <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
        </div>
      </Spin>
    </PageContainer>
  );
};

export default SystemAvailable;
