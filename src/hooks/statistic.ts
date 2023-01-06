import { useState } from 'react';
import { useGqlClient } from '@/hooks/index';
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
import { isEmpty } from 'lodash';

// 统计
export type IStaticBy = 'year' | 'halfYear' | 'quarter' | 'month' | 'week' | 'day';
export type IIdentity =
  | 'DEVELOPER'
  | 'TESTER'
  | 'TEST'
  | 'OWN'
  | 'REFER'
  | 'ALL'
  | 'EXCLUDE_ONLINE';
export type Period = 'period' | 'uptoperiod';

export interface IRequest {
  type: IStaticBy;
  identity?: IIdentity;
  period?: Period;
  showDenominator?: boolean;
  defaultColumn?: boolean;
  normalQuarter?: boolean;
  request: (data: IStatisticQuery) => void;
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
    period,
    defaultColumn = true,
    normalQuarter = false,
  }: IRequest) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (defaultColumn) {
      renderColumn({ type, normalQuarter });
    }
    setRowData([]);
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { data, loading, column }: any = await request({
        client: gqlClient,
        params: type,
        identity,
        showDenominator,
        normalQuarter,
        period,
      });
      setRowData(data);
      if (!isEmpty(column)) {
        setColumns(column);
      }
      setLoading(loading);
    } catch (e) {
      setLoading(false);
      setRowData(null);
    }
  };

  // column
  const renderColumn = ({
    type,
    normalQuarter = false,
  }: {
    type: IStaticBy;
    normalQuarter?: boolean;
  }) => {
    const component: (ColDef | ColGroupDef)[] = new Array();
    const typeMap = {
      year: getYearsTime,
      halfYear: getHalfYearTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };
    const ranges = typeMap[type]?.(type == 'quarter' ? normalQuarter : undefined);
    const weekRanges = type == 'week' ? getWeeksRange(8) : [];
    const data = type == 'week' ? weekRanges?.reverse() : ranges;
    for (let index = 0; index < data?.length; index += 1) {
      if (type == 'week') {
        const startTime = data[index].from;
        const weekName = getMonthWeek(startTime);
        component.push({
          minWidth: 100,
          headerName: weekName,
          field: startTime?.toString(),
          cellRenderer: 'wrapperkpi',
        });
      } else
        component.push(
          Object.assign(
            {
              headerName: data[index].title,
              field: data[index].start?.toString(),
              cellRenderer: 'wrapperkpi',
            },
            type == 'month' ? { minWidth: 110 } : {},
          ),
        );
    }
    setColumns(component);
  };

  return { handleStaticBy, renderColumn, columns, rowData, loading };
};
