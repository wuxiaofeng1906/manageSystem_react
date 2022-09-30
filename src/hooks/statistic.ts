import { useState } from 'react';
import { useGqlClient } from '@/hooks/index';
import { isNumber } from 'lodash';
import {
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getYearsTime,
  getWeeksRange,
  getHalfYearTime,
} from '@/publicMethods/timeMethods';
import type { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import type { IStatisticQuery } from '@/services/statistic';

// 统计
export type IStaticBy = 'year' | 'halfYear' | 'quarter' | 'month' | 'week';
export type IIdentity = 'DEVELOPER' | 'TESTER';
export interface IRequest {
  request: (data: IStatisticQuery) => void;
  type: IStaticBy;
  identity?: IIdentity;
  showDenominator?: boolean;
}
export const useStatistic = () => {
  const gqlClient = useGqlClient();
  const [columns, setColumns] = useState<(ColDef | ColGroupDef)[]>([]);
  const [rowData, setRowData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStaticBy = async ({
    request,
    type = 'week',
    identity,
    showDenominator = false,
  }: IRequest) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    renderColumn(type, showDenominator);
    setRowData([]);
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { data, loading }: any = await request({
        client: gqlClient,
        params: type,
        identity,
        showDenominator,
      });
      setRowData(data);
      setLoading(loading);
    } catch (e) {
      setLoading(false);
      setRowData(null);
    }
  };

  const cellRenderer = (params: any, showSplit = false) => {
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
    const data = isNumber(result) && result ? result.toFixed(2) : 0;
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

  // column
  const renderColumn = (type: IStaticBy, showSplit = false) => {
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
          cellRenderer: (p) => cellRenderer(p, showSplit),
          minWidth: 100,
        });
      } else
        component.push(
          Object.assign(
            {
              cellRenderer: (p: any) => cellRenderer(p, showSplit),
              headerName: data[index].title,
              field: data[index].start?.toString(),
            },
            type == 'month' ? { minWidth: 110 } : {},
          ),
        );
    }
    setColumns(component);
  };

  return { handleStaticBy, columns, rowData, loading };
};
